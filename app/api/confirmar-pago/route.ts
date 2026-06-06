import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { activarAds } from '@/lib/ads';
import { createClient } from '@supabase/supabase-js';

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

async function enviarEmailBienvenidaComercio(email: string, nombreNegocio: string) {
  const negocio = esc(nombreNegocio);
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Vecindog <noreply@mivecindog.com.ar>',
      to: [email],
      subject: `🐾 ¡Bienvenido a la Red Vecindog, ${nombreNegocio}!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a;">

          <!-- Header -->
          <div style="background: linear-gradient(135deg, #B85C4A 0%, #8E4232 100%); border-radius: 20px; padding: 32px; text-align: center; margin-bottom: 28px;">
            <p style="margin: 0; font-size: 36px;">🐾</p>
            <h1 style="color: white; margin: 8px 0 0; font-size: 26px; font-weight: 900;">¡Ya sos parte de la Red Vecindog!</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 15px;">Tu negocio está activo y visible para toda la comunidad</p>
          </div>

          <!-- Saludo -->
          <p style="font-size: 17px; line-height: 1.6; margin-bottom: 20px;">
            Hola equipo de <strong>${negocio}</strong>,<br/><br/>
            Tu negocio ya aparece en el mapa de Vecindog y los vecinos dueños de perros en tu ciudad pueden encontrarte. Estamos muy contentos de tenerte en la red. 🎉
          </p>

          <!-- Separador -->
          <hr style="border: none; border-top: 2px solid #f0ebe4; margin: 28px 0;" />

          <!-- Sección descuentos -->
          <h2 style="font-size: 20px; font-weight: 900; margin-bottom: 12px;">🎁 Cómo ofrecer descuentos a los vecinos</h2>

          <p style="font-size: 15px; line-height: 1.7; color: #444; margin-bottom: 16px;">
            Uno de los beneficios más valorados por la comunidad es poder acceder a descuentos exclusivos en los negocios de la red. Vos decidís el descuento que querés ofrecer — puede ser un porcentaje, un producto de regalo, atención preferencial, o lo que mejor se adapte a tu negocio.
          </p>

          <!-- Cómo funciona -->
          <div style="background: #f9f5f0; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
            <h3 style="font-size: 16px; font-weight: 800; margin: 0 0 16px;">¿Cómo verificar que un cliente es socio Vecindog?</h3>

            <div style="display: flex; flex-direction: column; gap: 14px;">

              <div style="display: flex; align-items: flex-start; gap: 14px;">
                <div style="background: #B85C4A; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; flex-shrink: 0; text-align: center; line-height: 28px;">1</div>
                <div>
                  <p style="margin: 0; font-weight: 700; font-size: 15px;">El cliente abre la app de Vecindog</p>
                  <p style="margin: 4px 0 0; color: #666; font-size: 14px;">Desde su celular ingresa a <strong>mivecindog.com.ar</strong>, va a su perfil y toca el botón <strong>QR</strong>.</p>
                </div>
              </div>

              <div style="display: flex; align-items: flex-start; gap: 14px;">
                <div style="background: #B85C4A; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; flex-shrink: 0; text-align: center; line-height: 28px;">2</div>
                <div>
                  <p style="margin: 0; font-weight: 700; font-size: 15px;">Te muestra su código QR</p>
                  <p style="margin: 4px 0 0; color: #666; font-size: 14px;">El QR incluye el nombre del socio y se renueva cada 30 segundos, así no puede ser compartido o falsificado.</p>
                </div>
              </div>

              <div style="display: flex; align-items: flex-start; gap: 14px;">
                <div style="background: #B85C4A; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; flex-shrink: 0; text-align: center; line-height: 28px;">3</div>
                <div>
                  <p style="margin: 0; font-weight: 700; font-size: 15px;">Lo escaneás desde tu celular</p>
                  <p style="margin: 4px 0 0; color: #666; font-size: 14px;">Con cualquier lector de QR (la cámara del celular funciona) verificás que la persona es socia activa de Vecindog Pro.</p>
                </div>
              </div>

              <div style="display: flex; align-items: flex-start; gap: 14px;">
                <div style="background: #3F8B5C; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; flex-shrink: 0; text-align: center; line-height: 28px;">✓</div>
                <div>
                  <p style="margin: 0; font-weight: 700; font-size: 15px;">¡Aplicás el descuento!</p>
                  <p style="margin: 4px 0 0; color: #666; font-size: 14px;">Si la verificación es correcta, aplicás el beneficio que hayas decidido ofrecer. Así de simple.</p>
                </div>
              </div>

            </div>
          </div>

          <!-- Qué descuento ofrecer -->
          <div style="background: #fff8f0; border: 2px solid #f0d9c8; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h3 style="font-size: 16px; font-weight: 800; margin: 0 0 10px;">💡 Ideas de beneficios para ofrecer</h3>
            <ul style="margin: 0; padding-left: 20px; color: #555; font-size: 14px; line-height: 1.9;">
              <li>10% de descuento en productos o servicios</li>
              <li>Un baño gratis en la primera visita</li>
              <li>Snack o premio de regalo con cada compra</li>
              <li>Turno prioritario sin espera</li>
              <li>Consulta inicial sin cargo</li>
            </ul>
            <p style="margin: 12px 0 0; font-size: 13px; color: #888;">
              Escribinos a <a href="mailto:hola@mivecindog.com.ar" style="color: #B85C4A;">hola@mivecindog.com.ar</a> y te ayudamos a definir el beneficio ideal para tu negocio. También podemos actualizar la descripción de tu local en el mapa.
            </p>
          </div>

          <!-- CTA -->
          <div style="text-align: center; margin: 28px 0;">
            <a href="https://www.mivecindog.com.ar/red-vecindog"
               style="background: #B85C4A; color: white; padding: 15px 32px; border-radius: 14px; text-decoration: none; font-weight: 800; font-size: 16px; display: inline-block;">
              Ver mi negocio en el mapa →
            </a>
          </div>

          <!-- Footer -->
          <hr style="border: none; border-top: 2px solid #f0ebe4; margin: 24px 0;" />
          <p style="color: #aaa; font-size: 12px; text-align: center; line-height: 1.6;">
            Recibís este email porque <strong>${negocio}</strong> se registró en la Red Vecindog.<br/>
            ¿Tenés alguna duda? Escribinos a <a href="mailto:hola@mivecindog.com.ar" style="color: #B85C4A;">hola@mivecindog.com.ar</a>
          </p>

        </div>
      `,
    }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const { payment_id, ad_ids } = await req.json();

    if (!payment_id || !Array.isArray(ad_ids) || ad_ids.length === 0) {
      return NextResponse.json({ ok: false, error: 'Faltan parámetros' }, { status: 400 });
    }

    // Verificar el pago con MP antes de activar
    const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
    const paymentClient = new Payment(mp);
    const payment = await paymentClient.get({ id: String(payment_id) });

    if (payment.status !== 'approved') {
      return NextResponse.json({
        ok: false,
        error: `Pago no aprobado (estado: ${payment.status})`,
      });
    }

    await activarAds(ad_ids);

    // Mandar email de bienvenida al comercio (fire & forget)
    try {
      const admin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
      );
      const { data: ad } = await admin
        .from('ads')
        .select('titulo, anunciante')
        .eq('id', ad_ids[0])
        .single();

      if (ad?.anunciante && ad.anunciante.includes('@')) {
        await enviarEmailBienvenidaComercio(ad.anunciante, ad.titulo ?? 'tu negocio');
      }
    } catch (emailErr) {
      console.error('[confirmar-pago] email bienvenida error:', emailErr);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Error al confirmar el pago' }, { status: 500 });
  }
}
