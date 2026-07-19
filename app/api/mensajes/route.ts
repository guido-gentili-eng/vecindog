import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/* ── GET /api/mensajes?post_id=xxx&with=yyy ──
 * Si quien pide es el dueño del aviso:
 *   - sin `with`: devuelve la lista de conversaciones (un visitante por hilo).
 *   - con `with`: devuelve los mensajes de ese hilo puntual.
 * Si quien pide NO es el dueño: siempre devuelve su único hilo con el dueño
 * (ignora `with`, no tiene otro hilo posible).
 */
export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get('post_id');
  const withUserId = req.nextUrl.searchParams.get('with');
  if (!postId) return NextResponse.json({ error: 'post_id requerido' }, { status: 400 });

  const auth = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!auth) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const admin = getAdmin();
  const { data: { user }, error } = await admin.auth.getUser(auth);
  if (error || !user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { data: postData } = await admin
    .from('posts')
    .select('user_id')
    .eq('id', postId)
    .single();
  if (!postData) return NextResponse.json({ error: 'Aviso no encontrado' }, { status: 404 });

  const ownerId = postData.user_id;
  const isPostOwner = ownerId === user.id;

  if (!isPostOwner) {
    // Solo puede ver su propio hilo con el dueño — verificamos que ya haya
    // escrito antes (si no, no tiene ningún hilo que ver todavía).
    const { data: participated } = await admin
      .from('mensajes')
      .select('id')
      .eq('post_id', postId)
      .eq('sender_id', user.id)
      .limit(1);
    if (!participated?.length) {
      return NextResponse.json({ mensajes: [] });
    }

    const otherId = ownerId;
    const { data: mensajes, error: err } = await admin
      .from('mensajes')
      .select('id, texto, created_at, sender_id, profiles(nombre, apellido, foto_url)')
      .eq('post_id', postId)
      .or(
        `and(sender_id.eq.${user.id},recipient_id.eq.${otherId}),` +
        `and(sender_id.eq.${otherId},recipient_id.eq.${user.id}),` +
        `and(sender_id.eq.${otherId},recipient_id.is.null)`
      )
      .order('created_at', { ascending: true });

    if (err) return NextResponse.json({ error: err.message }, { status: 500 });
    return NextResponse.json({ mensajes: mensajes ?? [] });
  }

  // A partir de acá, quien pide es el dueño del aviso.
  if (!withUserId) {
    // Lista de conversaciones: un renglón por visitante que haya escrito.
    const { data: rows, error: err } = await admin
      .from('mensajes')
      .select('sender_id, texto, created_at, profiles(nombre, apellido, foto_url)')
      .eq('post_id', postId)
      .neq('sender_id', ownerId)
      .order('created_at', { ascending: false });

    if (err) return NextResponse.json({ error: err.message }, { status: 500 });

    const vistos = new Set<string>();
    const conversaciones = [];
    for (const r of rows ?? []) {
      if (vistos.has(r.sender_id)) continue;
      vistos.add(r.sender_id);
      conversaciones.push({
        user_id: r.sender_id,
        nombre: r.profiles,
        ultimo_texto: r.texto,
        ultimo_at: r.created_at,
      });
    }
    return NextResponse.json({ conversaciones });
  }

  // Hilo puntual del dueño con un visitante específico.
  const { data: mensajes, error: err } = await admin
    .from('mensajes')
    .select('id, texto, created_at, sender_id, profiles(nombre, apellido, foto_url)')
    .eq('post_id', postId)
    .or(
      `and(sender_id.eq.${withUserId},recipient_id.eq.${ownerId}),` +
      `and(sender_id.eq.${withUserId},recipient_id.is.null),` +
      `and(sender_id.eq.${ownerId},recipient_id.eq.${withUserId}),` +
      `and(sender_id.eq.${ownerId},recipient_id.is.null)`
    )
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

  let post_id: string, texto: string, recipient_id: string | undefined;
  try {
    ({ post_id, texto, recipient_id } = await req.json());
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 });
  }
  if (!post_id || !texto?.trim()) {
    return NextResponse.json({ error: 'post_id y texto son requeridos' }, { status: 400 });
  }
  if (texto.trim().length > 2000) {
    return NextResponse.json({ error: 'El mensaje no puede superar los 2000 caracteres' }, { status: 400 });
  }

  const { data: post, error: postErr } = await admin
    .from('posts')
    .select('user_id, nombre, categoria')
    .eq('id', post_id)
    .single();

  if (postErr || !post) {
    return NextResponse.json({ error: 'Aviso no encontrado' }, { status: 404 });
  }

  const isOwner = post.user_id === user.id;
  let finalRecipientId: string;

  if (!isOwner) {
    // Un visitante siempre le escribe al dueño, sin importar lo que mande el cliente.
    finalRecipientId = post.user_id;
  } else {
    // El dueño tiene que decir a cuál visitante le está respondiendo, y ese
    // visitante tiene que tener ya al menos un mensaje en este aviso (evita
    // que el dueño le escriba de la nada a alguien sin hilo abierto, y de
    // paso previene que se auto-inicie un hilo con su propio user_id).
    if (!recipient_id) {
      return NextResponse.json({ error: 'recipient_id es requerido para responder' }, { status: 400 });
    }
    const { count } = await admin
      .from('mensajes')
      .select('id', { count: 'exact', head: true })
      .eq('post_id', post_id)
      .eq('sender_id', recipient_id);
    if (!count) {
      return NextResponse.json({ error: 'Ese usuario no tiene ningún mensaje en este aviso' }, { status: 400 });
    }
    finalRecipientId = recipient_id;
  }

  const { data: nuevo, error: insErr } = await admin
    .from('mensajes')
    .insert({ post_id, sender_id: user.id, recipient_id: finalRecipientId, texto: texto.trim() })
    .select('id, texto, created_at, sender_id')
    .single();

  if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 });

  // Notificar al destinatario (dueño si escribió un visitante, o el visitante
  // puntual si quien contestó fue el dueño).
  const { data: senderProfile } = await admin
    .from('profiles')
    .select('nombre')
    .eq('id', user.id)
    .single();
  const nombreSender = senderProfile?.nombre ?? 'Alguien';
  const nombrePerro  = post.nombre ?? 'tu aviso';

  await admin.from('notifications').insert({
    user_id: finalRecipientId,
    post_id,
    tipo:    'mensaje',
    mensaje: `💬 ${nombreSender} te envió un mensaje sobre ${nombrePerro}.`,
    leida:   false,
  });

  return NextResponse.json({ mensaje: nuevo });
}
