import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'guido-gentili@live.com.ar';

export async function GET(req: NextRequest) {
  try {
    // Verificar que sea el admin
    const authHeader = req.headers.get('Authorization');
    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    let isAdmin = false;
    if (authHeader?.startsWith('Bearer ')) {
      const { data: { user } } = await anonClient.auth.getUser(authHeader.slice(7));
      isAdmin = user?.email === ADMIN_EMAIL;
    }

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Traer todos los perfiles
    const { data: profiles, error } = await admin
      .from('profiles')
      .select('id, nombre, apellido, ciudad, plan, plan_vencimiento')
      .order('plan', { ascending: false }) // pro primero
      .order('nombre');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Traer emails desde auth.users en batch
    const { data: { users: authUsers }, error: authErr } = await admin.auth.admin.listUsers({ perPage: 1000 });
    if (authErr) {
      return NextResponse.json({ error: authErr.message }, { status: 500 });
    }

    const emailMap: Record<string, string> = {};
    for (const u of authUsers) {
      if (u.email) emailMap[u.id] = u.email;
    }

    const suscriptos = (profiles ?? []).map((p) => ({
      id:               p.id,
      nombre:           p.nombre ?? '',
      apellido:         p.apellido ?? '',
      email:            emailMap[p.id] ?? '',
      plan:             p.plan ?? 'free',
      plan_vencimiento: p.plan_vencimiento ?? null,
      ciudad:           p.ciudad ?? '',
    }));

    return NextResponse.json({ suscriptos });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
