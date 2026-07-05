import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser, getAdminClient } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

async function checkAdmin(req: NextRequest) {
  const token = req.headers.get('authorization')?.slice(7);
  return getAdminUser(token);
}

function getAdmin() {
  return getAdminClient();
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
    const { error } = await admin.from('reportes').update({ revisado: true }).eq('id', reporte_id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else if (accion === 'eliminar_aviso') {
    const { data: rep, error: repErr } = await admin.from('reportes').select('post_id').eq('id', reporte_id).single();
    if (repErr) return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
    if (rep?.post_id) {
      // Eliminar el aviso primero: si falla, no marcamos los reportes como revisados
      const { error: delErr } = await admin.from('posts').delete().eq('id', rep.post_id);
      if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });

      const { error: revErr } = await admin.from('reportes').update({ revisado: true }).eq('post_id', rep.post_id);
      if (revErr) return NextResponse.json({ error: revErr.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Acción desconocida' }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
