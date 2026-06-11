import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// Corre todos los días a las 10:30am (configurado en vercel.json)
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
  const en3  = new Date(hoy); en3.setDate(hoy.getDate() + 3);

  const hoyStr = hoy.toISOString().slice(0, 10);
  const en3Str = en3.toISOString().slice(0, 10);

  // Medicamentos activos que vencen en los próximos 3 días
  const { data: meds } = await admin
    .from('medicamentos')
    .select('id, nombre, dosis, fecha_fin, perro_id, perros(id, nombre, user_id)')
    .eq('activo', true)
    .not('fecha_fin', 'is', null)
    .gte('fecha_fin', hoyStr)
    .lte('fecha_fin', en3Str);

  // Los medicamentos con fecha_fin = hoy ya están incluidos en la query anterior (gte hoy)
  const medicamentos = meds ?? [];

  if (medicamentos.length === 0) {
    return NextResponse.json({ ok: true, procesadas: 0 });
  }

  let enviados = 0;

  for (const med of medicamentos) {
    const perrosRaw = med.perros;
    const perro = (Array.isArray(perrosRaw) ? perrosRaw[0] : perrosRaw) as { id: string; nombre: string; user_id: string } | null;
    if (!perro?.user_id) continue;

    const diasRestantes = Math.round(
      (new Date(med.fecha_fin).getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
    );

    const mensaje = diasRestantes <= 0
      ? `💊 El medicamento ${med.nombre} de ${perro.nombre} terminó hoy.`
      : `💊 El medicamento ${med.nombre} de ${perro.nombre} termina en ${diasRestantes} día${diasRestantes === 1 ? '' : 's'}.`;

    // Evitar duplicados por día
    const { data: existing } = await admin
      .from('notifications')
      .select('id')
      .eq('user_id', perro.user_id)
      .eq('tipo', 'medicamento')
      .ilike('mensaje', `%${med.nombre}%${perro.nombre}%`)
      .gte('created_at', hoyStr)
      .limit(1);

    const yaNotificado = existing && existing.length > 0;

    if (!yaNotificado) {
      await admin.from('notifications').insert({
        user_id: perro.user_id,
        post_id:  null,
        tipo:     'medicamento',
        mensaje,
        leida:    false,
      });
    }

    // Solo enviar email si no hubo notificación hoy
    if (yaNotificado) continue;

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
      ? `💊 El tratamiento de ${perro.nombre} terminó hoy`
      : `⏰ El tratamiento de ${perro.nombre} termina en ${diasRestantes} días`;

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
              ${diasRestantes <= 0
                ? `El tratamiento de <strong>${perro.nombre}</strong> con <strong>${med.nombre}</strong> terminó hoy. ¿Necesita continuar el tratamiento?`
                : `El tratamiento de <strong>${perro.nombre}</strong> con <strong>${med.nombre}</strong> termina en <strong>${diasRestantes} días</strong> (${formatFecha(med.fecha_fin)}).`
              }
            </p>
            <div style="background: #FFF8F0; border-radius: 12px; padding: 16px; margin: 16px 0; border-left: 4px solid #EE5A3B;">
              <p style="margin: 0; font-size: 15px;">🐶 <strong>${perro.nombre}</strong></p>
              <p style="margin: 4px 0 0; color: #888; font-size: 14px;">💊 Medicamento: ${med.nombre}</p>
              ${med.dosis ? `<p style="margin: 4px 0 0; color: #888; font-size: 14px;">📏 Dosis: ${med.dosis}</p>` : ''}
              <p style="margin: 4px 0 0; color: #888; font-size: 14px;">📅 Fecha fin: ${formatFecha(med.fecha_fin)}</p>
            </div>
            <p style="color: #555; font-size: 15px;">
              Consultá con tu veterinario si necesita continuar o ajustar el tratamiento.
            </p>
            <div style="text-align: center; margin-top: 24px;">
              <a href="https://www.mivecindog.com.ar/mis-perros/${perro.id}"
                 style="background: #EE5A3B; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 15px;">
                Ver perfil de ${perro.nombre}
              </a>
            </div>
            <p style="color: #aaa; font-size: 12px; margin-top: 32px; text-align: center;">
              Vecindog — recordatorio automático de medicamentos
            </p>
          </div>
        `,
      }),
    });

    if (res.ok) enviados++;
  }

  return NextResponse.json({ ok: true, procesadas: medicamentos.length, enviados });
}

function formatFecha(iso: string): string {
  if (!iso) return '—';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}
