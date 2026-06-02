'use client';

import { Search, X, SlidersHorizontal } from 'lucide-react';
import type { Especie, FiltroCategoria } from '@/lib/mockData';

export interface FiltrosState {
  categoria: FiltroCategoria;
  especie:   Especie | 'todas';
  zona:      string;
}

export const FILTROS_INICIALES: FiltrosState = {
  categoria: 'todas',
  especie:   'todas',
  zona:      ''
};

/**
 * Filtros del listado. En esta versión solo hay perros, por eso el selector
 * de especie está oculto (queda en el state pero no se renderiza).
 */
export default function Filters({
  value,
  onChange
}: {
  value: FiltrosState;
  onChange: (next: FiltrosState) => void;
}) {
  const hayFiltros =
    value.categoria !== 'todas' || value.zona !== '';

  return (
    <div className="card p-4 md:p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-primary/10 text-brand-primary">
          <SlidersHorizontal className="h-4 w-4" />
        </span>
        <h2 className="font-display text-sm font-extrabold uppercase tracking-wide text-ink">
          Filtros
        </h2>
        {hayFiltros && (
          <button
            type="button"
            onClick={() => onChange(FILTROS_INICIALES)}
            className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline"
          >
            <X className="h-3.5 w-3.5" /> Limpiar
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">
            Tipo de aviso
          </span>
          <select
            className="field"
            value={value.categoria}
            onChange={(e) =>
              onChange({ ...value, categoria: e.target.value as FiltrosState['categoria'] })
            }
          >
            <option value="todas">Todos</option>
            <option value="buscar">Perdidos y vistos</option>
            <option value="perdido">Perdidos</option>
            <option value="encontrado">Vistos</option>
            <option value="adopcion">En adopción</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">
            Zona / barrio
          </span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              className="field pl-9"
              placeholder="Centro, Villa Mitre, Palihue…"
              value={value.zona}
              onChange={(e) => onChange({ ...value, zona: e.target.value })}
            />
          </div>
        </label>
      </div>
    </div>
  );
}
