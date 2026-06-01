import { createClient } from '@supabase/supabase-js';

interface Props {
  params:      { userId: string };
  searchParams: { t?: string };
}

export default async function VerificarPage({ params, searchParams }: Props) {
  const { userId } = params;
  const tParam     = Number(searchParams.t ?? 0);
  const ahora      = Math.floor(Date.now() / 30000);

  // Válido si el token es de esta ventana o la anterior (≤ 60 s de gracia)
  const valido = tParam === ahora || tParam === ahora - 1;

  // Leer perfil (server-side con service role, nunca expuesto al cliente)
  let nombre   = '';
  let apellido = '';

  if (valido) {
    try {
      const admin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      const { data } = await admin
        .from('profiles')
        .select('nombre, apellido')
        .eq('id', userId)
        .single();
      if (data) { nombre = data.nombre ?? ''; apellido = data.apellido ?? ''; }
    } catch { /* usuario no encontrado */ }
  }

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {valido && nombre ? (
          /* ── QR VÁLIDO ── */
          <div className="rounded-[32px] bg-white shadow-2xl overflow-hidden">

            {/* Franja superior */}
            <div className="bg-brand-primary px-6 py-5 text-white text-center">
              <p className="text-xs font-bold uppercase tracking-[3px] opacity-70 mb-1">Verificación</p>
              <h1 className="font-display text-2xl font-black">Socio Vecindog</h1>
            </div>

            {/* Avatar + nombre */}
            <div className="flex flex-col items-center gap-3 px-6 py-8">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-primary/10 text-4xl font-black text-brand-primary">
                {nombre.charAt(0).toUpperCase()}
              </div>
              <div className="text-center">
                <p className="font-display text-2xl font-black text-ink">
                  {nombre} {apellido}
                </p>
                <p className="mt-1 text-sm text-ink-muted">Miembro de la red vecinal</p>
              </div>
            </div>

            {/* Sello verificado */}
            <div className="mx-6 mb-6 flex items-center gap-3 rounded-2xl bg-good/10 px-5 py-4">
              <span className="text-3xl">✅</span>
              <div>
                <p className="font-bold text-ink">Identidad verificada</p>
                <p className="text-xs text-ink-muted">QR válido · caduca en unos segundos</p>
              </div>
            </div>

            {/* Logo footer */}
            <div className="border-t border-black/5 px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-ink-muted">mivecindog.com.ar</p>
                <p className="text-[10px] text-ink-muted/60">Red vecinal de mascotas · Argentina</p>
              </div>
              <span className="text-2xl">🐾</span>
            </div>
          </div>

        ) : (
          /* ── QR INVÁLIDO / EXPIRADO ── */
          <div className="rounded-[32px] bg-white shadow-2xl overflow-hidden text-center">
            <div className="bg-bad px-6 py-5 text-white">
              <p className="text-xs font-bold uppercase tracking-[3px] opacity-70 mb-1">Verificación</p>
              <h1 className="font-display text-2xl font-black">QR no válido</h1>
            </div>
            <div className="px-6 py-8">
              <div className="text-5xl mb-4">⏱️</div>
              <p className="font-bold text-ink text-lg mb-2">Código expirado</p>
              <p className="text-sm text-ink-muted leading-relaxed">
                Este QR ya no es válido. Pedile al socio que abra su app y muestre el código actualizado.
              </p>
            </div>
            <div className="border-t border-black/5 px-6 py-4 text-xs text-ink-muted/60">
              mivecindog.com.ar · Red vecinal de mascotas
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
