import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const DIAS_PRIMER_AVISO  = 5;   // día 5: primer email
const DIAS_SEGUNDO_AVISO = 6;   // día 6: segundo email (último aviso)
const DIAS_BORRADO       = 7;   // día 7+: se marca como resuelto automáticamente

async function enviarEmailExpiracion(
  email: string,
  saludo: string,
  categoriaLabel: string,
  nombrePerro: string,
  zona: string,
  postId: string,
  esFinal: boolean,
): Promise<boolean> {
  const asunto = esFinal
    ? `🚨 Último aviso: tu publicación de ${categoriaLabel}${nombrePerro} se eliminará mañana`
    : `⏰ Tu aviso de ${categoriaLabel}${nombrePerro} venció — ¿lo encontraste?`;

  const intro = esFinal
    ? `Este es el <strong>último aviso</strong>. Si no respondés hoy, el aviso se eliminará automáticamente mañana.`
    : `Tu aviso lleva ${DIAS_PRIMER_AVISO} días publicado. Necesitamos saber qué pasó.`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Vecindog <noreply@mivecindog.com.ar>',
      to:   [email],
      subject: asunto,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
          <div style="background:${esFinal ? '#b91c1c' : '#EE5A3B'};border-radius:16px;padding:24px;text-align:center;margin-bottom:24px">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:26px;font-weight:900;letter-spacing:-0.5px;"><span style="color:#ffffff;">Vecin</span><span style="color:rgba(255,255,255,0.75);">dog</span></p>
          </div>
          <h2 style="color:#1a1a1a">${saludo}</h2>
          <p style="color:#555;font-size:16px;line-height:1.6">
            Tu aviso de <strong>${categoriaLabel}${nombrePerro}</strong> en <strong>${zona}</strong>.
          </p>
          <p style="color:${esFinal ? '#b91c1c' : '#555'};font-size:16px;font-weight:${esFinal ? 'bold' : 'normal'}">
            ${intro}
          </p>
          <p style="color:#555;font-size:16px">¿Qué pasó?</p>
          <div style="display:flex;gap:12px;margin:24px 0;flex-direction:column">
            <a href="https://www.mivecindog.com.ar/publicaciones/${postId}?accion=encontrado"
               style="background:#22c55e;color:white;padding:14px 24px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:15px;text-align:center;display:block">
              ✅ ¡Lo encontré! Marcar como resuelto
            </a>
            <a href="https://www.mivecindog.com.ar/publicaciones/${postId}?accion=renovar"
               style="background:#EE5A3B;color:white;padding:14px 24px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:15px;text-align:center;display:block">
              🔄 Lo sigo buscando — Renovar 5 días más
            </a>
          </div>
          ${esFinal ? `
          <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:16px;margin-top:16px">
            <p style="color:#b91c1c;font-size:14px;margin:0;font-weight:bold">
              ⚠️ Si no respondés antes de mañana, el aviso se eliminará automáticamente.
            </p>
          </div>` : ''}
          <p style="color:#aaa;font-size:12px;margin-top:32px;text-align:center">
            <a href="https://www.mivecindog.com.ar/publicaciones/${postId}" style="color:#EE5A3B">Ver aviso</a>
          </p>
        </div>
      `,
    }),
  });

  return res.ok;
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const ahora   = new Date();
  const dia5    = new Date(ahora); dia5.setDate(dia5.getDate() - DIAS_PRIMER_AVISO);
  const dia6    = new Date(ahora); dia6.setDate(dia6.getDate() - DIAS_SEGUNDO_AVISO);
  const dia7    = new Date(ahora); dia7.setDate(dia7.getDate() - DIAS_BORRADO);

  let notif1 = 0, notif2 = 0, borrados = 0;

  // ── ETAPA 1: Primer aviso (día 5) ────────────────────────────────
  const { data: postsDia5 } = await admin
    .from('posts')
    .select('id, user_id, nombre, categoria, zona')
    .in('categoria', ['perdido', 'encontrado'])
    .eq('estado', 'activo')
    .eq('notified_expiration', false)
    .lte('created_at', dia5.toISOString());

  // ── ETAPA 2: Segundo y último aviso (día 6) ───────────────────────
  const { data: postsDia6 } = await admin
    .from('posts')
    .select('id, user_id, nombre, categoria, zona')
    .in('categoria', ['perdido', 'encontrado'])
    .eq('estado', 'activo')
    .eq('notified_expiration', true)
    .lte('created_at', dia6.toISOString())
    .gte('created_at', dia7.toISOString()); // solo exactamente día 6, no los de día 7+

  // Recopilar todos los user_ids únicos y traer sus datos en batch
  const todosUserIds = [
    ...(postsDia5 ?? []).map((p: { user_id: string }) => p.user_id),
    ...(postsDia6 ?? []).map((p: { user_id: string }) => p.user_id),
  ].filter(Boolean);
  const uniqueUserIds = [...new Set(todosUserIds)];

  // Traer emails via listUsers paginando (límite real, no hardcodeado a 1000)
  const emailsMap: Record<string, string> = {};
  let authPage = 1;
  while (true) {
    const { data: listData } = await admin.auth.admin.listUsers({ page: authPage, perPage: 1000 });
    if (!listData?.users?.length) break;
    for (const u of listData.users) {
      if (uniqueUserIds.includes(u.id) && u.email) emailsMap[u.id] = u.email;
    }
    if (listData.users.length < 1000) break;
    authPage++;
  }

  // Traer perfiles (nombre) en batch
  const profilesMap: Record<string, string> = {};
  if (uniqueUserIds.length > 0) {
    const { data: profilesData } = await admin
      .from('profiles')
      .select('id, nombre')
      .in('id', uniqueUserIds);
    for (const p of profilesData ?? []) profilesMap[p.id] = p.nombre ?? '';
  }

  // Procesar día 5 (primer aviso)
  for (const post of postsDia5 ?? []) {
    if (!post.user_id) continue;
    const categoriaLabel = post.categoria === 'perdido' ? 'perro perdido' : 'perro visto';
    const nombrePerro    = post.nombre ? ` (${post.nombre})` : '';

    // Notificación in-app
    await admin.from('notifications').insert({
      user_id: post.user_id, post_id: post.id,
      tipo: 'expiracion',
      mensaje: `⏰ Tu aviso de ${categoriaLabel}${nombrePerro} en ${post.zona} venció. ¿Lo encontraste o seguís buscando?`,
      leida: false,
    });

    // Marcar como notificado
    await admin.from('posts').update({ notified_expiration: true }).eq('id', post.id);

    const email  = emailsMap[post.user_id];
    if (!email) continue;
    const saludo = profilesMap[post.user_id] ? `Hola ${profilesMap[post.user_id]},` : 'Hola,';

    const ok = await enviarEmailExpiracion(email, saludo, categoriaLabel, nombrePerro, post.zona, post.id, false);
    if (ok) notif1++;
  }

  // Procesar día 6 (segundo aviso)
  for (const post of postsDia6 ?? []) {
    if (!post.user_id) continue;
    const categoriaLabel = post.categoria === 'perdido' ? 'perro perdido' : 'perro visto';
    const nombrePerro    = post.nombre ? ` (${post.nombre})` : '';

    const email  = emailsMap[post.user_id];
    if (!email) continue;
    const saludo = profilesMap[post.user_id] ? `Hola ${profilesMap[post.user_id]},` : 'Hola,';

    const ok = await enviarEmailExpiracion(email, saludo, categoriaLabel, nombrePerro, post.zona, post.id, true);
    if (ok) notif2++;
  }

  // ── ETAPA 3: Borrado automático (día 7+) ─────────────────────────
  const { data: postsBorrar } = await admin
    .from('posts')
    .select('id, user_id, nombre, categoria, zona')
    .in('categoria', ['perdido', 'encontrado'])
    .eq('estado', 'activo')
    .eq('notified_expiration', true)
    .lt('created_at', dia7.toISOString());

  if (postsBorrar?.length) {
    // Marcar como resueltos (quedan en historial pero desaparecen del listing)
    const ids = postsBorrar.map((p: { id: string }) => p.id);
    await admin.from('posts').update({ estado: 'resuelto' }).in('id', ids);

    // Notificación in-app de cierre automático
    for (const post of postsBorrar) {
      if (!post.user_id) continue;
      const categoriaLabel = post.categoria === 'perdido' ? 'perro perdido' : 'perro visto';
      const nombrePerro    = post.nombre ? ` (${post.nombre})` : '';
      await admin.from('notifications').insert({
        user_id: post.user_id, post_id: post.id,
        tipo: 'expiracion',
        mensaje: `🗑️ Tu aviso de ${categoriaLabel}${nombrePerro} en ${post.zona} fue cerrado automáticamente por inactividad.`,
        leida: false,
      });
    }

    borrados = postsBorrar.length;
  }

  // ── ETAPA 4: Cerrar busco_cuidador cuya fecha de devolución ya pasó ──
  const hoyStr = ahora.toISOString().slice(0, 10);
  const { data: cuidadoresVencidos } = await admin
    .from('posts')
    .select('id, user_id, nombre, zona')
    .eq('categoria', 'busco_cuidador')
    .eq('estado', 'activo')
    .lt('fecha', hoyStr);

  if (cuidadoresVencidos?.length) {
    const ids = cuidadoresVencidos.map((p: { id: string }) => p.id);
    await admin.from('posts').update({ estado: 'resuelto' }).in('id', ids);

    for (const post of cuidadoresVencidos) {
      if (!post.user_id) continue;
      await admin.from('notifications').insert({
        user_id: post.user_id,
        post_id: post.id,
        tipo: 'expiracion',
        mensaje: `✅ Tu aviso de busco cuidador${post.nombre ? ` para ${post.nombre}` : ''} venció y fue cerrado automáticamente.`,
        leida: false,
      });
    }
  }

  return NextResponse.json({
    ok:      true,
    notif1,
    notif2,
    borrados,
    cuidadoresVencidos: cuidadoresVencidos?.length ?? 0,
  });
}
