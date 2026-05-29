'use client';

import { useAuth } from '@/contexts/AuthContext';
import { nombreCorto } from '@/lib/ciudades';

/**
 * Hero principal de Vecindog.
 *
 * Versión "slim": solo texto + decoraciones sutiles, sin phone mockup ni CTAs.
 * Las 4 acciones principales viven en <ActionCards /> debajo, y son
 * el centro real de la decisión. El hero solo presenta marca y tagline.
 */
export default function Hero() {
  const { ciudad } = useAuth();
  const cityLabel = ciudad ? nombreCorto(ciudad) : 'Argentina';

  return (
    <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-brand-cream-soft via-brand-cream to-[#FBDFD2] px-6 py-6 text-center shadow-soft ring-1 ring-black/5 md:px-10 md:py-8">
      {/* Decoraciones sutiles (paw prints + blobs) */}
      <Decoraciones />

      <div className="relative mx-auto max-w-3xl">
        {/* Eyebrow: chip "Activo" */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-brand-primary shadow-sm ring-1 ring-black/5 backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-primary/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-primary" />
          </span>
          Red vecinal · {cityLabel}
        </span>

        {/* Tagline */}
        <h1 className="mt-3 font-display text-3xl font-black leading-[1.05] tracking-tight text-ink md:text-5xl">
          Buscá. Encontrá. <span className="text-brand-primary">Adoptá.</span>
        </h1>

        {/* Subtítulo */}
        <p className="mx-auto mt-2 max-w-xl text-sm text-ink md:text-base">
          La red vecinal para encontrar y adoptar{' '}
          <strong className="font-bold">perros cerca de vos</strong>.
        </p>
      </div>
    </section>
  );
}

/* --------------------- Decoraciones --------------------- */

function Decoraciones() {
  return (
    <>
      {/* Blobs */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-primary/10" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-adopt/10" />

      {/* Paw prints */}
      <PawSvg className="pointer-events-none absolute right-5 top-5 h-5 w-5 rotate-12 text-brand-primary/25 md:h-6 md:w-6" />
      <PawSvg className="pointer-events-none absolute bottom-5 left-5 h-5 w-5 -rotate-12 text-brand-primary/20 md:h-7 md:w-7" />
      <PawSvg className="pointer-events-none absolute left-1/4 top-6 hidden h-4 w-4 -rotate-12 text-brand-primary/15 sm:block" />
    </>
  );
}

function PawSvg({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <ellipse cx="7"  cy="11" rx="3" ry="4" />
      <ellipse cx="14" cy="6"  rx="3" ry="4" />
      <ellipse cx="22" cy="6"  rx="3" ry="4" />
      <ellipse cx="29" cy="11" rx="3" ry="4" />
      <path d="M18 14c-6 0-10 5-10 9 0 4 4 6 10 6s10-2 10-6c0-4-4-9-10-9z" />
    </svg>
  );
}
