'use client';

import { useState, useMemo } from 'react';
import { MapPin, Search, ChevronRight, PenLine, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { buscarCiudades } from '@/lib/ciudades';

export default function CityModal() {
  const { hasChosen, hasCity, setCiudad, loading, isAuthenticated } = useAuth();
  const [query,      setQuery]      = useState('');
  const [custom,     setCustom]     = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const hasQuery   = query.trim().length > 0;
  const resultados = useMemo(
    () => (hasQuery ? buscarCiudades(query) : []),
    [query, hasQuery]
  );

  if (loading || isAuthenticated || !hasChosen || hasCity) return null;

  function confirmar(nombre: string) {
    if (!nombre.trim()) return;
    setCiudad(nombre.trim());
  }

  function limpiar() {
    setQuery('');
    setShowCustom(false);
    setCustom('');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="w-full max-w-md rounded-t-[32px] bg-white pb-8 pt-7 shadow-2xl sm:rounded-[32px]">

        {/* Pill (mobile) */}
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-black/10 sm:hidden" />

        {/* Header */}
        <div className="mb-5 px-7 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
            <MapPin className="h-7 w-7" />
          </span>
          <h1 className="mt-3 font-display text-2xl font-black text-ink">
            ¿En qué ciudad estás?
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Vas a ver los avisos y negocios de tu ciudad.
          </p>
        </div>

        {/* Buscador */}
        <div className="relative mx-7">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Escribí tu ciudad o provincia…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowCustom(false); setCustom(''); }}
            className="field w-full pl-10 pr-10"
            autoFocus
          />
          {hasQuery && (
            <button
              type="button"
              onClick={limpiar}
              aria-label="Limpiar búsqueda"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-ink-muted transition hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Resultados — solo aparecen al escribir */}
        {hasQuery && !showCustom && (
          <div className="mt-2 max-h-64 overflow-y-auto px-3">
            {resultados.length === 0 ? (
              <div className="py-5 text-center">
                <p className="text-sm text-ink-muted">
                  No encontramos <strong className="text-ink">"{query}"</strong>
                </p>
                <button
                  type="button"
                  onClick={() => setShowCustom(true)}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-2xl bg-brand-primary/10 px-4 py-2 text-sm font-bold text-brand-primary transition hover:bg-brand-primary/20"
                >
                  <PenLine className="h-4 w-4" /> Usar "{query.trim()}" igual
                </button>
              </div>
            ) : (
              <>
                <ul className="space-y-0.5">
                  {resultados.map((c) => (
                    <li key={c.nombre}>
                      <button
                        type="button"
                        onClick={() => confirmar(c.nombre)}
                        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition hover:bg-brand-cream"
                      >
                        <MapPin className="h-4 w-4 shrink-0 text-brand-primary/60" />
                        <div className="min-w-0 flex-1">
                          <span className="block font-bold text-ink">{c.nombre}</span>
                          <span className="block text-xs text-ink-muted">{c.provincia}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-ink-muted/40" />
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Opción manual al final de la lista */}
                <button
                  type="button"
                  onClick={() => setShowCustom(true)}
                  className="mb-1 mt-1 flex w-full items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold text-ink-muted transition hover:bg-brand-cream hover:text-ink"
                >
                  <PenLine className="h-4 w-4" />
                  Mi ciudad no está en la lista
                </button>
              </>
            )}
          </div>
        )}

        {/* Input ciudad personalizada */}
        {showCustom && (
          <div className="mt-3 px-7">
            <p className="mb-3 text-sm font-semibold text-ink-muted">
              Ingresá el nombre de tu ciudad:
            </p>
            <input
              type="text"
              placeholder="Ej: Villa Regina"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && confirmar(custom)}
              className="field w-full"
              autoFocus
            />
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setShowCustom(false)}
                className="flex-1 rounded-2xl border-2 border-black/10 py-3 text-sm font-bold text-ink-muted transition hover:border-brand-primary hover:text-brand-primary"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={() => confirmar(custom)}
                disabled={!custom.trim()}
                className="flex-1 rounded-2xl bg-brand-primary py-3 text-sm font-bold text-white transition hover:bg-brand-primary-dark disabled:opacity-40"
              >
                Confirmar
              </button>
            </div>
          </div>
        )}

        {/* Estado vacío — sin query */}
        {!hasQuery && !showCustom && (
          <p className="mt-4 px-7 text-center text-xs text-ink-muted/60">
            Escribí al menos una letra para ver sugerencias
          </p>
        )}

      </div>
    </div>
  );
}
