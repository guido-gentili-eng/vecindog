import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function generarToken(userId: string, window30: number): string {
  const secret = process.env.VERIFICAR_SECRET;
  if (!secret) throw new Error('VERIFICAR_SECRET no configurado');
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

  // El QR de "Socio Vecindog" es un beneficio exclusivo de Pro — sin este check,
  // cualquier usuario free podría pedir el token directo al endpoint sin pasar
  // por el botón (que solo se muestra en el frontend si isPro).
  const { data: perfil } = await admin
    .from('profiles')
    .select('plan, plan_vencimiento, is_admin')
    .eq('id', user.id)
    .single();
  const hoy = new Date().toISOString().slice(0, 10);
  const esPro = perfil?.is_admin === true ||
    (perfil?.plan === 'pro' && (!perfil?.plan_vencimiento || perfil.plan_vencimiento >= hoy));
  if (!esPro) return NextResponse.json({ error: 'Función exclusiva de VecindogPro' }, { status: 403 });

  let hmac: string;
  try {
    const window30 = Math.floor(Date.now() / 30000);
    hmac = generarToken(user.id, window30);
    return NextResponse.json({ token: hmac, window: window30 });
  } catch {
    return NextResponse.json({ error: 'Error de configuración del servidor' }, { status: 500 });
  }
}
