import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get('ids') ?? '';
  const adIds = ids.split(',').filter(Boolean).slice(0, 10); // máximo 10

  if (!adIds.length) {
    return NextResponse.json({ ads: [] });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: ads } = await admin
    .from('ads')
    .select('id, titulo, subtitulo, plan, anunciante, fecha_fin, activo')
    .in('id', adIds);

  return NextResponse.json({ ads: ads ?? [] });
}
