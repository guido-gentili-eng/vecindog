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

  const uid = req.nextUrl.searchParams.get('uid');
  if (!uid) return NextResponse.json({ error: 'uid requerido' }, { status: 400 });

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: perros } = await admin
    .from('perros')
    .select('id, nombre, raza, color, tamano, vacunas(id)')
    .eq('user_id', uid)
    .order('nombre');

  const resultado = (perros ?? []).map((p: {
    id: string; nombre: string; raza: string | null;
    color: string | null; tamano: string | null;
    vacunas: { id: string }[];
  }) => ({
    id:           p.id,
    nombre:       p.nombre,
    raza:         p.raza   ?? '',
    color:        p.color  ?? '',
    tamano:       p.tamano ?? '',
    tieneVacunas: Array.isArray(p.vacunas) && p.vacunas.length > 0,
    cantVacunas:  Array.isArray(p.vacunas) ? p.vacunas.length : 0,
  }));

  return NextResponse.json({ perros: resultado });
}
