import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    // ── Autenticación: verificar el visitante ──
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
    const token = authHeader.slice(7);

    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { user: visitor } } = await anonClient.auth.getUser(token);
    if (!visitor) return NextResponse.json({ ok: false }, { status: 401 });

    const body = await req.json();
    const post_id = String(body.post_id ?? '').slice(0, 64);
    if (!post_id) return NextResponse.json({ ok: false, reason: 'post_id requerido' });

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // ── Traer el post para saber quién es el dueño ──
    const { data: post } = await admin
      .from('posts')
      .select('user_id, nombre, zona, categoria, estado')
      .eq('id', post_id)
      .single();

    if (!post?.user_id) return NextResponse.json({ ok: true, reason: 'sin dueño' });
    if (post.user_id === visitor.id) return NextResponse.json({ ok: true, reason: 'propio aviso' });
    if (post.estado === 'resuelto') return NextResponse.json({ ok: true, reason: 'resuelto' });

    // ── Rate limit: 1 notificación por visitante+aviso por día ──
    const desde = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count } = await admin
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', post.user_id)
      .eq('post_id', post_id)
      .eq('tipo', 'visita')
      .gte('created_at', desde);

    if (count && count > 0) return NextResponse.json({ ok: true, reason: 'ya notificado hoy' });

    // ── Nombre del visitante (si completó perfil) ──
    const { data: visitorProfile } = await admin
      .from('profiles')
      .select('nombre')
      .eq('id', visitor.id)
      .single();

    const nombrePerro = post.nombre ? `"${post.nombre}"` : 'tu aviso';
    const zonaLabel   = post.zona ?? '';
    const catLabel    =
      post.categoria === 'perdido'    ? 'perdido' :
      post.categoria === 'encontrado' ? 'encontrado' : 'en adopción';

    const quien  = visitorProfile?.nombre ?? 'Alguien';
    const mensaje = `${quien} vio ${nombrePerro} (${catLabel}${zonaLabel ? ` en ${zonaLabel}` : ''})`;

    await admin.from('notifications').insert({
      user_id: post.user_id,
      post_id,
      tipo:    'visita',
      mensaje,
      leida:   false,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 });
  }
}
