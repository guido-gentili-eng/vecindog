import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// Corre todos los lunes a las 11am (configurado en vercel.json)
// Avisa si un perro no tiene registro de peso en los últimos 60 días
const DIAS_SIN_PESO = 60;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const hoy      = new Date();
  const hoyStr   = hoy.toISOString().slice(0, 10);
  const hace60   = new Date(hoy); hace60.setDate(hoy.getDate() - DIAS_SIN_PESO);
  const hace60Str = hace60.toISOString().slice(0, 10);

  // Traer todos los perros con su último peso
  const { data: perros } = await admin
    .from('perros')
    .select('id, nombre, user_id');

  if (!perros || perros.length === 0) {
    return NextResponse.json({ ok: true, procesadas: 0 });
  }

  let enviados = 0;

  for (const perro of perros) {
    if (!perro.user_id) continue;

    // Buscar el peso más reciente del perro
    const { data: ultimoPeso } = await admin
      .from('pesos')
      .select('fecha, valor_kg')
      .eq('perro_id', perro.id)
      .order('fecha', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Si tiene un peso reciente (< 60 días), saltar
    if (ultimoPeso && ultimoPeso.fecha >= hace60Str) continue;

    const mensaje = ultimoPeso
      ? `⚖️ Hace más de ${DIAS_SIN_PESO} días que no registrás el peso de ${perro.nombre}.`
      : `⚖️ Todavía no registraste ningún peso para ${perro.nombre}.`;

    // Evitar duplicados en los últimos 7 días
    const hace7 = new Date(hoy); hace7.setDate(hoy.getDate() - 7);
    const { data: existing } = await admin
      .from('notifications')
      .select('id')
      .eq('user_id', perro.user_id)
      .eq('tipo', 'peso')
      .ilike('mensaje', `%${perro.nombre}%`)
      .gte('created_at', hace7.toISOString())
      .limit(1);

    if (existing && existing.length > 0) continue;

    await admin.from('notifications').insert({
      user_id: perro.user_id,
      post_id:  null,
      tipo:     'peso',
      mensaje,
      leida:    false,
    });

    const { data: userData } = await admin.auth.admin.getUserById(perro.user_id);
    const email = userData?.user?.email;
    if (!email) continue;

    const { data: profile } = await admin
      .from('profiles')
      .select('nombre')
      .eq('id', perro.user_id)
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
        subject: `⚖️ ¿Cuánto pesa ${perro.nombre} hoy?`,
        html: `
          <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 24px;">
            <div style="background: #EE5A3B; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:26px;font-weight:900;letter-spacing:-0.5px;"><span style="color:#ffffff;">Vecin</span><span style="color:rgba(255,255,255,0.75);">dog</span></p>
            </div>
            <h2 style="color: #1a1a1a;">${saludo}</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              ${ultimoPeso
                ? `Hace más de <strong>${DIAS_SIN_PESO} días</strong> que no registrás el peso de <strong>${perro.nombre}</strong>. El último registro fue el ${formatFecha(ultimoPeso.fecha)} (${ultimoPeso.valor_kg} kg).`
                : `Todavía no registraste ningún peso para <strong>${perro.nombre}</strong>. Llevar un historial de peso ayuda a detectar cambios de salud a tiempo.`
              }
            </p>
            <div style="background: #FFF8F0; border-radius: 12px; padding: 16px; margin: 16px 0; border-left: 4px solid #EE5A3B;">
              <p style="margin: 0; font-size: 15px;">🐶 <strong>${perro.nombre}</strong></p>
              <p style="margin: 4px 0 0; color: #888; font-size: 14px;">
                ${ultimoPeso ? `⚖️ Último peso: ${ultimoPeso.valor_kg} kg (${formatFecha(ultimoPeso.fecha)})` : '⚖️ Sin registros de peso aún'}
              </p>
            </div>
            <p style="color: #555; font-size: 15px;">
              Registrar el peso regularmente ayuda a tu veterinario a hacer un seguimiento más preciso.
            </p>
            <div style="text-align: center; margin-top: 24px;">
              <a href="https://www.mivecindog.com.ar/mis-perros/${perro.id}"
                 style="background: #EE5A3B; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 15px;">
                Registrar peso de ${perro.nombre}
              </a>
            </div>
            <p style="color: #aaa; font-size: 12px; margin-top: 32px; text-align: center;">
              Vecindog — recordatorio de seguimiento de peso
            </p>
          </div>
        `,
      }),
    });

    if (res.ok) enviados++;
  }

  return NextResponse.json({ ok: true, procesadas: perros.length, enviados });
}

function formatFecha(iso: string): string {
  if (!iso) return '—';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}
