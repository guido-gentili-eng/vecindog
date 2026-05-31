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

// Slots por plan
const PLAN_SLOTS: Record<string, Array<'leaderboard' | 'card' | 'sidebar'>> = {
  basico:   ['sidebar'],
  estandar: ['sidebar', 'card'],
  premium:  ['leaderboard', 'card', 'sidebar'],
};

export async function POST(req: NextRequest) {
  try {
    const { plan, negocio, tagline, link, cta, email, telefono, imagen_url } = await req.json();

    if (!plan || !PRECIOS[plan]) {
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
    }

    // Guardar ad en Supabase como pendiente
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const slots = PLAN_SLOTS[plan] ?? ['sidebar'];
    const adIds: string[] = [];

    for (const variant of slots) {
      const { data } = await admin.from('ads').insert({
        variant,
        titulo:      negocio,
        subtitulo:   tagline   || null,
        imagen_url:  imagen_url || null,
        href:        link,
        cta:         cta       || null,
        anunciante:  email     || null,
        plan,
        activo:      false,  // se activa al confirmar pago
        fecha_inicio: null,
        fecha_fin:    null,
      }).select('id').single();
      if (data?.id) adIds.push(data.id);
    }

    const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
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
          success: `${origin}/publicitate/pago-exitoso?plan=${plan}&ads=${adIds.join(',')}`,
          failure: `${origin}/publicitate?pago=fallido`,
          pending: `${origin}/publicitate/pago-exitoso?plan=${plan}&ads=${adIds.join(',')}&pending=1`,
        },
        auto_return:          'approved',
        statement_descriptor: 'VECINDOG',
        external_reference:   `${plan}-${adIds.join('-')}-${Date.now()}`,
        metadata: { negocio, email, telefono, plan, adIds },
      },
    });

    return NextResponse.json({ url: result.init_point });
  } catch (err) {
    console.error('MP error:', err);
    return NextResponse.json({ error: 'Error al crear preferencia' }, { status: 500 });
  }
}
