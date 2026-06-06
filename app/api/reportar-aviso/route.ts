import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: { user } } = await admin.auth.getUser(token);
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { post_id, motivo } = await req.json();
  if (!post_id || !motivo?.trim()) {
    return NextResponse.json({ error: 'post_id y motivo son requeridos' }, { status: 400 });
  }

  const { error } = await admin
    .from('reportes')
    .upsert(
      { post_id, reporter_id: user.id, motivo: motivo.trim(), revisado: false },
      { onConflict: 'post_id,reporter_id' }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
