import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const PRECIO_PRO = Number(process.env.PRECIO_PRO);
    if (!Number.isFinite(PRECIO_PRO) || PRECIO_PRO <= 0) {
      return NextResponse.json({ error: 'Configuración de precio inválida' }, { status: 500 });
    }
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.slice(7);

    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { user }, error: authError } = await anonClient.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
    const preference = new Preference(mp);
    const origin = req.headers.get('origin') ?? 'https://www.mivecindog.com.ar';

    const result = await preference.create({
      body: {
        items: [{
          id:          'vecindog-pro',
          title:       'VecindogPro — Suscripción mensual',
          description: 'Acceso completo a todas las funciones de Vecindog por 30 días',
          quantity:    1,
          unit_price:  PRECIO_PRO,
          currency_id: 'ARS',
        }],
        payer: { email: user.email ?? undefined },
        back_urls: {
          success: `${origin}/planes/pago-exitoso`,
          failure: `${origin}/planes?pago=fallido`,
          pending: `${origin}/planes/pago-exitoso?pending=1`,
        },
        auto_return:          'approved',
        statement_descriptor: 'VECINDOG PRO',
        external_reference:   `pro-${user.id}-${Date.now()}`,
        metadata: { tipo: 'pro', user_id: user.id, email: user.email },
      },
    });

    if (!result.init_point) {
      return NextResponse.json({ error: 'Mercado Pago no devolvió URL de pago' }, { status: 502 });
    }
    return NextResponse.json({ url: result.init_point });
  } catch (err) {
    console.error('[pago/pro]', err);
    return NextResponse.json({ error: 'Error al crear preferencia de pago' }, { status: 500 });
  }
}
