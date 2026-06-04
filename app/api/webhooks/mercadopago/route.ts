import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';
import { activarAds } from '@/lib/ads';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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

    const meta = payment.metadata as Record<string, unknown> | null;

    // ── Pago de suscripción Pro ──────────────────────────────────────
    if (meta?.tipo === 'pro' && meta?.user_id) {
      const admin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      const vencimiento = new Date();
      vencimiento.setDate(vencimiento.getDate() + 30);
      await admin
        .from('profiles')
        .update({ plan: 'pro', plan_vencimiento: vencimiento.toISOString().slice(0, 10) })
        .eq('id', String(meta.user_id));
      return NextResponse.json({ ok: true, tipo: 'pro' });
    }

    const adIds = (meta as { ad_ids?: string[] } | null)?.ad_ids;
    if (!adIds?.length) {
      return NextResponse.json({ ok: true, reason: 'sin ad_ids en metadata' });
    }

    // ── Renovación de publicidad ─────────────────────────────────────
    if ((meta as Record<string, unknown>)?.tipo === 'renovacion') {
      const admin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
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
    await activarAds(adIds);

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
      const admin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
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
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Vecindog <noreply@mivecindog.com.ar>',
        to: ['guido-gentili@live.com.ar'],
        subject: renovacion ? `🔄 Renovación publicidad: ${negocio} (${plan})` : `💰 Nuevo anunciante: ${negocio} (${plan})`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
            <h2>Nuevo pago confirmado en Vecindog</h2>
            <p><strong>Negocio:</strong> ${negocio}</p>
            <p><strong>Plan:</strong> ${plan}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Payment ID:</strong> ${paymentId}</p>
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
