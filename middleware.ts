import { NextRequest, NextResponse } from 'next/server';

const ADMIN_EMAIL  = 'guido-gentili@live.com.ar';
// Supabase project ref (extraído de NEXT_PUBLIC_SUPABASE_URL)
const PROJECT_REF  = 'ptjyvhiimvmknzpcbzih';

/**
 * Intenta obtener el email del usuario desde las cookies de Supabase.
 * Decodifica el JWT sin verificar la firma (la firma se verifica en el servidor
 * de Supabase en cada llamada real). Es suficiente para bloquear acceso a rutas admin.
 */
function getEmailFromCookies(req: NextRequest): string | null {
  const cookieNames = [
    `sb-${PROJECT_REF}-auth-token`,
    'sb-access-token',
  ];

  for (const name of cookieNames) {
    const raw = req.cookies.get(name)?.value;
    if (!raw) continue;

    try {
      let token = raw;

      // Supabase a veces guarda el token como JSON array o JSON objeto
      if (raw.startsWith('[') || raw.startsWith('{')) {
        const parsed = JSON.parse(decodeURIComponent(raw));
        if (Array.isArray(parsed))       token = parsed[0] ?? '';
        else if (parsed?.access_token)   token = parsed.access_token;
        else if (typeof parsed === 'string') token = parsed;
      }

      // Decodificar el payload del JWT (parte central, base64url)
      const parts = token.split('.');
      if (parts.length !== 3) continue;

      const payload = JSON.parse(
        Buffer.from(
          parts[1].replace(/-/g, '+').replace(/_/g, '/'),
          'base64'
        ).toString('utf-8')
      );

      if (payload?.email) return payload.email as string;
    } catch { /* cookie malformada, probar la siguiente */ }
  }

  return null;
}

export function middleware(req: NextRequest) {
  // Proteger todas las rutas /admin/*
  const email = getEmailFromCookies(req);

  if (email !== ADMIN_EMAIL) {
    // Redirigir al inicio sin revelar que la ruta existe
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
