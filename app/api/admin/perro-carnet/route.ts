import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'guido-gentili@live.com.ar';

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization')?.slice(7);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const anon = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { user } } = await anon.auth.getUser(token);
  if (user?.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const perroId = req.nextUrl.searchParams.get('perroId');
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!perroId || !UUID_RE.test(perroId)) {
    return NextResponse.json({ error: 'perroId inválido' }, { status: 400 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: perro } = await admin
    .from('perros')
    .select('*, vacunas(*)')
    .eq('id', perroId)
    .single();

  if (!perro) return NextResponse.json({ error: 'Perro no encontrado' }, { status: 404 });

  const { data: profile } = await admin
    .from('profiles')
    .select('id, nombre, apellido, telefono, ciudad, provincia, pais, direccion')
    .eq('id', perro.user_id)
    .single();

  return NextResponse.json({ perro, profile: profile ?? null });
}
