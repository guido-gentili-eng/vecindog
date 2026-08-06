import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import path from 'path';
import { SignedDataVerifier, Environment } from '@apple/app-store-server-library';

const BUNDLE_ID = process.env.APPLE_IAP_BUNDLE_ID!;
const APPLE_ROOT_CERT = readFileSync(path.join(process.cwd(), 'lib/apple-root-ca-g3.cer'));
/** Debe coincidir con RED_VECINDOG_IOS_SKU en vecindog-mobile/lib/iapRedVecindog.ts */
const RED_VECINDOG_IOS_SKU = 'com.vecindog.app.redvecindog.mensual';

/** Lee el campo "environment" del JWS sin verificar la firma todavia -- solo
 * para saber si instanciar el verifier en modo Sandbox o Production; la
 * confianza real viene despues, de la verificacion criptografica. */
function peekEnvironment(jws: string): Environment {
  const payload = jws.split('.')[1];
  const json = Buffer.from(payload, 'base64url').toString('utf8');
  const { environment } = JSON.parse(json) as { environment?: string };
  return environment === 'Sandbox' ? Environment.SANDBOX : Environment.PRODUCTION;
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data: { user } } = await admin.auth.getUser(token);
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    const {
      purchaseToken, // JWS de la transaccion (StoreKit 2), viene del cliente via expo-iap
      nombre, categoria, telefono, direccion, localidad,
      lat, lng,
      horario_apertura, horario_cierre, dias_atencion,
      descripcion, link, email, imagen_url,
    } = await req.json();

    if (!purchaseToken) return NextResponse.json({ error: 'Falta el comprobante de compra' }, { status: 400 });
    if (!nombre?.trim())    return NextResponse.json({ error: 'Nombre requerido' },    { status: 400 });
    if (!categoria?.trim()) return NextResponse.json({ error: 'Categoría requerida' }, { status: 400 });
    if (!telefono?.trim())  return NextResponse.json({ error: 'Teléfono requerido' },  { status: 400 });
    if (!direccion?.trim()) return NextResponse.json({ error: 'Dirección requerida' }, { status: 400 });
    if (!email?.trim())     return NextResponse.json({ error: 'Email requerido' },     { status: 400 });

    const environment = peekEnvironment(purchaseToken);
    const verifier = new SignedDataVerifier([APPLE_ROOT_CERT], true, environment, BUNDLE_ID);

    let transaction;
    try {
      transaction = await verifier.verifyAndDecodeTransaction(purchaseToken);
    } catch (err) {
      console.error('[iap/red-vecindog/verify] JWS invalido:', err);
      return NextResponse.json({ error: 'No se pudo verificar la compra con Apple' }, { status: 400 });
    }

    if (transaction.productId !== RED_VECINDOG_IOS_SKU) {
      return NextResponse.json({ error: 'Producto de compra incorrecto' }, { status: 400 });
    }
    if (transaction.revocationDate) {
      return NextResponse.json({ error: 'Esta compra fue reembolsada' }, { status: 400 });
    }
    if (!transaction.transactionId || !transaction.originalTransactionId || !transaction.purchaseDate) {
      return NextResponse.json({ error: 'Comprobante de compra incompleto' }, { status: 400 });
    }

    // Idempotencia: si ya procesamos esta transaccion (reintento del cliente
    // tras un corte de red, por ejemplo), no crear un comercio duplicado.
    const paymentKey = `apple_${transaction.transactionId}`;
    const { data: yaProcesado } = await admin
      .from('pagos_procesados')
      .select('payment_id')
      .eq('payment_id', paymentKey)
      .maybeSingle();
    if (yaProcesado) {
      const { data: existente } = await admin
        .from('apple_iap_red_vecindog')
        .select('ad_id')
        .eq('original_transaction_id', transaction.originalTransactionId)
        .maybeSingle();
      return NextResponse.json({ ok: true, ad_id: existente?.ad_id ?? null, cached: true });
    }

    let href = 'https://www.mivecindog.com.ar';
    if (link?.trim()) {
      const raw = link.trim();
      const full = raw.includes('://') ? raw : `https://${raw}`;
      try {
        const parsed = new URL(full);
        if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error();
        href = full;
      } catch {
        return NextResponse.json({ error: 'El link debe ser una URL válida' }, { status: 400 });
      }
    } else if (telefono?.trim()) {
      href = `tel:${telefono.replace(/[\s\-\(\)]/g, '')}`;
    }

    const fechaInicioStr = new Date(transaction.purchaseDate).toISOString().slice(0, 10);
    const fechaFinStr = transaction.expiresDate
      ? new Date(transaction.expiresDate).toISOString().slice(0, 10)
      : null;

    const direccionCompleta = [direccion, localidad].filter(Boolean).join(', ');
    const subtitulo = [categoria, localidad].filter(Boolean).join(' · ') || null;

    const { data: ad, error: dbError } = await admin.from('ads').insert({
      variant:            'comercio',
      titulo:             nombre.trim(),
      subtitulo,
      imagen_url:         imagen_url || null,
      imagen_logo_url:    null,
      href,
      cta:                null,
      anunciante:         email.trim().toLowerCase(),
      user_id:            user.id,
      plan:               'comercio',
      activo:             true,
      es_trial:           false,
      fecha_inicio:       fechaInicioStr,
      fecha_fin:          fechaFinStr,
      telefono_comercio:  telefono.trim()  || null,
      horario_apertura:   horario_apertura || null,
      horario_cierre:     horario_cierre   || null,
      dias_atencion:      dias_atencion    || null,
      direccion_comercio: direccionCompleta || null,
      localidad_comercio: localidad?.trim().toLowerCase() || null,
      categoria_local:    categoria.trim() || null,
      lat:                lat ?? null,
      lng:                lng ?? null,
    }).select('id').single();

    if (dbError || !ad?.id) {
      console.error('[iap/red-vecindog/verify] DB error:', dbError);
      return NextResponse.json({ error: 'Error al guardar el registro' }, { status: 500 });
    }

    await admin.from('apple_iap_red_vecindog').insert({
      original_transaction_id: transaction.originalTransactionId,
      ad_id: ad.id,
      user_id: user.id,
    });

    await admin.from('pagos_procesados').insert({
      payment_id: paymentKey,
      user_id:    user.id,
      tipo:       'comercio_apple',
    });

    return NextResponse.json({ ok: true, ad_id: ad.id, vencimiento: fechaFinStr });
  } catch (err) {
    console.error('[iap/red-vecindog/verify]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
