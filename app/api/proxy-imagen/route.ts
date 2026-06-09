import { NextRequest, NextResponse } from 'next/server';

// Solo permite dominios conocidos (Replicate, Supabase)
const ALLOWED_HOSTS = [
  'replicate.delivery',
  'pbxt.replicate.delivery',
  'ptjyvhiimvmknzpcbzih.supabase.co',
];

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return new NextResponse('url requerida', { status: 400 });

  let parsed: URL;
  try { parsed = new URL(url); } catch {
    return new NextResponse('url inválida', { status: 400 });
  }

  if (!ALLOWED_HOSTS.some(h => parsed.hostname.endsWith(h))) {
    return new NextResponse('dominio no permitido', { status: 403 });
  }

  const res = await fetch(url);
  if (!res.ok) return new NextResponse('error al obtener imagen', { status: 502 });

  const blob = await res.arrayBuffer();
  const ct   = res.headers.get('content-type') ?? 'image/png';

  return new NextResponse(blob, {
    headers: {
      'Content-Type': ct,
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
