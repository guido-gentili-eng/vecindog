import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'guido-gentili@live.com.ar';

export async function GET(req: NextRequest) {
  // ── Verificar que sea el admin ───────────────────────────────────
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

  // ── Datos con service role ───────────────────────────────────────
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [
    { count: totalUsuarios },
    { count: usuariosPro },
    { data: ads },
    { data: authUsers },
    { data: profiles },
  ] = await Promise.all([
    admin.from('profiles').select('id', { count: 'exact', head: true }),
    admin.from('profiles').select('id', { count: 'exact', head: true }).eq('plan', 'pro'),
    admin.from('ads').select('id, titulo, anunciante, plan, activo, fecha_fin'),
    admin.auth.admin.listUsers({ perPage: 1000 }),
    admin.from('profiles').select('id, nombre, apellido, telefono, ciudad, provincia, direccion, plan'),
  ]);

  const hoy         = new Date().toISOString().slice(0, 10);
  const negociosAll = new Set((ads ?? []).map((a: {anunciante: string}) => a.anunciante).filter(Boolean));
  const negociosAct = new Set((ads ?? []).filter((a: {activo: boolean}) => a.activo).map((a: {anunciante: string}) => a.anunciante).filter(Boolean));
  const proVencidos = await admin.from('profiles').select('id', { count: 'exact', head: true })
    .eq('plan', 'pro').lt('plan_vencimiento', hoy);

  // Mapa de id → perfil
  const profileMap: Record<string, { nombre: string; apellido: string; telefono: string; ciudad: string; provincia: string; direccion: string; plan: string }> = {};
  for (const p of profiles ?? []) {
    profileMap[p.id] = p;
  }

  // Últimos 10 usuarios registrados con datos completos
  const ultimosUsuarios = (authUsers?.users ?? [])
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10)
    .map((u) => {
      const p = profileMap[u.id];
      return {
        id:         u.id,
        email:      u.email ?? '',
        created_at: u.created_at,
        nombre:     p?.nombre    ?? '',
        apellido:   p?.apellido  ?? '',
        telefono:   p?.telefono  ?? '',
        ciudad:     p?.ciudad    ?? '',
        provincia:  p?.provincia ?? '',
        direccion:  p?.direccion ?? '',
        plan:       p?.plan      ?? 'free',
      };
    });

  return NextResponse.json({
    cuentas: {
      total:    totalUsuarios ?? 0,
      pro:      usuariosPro  ?? 0,
      gratis:   (totalUsuarios ?? 0) - (usuariosPro ?? 0),
      proVencidos: proVencidos.count ?? 0,
    },
    negocios: {
      total:   negociosAll.size,
      activos: negociosAct.size,
    },
    ultimosUsuarios,
  });
}
