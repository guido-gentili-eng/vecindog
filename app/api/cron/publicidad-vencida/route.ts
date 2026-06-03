import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// Avisa 3 días antes del vencimiento
const DIAS_AVISO = 3;

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
  const avisoFin = new Date(hoy);
  avisoFin.setDate(avisoFin.getDate() + DIAS_AVISO);
  const avisoFinStr = avisoFin.toISOString().slice(0, 10);

  // 1. Desactivar ads ya vencidos
  const { data: vencidos } = await admin
    .from('ads')
    .select('id, titulo, anunciante')
    .eq('activo', true)
    .not('fecha_fin', 'is', null)
    .lt('fecha_fin', hoyStr);

  if (vencidos?.length) {
    await admin
      .from('ads')
      .update({ activo: false })
      .in('id', vencidos.map((a: { id: string }) => a.id));
  }

  // 2. Buscar ads que vencen en exactamente DIAS_AVISO días (para no enviar el mail más de una vez)
  // Agrupar por (anunciante + plan + fecha_fin) para enviar un solo email por campaña
  const { data: proximos } = await admin
    .from('ads')
    .select('id, titulo, subtitulo, plan, anunciante, fecha_fin')
    .eq('activo', true)
    .eq('fecha_fin', avisoFinStr);

  if (!proximos?.length) {
    return NextResponse.json({ ok: true, desactivados: vencidos?.length ?? 0, avisos: 0 });
  }

  const PLAN_LABEL: Record<string, string> = {
    basico:   'Plan Básico',
    estandar: 'Plan Estándar',
    premium:  'Plan Premium',
  };

  // Agrupar ads por (anunciante + plan) para enviar un email por campaña
  const grupos = new Map<string, typeof proximos>();
  for (const ad of proximos) {
    const key = `${ad.anunciante}|${ad.plan}`;
    if (!grupos.has(key)) grupos.set(key, []);
    grupos.get(key)!.push(ad);
  }

  let enviados = 0;

  for (const [, adsGrupo] of grupos) {
    const ad    = adsGrupo[0];
    const email = ad.anunciante;
    if (!email || !email.includes('@')) continue;

    const allIds   = adsGrupo.map((a: { id: string }) => a.id).join(',');
    const planLabel = PLAN_LABEL[ad.plan] ?? ad.plan;
    const fechaFin  = new Date(ad.fecha_fin + 'T00:00:00').toLocaleDateString('es-AR', {
      day: 'numeric', month: 'long', year: 'numeric',
    });

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Vecindog <noreply@mivecindog.com.ar>',
        to:   [email],
        subject: `Tu publicidad en Vecindog vence en ${DIAS_AVISO} días — Renovar ahora`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
            <div style="background:#B85C4A;border-radius:16px;padding:24px;text-align:center;margin-bottom:24px">
              <h1 style="color:white;margin:0;font-size:22px">🐾 Vecindog</h1>
            </div>

            <h2 style="color:#1a1a1a">Tu publicidad está por vencer</h2>

            <p style="color:#555;font-size:16px;line-height:1.6">
              La publicidad de <strong>${ad.titulo}</strong> (${planLabel}) vence el <strong>${fechaFin}</strong>.
            </p>

            <div style="background:#FFF8F0;border-radius:12px;padding:16px;margin:20px 0;border-left:4px solid #B85C4A">
              <p style="margin:0;font-size:15px;font-weight:bold;color:#1a1a1a">📢 ${ad.titulo}</p>
              ${ad.subtitulo ? `<p style="margin:4px 0 0;color:#888;font-size:14px">${ad.subtitulo}</p>` : ''}
              <p style="margin:8px 0 0;color:#B85C4A;font-size:13px;font-weight:bold">${planLabel} · vence el ${fechaFin}</p>
            </div>

            <p style="color:#555;font-size:15px;line-height:1.6">
              Para seguir llegando a dueños de mascotas de toda Argentina, renová tu plan antes de que se venza.
            </p>

            <div style="text-align:center;margin-top:28px">
              <a href="https://www.mivecindog.com.ar/publicitate/renovar?ads=${allIds}"
                 style="background:#B85C4A;color:white;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block">
                Renovar ahora (sin reingresar datos) →
              </a>
            </div>

            <p style="color:#aaa;font-size:12px;margin-top:32px;text-align:center">
              ¿Tenés alguna duda? Escribinos a
              <a href="mailto:hola@mivecindog.com.ar" style="color:#B85C4A">hola@mivecindog.com.ar</a>
              o al WhatsApp <a href="https://wa.me/5492914050210" style="color:#B85C4A">+54 9 291 405-0210</a>
            </p>
          </div>
        `,
      }),
    });

    if (res.ok) enviados++;
  }

  return NextResponse.json({
    ok:          true,
    desactivados: vencidos?.length ?? 0,
    avisos:       proximos.length,
    enviados,
  });
}
