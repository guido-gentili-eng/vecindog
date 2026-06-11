import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// Corre todos los días a las 8am (configurado en vercel.json)
// Avisa 1 día antes del turno de ecografía o radiografía
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const hoy     = new Date();
  const manana  = new Date(hoy); manana.setDate(hoy.getDate() + 1);

  const hoyStr    = hoy.toISOString().slice(0, 10);
  const mananaStr = manana.toISOString().slice(0, 10);

  // Turnos de mañana y de hoy
  const { data: turnos } = await admin
    .from('turnos')
    .select('id, tipo, fecha, nota, perro_id, perros(id, nombre, user_id)')
    .in('fecha', [hoyStr, mananaStr]);

  if (!turnos || turnos.length === 0) {
    return NextResponse.json({ ok: true, procesadas: 0 });
  }

  let enviados = 0;

  for (const t of turnos) {
    const perrosRaw = t.perros;
    const perro = (Array.isArray(perrosRaw) ? perrosRaw[0] : perrosRaw) as { id: string; nombre: string; user_id: string } | null;
    if (!perro?.user_id) continue;

    const esHoy    = t.fecha === hoyStr;
    const tipoStr  = t.tipo === 'ecografia' ? 'ecografía' : 'radiografía';
    const mensaje  = esHoy
      ? `📅 Hoy es el turno de ${tipoStr} de ${perro.nombre}${t.nota ? ` — ${t.nota}` : ''}.`
      : `📅 Mañana es el turno de ${tipoStr} de ${perro.nombre}${t.nota ? ` — ${t.nota}` : ''}.`;

    // Evitar duplicados por día
    const { data: existing } = await admin
      .from('notifications')
      .select('id')
      .eq('user_id', perro.user_id)
      .eq('tipo', 'turno')
      .ilike('mensaje', `%${tipoStr}%${perro.nombre}%`)
      .gte('created_at', hoyStr)
      .limit(1);

    if (!existing || existing.length === 0) {
      await admin.from('notifications').insert({
        user_id: perro.user_id,
        post_id:  null,
        tipo:     'turno',
        mensaje,
        leida:    false,
      });
    }

    const { data: userData } = await admin.auth.admin.getUserById(perro.user_id);
    const email = userData?.user?.email;
    if (!email) continue;

    const { data: profile } = await admin
      .from('profiles')
      .select('nombre')
      .eq('id', perro.user_id)
      .single();

    const saludo = profile?.nombre ? `Hola ${profile.nombre},` : 'Hola,';
    const asunto = esHoy
      ? `📅 Hoy es el turno de ${tipoStr} de ${perro.nombre}`
      : `⏰ Mañana es el turno de ${tipoStr} de ${perro.nombre}`;

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
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:26px;font-weight:900;letter-spacing:-0.5px;"><span style="color:#ffffff;">Vecin</span><span style="color:rgba(255,255,255,0.75);">dog</span></p>
            </div>
            <h2 style="color: #1a1a1a;">${saludo}</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              ${esHoy
                ? `Hoy tenés el turno de <strong>${tipoStr}</strong> de <strong>${perro.nombre}</strong>.`
                : `Mañana tenés el turno de <strong>${tipoStr}</strong> de <strong>${perro.nombre}</strong>.`
              }
            </p>
            <div style="background: #FFF8F0; border-radius: 12px; padding: 16px; margin: 16px 0; border-left: 4px solid #EE5A3B;">
              <p style="margin: 0; font-size: 15px;">🐶 <strong>${perro.nombre}</strong></p>
              <p style="margin: 4px 0 0; color: #888; font-size: 14px;">🩻 Estudio: ${tipoStr}</p>
              <p style="margin: 4px 0 0; color: #888; font-size: 14px;">📅 Fecha: ${formatFecha(t.fecha)}</p>
              ${t.nota ? `<p style="margin: 4px 0 0; color: #888; font-size: 14px;">📝 ${t.nota}</p>` : ''}
            </div>
            <div style="text-align: center; margin-top: 24px;">
              <a href="https://www.mivecindog.com.ar/mis-perros/${perro.id}"
                 style="background: #EE5A3B; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 15px;">
                Ver perfil de ${perro.nombre}
              </a>
            </div>
            <p style="color: #aaa; font-size: 12px; margin-top: 32px; text-align: center;">
              Vecindog — recordatorio automático de turnos
            </p>
          </div>
        `,
      }),
    });

    if (res.ok) enviados++;
  }

  return NextResponse.json({ ok: true, procesadas: turnos.length, enviados });
}

function formatFecha(iso: string): string {
  if (!iso) return '—';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}
