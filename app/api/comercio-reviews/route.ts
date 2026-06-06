import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/* GET /api/comercio-reviews?ad_id=xxx */
export async function GET(req: NextRequest) {
  const adId = req.nextUrl.searchParams.get('ad_id');
  if (!adId) return NextResponse.json({ error: 'ad_id requerido' }, { status: 400 });

  const admin = getAdmin();

  const [{ data: reviews }, { data: summary }] = await Promise.all([
    admin
      .from('comercio_reviews')
      .select('id, estrellas, comentario, created_at, user_id, profiles(nombre, apellido, foto_url)')
      .eq('ad_id', adId)
      .order('created_at', { ascending: false }),
    admin
      .from('comercio_reviews')
      .select('estrellas')
      .eq('ad_id', adId),
  ]);

  const total = summary?.length ?? 0;
  const promedio = total > 0
    ? Math.round(((summary ?? []).reduce((a, r) => a + r.estrellas, 0) / total) * 10) / 10
    : 0;

  // Usuario actual (si está autenticado)
  let miReview = null;
  const auth = req.headers.get('authorization')?.replace('Bearer ', '');
  if (auth) {
    const { data: { user } } = await admin.auth.getUser(auth);
    if (user) {
      miReview = (reviews ?? []).find((r) => r.user_id === user.id) ?? null;
    }
  }

  return NextResponse.json({ reviews: reviews ?? [], total, promedio, miReview });
}

/* POST /api/comercio-reviews */
export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!auth) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const admin = getAdmin();
  const { data: { user }, error } = await admin.auth.getUser(auth);
  if (error || !user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { ad_id, estrellas, comentario } = await req.json();
  if (!ad_id || !estrellas || estrellas < 1 || estrellas > 5) {
    return NextResponse.json({ error: 'ad_id y estrellas (1-5) son requeridos' }, { status: 400 });
  }

  const { error: upsertErr } = await admin
    .from('comercio_reviews')
    .upsert(
      { ad_id, user_id: user.id, estrellas, comentario: comentario?.trim() || null },
      { onConflict: 'ad_id,user_id' }
    );

  if (upsertErr) return NextResponse.json({ error: upsertErr.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
