import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { activarAds } from '@/app/api/webhooks/mercadopago/route';

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
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Error al confirmar el pago' }, { status: 500 });
  }
}
