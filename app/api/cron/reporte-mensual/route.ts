import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function esc(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Rango: mes calendario anterior completo
  const ahora     = new Date();
  const inicioMes = new Date(Date.UTC(ahora.getUTCFullYear(), ahora.getUTCMonth() - 1, 1));
  const finMes    = new Date(Date.UTC(ahora.getUTCFullYear(), ahora.getUTCMonth(), 1));
  const mesLabel  = inicioMes.toLocaleDateString('es-AR', { month: 'long', year: 'numeric', timeZone: 'UTC' });

  // Solo ads activos con fecha_fin futura o que vencieron en el último mes (pagaron el período)
  const { data: ads } = await admin
    .from('ads')
    .select('id, titulo, subtitulo, plan, anunciante, variant')
    .not('anunciante', 'is', null)
    .filter('anunciante', 'like', '%@%')
    .gte('fecha_fin', inicioMes.toISOString().slice(0, 10)); // activos durante el mes del reporte

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

  // Construir y enviar todos los emails en paralelo
  const sendTasks = Array.from(porAnunciante.entries()).map(async ([email, adsAnunciante]) => {
    const totalVistas = adsAnunciante.reduce((sum, a) => sum + (eventosPorAd[a.id]?.view ?? 0), 0);
    const totalClicks = adsAnunciante.reduce((sum, a) =>
      sum + (eventosPorAd[a.id]?.click_link ?? 0)
          + (eventosPorAd[a.id]?.click_telefono ?? 0)
          + (eventosPorAd[a.id]?.click_mapa ?? 0), 0);

    const negocio  = esc(adsAnunciante[0].titulo ?? 'tu negocio');
    const planLabel = PLAN_LABEL[adsAnunciante[0].plan] ?? esc(adsAnunciante[0].plan);

    const filasAds = adsAnunciante.map((a) => {
      const stats = eventosPorAd[a.id] ?? { view: 0, click_link: 0, click_telefono: 0, click_mapa: 0 };
      const clics = stats.click_link + stats.click_telefono + stats.click_mapa;
      const label = esc(VARIANT_LABEL[a.variant] ?? a.variant);
      return `
        <tr>
          <td style="padding:10px 12px;font-size:14px;color:#333;border-bottom:1px solid #f0ebe4">${label}</td>
          <td style="padding:10px 12px;font-size:14px;font-weight:bold;color:#1a1a1a;text-align:center;border-bottom:1px solid #f0ebe4">${stats.view.toLocaleString('es-AR')}</td>
          <td style="padding:10px 12px;font-size:14px;font-weight:bold;color:#B85C4A;text-align:center;border-bottom:1px solid #f0ebe4">${clics.toLocaleString('es-AR')}</td>
        </tr>`;
    }).join('');

    const html = `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a1a">
        <div style="background:#B85C4A;border-radius:16px;padding:24px;text-align:center;margin-bottom:28px">
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:26px;font-weight:900;letter-spacing:-0.5px">
            <span style="color:#fff">Vecin</span><span style="color:rgba(255,255,255,0.7)">dog</span>
          </p>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px">Reporte mensual de publicidad</p>
        </div>

        <h2 style="color:#1a1a1a;margin-bottom:4px">Reporte de ${esc(mesLabel)}</h2>
        <p style="color:#666;font-size:15px;margin-bottom:24px">
          Hola equipo de <strong>${negocio}</strong> — acá está el resumen de rendimiento de ${esc(planLabel)} durante ${esc(mesLabel)}.
        </p>

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

    try {
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
      return res.ok;
    } catch (e) {
      console.error('[reporte-mensual] error enviando a', email, e);
      return false;
    }
  });

  const results = await Promise.allSettled(sendTasks);
  const enviados = results.filter(r => r.status === 'fulfilled' && r.value).length;

  return NextResponse.json({ ok: true, anunciantes: porAnunciante.size, enviados, mes: mesLabel });
}
