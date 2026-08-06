import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import path from 'path';
import { SignedDataVerifier, Environment, NotificationTypeV2 } from '@apple/app-store-server-library';

const BUNDLE_ID = process.env.APPLE_IAP_BUNDLE_ID!;
const APPLE_ROOT_CERT = readFileSync(path.join(process.cwd(), 'lib/apple-root-ca-g3.cer'));

function peekEnvironment(jws: string): Environment {
  const payload = jws.split('.')[1];
  const json = Buffer.from(payload, 'base64url').toString('utf8');
  const { environment } = JSON.parse(json) as { environment?: string };
  return environment === 'Sandbox' ? Environment.SANDBOX : Environment.PRODUCTION;
}

/**
 * App Store Server Notifications V2 -- Apple avisa aca cuando una
 * suscripcion de Red Vecindog (iOS) se renueva, vence, se cancela o se
 * reembolsa. URL a configurar en App Store Connect > Informacion de la app
 * > Notificaciones del servidor de App Store (produccion Y sandbox).
 */
export async function POST(req: NextRequest) {
  try {
    const { signedPayload } = await req.json();
    if (!signedPayload) return NextResponse.json({ ok: false }, { status: 400 });

    const environment = peekEnvironment(signedPayload);
    const verifier = new SignedDataVerifier([APPLE_ROOT_CERT], true, environment, BUNDLE_ID);

    const notification = await verifier.verifyAndDecodeNotification(signedPayload);
    const signedTransactionInfo = notification.data?.signedTransactionInfo;
    if (!signedTransactionInfo) {
      // Notificaciones sin transaccion (ej. TEST) no requieren accion.
      return NextResponse.json({ ok: true });
    }

    const transaction = await verifier.verifyAndDecodeTransaction(signedTransactionInfo);
    if (!transaction.originalTransactionId) return NextResponse.json({ ok: true });

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data: link } = await admin
      .from('apple_iap_red_vecindog')
      .select('ad_id')
      .eq('original_transaction_id', transaction.originalTransactionId)
      .maybeSingle();

    if (!link?.ad_id) {
      // Puede ser una notificacion de sandbox/otra app -- no es un error.
      return NextResponse.json({ ok: true, reason: 'sin ad_id vinculado' });
    }

    switch (notification.notificationType) {
      case NotificationTypeV2.DID_RENEW:
      case NotificationTypeV2.SUBSCRIBED:
      case NotificationTypeV2.RENEWAL_EXTENDED:
      case NotificationTypeV2.RENEWAL_EXTENSION: {
        const fechaFin = transaction.expiresDate
          ? new Date(transaction.expiresDate).toISOString().slice(0, 10)
          : null;
        await admin.from('ads').update({ activo: true, fecha_fin: fechaFin }).eq('id', link.ad_id);
        break;
      }
      case NotificationTypeV2.EXPIRED:
      case NotificationTypeV2.GRACE_PERIOD_EXPIRED:
      case NotificationTypeV2.REFUND:
      case NotificationTypeV2.REVOKE:
        await admin.from('ads').update({ activo: false }).eq('id', link.ad_id);
        break;
      default:
        // DID_CHANGE_RENEWAL_STATUS, DID_FAIL_TO_RENEW (todavia en periodo de
        // gracia), PRICE_INCREASE, etc. no cambian el estado activo hoy.
        break;
    }

    return NextResponse.json({ ok: true, tipo: notification.notificationType });
  } catch (err) {
    console.error('[webhooks/apple-iap]', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
