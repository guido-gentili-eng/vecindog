import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
export const dynamic = 'force-dynamic';

async function checkAdmin(req: NextRequest) {
  const token = req.headers.get('authorization')?.slice(7);
  if (!token) return null;
  const anon = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { user } } = await anon.auth.getUser(token);
  return (ADMIN_EMAIL && user?.email === ADMIN_EMAIL) ? user : null;
}

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/* GET — lista de reportes pendientes */
export async function GET(req: NextRequest) {
  const user = await checkAdmin(req);
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const admin = getAdmin();
  const { data: reportes } = await admin
    .from('reportes')
    .select(`
      id, motivo, revisado, created_at,
      post_id,
      posts(id, categoria, nombre, zona, estado, images)
    `)
    .eq('revisado', false)
    .order('created_at', { ascending: false })
    .limit(50);

  return NextResponse.json({ reportes: reportes ?? [] });
}

/* POST — marcar reporte como revisado o eliminar el aviso */
export async function POST(req: NextRequest) {
  const user = await checkAdmin(req);
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  let reporte_id: string, accion: string;
  try {
    ({ reporte_id, accion } = await req.json());
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 });
  }
  // accion: 'desestimar' | 'eliminar_aviso'

  const admin = getAdmin();

  if (accion === 'desestimar') {
    await admin.from('reportes').update({ revisado: true }).eq('id', reporte_id);
  } else if (accion === 'eliminar_aviso') {
    const { data: rep, error: repErr } = await admin.from('reportes').select('post_id').eq('id', reporte_id).single();
    if (repErr) return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
    if (rep?.post_id) {
      // Marcar todos los reportes de ese aviso como revisados
      await admin.from('reportes').update({ revisado: true }).eq('post_id', rep.post_id);
      // Eliminar el aviso
      await admin.from('posts').delete().eq('id', rep.post_id);
    }
  }

  return NextResponse.json({ ok: true });
}
