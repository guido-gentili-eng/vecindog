import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// Corre todos los días a las 9am (configurado en vercel.json)
export async function GET(req: NextRequest) {
  // Verificar que viene de Vercel Cron
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const hoy    = new Date();
  const en3    = new Date(hoy); en3.setDate(hoy.getDate() + 3);
  const en7    = new Date(hoy); en7.setDate(hoy.getDate() + 7);

  const hoyStr  = hoy.toISOString().slice(0, 10);
  const en7Str  = en7.toISOString().slice(0, 10);

  // Traer vacunas con próxima fecha entre hoy y 7 días
  const { data: vacunas } = await admin
    .from('vacunas')
    .select('id, nombre, proxima, perro_id, perros(id, nombre, user_id)')
    .gte('proxima', hoyStr)
    .lte('proxima', en7Str);

  if (!vacunas || vacunas.length === 0) {
    return NextResponse.json({ ok: true, procesadas: 0 });
  }

  let enviados = 0;

  for (const v of vacunas) {
    const perrosRaw = v.perros;
    const perro = (Array.isArray(perrosRaw) ? perrosRaw[0] : perrosRaw) as { id: string; nombre: string; user_id: string } | null;
    if (!perro?.user_id) continue;

    const diasRestantes = Math.round(
      (new Date(v.proxima).getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
    );

    const mensaje = diasRestantes === 0
      ? `🔔 Hoy vence la vacuna ${v.nombre} de ${perro.nombre}.`
      : `🔔 La vacuna ${v.nombre} de ${perro.nombre} vence en ${diasRestantes} día${diasRestantes === 1 ? '' : 's'}.`;

    // Crear notificación in-app (evitar duplicados por día)
    const { data: existing } = await admin
      .from('notifications')
      .select('id')
      .eq('user_id', perro.user_id)
      .eq('tipo', 'vacuna')
      .ilike('mensaje', `%${v.nombre}%${perro.nombre}%`)
      .gte('created_at', hoyStr)
      .limit(1);

    if (!existing || existing.length === 0) {
      await admin.from('notifications').insert({
        user_id: perro.user_id,
        post_id:  null,
        tipo:     'vacuna',
        mensaje,
        leida:    false,
      });
    }

    // Obtener email del usuario
    const { data: userData } = await admin.auth.admin.getUserById(perro.user_id);
    const email = userData?.user?.email;
    if (!email) continue;

    // Solo enviar email si es hoy, en 3 días o en 7 días (no todos los días intermedios)
    const enviarEmail = diasRestantes === 0 || diasRestantes === 3 || diasRestantes === 7;
    if (!enviarEmail) continue;

    // Obtener nombre del dueño
    const { data: profile } = await admin
      .from('profiles')
      .select('nombre')
      .eq('id', perro.user_id)
      .single();

    const saludo = profile?.nombre ? `Hola ${profile.nombre},` : 'Hola,';
    const asunto = diasRestantes === 0
      ? `🔔 Hoy vence la vacuna de ${perro.nombre}`
      : `⏰ La vacuna de ${perro.nombre} vence en ${diasRestantes} días`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Vecindog <noreply@mivecindog.com.ar>',
        to: [email],
        subject: asunto,
        html: `
          <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 24px;">
            <div style="background: #EE5A3B; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <h1 style="color: white; margin: 0; font-size: 22px;">🐾 Vecindog</h1>
            </div>
            <h2 style="color: #1a1a1a;">${saludo}</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              ${diasRestantes === 0
                ? `Hoy es el día en que <strong>${perro.nombre}</strong> tiene que recibir la vacuna <strong>${v.nombre}</strong>.`
                : `La vacuna <strong>${v.nombre}</strong> de <strong>${perro.nombre}</strong> vence el <strong>${formatFecha(v.proxima)}</strong> (en ${diasRestantes} días).`
              }
            </p>
            <div style="background: #FFF8F0; border-radius: 12px; padding: 16px; margin: 16px 0; border-left: 4px solid #EE5A3B;">
              <p style="margin: 0; font-size: 15px;">🐶 <strong>${perro.nombre}</strong></p>
              <p style="margin: 4px 0 0; color: #888; font-size: 14px;">💉 Vacuna: ${v.nombre}</p>
              <p style="margin: 4px 0 0; color: #888; font-size: 14px;">📅 Fecha: ${formatFecha(v.proxima)}</p>
            </div>
            <p style="color: #555; font-size: 15px;">
              Acordate de sacar turno con el veterinario a tiempo.
            </p>
            <div style="text-align: center; margin-top: 24px;">
              <a href="https://www.mivecindog.com.ar/mis-perros/${perro.id}"
                 style="background: #EE5A3B; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 15px;">
                Ver carnet de ${perro.nombre}
              </a>
            </div>
            <p style="color: #aaa; font-size: 12px; margin-top: 32px; text-align: center;">
              Vecindog — recordatorio automático de vacunas<br/>
              <a href="https://www.mivecindog.com.ar/mis-perros" style="color: #EE5A3B;">Ver mis perros</a>
            </p>
          </div>
        `,
      }),
    });

    if (res.ok) enviados++;
  }

  return NextResponse.json({ ok: true, procesadas: vacunas.length, enviados });
}

function formatFecha(iso: string): string {
  if (!iso) return '—';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}
