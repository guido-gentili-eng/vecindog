import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

const PRECIO_PROMO   = 7990;   // Primeros 50 comercios por ciudad — primeros 6 meses
const PRECIO_REGULAR = 12900;  // Tarifa estándar
const CUPOS_PROMO    = 50;

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
      localidad_comercio: localidad?.trim().toLowerCase() || null,
      categoria_local:    categoria.trim() || null,
      lat:                null,
      lng:                null,
    }).select('id').single();

    if (dbError || !data?.id) {
      console.error('[red-vecindog] DB error:', dbError);
      return NextResponse.json({ error: 'Error al guardar el registro' }, { status: 500 });
    }

    // Determinar precio según cupos por ciudad
    const ciudadNorm = (localidad ?? '').trim().toLowerCase();
    const { count: activosCiudad } = await admin
      .from('ads')
      .select('*', { count: 'exact', head: true })
      .eq('variant', 'comercio')
      .eq('activo', true)
      .eq('localidad_comercio', ciudadNorm);
    const esPromo = (activosCiudad ?? 0) < CUPOS_PROMO;
    const precioFinal  = esPromo ? PRECIO_PROMO : PRECIO_REGULAR;
    const tituloItem   = esPromo
      ? 'Red Vecindog — Tarifa promocional (primeros 6 meses)'
      : 'Red Vecindog — Membresía mensual';

    const mp        = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
    const pref      = new Preference(mp);
    const origin    = req.headers.get('origin') ?? 'https://www.mivecindog.com.ar';

    const result = await pref.create({
      body: {
        items: [{
          id:          'comercio',
          title:       tituloItem,
          description: `${nombre} · ${categoria}`,
          quantity:    1,
          unit_price:  precioFinal,
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
    return NextResponse.json({ url: result.init_point, esPromo, precioFinal });
  } catch (err) {
    console.error('[red-vecindog pago]', err);
    return NextResponse.json({ error: 'Error al procesar el pago' }, { status: 500 });
  }
}

/** GET /api/pago/red-vecindog?ciudad=bahia+blanca — devuelve cupos y precio por ciudad */
export async function GET(req: NextRequest) {
  try {
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const ciudad = req.nextUrl.searchParams.get('ciudad')?.trim().toLowerCase() ?? '';

    let query = admin
      .from('ads')
      .select('*', { count: 'exact', head: true })
      .eq('variant', 'comercio')
      .eq('activo', true);

    if (ciudad) query = query.eq('localidad_comercio', ciudad);

    const { count } = await query;

    const activos  = count ?? 0;
    const esPromo  = activos < CUPOS_PROMO;
    const cuposRestantes = Math.max(0, CUPOS_PROMO - activos);

    return NextResponse.json({
      esPromo,
      cuposRestantes,
      precioActual:  esPromo ? PRECIO_PROMO : PRECIO_REGULAR,
      precioRegular: PRECIO_REGULAR,
      precioPromo:   PRECIO_PROMO,
      totalActivos:  activos,
    });
  } catch {
    return NextResponse.json({ esPromo: true, cuposRestantes: 20, precioActual: PRECIO_PROMO, precioRegular: PRECIO_REGULAR, precioPromo: PRECIO_PROMO, totalActivos: 0 });
  }
}
