'use client';

import Link from 'next/link';
import { Lock, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { ReactNode } from 'react';

interface Props {
  /** Nombre de la función bloqueada, ej: "Panel de Amigos" */
  feature: string;
  children: ReactNode;
}

/**
 * Envuelve contenido Pro. Si el usuario no tiene plan Pro, muestra el
 * contenido desenfocado con una tarjeta de upgrade encima.
 */
export default function ProGate({ feature, children }: Props) {
  const { isPro } = useAuth();
  if (isPro) return <>{children}</>;

  return (
    <div className="relative overflow-hidden rounded-[20px]">
      <div className="pointer-events-none select-none opacity-30 blur-[3px]" aria-hidden>
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[20px] bg-white/80 p-6 text-center backdrop-blur-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/10">
          <Lock className="h-6 w-6 text-brand-primary" />
        </div>
        <p className="font-display text-base font-extrabold text-ink">{feature}</p>
        <p className="text-xs text-ink-muted">Función exclusiva de VecindogPro</p>
        <Link
          href="/planes"
          className="inline-flex items-center gap-1.5 rounded-2xl bg-brand-primary px-5 py-2.5 text-sm font-bold text-white shadow-soft transition hover:opacity-90"
        >
          <Sparkles className="h-4 w-4" /> Ver planes
        </Link>
      </div>
    </div>
  );
}
