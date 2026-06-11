import { NextRequest, NextResponse } from 'next/server';

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const nombre_apellido = String(body.nombre_apellido ?? '').trim().slice(0, 100);
    const email           = String(body.email ?? '').trim().slice(0, 200);
    const nombre_perro    = String(body.nombre_perro ?? '').trim().slice(0, 80);
    const receta_url      = String(body.receta_url ?? '').trim().slice(0, 500);

    if (!nombre_apellido || !email || !nombre_perro) {
      return NextResponse.json({ ok: false, error: 'Campos requeridos incompletos' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: 'Email inválido' }, { status: 400 });
    }

    // Validar que receta_url sea una URL https o vacía (previene javascript: XSS en el email)
    if (receta_url && !/^https:\/\/.+/.test(receta_url)) {
      return NextResponse.json({ ok: false, error: 'URL de receta inválida' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('[cotizacion-laboratorio] RESEND_API_KEY no configurada');
      return NextResponse.json({ ok: false, error: 'Configuración de email incompleta' }, { status: 500 });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Vecindog <noreply@mivecindog.com.ar>',
        to: ['Veterinaria@iaca.com.ar'],
        reply_to: email,
        subject: `Cotización análisis de laboratorio — ${esc(nombre_perro)}`,
        html: `
          <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 24px;">
            <div style="background: #EE5A3B; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:26px;font-weight:900;letter-spacing:-0.5px;"><span style="color:#ffffff;">Vecin</span><span style="color:rgba(255,255,255,0.75);">dog</span></p>
            </div>
            <h2 style="color: #1a1a1a; margin-top: 0;">Nueva solicitud de análisis de laboratorio</h2>
            <div style="background: #FFF8F0; border-radius: 12px; padding: 20px; margin: 16px 0; border-left: 4px solid #EE5A3B;">
              <p style="margin: 0 0 10px; font-size: 15px;"><strong>Nombre y Apellido:</strong> ${esc(nombre_apellido)}</p>
              <p style="margin: 0 0 10px; font-size: 15px;"><strong>Email de contacto:</strong> <a href="mailto:${esc(email)}" style="color: #EE5A3B;">${esc(email)}</a></p>
              <p style="margin: 0; font-size: 15px;"><strong>Nombre del perro:</strong> ${esc(nombre_perro)}</p>
            </div>
            ${receta_url ? `
            <div style="margin-top: 16px;">
              <p style="font-size: 14px; color: #555; margin-bottom: 8px;"><strong>Receta del veterinario:</strong></p>
              <a href="${esc(receta_url)}" target="_blank"
                 style="display: inline-block; background: #EE5A3B; color: white; padding: 10px 20px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px;">
                Ver receta adjunta
              </a>
            </div>
            ` : '<p style="font-size: 13px; color: #999; margin-top: 12px;">Sin receta adjunta.</p>'}
            <p style="color: #aaa; font-size: 12px; margin-top: 32px; text-align: center;">
              Solicitud enviada desde Vecindog — Análisis de Laboratorio
            </p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[cotizacion-laboratorio] Resend error:', err);
      return NextResponse.json({ ok: false, error: 'No se pudo enviar el email' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 });
  }
}
