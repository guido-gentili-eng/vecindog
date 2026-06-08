import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendPushToUser } from '@/lib/pushNotification';

const RADIO_KM = 1;

/** Escapa caracteres HTML para evitar inyección en emails */
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function POST(req: NextRequest) {
  try {
    // ── Autenticación: verificar sesión del usuario ──────────────────
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.slice(7);

    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { user }, error: authError } = await anonClient.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    // ── Parsear y validar input ──────────────────────────────────────
    const body = await req.json();
    const { lat, lng, zona, ciudad, categoria, nombre_perro, post_id, publicador_id } = body;

    // Validar coordenadas
    const latN = Number(lat);
    const lngN = Number(lng);
    if (
      !Number.isFinite(latN) || !Number.isFinite(lngN) ||
      latN < -90 || latN > 90 || lngN < -180 || lngN > 180
    ) {
      return NextResponse.json({ ok: false, reason: 'coords inválidas' });
    }

    // Validar categoría
    if (!['perdido', 'encontrado', 'adopcion', 'transito'].includes(categoria)) {
      return NextResponse.json({ ok: false, reason: 'categoría inválida' });
    }

    // Sanitizar strings
    const zonaS       = String(zona       ?? '').slice(0, 100);
    const ciudadS     = String(ciudad     ?? '').slice(0, 100);
    const nombrePerroS = String(nombre_perro ?? '').slice(0, 80);
    const postIdS     = String(post_id    ?? '').slice(0, 64);

    // post_id es obligatorio — sin él no se puede verificar propiedad
    if (!postIdS) {
      return NextResponse.json({ ok: false, error: 'post_id requerido' }, { status: 400 });
    }

    // ── Cliente admin ────────────────────────────────────────────────
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // ── Verificar que el post pertenece al usuario autenticado ───────
    const { data: postCheck } = await admin
      .from('posts')
      .select('user_id')
      .eq('id', postIdS)
      .single();
    if (!postCheck || postCheck.user_id !== user.id) {
      return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
    }

    // ── Traer perfiles con coordenadas ───────────────────────────────
    const { data: profiles } = await admin
      .from('profiles')
      .select('id, nombre, apellido, lat, lng, radio_alerta_km')
      .not('lat', 'is', null)
      .not('lng', 'is', null)
      .neq('id', publicador_id ?? '');

    if (!profiles || profiles.length === 0) return NextResponse.json({ ok: true, enviados: 0 });

    // Filtrar por el radio personalizado de cada usuario (default RADIO_KM si no tiene)
    const cercanos = profiles.filter((p: { lat: number; lng: number; radio_alerta_km?: number | null }) => {
      const radio = p.radio_alerta_km ?? RADIO_KM;
      return haversineKm(latN, lngN, p.lat, p.lng) <= radio;
    });
    if (cercanos.length === 0) return NextResponse.json({ ok: true, enviados: 0 });

    // ── Obtener emails en batch ──────────────────────────────────────
    const ids = cercanos.map((p: { id: string }) => p.id);
    const emailsMap: Record<string, string> = {};
    const { data: listData, error: listError } = await admin.auth.admin.listUsers({ perPage: 1000 });
    if (!listError && listData) {
      for (const u of listData.users) {
        if (ids.includes(u.id) && u.email) emailsMap[u.id] = u.email;
      }
    }

    const categoriaLabel =
      categoria === 'perdido'    ? 'perro perdido' :
      categoria === 'encontrado' ? 'perro visto' :
      categoria === 'transito'   ? 'perro en tránsito' :
      'perro en adopción';

    const zonaLabel = [zonaS, ciudadS].filter(Boolean).join(', ');

    // ── Insertar notificaciones ──────────────────────────────────────
    const notifRows = cercanos.map((p: { id: string }) => ({
      user_id: p.id,
      post_id: postIdS || null,
      tipo:    categoria,
      mensaje: `🐾 Aviso de ${categoriaLabel}${nombrePerroS ? ` (${esc(nombrePerroS)})` : ''} cerca de tu casa en ${esc(zonaLabel)}.`,
      leida:   false,
    }));
    if (notifRows.length > 0) {
      const { error: insertErr } = await admin.from('notifications').insert(notifRows);
      if (insertErr) console.error('[notificar-vecinos] insert notifications error:', insertErr.message);
    }

    // ── Enviar push notifications ────────────────────────────────────
    const pushTitle = `🐾 ${categoriaLabel.charAt(0).toUpperCase() + categoriaLabel.slice(1)} cerca de tu casa`;
    const pushBody  = nombrePerroS
      ? `${nombrePerroS} — ${zonaLabel}`
      : `Nuevo aviso en ${zonaLabel}`;
    const pushUrl   = `/publicaciones/${postIdS}`;

    await Promise.allSettled(
      cercanos.map((p: { id: string }) =>
        sendPushToUser(p.id, { title: pushTitle, body: pushBody, url: pushUrl }, admin)
      )
    );

    // ── Enviar emails ────────────────────────────────────────────────
    let enviados = 0;
    for (const perfil of cercanos as Array<{ id: string; nombre: string }>) {
      const email = emailsMap[perfil.id];
      if (!email) continue;

      const saludo    = esc(perfil.nombre ?? 'Vecino');
      const nombreEsc = nombrePerroS ? `<strong>${esc(nombrePerroS)}</strong>` : 'un perro';
      const zonaEsc   = esc(zonaLabel);
      const postUrl   = `https://www.mivecindog.com.ar/publicaciones/${esc(postIdS)}`;

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Vecindog <noreply@mivecindog.com.ar>',
          to: [email],
          subject: `🐾 Aviso de ${categoriaLabel} cerca de tu casa`,
          html: `
            <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 24px;">
              <div style="background: #EE5A3B; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
                <h1 style="color: white; margin: 0; font-size: 22px;">🐾 Vecindog</h1>
              </div>
              <h2 style="color: #1a1a1a;">Hola ${saludo},</h2>
              <p style="color: #555; font-size: 16px; line-height: 1.6;">
                Se publicó un aviso de <strong>${esc(categoriaLabel)}</strong> cerca de tu hogar:
              </p>
              <div style="background: #FFF8F0; border-radius: 12px; padding: 16px; margin: 16px 0; border-left: 4px solid #EE5A3B;">
                <p style="margin: 0; font-size: 16px;">🐶 ${nombreEsc}</p>
                <p style="margin: 4px 0 0; color: #888; font-size: 14px;">📍 ${zonaEsc}</p>
              </div>
              <p style="color: #555; font-size: 15px;">
                Si lo viste o podés ayudar, entrá al aviso y contactá al dueño.
              </p>
              <div style="text-align: center; margin-top: 24px;">
                <a href="${postUrl}"
                   style="background: #EE5A3B; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 15px;">
                  Ver aviso
                </a>
              </div>
              <p style="color: #aaa; font-size: 12px; margin-top: 32px; text-align: center;">
                Recibís este email porque registraste tu domicilio en Vecindog y hay un aviso a menos de 1km de tu casa.<br/>
                <a href="https://www.mivecindog.com.ar/mi-perfil" style="color: #EE5A3B;">Actualizar mi perfil</a>
              </p>
            </div>
          `,
        }),
      });

      if (res.ok) {
        enviados++;
      } else {
        const body = await res.text().catch(() => '');
        console.error(`[notificar-vecinos] Resend error ${res.status} para ${email}:`, body);
      }
    }

    // ── Notificar a comercios cercanos (solo avisos de perros perdidos) ─
    if (categoria === 'perdido') {
      const { data: comercios } = await admin
        .from('ads')
        .select('id, titulo, anunciante, lat, lng, categoria_local')
        .eq('variant', 'comercio')
        .eq('activo', true)
        .not('lat', 'is', null)
        .not('lng', 'is', null)
        .not('anunciante', 'is', null);

      const comerciosCercanos = (comercios ?? []).filter((c: { lat: number; lng: number }) =>
        haversineKm(latN, lngN, c.lat, c.lng) <= 2  // radio 2km para comercios
      );

      for (const comercio of comerciosCercanos as Array<{ anunciante: string; titulo: string; id: string }>) {
        const emailC = comercio.anunciante;
        if (!emailC || !emailC.includes('@')) continue;

        const postUrl = `https://www.mivecindog.com.ar/publicaciones/${esc(postIdS)}`;
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'Vecindog <noreply@mivecindog.com.ar>',
            to: [emailC],
            subject: `🐾 Perro perdido cerca de ${esc(comercio.titulo)}`,
            html: `
              <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;">
                <div style="background:#EE5A3B;border-radius:16px;padding:24px;text-align:center;margin-bottom:24px;">
                  <h1 style="color:white;margin:0;font-size:22px;">🐾 Vecindog</h1>
                </div>
                <h2 style="color:#1a1a1a;">Hola ${esc(comercio.titulo)},</h2>
                <p style="color:#555;font-size:16px;line-height:1.6;">
                  Se publicó un aviso de <strong>perro perdido</strong> cerca de tu comercio:
                  ${nombrePerroS ? `<strong>${esc(nombrePerroS)}</strong>` : 'un perro'} en ${esc(zonaLabel)}.
                </p>
                <p style="color:#555;font-size:15px;">
                  Si el perro llega a tu local o lo ven cerca, podés ayudar al dueño contactándolo desde el aviso.
                </p>
                <div style="text-align:center;margin-top:24px;">
                  <a href="${postUrl}"
                     style="background:#EE5A3B;color:white;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:15px;">
                    Ver aviso completo
                  </a>
                </div>
                <p style="color:#aaa;font-size:12px;margin-top:32px;text-align:center;">
                  Vecindog — tu comercio adherido colabora con la comunidad<br/>
                  <a href="https://www.mivecindog.com.ar/mi-comercio" style="color:#EE5A3B;">Gestionar mi comercio</a>
                </p>
              </div>
            `,
          }),
        }).catch(() => {}); // no bloquear si falla
      }
    }

    return NextResponse.json({ ok: true, enviados });
  } catch {
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 });
  }
}
