import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

const PRECIO_COMERCIO = 2500;

export async function POST(req: NextRequest) {
  try {
    const {
      nombre, categoria, telefono, direccion, localidad,
      horario_apertura, horario_cierre, dias_atencion,
      descripcion, link, email, imagen_url,
    } = await req.json();

    if (!nombre?.trim())    return NextResponse.json({ error: 'Nombre requerido' },    { status: 400 });
    if (!categoria?.trim()) return NextResponse.json({ error: 'Categoría requerida' }, { status: 400 });
    if (!telefono?.trim())  return NextResponse.json({ error: 'Teléfono requerido' },  { status: 400 });
    if (!direccion?.trim()) return NextResponse.json({ error: 'Dirección requerida' }, { status: 400 });
    if (!email?.trim())     return NextResponse.json({ error: 'Email requerido' },     { status: 400 });

    if (nombre.length  > 100) return NextResponse.json({ error: 'Nombre demasiado largo' },      { status: 400 });
    if (descripcion && descripcion.length > 200) return NextResponse.json({ error: 'Descripción demasiado larga' }, { status: 400 });

    // Construir href: prioriza link, fallback teléfono, fallback sitio
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

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const direccionCompleta = [direccion, localidad].filter(Boolean).join(', ');
    const subtitulo = [categoria, localidad].filter(Boolean).join(' · ') || null;

    const { data, error: dbError } = await admin.from('ads').insert({
      variant:            'comercio',
      titulo:             nombre.trim(),
      subtitulo,
      imagen_url:         imagen_url || null,
      imagen_logo_url:    null,
      href,
      cta:                null,
      anunciante:         email.trim(),
      plan:               'comercio',
      activo:             false,
      fecha_inicio:       null,
      fecha_fin:          null,
      telefono_comercio:  telefono.trim()  || null,
      horario_apertura:   horario_apertura || null,
      horario_cierre:     horario_cierre   || null,
      dias_atencion:      dias_atencion    || null,
      direccion_comercio: direccionCompleta || null,
      categoria_local:    categoria.trim() || null,
      lat:                null,
      lng:                null,
    }).select('id').single();

    if (dbError || !data?.id) {
      console.error('[red-vecindog] DB error:', dbError);
      return NextResponse.json({ error: 'Error al guardar el registro' }, { status: 500 });
    }

    const mp        = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
    const pref      = new Preference(mp);
    const origin    = req.headers.get('origin') ?? 'https://www.mivecindog.com.ar';

    const result = await pref.create({
      body: {
        items: [{
          id:          'comercio',
          title:       'Red Vecindog — Membresía mensual',
          description: `${nombre} · ${categoria}`,
          quantity:    1,
          unit_price:  PRECIO_COMERCIO,
          currency_id: 'ARS',
        }],
        payer: { email: email.trim() },
        back_urls: {
          success: `${origin}/red-vecindog/pago-exitoso?ads=${data.id}`,
          failure: `${origin}/red-vecindog?pago=fallido`,
          pending: `${origin}/red-vecindog/pago-exitoso?ads=${data.id}&pending=1`,
        },
        auto_return:          'approved',
        statement_descriptor: 'VECINDOG',
        external_reference:   `comercio-${data.id}-${Date.now()}`,
        metadata: {
          tipo:    'comercio',
          negocio: nombre.trim(),
          plan:    'comercio',
          email:   email.trim(),
          ad_ids:  [data.id],
        },
      },
    });

    if (!result.init_point) {
      return NextResponse.json({ error: 'Mercado Pago no devolvió URL de pago' }, { status: 502 });
    }
    return NextResponse.json({ url: result.init_point });
  } catch (err) {
    console.error('[red-vecindog pago]', err);
    return NextResponse.json({ error: 'Error al procesar el pago' }, { status: 500 });
  }
}
