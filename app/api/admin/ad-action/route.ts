import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAdminUser } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.slice(7);
    if (!token) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

    const user = await getAdminUser(token);
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
    }

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { ad_id, accion } = await req.json();
    if (!ad_id || accion !== 'eliminar') {
      return NextResponse.json({ ok: false, error: 'Parámetros inválidos' }, { status: 400 });
    }

    // Borrar registros hijo antes de borrar el anuncio (por si los FK no tienen CASCADE en prod)
    await admin.from('novedades').delete().eq('ad_id', ad_id);
    await admin.from('comercio_reviews').delete().eq('ad_id', ad_id);

    const { error } = await admin.from('ads').delete().eq('id', ad_id);
    if (error) {
      console.error('[ad-action] delete error:', error.message);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[ad-action] unexpected error:', e);
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 });
  }
}
