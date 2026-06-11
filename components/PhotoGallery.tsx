'use client';

import { useState } from 'react';
import { ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Galería de fotos para el detalle de un aviso.
 *
 * - Imagen principal grande arriba.
 * - Miniaturas debajo (clic = cambia la principal).
 * - Si hay 1 sola foto, muestra solo esa.
 * - Si no hay fotos, muestra un placeholder amigable.
 * - Flechas opcionales para navegar (solo si hay >1 foto).
 */
export default function PhotoGallery({
  imagenes,
  alt
}: {
  imagenes: string[];
  alt: string;
}) {
  const [idx, setIdx] = useState(0);

  // Caso 1: no hay fotos -> placeholder
  if (!imagenes || imagenes.length === 0) {
    return (
      <div className="flex aspect-[16/9] w-full flex-col items-center justify-center rounded-3xl bg-brand-cream text-ink-muted">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white shadow-sm">
          <ImageIcon className="h-8 w-8 text-brand-primary/60" />
        </div>
        <p className="mt-3 text-sm font-medium">Este aviso todavía no tiene fotos</p>
        <p className="text-xs">Cuando se publique con foto, va a aparecer acá.</p>
      </div>
    );
  }

  const total = imagenes.length;
  const safeIdx = Math.min(idx, total - 1);
  const hayVarias = total > 1;
  const goPrev = () => setIdx((i) => (i - 1 + total) % total);
  const goNext = () => setIdx((i) => (i + 1) % total);

  return (
    <div>
      {/* Imagen principal */}
      <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-brand-cream">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imagenes[safeIdx]}
          alt={`${alt} — foto ${safeIdx + 1} de ${total}`}
          className="h-full w-full object-cover transition-opacity duration-200"
        />

        {hayVarias && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow ring-1 ring-black/5 transition hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Foto siguiente"
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow ring-1 ring-black/5 transition hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Indicador X / Y */}
            <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {idx + 1} / {total}
            </span>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {hayVarias && (
        <div className="hide-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {imagenes.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === idx}
              className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-xl ring-1 transition ${
                i === idx
                  ? 'ring-2 ring-brand-primary'
                  : 'ring-black/10 hover:ring-brand-primary/60'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              {i === idx && (
                <span className="absolute inset-0 bg-brand-primary/10" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
