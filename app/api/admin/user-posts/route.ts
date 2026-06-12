import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization')?.slice(7);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const anon = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { user } } = await anon.auth.getUser(token);
  if (!ADMIN_EMAIL || user?.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const uid = req.nextUrl.searchParams.get('uid');
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uid || !UUID_RE.test(uid)) return NextResponse.json({ error: 'uid inválido' }, { status: 400 });

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Todos los posts del usuario, incluyendo resueltos
  const { data: posts } = await admin
    .from('posts')
    .select('id, categoria, nombre, zona, fecha, estado, images')
    .eq('user_id', uid)
    .order('created_at', { ascending: false });

  return NextResponse.json({ posts: posts ?? [] });
}
