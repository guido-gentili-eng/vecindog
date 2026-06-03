import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { activarAds } from '@/lib/ads';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // MP envía distintos tipos de notificaciones
    if (body.type !== 'payment') {
      return NextResponse.json({ ok: true });
    }

    const paymentId = body.data?.id;
    if (!paymentId) return NextResponse.json({ ok: false }, { status: 400 });

    // Verificar el pago con la API de MP
    const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
    const paymentClient = new Payment(mp);
    const payment = await paymentClient.get({ id: String(paymentId) });

    if (payment.status !== 'approved') {
      return NextResponse.json({ ok: true, reason: `status: ${payment.status}` });
    }

    // Extraer IDs de los ads del metadata
    const adIds = (payment.metadata as { ad_ids?: string[] } | null)?.ad_ids;
    if (!adIds?.length) {
      return NextResponse.json({ ok: true, reason: 'sin ad_ids en metadata' });
    }

    await activarAds(adIds);

    // Email al admin
    await notificarAdmin({
      negocio: (payment.metadata as Record<string, string> | null)?.negocio ?? '',
      plan:    (payment.metadata as Record<string, string> | null)?.plan ?? '',
      email:   (payment.metadata as Record<string, string> | null)?.email ?? '',
      paymentId: String(paymentId),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[MP webhook]', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}


async function notificarAdmin({
  negocio, plan, email, paymentId,
}: { negocio: string; plan: string; email: string; paymentId: string }) {
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Vecindog <noreply@mivecindog.com.ar>',
        to: ['guido-gentili@live.com.ar'],
        subject: `💰 Nuevo anunciante: ${negocio} (${plan})`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
            <h2>Nuevo pago confirmado en Vecindog</h2>
            <p><strong>Negocio:</strong> ${negocio}</p>
            <p><strong>Plan:</strong> ${plan}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Payment ID:</strong> ${paymentId}</p>
            <p>Los espacios publicitarios ya están activos.</p>
            <a href="https://www.mivecindog.com.ar/admin/publicidad"
               style="display:inline-block;margin-top:16px;background:#B85C4A;color:white;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:bold">
              Ver panel de publicidad →
            </a>
          </div>
        `,
      }),
    });
  } catch { /* el email no es crítico */ }
}
