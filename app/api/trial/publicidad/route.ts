import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const PLAN_SLOTS: Record<string, Array<'leaderboard' | 'card' | 'sidebar'>> = {
  basico:   ['sidebar'],
  estandar: ['sidebar', 'card'],
  premium:  ['leaderboard', 'card', 'sidebar'],
};

export async function POST(req: NextRequest) {
  try {
    // Verificar sesión del usuario
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data: { user } } = await admin.auth.getUser(token);
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    const { plan, negocio, tagline, link, cta, email, telefono, imagen_url, imagen_logo_url } = await req.json();

    if (!plan || !PLAN_SLOTS[plan]) {
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
    }
    if (!email?.trim()) return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
    if (!negocio?.trim()) return NextResponse.json({ error: 'Nombre del negocio requerido' }, { status: 400 });

    if (link) {
      try {
        const parsed = new URL(link.includes('://') ? link : `https://${link}`);
        if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error();
      } catch {
        return NextResponse.json({ error: 'El link debe ser una URL válida' }, { status: 400 });
      }
    }

    // Verificar que el usuario no usó trial antes (por user_id, no solo por email)
    const { data: existingByUser } = await admin
      .from('ads')
      .select('id')
      .eq('user_id', user.id)
      .eq('es_trial', true)
      .not('plan', 'eq', 'comercio')
      .limit(1);

    if (existingByUser && existingByUser.length > 0) {
      return NextResponse.json({ error: 'Ya usaste el mes gratis.' }, { status: 409 });
    }

    // Verificar también por email (compatibilidad con registros anteriores sin user_id)
    const { data: existing } = await admin
      .from('ads')
      .select('id')
      .eq('anunciante', email.trim().toLowerCase())
      .eq('es_trial', true)
      .not('plan', 'eq', 'comercio')
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'Ya usaste el mes gratis con este email.' }, { status: 409 });
    }

    const hoy = new Date();
    const fin = new Date(hoy);
    fin.setDate(fin.getDate() + 30);
    const fechaInicioStr = hoy.toISOString().slice(0, 10);
    const fechaFinStr    = fin.toISOString().slice(0, 10);

    const slots  = PLAN_SLOTS[plan];
    const adIds: string[] = [];

    for (const variant of slots) {
      const esCard = variant === 'card';
      const { data } = await admin.from('ads').insert({
        variant,
        titulo:          negocio,
        subtitulo:       tagline        || null,
        imagen_url:      imagen_url     || null,
        imagen_logo_url: (!esCard && imagen_logo_url) ? imagen_logo_url : null,
        href:            link           || null,
        cta:             cta            || null,
        anunciante:      email.trim().toLowerCase(),
        user_id:         user.id,
        plan,
        activo:          true,
        es_trial:        true,
        fecha_inicio:    fechaInicioStr,
        fecha_fin:       fechaFinStr,
      }).select('id').single();
      if (data?.id) adIds.push(data.id);
    }

    // Email de bienvenida
    const fechaFinLabel = fin.toLocaleDateString('es-AR', {
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
        to: [email.trim()],
        subject: `¡Tu publicidad en Vecindog está activa — primer mes gratis! 🎉`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
            <div style="background:#B85C4A;border-radius:16px;padding:24px;text-align:center;margin-bottom:24px">
              <img src="https://www.mivecindog.com.ar/logo.svg" alt="Vecindog" width="160" height="40" style="display:block;margin:0 auto;" />
            </div>
            <h2 style="color:#1a1a1a">¡Tu publicidad ya está activa!</h2>
            <p style="color:#555;font-size:16px;line-height:1.6">
              <strong>${negocio}</strong> ya aparece en Vecindog. Tu primer mes es completamente gratis hasta el <strong>${fechaFinLabel}</strong>.
            </p>
            <p style="color:#888;font-size:14px;line-height:1.6;margin-top:16px">
              3 días antes del vencimiento te avisamos para que puedas renovar sin perder tu espacio.
            </p>
            <div style="text-align:center;margin-top:28px">
              <a href="https://www.mivecindog.com.ar/"
                 style="background:#B85C4A;color:white;padding:14px 36px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block">
                Ver Vecindog →
              </a>
            </div>
          </div>
        `,
      }),
    }).catch(() => null);

    return NextResponse.json({ ok: true, ad_ids: adIds, plan, vencimiento: fechaFinStr });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
