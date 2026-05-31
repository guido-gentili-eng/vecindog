import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const RADIO_KM = 1;

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
    const { lat, lng, zona, ciudad, categoria, nombre_perro, post_id, publicador_id } = await req.json();

    if (!lat || !lng) return NextResponse.json({ ok: false, reason: 'sin coords' });

    // Cliente admin para leer todos los perfiles
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Traer perfiles con coordenadas (excluir al publicador)
    const { data: profiles } = await admin
      .from('profiles')
      .select('id, nombre, apellido, lat, lng')
      .not('lat', 'is', null)
      .not('lng', 'is', null)
      .neq('id', publicador_id ?? '');

    if (!profiles || profiles.length === 0) return NextResponse.json({ ok: true, enviados: 0 });

    // Filtrar por radio
    const cercanos = profiles.filter((p: { lat: number; lng: number }) =>
      haversineKm(lat, lng, p.lat, p.lng) <= RADIO_KM
    );

    if (cercanos.length === 0) return NextResponse.json({ ok: true, enviados: 0 });

    // Obtener emails de auth.users
    const ids = cercanos.map((p: { id: string }) => p.id);
    const emailsMap: Record<string, string> = {};
    for (const id of ids) {
      const { data: userData } = await admin.auth.admin.getUserById(id);
      if (userData?.user?.email) emailsMap[id] = userData.user.email;
    }

    const categoriaLabel = categoria === 'perdido' ? 'perro perdido' : categoria === 'encontrado' ? 'perro encontrado' : 'perro en adopción';
    const nombrePerro = nombre_perro || 'un perro';
    const zonaLabel = [zona, ciudad].filter(Boolean).join(', ');

    // Insertar notificaciones en la tabla
    const notifRows = cercanos.map((p: { id: string }) => ({
      user_id:  p.id,
      post_id:  post_id ?? null,
      tipo:     categoria,
      mensaje:  `🐾 Aviso de ${categoriaLabel}${nombre_perro ? ` (${nombre_perro})` : ''} cerca de tu casa en ${zonaLabel}.`,
      leida:    false,
    }));
    if (notifRows.length > 0) {
      await admin.from('notifications').insert(notifRows);
    }

    // Enviar emails via Resend
    let enviados = 0;
    for (const perfil of cercanos as Array<{ id: string; nombre: string }>) {
      const email = emailsMap[perfil.id];
      if (!email) continue;

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
              <h2 style="color: #1a1a1a;">Hola ${perfil.nombre},</h2>
              <p style="color: #555; font-size: 16px; line-height: 1.6;">
                Se publicó un aviso de <strong>${categoriaLabel}</strong> cerca de tu hogar:
              </p>
              <div style="background: #FFF8F0; border-radius: 12px; padding: 16px; margin: 16px 0; border-left: 4px solid #EE5A3B;">
                <p style="margin: 0; font-size: 16px;"><strong>🐶 ${nombrePerro}</strong></p>
                <p style="margin: 4px 0 0; color: #888; font-size: 14px;">📍 ${zonaLabel}</p>
              </div>
              <p style="color: #555; font-size: 15px;">
                Si lo viste o podés ayudar, entrá al aviso y contactá al dueño.
              </p>
              <div style="text-align: center; margin-top: 24px;">
                <a href="https://www.mivecindog.com.ar/publicaciones/${post_id}"
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

      if (res.ok) enviados++;
    }

    return NextResponse.json({ ok: true, enviados });
  } catch (err) {
    console.error('notificar-vecinos error:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
