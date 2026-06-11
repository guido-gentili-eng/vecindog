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

  const hoy  = new Date();
  const en7  = new Date(hoy); en7.setDate(hoy.getDate() + 7);

  const hoyStr = hoy.toISOString().slice(0, 10);
  const en7Str = en7.toISOString().slice(0, 10);

  // Traer desparasitaciones con proxima fecha entre hoy y 7 días
  const { data: desparas } = await admin
    .from('desparasitaciones')
    .select('id, producto, proxima, perro_id, perros(id, nombre, user_id)')
    .gte('proxima', hoyStr)
    .lte('proxima', en7Str);

  if (!desparas || desparas.length === 0) {
    return NextResponse.json({ ok: true, procesadas: 0 });
  }

  let enviados = 0;

  for (const d of desparas) {
    const perrosRaw = d.perros;
    const perro = (Array.isArray(perrosRaw) ? perrosRaw[0] : perrosRaw) as { id: string; nombre: string; user_id: string } | null;
    if (!perro?.user_id) continue;

    const diasRestantes = Math.round(
      (new Date(d.proxima).getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
    );

    const mensaje = diasRestantes === 0
      ? `🐛 Hoy toca la desparasitación de ${perro.nombre} (${d.producto}).`
      : `🐛 La desparasitación de ${perro.nombre} (${d.producto}) vence en ${diasRestantes} día${diasRestantes === 1 ? '' : 's'}.`;

    // Evitar duplicados por día
    const { data: existing } = await admin
      .from('notifications')
      .select('id')
      .eq('user_id', perro.user_id)
      .eq('tipo', 'desparasitacion')
      .ilike('mensaje', `%${d.producto}%${perro.nombre}%`)
      .gte('created_at', hoyStr)
      .limit(1);

    if (!existing || existing.length === 0) {
      await admin.from('notifications').insert({
        user_id: perro.user_id,
        post_id:  null,
        tipo:     'desparasitacion',
        mensaje,
        leida:    false,
      });
    }

    // Solo email hoy, en 3 días o en 7 días
    const enviarEmail = diasRestantes === 0 || diasRestantes === 3 || diasRestantes === 7;
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
    const asunto = diasRestantes === 0
      ? `🐛 Hoy toca la desparasitación de ${perro.nombre}`
      : `⏰ Desparasitación de ${perro.nombre} en ${diasRestantes} días`;

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
              <img src="https://www.mivecindog.com.ar/logo.svg" alt="Vecindog" width="160" height="40" style="display:block;margin:0 auto;" />
            </div>
            <h2 style="color: #1a1a1a;">${saludo}</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              ${diasRestantes === 0
                ? `Hoy es el día de la desparasitación de <strong>${perro.nombre}</strong> con <strong>${d.producto}</strong>.`
                : `La desparasitación de <strong>${perro.nombre}</strong> con <strong>${d.producto}</strong> vence en <strong>${diasRestantes} días</strong> (${formatFecha(d.proxima)}).`
              }
            </p>
            <div style="background: #FFF8F0; border-radius: 12px; padding: 16px; margin: 16px 0; border-left: 4px solid #EE5A3B;">
              <p style="margin: 0; font-size: 15px;">🐶 <strong>${perro.nombre}</strong></p>
              <p style="margin: 4px 0 0; color: #888; font-size: 14px;">🐛 Producto: ${d.producto}</p>
              <p style="margin: 4px 0 0; color: #888; font-size: 14px;">📅 Fecha: ${formatFecha(d.proxima)}</p>
            </div>
            <div style="text-align: center; margin-top: 24px;">
              <a href="https://www.mivecindog.com.ar/mis-perros/${perro.id}"
                 style="background: #EE5A3B; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 15px;">
                Ver perfil de ${perro.nombre}
              </a>
            </div>
            <p style="color: #aaa; font-size: 12px; margin-top: 32px; text-align: center;">
              Vecindog — recordatorio automático de desparasitaciones
            </p>
          </div>
        `,
      }),
    });

    if (res.ok) enviados++;
  }

  return NextResponse.json({ ok: true, procesadas: desparas.length, enviados });
}

function formatFecha(iso: string): string {
  if (!iso) return '—';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}
