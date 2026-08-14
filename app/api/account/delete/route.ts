import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.slice(7);

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: { user }, error: authError } = await admin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    // perros/posts/profiles son tablas core creadas a mano desde el dashboard de Supabase,
    // sin migración versionada que confirme que su FK a auth.users tiene ON DELETE CASCADE.
    // Se borran acá explícitamente para no depender de eso -- si no, deleteUser() falla con
    // violación de FK para cualquier usuario que ya tenga un perro o un aviso publicado.
    // Sus tablas hijas (vacunas, medicamentos, mensajes, turnos, ratings, etc.) sí tienen
    // CASCADE versionado hacia perros/posts, así que se limpian solas.
    const { error: postsError } = await admin.from('posts').delete().eq('user_id', user.id);
    if (postsError) {
      console.error('[account/delete] posts:', postsError);
      return NextResponse.json({ ok: false, error: 'No se pudo eliminar la cuenta' }, { status: 500 });
    }

    const { error: perrosError } = await admin.from('perros').delete().eq('user_id', user.id);
    if (perrosError) {
      console.error('[account/delete] perros:', perrosError);
      return NextResponse.json({ ok: false, error: 'No se pudo eliminar la cuenta' }, { status: 500 });
    }

    const { error: profileError } = await admin.from('profiles').delete().eq('id', user.id);
    if (profileError) {
      console.error('[account/delete] profiles:', profileError);
      return NextResponse.json({ ok: false, error: 'No se pudo eliminar la cuenta' }, { status: 500 });
    }

    // pagos_procesados es un log de auditoría de pagos -- no se borra, solo se desvincula
    // del usuario. Verificado en producción (pg_constraint) que su FK a auth.users quedó
    // como NO ACTION en vez del ON DELETE SET NULL que dice la migración original, así que
    // sin esto deleteUser() falla para cualquier usuario que haya pagado algo alguna vez.
    const { error: pagosError } = await admin.from('pagos_procesados').update({ user_id: null }).eq('user_id', user.id);
    if (pagosError) {
      console.error('[account/delete] pagos_procesados:', pagosError);
      return NextResponse.json({ ok: false, error: 'No se pudo eliminar la cuenta' }, { status: 500 });
    }

    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) {
      console.error('[account/delete] auth:', error);
      return NextResponse.json({ ok: false, error: 'No se pudo eliminar la cuenta' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[account/delete]', e);
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 });
  }
}
