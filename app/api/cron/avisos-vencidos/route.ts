import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const DIAS_EXPIRACION = 5;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const limite = new Date();
  limite.setDate(limite.getDate() - DIAS_EXPIRACION);

  // Posts activos de perdido/encontrado que vencieron y aún no fueron notificados
  const { data: posts } = await admin
    .from('posts')
    .select('id, user_id, nombre, categoria, zona')
    .in('categoria', ['perdido', 'encontrado'])
    .eq('estado', 'activo')
    .eq('notified_expiration', false)
    .lte('created_at', limite.toISOString());

  if (!posts || posts.length === 0) {
    return NextResponse.json({ ok: true, procesados: 0 });
  }

  let enviados = 0;

  for (const post of posts) {
    if (!post.user_id) continue;

    const categoriaLabel = post.categoria === 'perdido' ? 'perro perdido' : 'perro visto';
    const nombrePerro = post.nombre ? ` (${post.nombre})` : '';
    const mensaje = `⏰ Tu aviso de ${categoriaLabel}${nombrePerro} en ${post.zona} venció. ¿Lo encontraste o seguís buscando?`;

    // Crear notificación in-app
    await admin.from('notifications').insert({
      user_id: post.user_id,
      post_id:  post.id,
      tipo:     'expiracion',
      mensaje,
      leida:    false,
    });

    // Marcar como notificado
    await admin.from('posts').update({ notified_expiration: true }).eq('id', post.id);

    // Email
    const { data: userData } = await admin.auth.admin.getUserById(post.user_id);
    const email = userData?.user?.email;
    if (!email) continue;

    const { data: profile } = await admin
      .from('profiles')
      .select('nombre')
      .eq('id', post.user_id)
      .single();

    const saludo = profile?.nombre ? `Hola ${profile.nombre},` : 'Hola,';

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Vecindog <noreply@mivecindog.com.ar>',
        to: [email],
        subject: `⏰ Tu aviso de ${categoriaLabel}${nombrePerro} venció — ¿lo encontraste?`,
        html: `
          <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 24px;">
            <div style="background: #EE5A3B; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <h1 style="color: white; margin: 0; font-size: 22px;">🐾 Vecindog</h1>
            </div>
            <h2 style="color: #1a1a1a;">${saludo}</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              Tu aviso de <strong>${categoriaLabel}${nombrePerro}</strong> en <strong>${post.zona}</strong> lleva ${DIAS_EXPIRACION} días publicado.
            </p>
            <p style="color: #555; font-size: 16px;">¿Qué pasó?</p>
            <div style="display: flex; gap: 12px; margin: 24px 0; flex-direction: column;">
              <a href="https://www.mivecindog.com.ar/publicaciones/${post.id}?accion=encontrado"
                 style="background: #22c55e; color: white; padding: 14px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 15px; text-align: center; display: block;">
                ✅ ¡Lo encontré! Marcar como resuelto
              </a>
              <a href="https://www.mivecindog.com.ar/publicaciones/${post.id}?accion=renovar"
                 style="background: #EE5A3B; color: white; padding: 14px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 15px; text-align: center; display: block;">
                🔄 Lo sigo buscando — Renovar 5 días más
              </a>
            </div>
            <p style="color: #aaa; font-size: 12px; margin-top: 32px; text-align: center;">
              Si no tomás ninguna acción, el aviso se mantendrá visible pero sin renovar.<br/>
              <a href="https://www.mivecindog.com.ar/publicaciones/${post.id}" style="color: #EE5A3B;">Ver aviso</a>
            </p>
          </div>
        `,
      }),
    });

    if (res.ok) enviados++;
  }

  return NextResponse.json({ ok: true, procesados: posts.length, enviados });
}
