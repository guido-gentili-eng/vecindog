import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'guido-gentili@live.com.ar';

export async function POST(req: NextRequest) {
  const token = req.headers.get('Authorization')?.slice(7);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const anon = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { user: adminUser } } = await anon.auth.getUser(token);
  if (adminUser?.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { uid, plan, plan_vencimiento } = await req.json() as {
    uid: string;
    plan: 'free' | 'pro';
    plan_vencimiento?: string | null;
  };

  if (!uid || !['free', 'pro'].includes(plan)) {
    return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const updateData: Record<string, unknown> = { plan };
  updateData.plan_vencimiento = plan === 'pro' && plan_vencimiento ? plan_vencimiento : null;

  const { error } = await admin.from('profiles').update(updateData).eq('id', uid);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
