'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export interface OnboardingSlide {
  emoji: string;
  titulo: string;
  descripcion: string;
}

interface Props {
  storageKey: string;
  slides: OnboardingSlide[];
}

export default function OnboardingModal({ storageKey, slides }: Props) {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const visto = localStorage.getItem(storageKey);
    if (!visto) setVisible(true);
  }, [storageKey]);

  function cerrar() {
    localStorage.setItem(storageKey, '1');
    setVisible(false);
  }

  function siguiente() {
    if (current < slides.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      cerrar();
    }
  }

  if (!visible) return null;

  const slide = slides[current];
  const esUltimo = current === slides.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 sm:items-center px-4 pb-4 sm:pb-0">
      <div className="w-full max-w-sm rounded-[28px] bg-white shadow-2xl overflow-hidden">

        {/* Barra superior con omitir */}
        <div className="flex items-center justify-between px-5 pt-5 pb-1">
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-6 bg-brand-primary'
                    : i < current
                    ? 'w-2 bg-brand-primary/40'
                    : 'w-2 bg-black/10'
                }`}
              />
            ))}
          </div>
          <button
            onClick={cerrar}
            className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold text-ink-muted hover:bg-black/5 transition"
          >
            Omitir <X className="h-3 w-3" />
          </button>
        </div>

        {/* Contenido */}
        <div className="px-6 py-6 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-primary/10 text-4xl">
            {slide.emoji}
          </div>
          <h2 className="font-display text-xl font-black text-ink leading-tight mb-2">
            {slide.titulo}
          </h2>
          <p className="text-sm text-ink-muted leading-relaxed">
            {slide.descripcion}
          </p>
        </div>

        {/* Botones */}
        <div className="px-6 pb-6 flex gap-3">
          {current > 0 && (
            <button
              onClick={() => setCurrent((c) => c - 1)}
              className="flex-1 rounded-2xl border-2 border-black/10 py-3 text-sm font-bold text-ink-muted"
            >
              Atrás
            </button>
          )}
          <button
            onClick={siguiente}
            className="flex-1 rounded-2xl bg-brand-primary py-3 text-sm font-bold text-white"
          >
            {esUltimo ? '¡Entendido!' : 'Siguiente →'}
          </button>
        </div>

      </div>
    </div>
  );
}
