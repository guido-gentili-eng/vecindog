import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const { payment_id } = await req.json();
    if (!payment_id) {
      return NextResponse.json({ error: 'payment_id requerido' }, { status: 400 });
    }

    const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
    const paymentClient = new Payment(mp);
    const payment = await paymentClient.get({ id: String(payment_id) });

    if (payment.status !== 'approved') {
      return NextResponse.json({ ok: false, status: payment.status });
    }

    const meta = payment.metadata as Record<string, string> | null;
    if (meta?.tipo !== 'pro' || !meta?.user_id) {
      return NextResponse.json({ ok: false, reason: 'no es un pago Pro' });
    }

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const vencimiento = new Date();
    vencimiento.setDate(vencimiento.getDate() + 30);
    const vencimientoStr = vencimiento.toISOString().slice(0, 10);

    const { error } = await admin
      .from('profiles')
      .update({ plan: 'pro', plan_vencimiento: vencimientoStr })
      .eq('id', meta.user_id);

    if (error) {
      console.error('[confirmar-pago-pro]', error.message);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, vencimiento: vencimientoStr });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
