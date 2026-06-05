import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// Corre todos los días a las 9:30am (configurado en vercel.json)
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const hoy    = new Date();
  const hoyStr = hoy.toISOString().slice(0, 10);

  // Traer todos los registros de grooming junto con los datos del perro
  const { data: groomings } = await admin
    .from('grooming')
    .select('id, ultima_fecha, frecuencia_dias, tipo, perro_id, perros(id, nombre, user_id)');

  if (!groomings || groomings.length === 0) {
    return NextResponse.json({ ok: true, procesadas: 0 });
  }

  let enviados = 0;

  for (const g of groomings) {
    const perrosRaw = g.perros;
    const perro = (Array.isArray(perrosRaw) ? perrosRaw[0] : perrosRaw) as { id: string; nombre: string; user_id: string } | null;
    if (!perro?.user_id) continue;

    // Calcular próxima fecha de grooming
    const ultimaFecha = new Date(g.ultima_fecha);
    const proximaFecha = new Date(ultimaFecha);
    proximaFecha.setDate(ultimaFecha.getDate() + g.frecuencia_dias);
    const proximaStr = proximaFecha.toISOString().slice(0, 10);

    const diasRestantes = Math.round(
      (proximaFecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Solo notificar si la fecha ya llegó (<=0) o faltan 2 días o menos
    if (diasRestantes > 2) continue;

    const tipoLabel =
      g.tipo === 'baño'        ? 'bañar'                        :
      g.tipo === 'peluquería'  ? 'llevar a la peluquería'        :
                                 'bañar y llevar a la peluquería';

    const mensaje = diasRestantes <= 0
      ? `🛁 Hoy es el día de ${tipoLabel} a ${perro.nombre}.`
      : `🛁 Es hora de ${tipoLabel} a ${perro.nombre} (en ${diasRestantes} día${diasRestantes === 1 ? '' : 's'}).`;

    // Evitar duplicados: verificar si ya existe una notificación de grooming en los últimos 7 días
    const hace7Dias = new Date(hoy);
    hace7Dias.setDate(hoy.getDate() - 7);
    const hace7DiasStr = hace7Dias.toISOString().slice(0, 10);

    const { data: existing } = await admin
      .from('notifications')
      .select('id')
      .eq('user_id', perro.user_id)
      .eq('tipo', 'grooming')
      .ilike('mensaje', `%${perro.nombre}%`)
      .gte('created_at', hace7DiasStr)
      .limit(1);

    if (!existing || existing.length === 0) {
      await admin.from('notifications').insert({
        user_id: perro.user_id,
        post_id:  null,
        tipo:     'grooming',
        mensaje,
        leida:    false,
      });
    }

    // Email solo cuando toca hoy o cuando faltan exactamente 2 días
    const enviarEmail = diasRestantes <= 0 || diasRestantes === 2;
    if (!enviarEmail) continue;

    const { data: userData } = await admin.auth.admin.getUserById(perro.user_id);
    const email = userData?.user?.email;
    if (!email) continue;

    const { data: profile } = await admin
      .from('profiles')
      .select('nombre')
      .eq('id', perro.user_id)
      .single();

    const saludo = profile?.nombre ? `Hola ${profile.nombre},` : 'Hola,';
    const asunto = diasRestantes <= 0
      ? `🛁 Hoy toca ${tipoLabel} a ${perro.nombre}`
      : `⏰ Grooming de ${perro.nombre} en ${diasRestantes} días`;

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
              ${diasRestantes <= 0
                ? `Hoy es el día de <strong>${tipoLabel}</strong> a <strong>${perro.nombre}</strong>.`
                : `El grooming de <strong>${perro.nombre}</strong> está programado en <strong>${diasRestantes} días</strong> (${formatFecha(proximaStr)}).`
              }
            </p>
            <div style="background: #FFF8F0; border-radius: 12px; padding: 16px; margin: 16px 0; border-left: 4px solid #EE5A3B;">
              <p style="margin: 0; font-size: 15px;">🐶 <strong>${perro.nombre}</strong></p>
              <p style="margin: 4px 0 0; color: #888; font-size: 14px;">🛁 Tipo: ${g.tipo}</p>
              <p style="margin: 4px 0 0; color: #888; font-size: 14px;">📅 Próxima fecha: ${formatFecha(proximaStr)}</p>
              <p style="margin: 4px 0 0; color: #888; font-size: 14px;">🔁 Frecuencia: cada ${g.frecuencia_dias} días</p>
            </div>
            <div style="text-align: center; margin-top: 24px;">
              <a href="https://www.mivecindog.com.ar/mis-perros/${perro.id}"
                 style="background: #EE5A3B; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 15px;">
                Ver perfil de ${perro.nombre}
              </a>
            </div>
            <p style="color: #aaa; font-size: 12px; margin-top: 32px; text-align: center;">
              Vecindog — recordatorio automático de grooming
            </p>
          </div>
        `,
      }),
    });

    if (res.ok) enviados++;
  }

  return NextResponse.json({ ok: true, procesadas: groomings.length, enviados });
}

function formatFecha(iso: string): string {
  if (!iso) return '—';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}
