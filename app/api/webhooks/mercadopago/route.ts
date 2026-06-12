import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';
import { createHmac } from 'crypto';
import { activarAds } from '@/lib/ads';

function escHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function verifyMpSignature(req: NextRequest, rawBody: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[MP webhook] MP_WEBHOOK_SECRET no configurado');
    return false;
  }

  const xSignature = req.headers.get('x-signature');
  const xRequestId = req.headers.get('x-request-id');
  const dataId     = req.nextUrl.searchParams.get('data.id');

  if (!xSignature) return false;

  // Parsear ts y v1 del header "ts=...,v1=..."
  const parts: Record<string, string> = {};
  for (const part of xSignature.split(',')) {
    const [k, v] = part.split('=');
    if (k && v) parts[k.trim()] = v.trim();
  }
  const { ts, v1 } = parts;
  if (!ts || !v1) return false;

  // Construir el manifest que firma MP
  const manifest = [
    dataId     ? `id:${dataId}`               : null,
    xRequestId ? `request-id:${xRequestId}`   : null,
    `ts:${ts}`,
  ].filter(Boolean).join(';');

  const expected = createHmac('sha256', secret).update(manifest).digest('hex');
  return expected === v1;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    // Verificar firma HMAC de MercadoPago
    if (!verifyMpSignature(req, rawBody)) {
      console.warn('[MP webhook] firma inválida');
      return NextResponse.json({ ok: false, error: 'invalid signature' }, { status: 401 });
    }

    const body = JSON.parse(rawBody);

    // MP envía distintos tipos de notificaciones
    if (body.type !== 'payment') {
      return NextResponse.json({ ok: true });
    }

    const paymentId = body.data?.id;
    if (!paymentId) return NextResponse.json({ ok: false }, { status: 400 });

    // Verificar el pago con la API de MP
    const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
    const paymentClient = new Payment(mp);
    const payment = await paymentClient.get({ id: String(paymentId) });

    if (payment.status !== 'approved') {
      return NextResponse.json({ ok: true, reason: `status: ${payment.status}` });
    }

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const meta = payment.metadata as Record<string, unknown> | null;

    // ── Pago de suscripción Pro ──────────────────────────────────────
    if (meta?.tipo === 'pro' && meta?.user_id) {
      // CRÍTICO: Validar que PRECIO_PRO sea un número finito para evitar bypass con NaN
      const PRECIO_PRO = Number(process.env.PRECIO_PRO);
      if (!Number.isFinite(PRECIO_PRO) || PRECIO_PRO <= 0) {
        console.error('[MP webhook] PRECIO_PRO no configurado o inválido:', process.env.PRECIO_PRO);
        return NextResponse.json({ ok: false, reason: 'config error' }, { status: 500 });
      }
      const montoAbonado = payment.transaction_amount ?? 0;
      if (montoAbonado < PRECIO_PRO) {
        console.warn('[MP webhook] monto insuficiente para Pro:', montoAbonado);
        return NextResponse.json({ ok: false, reason: 'monto insuficiente' }, { status: 400 });
      }

      // CRÍTICO: Idempotencia — evitar procesar el mismo pago dos veces
      const { data: existing } = await admin
        .from('pagos_procesados')
        .select('payment_id')
        .eq('payment_id', String(paymentId))
        .maybeSingle();

      if (existing) {
        return NextResponse.json({ ok: true, tipo: 'pro', cached: true });
      }

      // Verificar que el user_id existe en auth.users antes de actualizar
      const { data: authUser } = await admin.auth.admin.getUserById(String(meta.user_id));
      if (!authUser?.user) {
        console.warn('[MP webhook] user_id no encontrado:', meta.user_id);
        return NextResponse.json({ ok: false, reason: 'usuario no encontrado' }, { status: 400 });
      }

      // Acumular el vencimiento desde el plan actual (igual que confirmar-pago-pro)
      const { data: currentProfile } = await admin
        .from('profiles')
        .select('plan_vencimiento')
        .eq('id', String(meta.user_id))
        .single();

      const currentExpiry = currentProfile?.plan_vencimiento
        ? new Date(currentProfile.plan_vencimiento)
        : new Date(0);
      const base = currentExpiry > new Date() ? currentExpiry : new Date();
      const vencimiento = new Date(base);
      vencimiento.setDate(vencimiento.getDate() + 30);

      const { error: updateErr } = await admin
        .from('profiles')
        .update({ plan: 'pro', plan_vencimiento: vencimiento.toISOString().slice(0, 10) })
        .eq('id', String(meta.user_id));
      if (updateErr) {
        console.error('[MP webhook] Error al actualizar plan Pro:', updateErr.message);
        return NextResponse.json({ ok: false, error: 'Error al actualizar perfil' }, { status: 500 });
      }

      // Registrar idempotencia
      await admin.from('pagos_procesados').insert({
        payment_id: String(paymentId),
        user_id:    String(meta.user_id),
        tipo:       'pro',
      });

      return NextResponse.json({ ok: true, tipo: 'pro' });
    }

    const adIds = (meta as { ad_ids?: string[] } | null)?.ad_ids;
    if (!adIds?.length) {
      return NextResponse.json({ ok: true, reason: 'sin ad_ids en metadata' });
    }

    // ── Renovación de publicidad ─────────────────────────────────────
    if ((meta as Record<string, unknown>)?.tipo === 'renovacion') {
      const nuevaFin = new Date();
      nuevaFin.setDate(nuevaFin.getDate() + 30);
      await admin
        .from('ads')
        .update({ activo: true, fecha_inicio: new Date().toISOString().slice(0, 10), fecha_fin: nuevaFin.toISOString().slice(0, 10) })
        .in('id', adIds);

      await notificarAdmin({
        negocio:   (meta as Record<string, string>)?.negocio ?? '',
        plan:      (meta as Record<string, string>)?.plan ?? '',
        email:     (meta as Record<string, string>)?.email ?? '',
        paymentId: String(paymentId),
        renovacion: true,
      });
      return NextResponse.json({ ok: true, tipo: 'renovacion' });
    }

    // ── Nueva publicidad / comercio ──────────────────────────────────
    try {
      await activarAds(adIds);
    } catch (err) {
      console.error('[MP webhook] Error activando ads, MP reintentará:', err);
      // Retornar 500 para que MercadoPago reintente el webhook automáticamente
      return NextResponse.json({ ok: false, error: 'Error activando ads' }, { status: 500 });
    }

    const metaMap = (meta ?? {}) as Record<string, string>;

    // Email al admin
    await notificarAdmin({
      negocio:   metaMap.negocio   ?? '',
      plan:      metaMap.plan      ?? '',
      email:     metaMap.email     ?? '',
      paymentId: String(paymentId),
    });

    // Si es un comercio de Red Vecindog → notificar a todos los usuarios
    if (metaMap.tipo === 'comercio') {
      // Traer datos del comercio para la notificación
      const { data: adData } = await admin
        .from('ads')
        .select('titulo, categoria_local')
        .eq('id', adIds[0])
        .single();

      const nombre    = adData?.titulo        ?? metaMap.negocio ?? 'Un nuevo negocio';
      const categoria = adData?.categoria_local ? ` (${adData.categoria_local})` : '';
      const mensaje   = `🏪 ${nombre}${categoria} se incorporó a la Red Vecindog. Encontrá sus datos y contacto en la sección Red Vecindog de la app.`;

      // Traer todos los perfiles registrados
      const { data: perfiles } = await admin.from('profiles').select('id');
      if (perfiles?.length) {
        const rows = perfiles.map((p: { id: string }) => ({
          user_id: p.id,
          post_id: null,
          tipo:    'nuevo_comercio',
          mensaje,
          leida:   false,
        }));
        await admin.from('notifications').insert(rows);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[MP webhook]', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}


async function notificarAdmin({
  negocio, plan, email, paymentId, renovacion = false,
}: { negocio: string; plan: string; email: string; paymentId: string; renovacion?: boolean }) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;
  try {
    // ALTO: Escapar HTML para prevenir inyección en el email del admin
    const n = escHtml(negocio);
    const p = escHtml(plan);
    const e = escHtml(email);
    const id = escHtml(paymentId);
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Vecindog <noreply@mivecindog.com.ar>',
        to: [adminEmail],
        subject: renovacion ? `🔄 Renovación publicidad: ${n} (${p})` : `💰 Nuevo anunciante: ${n} (${p})`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
            <h2>Nuevo pago confirmado en Vecindog</h2>
            <p><strong>Negocio:</strong> ${n}</p>
            <p><strong>Plan:</strong> ${p}</p>
            <p><strong>Email:</strong> ${e}</p>
            <p><strong>Payment ID:</strong> ${id}</p>
            <p>Los espacios publicitarios ya están activos.</p>
            <a href="https://www.mivecindog.com.ar/admin/publicidad"
               style="display:inline-block;margin-top:16px;background:#B85C4A;color:white;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:bold">
              Ver panel de publicidad →
            </a>
          </div>
        `,
      }),
    });
  } catch { /* el email no es crítico */ }
}
