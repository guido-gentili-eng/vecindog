import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Solo expone los campos mínimos necesarios para la página de renovación
// El campo `anunciante` (email) no se devuelve al cliente
export async function GET(req: NextRequest) {
  const ids    = req.nextUrl.searchParams.get('ids') ?? '';
  const adIds  = ids.split(',').filter(Boolean).slice(0, 6); // máximo 6 (un plan premium tiene 3)

  if (!adIds.length) {
    return NextResponse.json({ ads: [] });
  }

  // Validar que los IDs tengan formato UUID
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!adIds.every((id) => UUID_RE.test(id))) {
    return NextResponse.json({ error: 'IDs inválidos' }, { status: 400 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: ads } = await admin
    .from('ads')
    .select('id, titulo, subtitulo, plan, fecha_fin, activo') // SIN anunciante
    .in('id', adIds);

  return NextResponse.json({ ads: ads ?? [] });
}
