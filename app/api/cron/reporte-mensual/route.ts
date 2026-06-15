import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Rango: mes calendario anterior completo
  const ahora    = new Date();
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
  const finMes    = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
  const mesLabel  = inicioMes.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });

  // Traer todos los ads activos o que estuvieron activos el mes pasado
  const { data: ads } = await admin
    .from('ads')
    .select('id, titulo, subtitulo, plan, anunciante, variant')
    .not('anunciante', 'is', null)
    .filter('anunciante', 'like', '%@%');

  if (!ads?.length) return NextResponse.json({ ok: true, enviados: 0 });

  // Traer todos los eventos del mes pasado
  const { data: eventos } = await admin
    .from('comercio_events')
    .select('ad_id, event_type')
    .gte('created_at', inicioMes.toISOString())
    .lt('created_at', finMes.toISOString());

  const eventosPorAd: Record<string, { view: number; click_link: number; click_telefono: number; click_mapa: number }> = {};
  for (const ev of eventos ?? []) {
    if (!eventosPorAd[ev.ad_id]) {
      eventosPorAd[ev.ad_id] = { view: 0, click_link: 0, click_telefono: 0, click_mapa: 0 };
    }
    const tipo = ev.event_type as keyof typeof eventosPorAd[string];
    if (tipo in eventosPorAd[ev.ad_id]) eventosPorAd[ev.ad_id][tipo]++;
  }

  // Agrupar ads por anunciante (email)
  const porAnunciante = new Map<string, typeof ads>();
  for (const ad of ads) {
    const email = ad.anunciante!.toLowerCase();
    if (!porAnunciante.has(email)) porAnunciante.set(email, []);
    porAnunciante.get(email)!.push(ad);
  }

  const PLAN_LABEL: Record<string, string> = {
    basico: 'Plan Básico', estandar: 'Plan Estándar', premium: 'Plan Premium', comercio: 'Red Vecindog',
  };
  const VARIANT_LABEL: Record<string, string> = {
    leaderboard: 'Banner', card: 'Card', sidebar: 'Panel lateral', comercio: 'Perfil Red Vecindog',
  };

  let enviados = 0;

  for (const [email, adsAnunciante] of porAnunciante) {
    // Solo enviar si tuvo al menos algún evento en el mes
    const totalVistas = adsAnunciante.reduce((sum, a) => sum + (eventosPorAd[a.id]?.view ?? 0), 0);
    const totalClicks = adsAnunciante.reduce((sum, a) =>
      sum + (eventosPorAd[a.id]?.click_link ?? 0)
          + (eventosPorAd[a.id]?.click_telefono ?? 0)
          + (eventosPorAd[a.id]?.click_mapa ?? 0), 0);

    // Siempre enviamos aunque sea 0 (el anunciante pagó, merece el reporte)
    const negocio = adsAnunciante[0].titulo ?? 'tu negocio';

    const filasAds = adsAnunciante.map((a) => {
      const stats = eventosPorAd[a.id] ?? { view: 0, click_link: 0, click_telefono: 0, click_mapa: 0 };
      const clics = stats.click_link + stats.click_telefono + stats.click_mapa;
      const label = VARIANT_LABEL[a.variant] ?? a.variant;
      return `
        <tr>
          <td style="padding:10px 12px;font-size:14px;color:#333;border-bottom:1px solid #f0ebe4">${label}</td>
          <td style="padding:10px 12px;font-size:14px;font-weight:bold;color:#1a1a1a;text-align:center;border-bottom:1px solid #f0ebe4">${stats.view.toLocaleString('es-AR')}</td>
          <td style="padding:10px 12px;font-size:14px;font-weight:bold;color:#B85C4A;text-align:center;border-bottom:1px solid #f0ebe4">${clics.toLocaleString('es-AR')}</td>
        </tr>`;
    }).join('');

    const planLabel = PLAN_LABEL[adsAnunciante[0].plan] ?? adsAnunciante[0].plan;

    const html = `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a1a">
        <div style="background:#B85C4A;border-radius:16px;padding:24px;text-align:center;margin-bottom:28px">
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:26px;font-weight:900;letter-spacing:-0.5px">
            <span style="color:#fff">Vecin</span><span style="color:rgba(255,255,255,0.7)">dog</span>
          </p>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px">Reporte mensual de publicidad</p>
        </div>

        <h2 style="color:#1a1a1a;margin-bottom:4px">Reporte de ${mesLabel}</h2>
        <p style="color:#666;font-size:15px;margin-bottom:24px">
          Hola equipo de <strong>${negocio}</strong> — acá está el resumen de rendimiento de ${planLabel} durante ${mesLabel}.
        </p>

        <!-- Resumen -->
        <div style="display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap">
          <div style="flex:1;min-width:120px;background:#fff8f0;border:2px solid #f0d9c8;border-radius:14px;padding:18px;text-align:center">
            <p style="margin:0;font-size:32px;font-weight:900;color:#B85C4A">${totalVistas.toLocaleString('es-AR')}</p>
            <p style="margin:6px 0 0;font-size:12px;font-weight:bold;color:#888;text-transform:uppercase;letter-spacing:0.05em">Impresiones</p>
          </div>
          <div style="flex:1;min-width:120px;background:#f0faf4;border:2px solid #c6e8d4;border-radius:14px;padding:18px;text-align:center">
            <p style="margin:0;font-size:32px;font-weight:900;color:#3F8B5C">${totalClicks.toLocaleString('es-AR')}</p>
            <p style="margin:6px 0 0;font-size:12px;font-weight:bold;color:#888;text-transform:uppercase;letter-spacing:0.05em">Clics totales</p>
          </div>
          ${totalVistas > 0 ? `
          <div style="flex:1;min-width:120px;background:#f5f0ff;border:2px solid #d4c8f0;border-radius:14px;padding:18px;text-align:center">
            <p style="margin:0;font-size:32px;font-weight:900;color:#6d28d9">${((totalClicks / totalVistas) * 100).toFixed(1)}%</p>
            <p style="margin:6px 0 0;font-size:12px;font-weight:bold;color:#888;text-transform:uppercase;letter-spacing:0.05em">CTR</p>
          </div>` : ''}
        </div>

        <!-- Detalle por slot -->
        ${adsAnunciante.length > 1 ? `
        <h3 style="color:#1a1a1a;font-size:15px;margin-bottom:10px">Detalle por slot</h3>
        <table style="width:100%;border-collapse:collapse;border-radius:12px;overflow:hidden;margin-bottom:24px">
          <thead>
            <tr style="background:#f9f5f0">
              <th style="padding:10px 12px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#888">Slot</th>
              <th style="padding:10px 12px;text-align:center;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#888">Vistas</th>
              <th style="padding:10px 12px;text-align:center;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#888">Clics</th>
            </tr>
          </thead>
          <tbody>${filasAds}</tbody>
        </table>` : ''}

        <p style="color:#555;font-size:14px;line-height:1.7;margin-bottom:24px">
          Las <strong>impresiones</strong> son las veces que tu anuncio fue visto en pantalla por un usuario real. Los <strong>clics</strong> incluyen visitas al sitio, llamadas y consultas de ubicación.
        </p>

        <div style="text-align:center;margin:28px 0">
          <a href="https://www.mivecindog.com.ar/mi-comercio"
             style="background:#B85C4A;color:white;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block">
            Ver mi panel →
          </a>
        </div>

        <p style="color:#aaa;font-size:12px;margin-top:32px;text-align:center;line-height:1.6">
          ¿Querés ajustar tu publicidad? Escribinos a
          <a href="mailto:hola@mivecindog.com.ar" style="color:#B85C4A">hola@mivecindog.com.ar</a>
        </p>
      </div>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Vecindog <noreply@mivecindog.com.ar>',
        to:   [email],
        subject: `📊 Tu reporte de publicidad en Vecindog — ${mesLabel}`,
        html,
      }),
    });

    if (res.ok) enviados++;
  }

  return NextResponse.json({ ok: true, anunciantes: porAnunciante.size, enviados, mes: mesLabel });
}
