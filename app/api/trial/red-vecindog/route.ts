import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const {
      nombre, categoria, telefono, direccion, localidad,
      lat, lng,
      horario_apertura, horario_cierre, dias_atencion,
      descripcion, link, email, imagen_url,
    } = await req.json();

    if (!nombre?.trim())    return NextResponse.json({ error: 'Nombre requerido' },    { status: 400 });
    if (!categoria?.trim()) return NextResponse.json({ error: 'Categoría requerida' }, { status: 400 });
    if (!telefono?.trim())  return NextResponse.json({ error: 'Teléfono requerido' },  { status: 400 });
    if (!direccion?.trim()) return NextResponse.json({ error: 'Dirección requerida' }, { status: 400 });
    if (!email?.trim())     return NextResponse.json({ error: 'Email requerido' },     { status: 400 });

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Verificar que el email no usó trial de Red Vecindog antes
    const { data: existing } = await admin
      .from('ads')
      .select('id')
      .eq('anunciante', email.trim().toLowerCase())
      .eq('variant', 'comercio')
      .eq('es_trial', true)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'Ya usaste el mes gratis con este email.' }, { status: 409 });
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

    const hoy = new Date();
    const fin = new Date(hoy);
    fin.setDate(fin.getDate() + 30);
    const fechaInicioStr = hoy.toISOString().slice(0, 10);
    const fechaFinStr    = fin.toISOString().slice(0, 10);

    const direccionCompleta = [direccion, localidad].filter(Boolean).join(', ');
    const subtitulo         = [categoria, localidad].filter(Boolean).join(' · ') || null;

    const { data, error: dbError } = await admin.from('ads').insert({
      variant:            'comercio',
      titulo:             nombre.trim(),
      subtitulo,
      imagen_url:         imagen_url || null,
      imagen_logo_url:    null,
      href,
      cta:                null,
      anunciante:         email.trim().toLowerCase(),
      plan:               'comercio',
      activo:             true,
      es_trial:           true,
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

    if (dbError || !data?.id) {
      return NextResponse.json({ error: 'Error al guardar el registro' }, { status: 500 });
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
        subject: `¡${nombre} ya está en Red Vecindog — primer mes gratis! 🐾`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
            <div style="background:#B85C4A;border-radius:16px;padding:24px;text-align:center;margin-bottom:24px">
              <h1 style="color:white;margin:0;font-size:22px">🐾 Vecindog</h1>
            </div>
            <h2 style="color:#1a1a1a">¡Tu negocio ya está en la red!</h2>
            <p style="color:#555;font-size:16px;line-height:1.6">
              <strong>${nombre}</strong> ya aparece en el mapa y en la Red Vecindog. Tu primer mes es completamente gratis hasta el <strong>${fechaFinLabel}</strong>.
            </p>
            <p style="color:#888;font-size:14px;line-height:1.6;margin-top:16px">
              3 días antes del vencimiento te avisamos para que puedas renovar tu membresía sin perder tu lugar en la red.
            </p>
            <div style="text-align:center;margin-top:28px">
              <a href="https://www.mivecindog.com.ar/red-vecindog"
                 style="background:#B85C4A;color:white;padding:14px 36px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block">
                Ver mi negocio →
              </a>
            </div>
          </div>
        `,
      }),
    }).catch(() => null);

    return NextResponse.json({ ok: true, ad_id: data.id, vencimiento: fechaFinStr });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
