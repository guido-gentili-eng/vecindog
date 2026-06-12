import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export async function GET(req: NextRequest) {
  // ── Verificar que sea el admin ───────────────────────────────────
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
    admin.from('profiles').select('id, nombre, apellido, telefono, ciudad, provincia, direccion, plan, suspendido').limit(2000),
  ]);

  const hoy         = new Date().toISOString().slice(0, 10);
  const hace30      = new Date(); hace30.setDate(hace30.getDate() - 30);
  const hace30Str   = hace30.toISOString().slice(0, 10);
  const negociosAll = new Set((ads ?? []).map((a: {anunciante: string}) => a.anunciante).filter(Boolean));
  const negociosAct = new Set((ads ?? []).filter((a: {activo: boolean}) => a.activo).map((a: {anunciante: string}) => a.anunciante).filter(Boolean));

  const [proVencidos, conversionesMes, comerciosMes, reportesPendientes] = await Promise.all([
    admin.from('profiles').select('id', { count: 'exact', head: true })
      .eq('plan', 'pro').lt('plan_vencimiento', hoy),
    // Usuarios que se convirtieron a Pro en los últimos 30 días (tienen plan_vencimiento futuro y fue actualizado recientemente)
    admin.from('profiles').select('id', { count: 'exact', head: true })
      .eq('plan', 'pro').gte('plan_vencimiento', hoy),
    // Comercios nuevos en los últimos 30 días
    admin.from('ads').select('id', { count: 'exact', head: true })
      .eq('variant', 'comercio').gte('created_at', hace30Str),
    // Reportes sin revisar
    admin.from('reportes').select('id', { count: 'exact', head: true })
      .eq('revisado', false),
  ]);

  // Mapa de id → perfil
  const profileMap: Record<string, { nombre: string; apellido: string; telefono: string; ciudad: string; provincia: string; direccion: string; plan: string; suspendido: boolean }> = {};
  for (const p of profiles ?? []) {
    profileMap[p.id] = p;
  }

  // Mapas de email y created_at desde auth.users
  const emailMap:     Record<string, string> = {};
  const createdAtMap: Record<string, string> = {};
  for (const u of authUsers?.users ?? []) {
    if (u.email)      emailMap[u.id]     = u.email;
    if (u.created_at) createdAtMap[u.id] = u.created_at;
  }

  const todosUsuarios = (profiles ?? [])
    .map((p) => ({
      id:         p.id,
      email:      emailMap[p.id]     ?? '',
      created_at: createdAtMap[p.id] ?? '',
      nombre:     p.nombre    ?? '',
      apellido:   p.apellido  ?? '',
      telefono:   p.telefono  ?? '',
      ciudad:     p.ciudad    ?? '',
      provincia:  p.provincia ?? '',
      direccion:  p.direccion ?? '',
      plan:       p.plan       ?? 'free',
      suspendido: p.suspendido ?? false,
    }))
    // Por defecto: orden A-Z (el cliente puede reordenar por fecha)
    .sort((a, b) => {
      const na = `${a.nombre} ${a.apellido}`.toLowerCase().trim();
      const nb = `${b.nombre} ${b.apellido}`.toLowerCase().trim();
      return na.localeCompare(nb, 'es');
    });

  // Para compatibilidad con la página, mantenemos el nombre ultimosUsuarios
  const ultimosUsuarios = todosUsuarios;

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
    metricas: {
      proActivos:        conversionesMes.count ?? 0,
      comerciosMes:      comerciosMes.count ?? 0,
      reportesPendientes: reportesPendientes.count ?? 0,
      tasaConversion:    totalUsuarios
        ? Math.round(((usuariosPro ?? 0) / (totalUsuarios ?? 1)) * 100)
        : 0,
    },
    ultimosUsuarios,
  });
}
