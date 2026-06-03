import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

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
    const { ad_ids } = await req.json();

    if (!Array.isArray(ad_ids) || ad_ids.length === 0) {
      return NextResponse.json({ error: 'ad_ids requeridos' }, { status: 400 });
    }

    // Traer info del primer ad para construir la preferencia
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: ad, error } = await admin
      .from('ads')
      .select('plan, titulo, anunciante')
      .eq('id', ad_ids[0])
      .single();

    if (error || !ad) {
      return NextResponse.json({ error: 'Anuncio no encontrado' }, { status: 404 });
    }

    const precio = PRECIOS[ad.plan];
    if (!precio) {
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
    }

    const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
    const preference = new Preference(mp);
    const origin = req.headers.get('origin') ?? 'https://www.mivecindog.com.ar';

    const result = await preference.create({
      body: {
        items: [{
          id:          `renovacion-${ad.plan}`,
          title:       `Vecindog — Renovación ${PLAN_LABEL[ad.plan] ?? ad.plan}`,
          description: `Renovación de publicidad para ${ad.titulo ?? 'tu negocio'} · 30 días`,
          quantity:    1,
          unit_price:  precio,
          currency_id: 'ARS',
        }],
        payer: { email: ad.anunciante ?? undefined },
        back_urls: {
          success: `${origin}/publicitate/pago-exitoso?plan=${ad.plan}&ads=${ad_ids.join(',')}&renovacion=1`,
          failure: `${origin}/publicitate/renovar?ads=${ad_ids.join(',')}&pago=fallido`,
          pending: `${origin}/publicitate/pago-exitoso?plan=${ad.plan}&ads=${ad_ids.join(',')}&renovacion=1&pending=1`,
        },
        auto_return:          'approved',
        statement_descriptor: 'VECINDOG ADS',
        external_reference:   `renovacion-${ad_ids.join('-')}-${Date.now()}`,
        metadata: {
          tipo:    'renovacion',
          ad_ids,
          negocio: ad.titulo,
          plan:    ad.plan,
          email:   ad.anunciante,
        },
      },
    });

    if (!result.init_point) {
      return NextResponse.json({ error: 'Mercado Pago no devolvió URL de pago' }, { status: 502 });
    }

    return NextResponse.json({ url: result.init_point });
  } catch {
    return NextResponse.json({ error: 'Error al crear preferencia de pago' }, { status: 500 });
  }
}
