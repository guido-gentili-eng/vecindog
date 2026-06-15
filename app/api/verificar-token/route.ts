import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function generarToken(userId: string, window30: number): string {
  const secret = process.env.VERIFICAR_SECRET ?? 'vecindog-fallback-secret';
  return createHmac('sha256', secret)
    .update(`${userId}:${window30}`)
    .digest('hex')
    .slice(0, 16);
}

export async function GET(req: NextRequest) {
  // Requiere sesión válida para generar token
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data: { user } } = await admin.auth.getUser(token);
  if (!user) return NextResponse.json({ error: 'Token inválido' }, { status: 401 });

  const window30 = Math.floor(Date.now() / 30000);
  const hmac = generarToken(user.id, window30);

  return NextResponse.json({ token: hmac, window: window30 });
}
