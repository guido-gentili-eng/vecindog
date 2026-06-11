import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    // Verificar que el caller está autenticado
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: { user } } = await adminClient.auth.getUser(token);
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    const { payment_id } = await req.json();
    if (!payment_id) {
      return NextResponse.json({ error: 'payment_id requerido' }, { status: 400 });
    }

    // CRÍTICO: Idempotencia — verificar que este pago no fue procesado antes
    const { data: existing } = await adminClient
      .from('pagos_procesados')
      .select('payment_id')
      .eq('payment_id', String(payment_id))
      .maybeSingle();

    if (existing) {
      // El pago ya fue procesado (posiblemente por el webhook). Retornar el estado actual.
      const { data: currentProfile } = await adminClient
        .from('profiles')
        .select('plan_vencimiento')
        .eq('id', user.id)
        .single();
      return NextResponse.json({ ok: true, vencimiento: currentProfile?.plan_vencimiento, cached: true });
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

    // El user_id del pago debe coincidir con el usuario autenticado
    if (meta.user_id !== user.id) {
      return NextResponse.json({ ok: false, reason: 'usuario no coincide' }, { status: 403 });
    }

    const { data: currentProfile } = await adminClient
      .from('profiles')
      .select('plan_vencimiento')
      .eq('id', meta.user_id)
      .single();

    const currentExpiry = currentProfile?.plan_vencimiento
      ? new Date(currentProfile.plan_vencimiento)
      : new Date(0);
    const base = currentExpiry > new Date() ? currentExpiry : new Date();
    const vencimiento = new Date(base);
    vencimiento.setDate(vencimiento.getDate() + 30);
    const vencimientoStr = vencimiento.toISOString().slice(0, 10);

    const { error } = await adminClient
      .from('profiles')
      .update({ plan: 'pro', plan_vencimiento: vencimientoStr })
      .eq('id', meta.user_id);

    if (error) {
      console.error('[confirmar-pago-pro]', error.message);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    // Registrar el pago como procesado para garantizar idempotencia futura
    await adminClient.from('pagos_procesados').insert({
      payment_id: String(payment_id),
      user_id:    meta.user_id,
      tipo:       'pro',
    });

    return NextResponse.json({ ok: true, vencimiento: vencimientoStr });
  } catch (err) {
    console.error('[confirmar-pago-pro]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
