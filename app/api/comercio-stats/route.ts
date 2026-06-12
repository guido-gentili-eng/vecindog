import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/* POST /api/comercio-stats  — registrar evento (público, anónimo) */
export async function POST(req: NextRequest) {
  const { ad_id, event_type } = await req.json();
  if (!ad_id || !event_type) {
    return NextResponse.json({ error: 'ad_id y event_type requeridos' }, { status: 400 });
  }

  if (!UUID_RE.test(ad_id)) {
    return NextResponse.json({ error: 'ad_id inválido' }, { status: 400 });
  }

  const allowed = ['view', 'click_telefono', 'click_mapa', 'click_link'];
  if (!allowed.includes(event_type)) {
    return NextResponse.json({ error: 'event_type inválido' }, { status: 400 });
  }

  const admin = getAdmin();
  const { error } = await admin.from('comercio_events').insert({ ad_id, event_type });
  if (error) console.error('[comercio-stats] insert error:', error);

  return NextResponse.json({ ok: true });
}

/* GET /api/comercio-stats?ad_id=xxx  — estadísticas para el dueño */
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!auth) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const admin = getAdmin();
  const { data: { user }, error } = await admin.auth.getUser(auth);
  if (error || !user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  if (!user.email) return NextResponse.json({ error: 'Cuenta sin email' }, { status: 403 });

  const adId = req.nextUrl.searchParams.get('ad_id');
  if (!adId || !UUID_RE.test(adId)) return NextResponse.json({ error: 'ad_id inválido' }, { status: 400 });

  // Verificar que el comercio le pertenece
  const { data: ad } = await admin
    .from('ads')
    .select('id, anunciante')
    .eq('id', adId)
    .eq('anunciante', user.email)
    .single();

  if (!ad) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const sevenDaysAgo  = new Date(Date.now() -  7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: events30 } = await admin
    .from('comercio_events')
    .select('event_type, created_at')
    .eq('ad_id', adId)
    .gte('created_at', thirtyDaysAgo)
    .order('created_at', { ascending: false });

  const all = events30 ?? [];

  const count = (type: string) => all.filter((e) => e.event_type === type).length;
  const countSince = (type: string, since: string) =>
    all.filter((e) => e.event_type === type && e.created_at >= since).length;

  // Vistas por día (últimos 14 días) para el mini gráfico
  const daily: Record<string, number> = {};
  const fourteenDaysAgo = new Date(Date.now() - 13 * 24 * 60 * 60 * 1000);
  for (let i = 0; i < 14; i++) {
    const d = new Date(fourteenDaysAgo);
    d.setDate(d.getDate() + i);
    daily[d.toISOString().slice(0, 10)] = 0;
  }
  all
    .filter((e) => e.event_type === 'view')
    .forEach((e) => {
      const day = e.created_at.slice(0, 10);
      if (day in daily) daily[day]++;
    });

  return NextResponse.json({
    vistas_30d:          count('view'),
    vistas_7d:           countSince('view', sevenDaysAgo),
    clicks_telefono_30d: count('click_telefono'),
    clicks_mapa_30d:     count('click_mapa'),
    clicks_link_30d:     count('click_link'),
    vistas_por_dia:      Object.entries(daily).map(([fecha, total]) => ({ fecha, total })),
  });
}
