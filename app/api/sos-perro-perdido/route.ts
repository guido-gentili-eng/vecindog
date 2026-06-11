import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export async function POST(req: NextRequest) {
  try {
    // ── Auth ─────────────────────────────────────────────────────────
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.slice(7);

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: { user }, error: authError } = await admin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    // ── Input ────────────────────────────────────────────────────────
    const body = await req.json();
    const nombrePerro = String(body.nombre_perro ?? '').slice(0, 80).trim();
    // BAJO: Validar postId como UUID para evitar path injection en URLs de email
    const rawPostId = body.post_id ? String(body.post_id) : null;
    const postId    = rawPostId && UUID_RE.test(rawPostId) ? rawPostId : null;

    // CRÍTICO: Rate limiting — máximo 1 alerta SOS por post por hora para evitar spam.
    // Chequeamos si ya existe una notificación tipo 'amigo_perdido' para este post
    // en la última hora (se inserta al final de esta misma función).
    if (postId) {
      const { data: sosReciente } = await admin
        .from('notifications')
        .select('created_at')
        .eq('tipo', 'amigo_perdido')
        .eq('post_id', postId)
        .gte('created_at', new Date(Date.now() - 3_600_000).toISOString())
        .limit(1)
        .maybeSingle();

      if (sosReciente) {
        return NextResponse.json(
          { ok: false, error: 'Ya enviaste una alerta SOS en la última hora para este aviso' },
          { status: 429 }
        );
      }
    }

    // ── Perfil del dueño ─────────────────────────────────────────────
    const { data: ownerProfile } = await admin
      .from('profiles')
      .select('nombre, apellido')
      .eq('id', user.id)
      .single();
    const ownerNombre = ownerProfile
      ? `${ownerProfile.nombre ?? ''} ${ownerProfile.apellido ?? ''}`.trim()
      : 'Tu amigo';

    // ── Amigos confirmados ───────────────────────────────────────────
    const { data: amistades } = await admin
      .from('amistades')
      .select('solicitante_id, receptor_id')
      .or(`solicitante_id.eq.${user.id},receptor_id.eq.${user.id}`)
      .eq('estado', 'aceptada');

    if (!amistades || amistades.length === 0) {
      return NextResponse.json({ ok: true, enviados: 0, motivo: 'sin amigos' });
    }

    const amigosIds = amistades.map((a) =>
      a.solicitante_id === user.id ? a.receptor_id : a.solicitante_id
    );

    // ── Perfiles de amigos ───────────────────────────────────────────
    const { data: perfiles } = await admin
      .from('profiles')
      .select('id, nombre')
      .in('id', amigosIds);

    const perfilMap: Record<string, string> = {};
    for (const p of perfiles ?? []) perfilMap[p.id] = p.nombre ?? 'Vecino';

    // ── Emails de amigos ─────────────────────────────────────────────
    const emailMap: Record<string, string> = {};
    let authPage = 1;
    while (true) {
      const { data: listData } = await admin.auth.admin.listUsers({ perPage: 1000, page: authPage });
      for (const u of listData?.users ?? []) {
        if (amigosIds.includes(u.id) && u.email) emailMap[u.id] = u.email;
      }
      // ALTO: usar optional chaining para evitar TypeError si listData es null
      if ((listData?.users?.length ?? 0) < 1000) break;
      authPage++;
    }

    // ── Notificaciones in-app ────────────────────────────────────────
    const nombreStr = nombrePerro || 'Un perro';
    const notifRows = amigosIds.map((id) => ({
      user_id: id,
      post_id: postId,
      tipo:    'amigo_perdido',
      mensaje: `🚨 ${esc(nombreStr)}, el perro de ${esc(ownerNombre)}, se escapó. ¡Ayudá a encontrarlo!`,
      leida:   false,
    }));
    if (notifRows.length > 0) {
      await admin.from('notifications').insert(notifRows);
    }

    // ── Emails ───────────────────────────────────────────────────────
    const postUrl = postId
      ? `https://www.mivecindog.com.ar/publicaciones/${postId}`
      : `https://www.mivecindog.com.ar/buscar`;

    const duenioE = esc(ownerNombre);
    const perroE  = esc(nombreStr);

    // ALTO: Enviar emails en paralelo en vez de secuencialmente (evita timeout de Vercel)
    const amigosConEmail = amigosIds.filter((id) => emailMap[id]);
    const resultados = await Promise.allSettled(
      amigosConEmail.map((amigoId) => {
        const email  = emailMap[amigoId];
        const saludo = esc(perfilMap[amigoId] ?? 'Vecino');
        return fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Vecindog <noreply@mivecindog.com.ar>',
            to: [email],
            subject: `🚨 ${perroE} se escapó — ayudá a ${duenioE} a encontrarlo`,
            html: `
              <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 24px;">
                <div style="background: #D7503A; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
                  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:26px;font-weight:900;letter-spacing:-0.5px;"><span style="color:#ffffff;">Vecin</span><span style="color:rgba(255,255,255,0.75);">dog</span></p>
                </div>
                <h2 style="color: #1a1a1a;">Hola ${saludo},</h2>
                <p style="color: #555; font-size: 16px; line-height: 1.6;">
                  Tu amigo <strong>${duenioE}</strong> perdió a su perro y necesita tu ayuda:
                </p>
                <div style="background: #FFF0EE; border-radius: 12px; padding: 20px; margin: 16px 0; border-left: 4px solid #D7503A; text-align: center;">
                  <p style="margin: 0; font-size: 28px;">🐶</p>
                  <p style="margin: 8px 0 0; font-size: 20px; font-weight: bold; color: #1a1a1a;">${perroE}</p>
                  <p style="margin: 4px 0 0; color: #888; font-size: 14px;">se escapó y está perdido</p>
                </div>
                <p style="color: #555; font-size: 15px; line-height: 1.6;">
                  Si lo ves, avisale a <strong>${duenioE}</strong> de inmediato. También podés compartir el aviso para que más vecinos lo busquen.
                </p>
                <div style="text-align: center; margin-top: 24px;">
                  <a href="${postUrl}"
                     style="background: #D7503A; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 15px;">
                    Ver aviso completo
                  </a>
                </div>
                <p style="color: #aaa; font-size: 12px; margin-top: 32px; text-align: center;">
                  Recibís este email porque sos amigo de ${duenioE} en Vecindog.<br/>
                  <a href="https://www.mivecindog.com.ar/mi-perfil" style="color: #EE5A3B;">Ir a mi perfil</a>
                </p>
              </div>
            `,
          }),
        });
      })
    );

    let enviados = 0;
    for (const r of resultados) {
      if (r.status === 'fulfilled' && r.value.ok) {
        enviados++;
      } else {
        const reason = r.status === 'rejected' ? r.reason : `HTTP ${(r.value as Response).status}`;
        console.error('[sos-perro-perdido] Resend error:', reason);
      }
    }

    return NextResponse.json({ ok: true, enviados, amigos: amigosIds.length });
  } catch (e) {
    console.error('[sos-perro-perdido]', e);
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 });
  }
}
