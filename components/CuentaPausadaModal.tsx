'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ShieldAlert, Mail } from 'lucide-react';

export default function CuentaPausadaModal() {
  const { isSuspendido, signOut } = useAuth();
  if (!isSuspendido) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-[32px] bg-white px-7 py-10 text-center shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-warn/10">
          <ShieldAlert className="h-8 w-8 text-warn" />
        </div>

        <h2 className="mt-5 font-display text-2xl font-black text-ink">
          Cuenta en revisión
        </h2>

        <p className="mt-3 text-sm text-ink-muted leading-relaxed">
          Tu cuenta se encuentra <strong>temporalmente suspendida</strong> mientras nuestro equipo evalúa tu situación.
          Nos comunicaremos con vos a la brevedad — el proceso suele resolverse en menos de 48 horas.
        </p>

        <div className="mt-6 rounded-2xl bg-brand-cream px-4 py-4 text-left space-y-1.5">
          <p className="text-xs font-bold text-ink-muted uppercase tracking-wide">¿Tenés alguna duda?</p>
          <a
            href="mailto:hola@mivecindog.com.ar"
            className="flex items-center gap-2 text-sm font-bold text-brand-primary hover:underline transition"
          >
            <Mail className="h-4 w-4 shrink-0" />
            hola@mivecindog.com.ar
          </a>
        </div>

        <button
          type="button"
          onClick={() => signOut()}
          className="mt-6 w-full rounded-2xl border-2 border-black/10 py-3 text-sm font-bold text-ink-muted transition hover:border-black/20"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
