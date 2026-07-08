import { NextRequest, NextResponse } from 'next/server';

// Hosts exactos permitidos — no usar wildcards para evitar bypass de subdominios
const ALLOWED_HOSTS = new Set([
  'replicate.delivery',
  'pbxt.replicate.delivery',
  'ptjyvhiimvmknzpcbzih.supabase.co',
]);

// Sufijos de Replicate CDN (subdominios variables tipo xxxx.replicate.delivery)
const ALLOWED_SUFFIXES = ['.replicate.delivery'];

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return new NextResponse('url requerida', { status: 400 });

  let parsed: URL;
  try { parsed = new URL(url); } catch {
    return new NextResponse('url inválida', { status: 400 });
  }

  const host = parsed.hostname;
  const allowed =
    ALLOWED_HOSTS.has(host) ||
    ALLOWED_SUFFIXES.some((s) => host.endsWith(s) && host.length > s.length);

  if (!allowed) {
    return new NextResponse('dominio no permitido', { status: 403 });
  }

  // redirect: 'manual' evita que un host confiable pueda redirigir el proxy
  // hacia una URL arbitraria (SSRF) sin volver a validar el destino.
  const res = await fetch(url, { redirect: 'manual' });
  if (res.status >= 300 && res.status < 400) {
    return new NextResponse('redirect no permitido', { status: 403 });
  }
  if (!res.ok) return new NextResponse('error al obtener imagen', { status: 502 });

  const blob = await res.arrayBuffer();
  const ct   = res.headers.get('content-type') ?? 'image/png';

  if (!ct.startsWith('image/')) {
    return new NextResponse('tipo de contenido no permitido', { status: 403 });
  }

  return new NextResponse(blob, {
    headers: {
      'Content-Type': ct,
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
