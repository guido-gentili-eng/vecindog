import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/* ── GET /api/mensajes?post_id=xxx ── */
export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get('post_id');
  if (!postId) return NextResponse.json({ error: 'post_id requerido' }, { status: 400 });

  // Verificar auth
  const auth = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!auth) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const admin = getAdmin();
  const { data: { user }, error } = await admin.auth.getUser(auth);
  if (error || !user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  // Verificar que el usuario es el dueño del post o participó en el hilo
  const { data: postData } = await admin
    .from('posts')
    .select('user_id')
    .eq('id', postId)
    .single();

  const isPostOwner = postData?.user_id === user.id;

  if (!isPostOwner) {
    const { data: participated } = await admin
      .from('mensajes')
      .select('id')
      .eq('post_id', postId)
      .eq('sender_id', user.id)
      .limit(1);
    if (!participated?.length) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  const { data: mensajes, error: err } = await admin
    .from('mensajes')
    .select('id, texto, created_at, sender_id, profiles(nombre, apellido, foto_url)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (err) return NextResponse.json({ error: err.message }, { status: 500 });

  return NextResponse.json({ mensajes: mensajes ?? [] });
}

/* ── POST /api/mensajes ── */
export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!auth) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const admin = getAdmin();
  const { data: { user }, error } = await admin.auth.getUser(auth);
  if (error || !user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  let post_id: string, texto: string;
  try {
    ({ post_id, texto } = await req.json());
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 });
  }
  if (!post_id || !texto?.trim()) {
    return NextResponse.json({ error: 'post_id y texto son requeridos' }, { status: 400 });
  }
  if (texto.trim().length > 2000) {
    return NextResponse.json({ error: 'El mensaje no puede superar los 2000 caracteres' }, { status: 400 });
  }

  // Insertar mensaje
  const { data: nuevo, error: insErr } = await admin
    .from('mensajes')
    .insert({ post_id, sender_id: user.id, texto: texto.trim() })
    .select('id, texto, created_at, sender_id')
    .single();

  if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 });

  // Notificar al dueño del post si no es el mismo que envía
  const { data: post } = await admin
    .from('posts')
    .select('user_id, nombre, categoria')
    .eq('id', post_id)
    .single();

  if (post && post.user_id !== user.id) {
    const { data: senderProfile } = await admin
      .from('profiles')
      .select('nombre')
      .eq('id', user.id)
      .single();
    const nombreSender = senderProfile?.nombre ?? 'Alguien';
    const nombrePerro = post.nombre ?? 'tu aviso';

    await admin.from('notifications').insert({
      user_id: post.user_id,
      post_id,
      tipo: 'mensaje',
      mensaje: `💬 ${nombreSender} te envió un mensaje sobre ${nombrePerro}.`,
      leida: false,
    });
  }

  return NextResponse.json({ mensaje: nuevo });
}
