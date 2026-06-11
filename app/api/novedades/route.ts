import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? '';

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function getAuthUser(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  const admin = getAdmin();
  const { data: { user } } = await admin.auth.getUser(token);
  return user ?? null;
}

async function isOwnerOfAd(admin: ReturnType<typeof getAdmin>, adId: string, userEmail: string) {
  const { data } = await admin
    .from('ads')
    .select('anunciante')
    .eq('id', adId)
    .single();
  return data?.anunciante === userEmail;
}

/* GET /api/novedades?ad_id=xxx */
export async function GET(req: NextRequest) {
  const adId = req.nextUrl.searchParams.get('ad_id');
  if (!adId) return NextResponse.json({ error: 'ad_id requerido' }, { status: 400 });

  const admin = getAdmin();
  const { data } = await admin
    .from('novedades')
    .select('id, titulo, texto, imagen_url, created_at')
    .eq('ad_id', adId)
    .eq('activa', true)
    .order('created_at', { ascending: false })
    .limit(20);

  return NextResponse.json({ novedades: data ?? [] });
}

/* POST /api/novedades */
export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const admin = getAdmin();
  const { ad_id, titulo, texto, imagen_url } = await req.json();
  if (!ad_id || !titulo?.trim()) {
    return NextResponse.json({ error: 'ad_id y titulo son requeridos' }, { status: 400 });
  }

  // Solo el dueño del comercio o el admin puede publicar novedades
  if (!user.email) return NextResponse.json({ error: 'Usuario sin email' }, { status: 403 });
  const esAdmin = user.email === ADMIN_EMAIL;
  if (!esAdmin) {
    const esOwner = await isOwnerOfAd(admin, ad_id, user.email);
    if (!esOwner) return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
  }

  const { data, error } = await admin
    .from('novedades')
    .insert({
      ad_id,
      titulo: titulo.trim(),
      texto: (texto?.trim() || '').slice(0, 5000) || null,
      imagen_url: imagen_url || null,
      activa: true,
    })
    .select('id, titulo, texto, imagen_url, created_at')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ novedad: data });
}

/* DELETE /api/novedades?id=xxx */
export async function DELETE(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const novedadId = req.nextUrl.searchParams.get('id');
  if (!novedadId) return NextResponse.json({ error: 'id requerido' }, { status: 400 });

  const admin = getAdmin();

  // Verificar que la novedad pertenece a un comercio del usuario
  const { data: nov } = await admin
    .from('novedades')
    .select('ad_id')
    .eq('id', novedadId)
    .single();

  if (!nov) return NextResponse.json({ error: 'No encontrada' }, { status: 404 });

  if (!user.email) return NextResponse.json({ error: 'Usuario sin email' }, { status: 403 });
  const esAdmin = user.email === ADMIN_EMAIL;
  if (!esAdmin) {
    const esOwner = await isOwnerOfAd(admin, nov.ad_id, user.email);
    if (!esOwner) return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
  }

  const { error: delErr } = await admin.from('novedades').delete().eq('id', novedadId);
  if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
