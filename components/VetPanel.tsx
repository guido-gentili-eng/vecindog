'use client';

import { useEffect, useState } from 'react';
import { X, Phone, Globe, Clock, MapPin, Star, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getRatings, setRating, type Vet, type RatingResumen } from '@/lib/vetRatings';

/* ── Componente de estrellas ── */
function Estrellas({
  valor,
  interactivo,
  onSelect,
}: {
  valor: number;
  interactivo: boolean;
  onSelect?: (n: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const activo = hover || valor;

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!interactivo}
          onClick={() => onSelect?.(n)}
          onMouseEnter={() => interactivo && setHover(n)}
          onMouseLeave={() => interactivo && setHover(0)}
          className={`transition-transform ${interactivo ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
        >
          <Star
            className={`h-7 w-7 ${
              n <= activo
                ? 'fill-amber-400 text-amber-400'
                : 'fill-black/8 text-black/15'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}

/* ── Panel principal ── */
export default function VetPanel({
  vet,
  onClose,
}: {
  vet: Vet | null;
  onClose: () => void;
}) {
  const { isAuthenticated } = useAuth();
  const [resumen,  setResumen]  = useState<RatingResumen | null>(null);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [msgOk, setMsgOk] = useState(false);

  useEffect(() => {
    if (!vet) { setResumen(null); setMsgOk(false); return; }
    setCargando(true);
    getRatings(vet.id)
      .then(setResumen)
      .finally(() => setCargando(false));
  }, [vet]);

  async function handleRate(star: number) {
    if (!vet || !isAuthenticated) return;
    setGuardando(true);
    try {
      await setRating(vet.id, vet.nombre, star);
      const updated = await getRatings(vet.id);
      setResumen(updated);
      setMsgOk(true);
      setTimeout(() => setMsgOk(false), 2000);
    } finally {
      setGuardando(false);
    }
  }

  if (!vet) return null;

  const promedio = resumen?.promedio ?? 0;
  const total    = resumen?.total    ?? 0;
  const miRating = resumen?.miRating ?? 0;

  return (
    <>
      {/* Overlay semi-transparente (mobile) */}
      <div
        className="absolute inset-0 z-[1001] bg-black/20 sm:hidden"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute bottom-0 right-0 z-[1002] flex h-auto max-h-[90%] w-full flex-col overflow-y-auto rounded-t-[28px] bg-white shadow-2xl sm:bottom-auto sm:right-4 sm:top-4 sm:h-auto sm:max-h-[calc(100%-2rem)] sm:w-80 sm:rounded-[24px]">

        {/* Pill mobile */}
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-black/10 sm:hidden" />

        {/* Header */}
        <div className="flex items-start gap-3 p-5 pb-0">
          {/* Ícono vet */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="1" y="1" width="22" height="22" rx="5" fill="#0d9488"/>
              <rect x="10" y="5"  width="4" height="14" rx="1.5" fill="white"/>
              <rect x="5"  y="10" width="14" height="4"  rx="1.5" fill="white"/>
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-teal-600">Veterinaria</p>
            <h2 className="mt-0.5 font-display text-lg font-black leading-tight text-ink">
              {vet.nombre}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-xl p-1.5 text-ink-muted transition hover:bg-black/8"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Datos de contacto */}
        <div className="space-y-2 px-5 pt-4">
          {vet.direccion && (
            <div className="flex items-start gap-2 text-sm text-ink-muted">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" />
              <span>{vet.direccion}</span>
            </div>
          )}
          {vet.telefono && (
            <a
              href={`tel:${vet.telefono}`}
              className="flex items-center gap-2 text-sm font-semibold text-teal-600 hover:underline"
            >
              <Phone className="h-4 w-4 shrink-0" />
              {vet.telefono}
            </a>
          )}
          {vet.horario && (
            <div className="flex items-start gap-2 text-sm text-ink-muted">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" />
              <span>{vet.horario}</span>
            </div>
          )}
          {vet.website && (
            <a
              href={vet.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-teal-600 hover:underline"
            >
              <Globe className="h-4 w-4 shrink-0" />
              Sitio web
            </a>
          )}
        </div>

        {/* Divisor */}
        <div className="mx-5 my-4 border-t border-black/8" />

        {/* Calificaciones */}
        <div className="px-5 pb-6">
          <h3 className="mb-3 font-display text-sm font-extrabold uppercase tracking-wide text-ink">
            Calificación de vecinos
          </h3>

          {cargando ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-teal-500" />
            </div>
          ) : (
            <>
              {/* Promedio */}
              <div className="mb-4 flex items-center gap-3">
                <span className="font-display text-4xl font-black text-ink">
                  {total === 0 ? '—' : promedio.toFixed(1)}
                </span>
                <div>
                  <Estrellas valor={Math.round(promedio)} interactivo={false} />
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {total === 0
                      ? 'Sin calificaciones aún'
                      : `${total} calificación${total !== 1 ? 'es' : ''}`}
                  </p>
                </div>
              </div>

              {/* Calificar */}
              {isAuthenticated ? (
                <div className="rounded-2xl bg-teal-50 p-4">
                  <p className="mb-2 text-sm font-bold text-ink">
                    {miRating ? 'Tu calificación:' : '¿La conocés? Calificala:'}
                  </p>

                  {guardando ? (
                    <div className="flex items-center gap-2 py-1">
                      <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
                      <span className="text-sm text-teal-600 font-semibold">Guardando…</span>
                    </div>
                  ) : msgOk ? (
                    <p className="text-sm font-bold text-teal-600">
                      ✅ ¡Gracias por tu calificación!
                    </p>
                  ) : (
                    <Estrellas
                      valor={miRating}
                      interactivo
                      onSelect={handleRate}
                    />
                  )}

                  {miRating > 0 && !guardando && !msgOk && (
                    <p className="mt-1.5 text-[11px] text-ink-muted">
                      Hacé click en otra estrella para cambiarla
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl bg-black/5 p-4 text-center">
                  <p className="text-sm text-ink-muted">
                    <span className="font-bold text-ink">Iniciá sesión</span> para calificar esta veterinaria
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
