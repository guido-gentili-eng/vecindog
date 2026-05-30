import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const PRECIOS: Record<string, number> = {
  basico:   15000,
  estandar: 28000,
  premium:  45000,
};

const PLAN_LABEL: Record<string, string> = {
  basico:   'Plan Básico',
  estandar: 'Plan Estándar',
  premium:  'Plan Premium',
};

export async function POST(req: NextRequest) {
  try {
    const { plan, negocio, email, telefono } = await req.json();

    if (!plan || !PRECIOS[plan]) {
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
    }

    const mp = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    });

    const preference = new Preference(mp);

    const origin = req.headers.get('origin') ?? 'https://www.mivecindog.com.ar';

    const result = await preference.create({
      body: {
        items: [{
          id:          plan,
          title:       `Vecindog — ${PLAN_LABEL[plan]}`,
          description: `Publicidad en Vecindog para ${negocio ?? 'tu negocio'} · 1 mes`,
          quantity:    1,
          unit_price:  PRECIOS[plan],
          currency_id: 'ARS',
        }],
        payer: {
          email: email ?? undefined,
          phone: telefono ? { number: telefono } : undefined,
        },
        back_urls: {
          success: `${origin}/publicitate/pago-exitoso?plan=${plan}`,
          failure: `${origin}/publicitate?pago=fallido`,
          pending: `${origin}/publicitate/pago-exitoso?plan=${plan}&pending=1`,
        },
        auto_return:          'approved',
        statement_descriptor: 'VECINDOG',
        external_reference:   `${plan}-${Date.now()}`,
        metadata: { negocio, email, telefono, plan },
      },
    });

    return NextResponse.json({ url: result.init_point });
  } catch (err) {
    console.error('MP error:', err);
    return NextResponse.json({ error: 'Error al crear preferencia' }, { status: 500 });
  }
}
