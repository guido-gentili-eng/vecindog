import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

    // Verificar que no usó el trial antes
    const { data: profile } = await admin
      .from('profiles')
      .select('plan, plan_trial_usado')
      .eq('id', user.id)
      .single();

    if (profile?.plan_trial_usado) {
      return NextResponse.json({ error: 'Ya usaste el mes gratis anteriormente.' }, { status: 409 });
    }
    if (profile?.plan === 'pro') {
      return NextResponse.json({ error: 'Ya tenés un plan Pro activo.' }, { status: 409 });
    }

    const vencimiento = new Date();
    vencimiento.setDate(vencimiento.getDate() + 30);
    const vencimientoStr = vencimiento.toISOString().slice(0, 10);

    const { error } = await admin
      .from('profiles')
      .update({ plan: 'pro', plan_vencimiento: vencimientoStr, plan_trial_usado: true })
      .eq('id', user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Email de bienvenida
    if (user.email) {
      const fechaFin = vencimiento.toLocaleDateString('es-AR', {
        day: 'numeric', month: 'long', year: 'numeric',
      });
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Vecindog <noreply@mivecindog.com.ar>',
          to: [user.email],
          subject: '¡Tu primer mes de VecindogPro es gratis! 🎉',
          html: `
            <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
              <div style="background:#B85C4A;border-radius:16px;padding:24px;text-align:center;margin-bottom:24px">
                <img src="https://www.mivecindog.com.ar/logo.svg" alt="Vecindog" width="160" height="40" style="display:block;margin:0 auto;" />
              </div>
              <h2 style="color:#1a1a1a">¡Bienvenido/a a VecindogPro!</h2>
              <p style="color:#555;font-size:16px;line-height:1.6">
                Tu primer mes es completamente <strong>gratis</strong>. Disfrutá de todas las funciones premium hasta el <strong>${fechaFin}</strong>.
              </p>
              <div style="background:#FFF8F0;border-radius:12px;padding:20px;margin:20px 0;border-left:4px solid #B85C4A">
                <p style="margin:0;font-size:15px;font-weight:bold;color:#1a1a1a">¿Qué incluye tu Pro?</p>
                <ul style="margin:10px 0 0;padding-left:18px;color:#666;font-size:14px;line-height:2">
                  <li>Perros ilimitados y publicaciones ilimitadas</li>
                  <li>Búsqueda por foto con IA 📷</li>
                  <li>Panel de Amigos y red Vecindog</li>
                  <li>Notificaciones en tiempo real 🔔</li>
                  <li>Registro como cuidador o transportador</li>
                </ul>
              </div>
              <p style="color:#888;font-size:14px;line-height:1.6">
                Antes de que venza te avisamos para que puedas renovar por $1.000/mes y no perder el acceso.
              </p>
              <div style="text-align:center;margin-top:28px">
                <a href="https://www.mivecindog.com.ar/"
                   style="background:#B85C4A;color:white;padding:14px 36px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block">
                  Ir a Vecindog →
                </a>
              </div>
            </div>
          `,
        }),
      }).catch(() => null);
    }

    return NextResponse.json({ ok: true, vencimiento: vencimientoStr });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
