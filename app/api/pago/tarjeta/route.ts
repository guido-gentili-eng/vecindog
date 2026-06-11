import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

/* ── Precios en ARS ── */
const PRECIO_PRO_RAW = Number(process.env.PRECIO_PRO);
const PRECIO_PRO = Number.isFinite(PRECIO_PRO_RAW) && PRECIO_PRO_RAW > 0 ? PRECIO_PRO_RAW : 0;

/* ── Mensajes de rechazo ── */
const RECHAZO: Record<string, string> = {
  cc_rejected_bad_filled_card_number:  'Número de tarjeta incorrecto.',
  cc_rejected_bad_filled_date:         'Fecha de vencimiento incorrecta.',
  cc_rejected_bad_filled_security_code:'Código de seguridad (CVV) incorrecto.',
  cc_rejected_bad_filled_other:        'Datos de la tarjeta incorrectos. Verificá e intentá de nuevo.',
  cc_rejected_insufficient_amount:     'Fondos insuficientes. Verificá el saldo disponible.',
  cc_rejected_call_for_authorize:      'Tu banco requiere autorización. Llamá al número del dorso de tu tarjeta.',
  cc_rejected_card_disabled:           'Tarjeta deshabilitada. Contactá a tu banco.',
  cc_rejected_card_error:              'Error procesando la tarjeta. Intentá de nuevo.',
  cc_rejected_blacklist:               'No fue posible procesar el pago con esta tarjeta.',
  cc_rejected_max_attempts:            'Demasiados intentos. Esperá unos minutos e intentá de nuevo.',
  cc_rejected_duplicated_payment:      'Pago duplicado detectado. Esperá unos minutos.',
  cc_rejected_high_risk:               'El pago fue rechazado por seguridad. Intentá con otro método.',
  cc_rejected_other_reason:            'El pago fue rechazado. Verificá los datos o usá otra tarjeta.',
};

function mensajeRechazo(statusDetail: string): string {
  return RECHAZO[statusDetail] ?? RECHAZO.cc_rejected_other_reason;
}

/* ── Calcular monto con cuotas ── */
function montoConCuotas(base: number, cuotas: number): number {
  if (cuotas <= 1) return base;
  if (cuotas <= 3) return base;         // 0% interés
  if (cuotas <= 6) return Math.ceil(base * 1.15); // 15%
  return Math.ceil(base * 1.35);         // 35% para 12 cuotas
}

export async function POST(req: NextRequest) {
  try {
    /* ── 1. Autenticación ── */
    const token = req.headers.get('Authorization')?.slice(7);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const anon = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { data: { user }, error: authErr } = await anon.auth.getUser(token);
    if (authErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    /* ── 2. Body ── */
    let cardToken: string, cuotas: number, paymentMethodId: string;
    try {
      ({ cardToken, cuotas = 1, paymentMethodId = 'visa' } = await req.json());
    } catch {
      return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 });
    }
    if (!cardToken) return NextResponse.json({ error: 'cardToken requerido' }, { status: 400 });
    const cuotasN = Math.min(Math.max(parseInt(String(cuotas), 10) || 1, 1), 12);

    /* ── 3. Cliente admin Supabase ── */
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    /* ── 4. Validar precio ── */
    if (PRECIO_PRO <= 0) {
      return NextResponse.json({ error: 'Configuración de precio inválida' }, { status: 500 });
    }

    /* ── 5-old. Idempotencia: verificar si ya tiene plan activo ── */
    const { data: profile } = await admin
      .from('profiles')
      .select('plan, plan_vencimiento')
      .eq('id', user.id)
      .single();

    if (profile?.plan === 'pro' && profile.plan_vencimiento) {
      const venc = new Date(profile.plan_vencimiento);
      if (venc > new Date()) {
        return NextResponse.json({ ok: true, yaActivo: true });
      }
    }

    /* ── 5. Crear pago en Mercado Pago ── */
    // (Nota: el número de paso anterior se re-numeró)
    if (!user.email) return NextResponse.json({ error: 'Usuario sin email registrado' }, { status: 403 });
    const mp     = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
    const pagoCl = new Payment(mp);
    const origin = req.headers.get('origin') ?? 'https://www.mivecindog.com.ar';

    const monto = montoConCuotas(PRECIO_PRO, cuotasN);

    const pago = await pagoCl.create({
      body: {
        transaction_amount:   monto,
        token:                cardToken,
        description:          'VecindogPro — Suscripción 30 días',
        installments:         cuotasN,
        payment_method_id:    paymentMethodId,
        payer:                { email: user.email },
        metadata:             { tipo: 'pro', user_id: user.id, email: user.email },
        // 3D Secure habilitado (modo opcional: si el banco lo requiere, lo activa)
        three_d_secure_mode:  'optional',
        // Callback para redirect 3DS
        callback_url:         `${origin}/planes/pago-exitoso`,
        // Referencia externa para idempotencia
        external_reference:   `pro-${user.id}-${Date.now()}`,
        statement_descriptor: 'VECINDOG PRO',
      },
    });

    /* ── 6. Manejar resultado ── */

    if (pago.status === 'approved') {
      /* Pago aprobado → activar plan */
      const vencimiento = new Date();
      vencimiento.setDate(vencimiento.getDate() + 30);
      const vencimientoStr = vencimiento.toISOString().slice(0, 10);

      const { error: updErr } = await admin
        .from('profiles')
        .update({ plan: 'pro', plan_vencimiento: vencimientoStr })
        .eq('id', user.id);

      if (updErr) {
        console.error('[pago/tarjeta] error actualizando plan:', updErr.message);
        return NextResponse.json({ error: 'Pago aprobado pero error al activar el plan. Contactá a soporte.' }, { status: 500 });
      }

      // Registrar pago para idempotencia
      await admin.from('pagos_procesados').insert({
        payment_id: String(pago.id),
        user_id:    user.id,
        tipo:       'pro',
      }).then(({ error: insErr }) => {
        if (insErr && insErr.code !== '23505') {
          console.error('[pago/tarjeta] pagos_procesados insert error:', insErr.message);
        }
      });

      return NextResponse.json({ ok: true, paymentId: pago.id, vencimiento: vencimientoStr });
    }

    if (pago.status === 'pending') {
      /* Puede ser 3DS o revisión manual */
      const info3DS = pago.three_ds_info as { external_resource_url?: string; creq?: string } | null;

      if (info3DS?.external_resource_url) {
        /* El banco requiere 3D Secure — redirigir al usuario */
        return NextResponse.json({
          ok:          false,
          needs3DS:    true,
          redirectUrl: info3DS.external_resource_url,
          paymentId:   pago.id,
        });
      }

      /* Pago en revisión manual */
      return NextResponse.json({
        ok:        false,
        pending:   true,
        paymentId: pago.id,
        reason:    'Tu pago está en revisión. Te avisaremos por email cuando se confirme.',
      });
    }

    /* Pago rechazado */
    return NextResponse.json({
      ok:          false,
      statusDetail: pago.status_detail ?? '',
      reason:       mensajeRechazo(pago.status_detail ?? ''),
    });

  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error desconocido';
    console.error('[pago/tarjeta]', msg);
    return NextResponse.json({ error: 'Error interno al procesar el pago.' }, { status: 500 });
  }
}
