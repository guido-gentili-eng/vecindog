import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const hoy    = new Date();
  const hoyStr = hoy.toISOString().slice(0, 10);

  // Buscar usuarios Pro con plan vencido hoy o antes, que no se hayan pasado a free aún
  const { data: vencidos, error } = await admin
    .from('profiles')
    .select('id, plan_vencimiento')
    .eq('plan', 'pro')
    .not('plan_vencimiento', 'is', null)
    .lte('plan_vencimiento', hoyStr);

  if (error || !vencidos?.length) {
    return NextResponse.json({ ok: true, procesados: 0 });
  }

  const ids = vencidos.map((p: { id: string }) => p.id);

  // Obtener emails desde auth.users via admin auth API
  let enviados = 0;
  let notificados = 0;

  for (const perfil of vencidos) {
    // Degradar usuario individualmente antes de notificar,
    // así si el loop se interrumpe no quedan usuarios degradados sin notificación
    const { error: downgradeErr } = await admin
      .from('profiles')
      .update({ plan: 'free', plan_vencimiento: null })
      .eq('id', perfil.id)
      .eq('plan', 'pro'); // guard: solo si sigue siendo pro
    if (downgradeErr) continue;

    const { data: userData } = await admin.auth.admin.getUserById(perfil.id);
    const email = userData?.user?.email;

    // Notificación in-app
    await admin.from('notifications').insert({
      user_id:  perfil.id,
      post_id:  null,
      tipo:     'expiracion',
      mensaje:  'Tu plan VecindogPro venció. ¡Renovalo para seguir disfrutando de todas las funciones!',
      leida:    false,
    });
    notificados++;

    // Email
    if (!email) continue;

    const res = await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        from:    'Vecindog <noreply@mivecindog.com.ar>',
        to:      [email],
        subject: 'Tu VecindogPro venció — Renovalo ahora 🐾',
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
            <div style="background:#B85C4A;border-radius:16px;padding:24px;text-align:center;margin-bottom:24px">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:26px;font-weight:900;letter-spacing:-0.5px;"><span style="color:#ffffff;">Vecin</span><span style="color:rgba(255,255,255,0.75);">dog</span></p>
            </div>

            <h2 style="color:#1a1a1a;margin-bottom:8px">Tu plan Pro venció</h2>

            <p style="color:#555;font-size:16px;line-height:1.6">
              Tu suscripción <strong>VecindogPro</strong> llegó a su fin. Tu cuenta volvió al plan gratuito y ya no tenés acceso a las funciones premium.
            </p>

            <div style="background:#FFF8F0;border-radius:12px;padding:20px;margin:24px 0;border-left:4px solid #B85C4A">
              <p style="margin:0;font-size:15px;font-weight:bold;color:#1a1a1a">¿Qué perdés sin Pro?</p>
              <ul style="margin:10px 0 0;padding-left:18px;color:#666;font-size:14px;line-height:2">
                <li>Perros ilimitados y publicaciones ilimitadas</li>
                <li>Búsqueda por foto con IA</li>
                <li>Panel de Amigos y red Vecindog</li>
                <li>Notificaciones en tiempo real</li>
                <li>Registro como cuidador o transportador</li>
              </ul>
            </div>

            <p style="color:#555;font-size:15px;line-height:1.6">
              Renová tu plan por solo <strong>$1.000/mes</strong> y seguí disfrutando de la experiencia completa.
            </p>

            <div style="text-align:center;margin-top:28px">
              <a href="https://www.mivecindog.com.ar/planes"
                 style="background:#B85C4A;color:white;padding:14px 36px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block">
                Renovar VecindogPro →
              </a>
            </div>

            <p style="color:#aaa;font-size:12px;margin-top:32px;text-align:center">
              ¿Tenés alguna duda? Escribinos a
              <a href="mailto:hola@mivecindog.com.ar" style="color:#B85C4A">hola@mivecindog.com.ar</a>
            </p>
          </div>
        `,
      }),
    });

    if (res.ok) enviados++;
  }

  return NextResponse.json({ ok: true, procesados: ids.length, notificados, enviados });
}
