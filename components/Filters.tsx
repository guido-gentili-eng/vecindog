'use client';

import { Search, X, SlidersHorizontal, User } from 'lucide-react';
import type { Especie, FiltroCategoria } from '@/lib/mockData';
import { useLanguage } from '@/contexts/LanguageContext';

export interface FiltrosState {
  categoria: FiltroCategoria;
  especie:   Especie | 'todas';
  zona:      string;
  soloMios:  boolean;
}

export const FILTROS_INICIALES: FiltrosState = {
  categoria: 'todas',
  especie:   'todas',
  zona:      '',
  soloMios:  false,
};

export default function Filters({
  value,
  onChange,
  isAuthenticated = false,
}: {
  value: FiltrosState;
  onChange: (next: FiltrosState) => void;
  isAuthenticated?: boolean;
}) {
  const { t } = useLanguage();
  const hayFiltros = value.categoria !== 'todas' || value.zona !== '' || value.soloMios;

  return (
    <div className="card p-4 md:p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-primary/10 text-brand-primary">
          <SlidersHorizontal className="h-4 w-4" />
        </span>
        <h2 className="font-display text-sm font-extrabold uppercase tracking-wide text-ink">
          {t.filterTitle}
        </h2>
        {hayFiltros && (
          <button
            type="button"
            onClick={() => onChange(FILTROS_INICIALES)}
            className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline"
          >
            <X className="h-3.5 w-3.5" /> {t.filterClear}
          </button>
        )}
      </div>

      {isAuthenticated && (
        <div className="mb-3">
          <button
            type="button"
            onClick={() => onChange({ ...value, soloMios: !value.soloMios })}
            className={`inline-flex items-center gap-2 rounded-2xl border-2 px-4 py-2 text-sm font-bold transition ${
              value.soloMios
                ? 'border-brand-primary bg-brand-primary text-white'
                : 'border-brand-primary/30 text-brand-primary hover:bg-brand-primary/5'
            }`}
          >
            <User className="h-4 w-4" />
            {t.filterMyPosts}
          </button>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">
            {t.filterType}
          </span>
          <select
            className="field"
            value={value.categoria}
            onChange={(e) => onChange({ ...value, categoria: e.target.value as FiltrosState['categoria'] })}
          >
            <option value="todas">{t.filterAll}</option>
            <option value="buscar">{t.filterLostAndFound}</option>
            <option value="perdido">{t.filterLost}</option>
            <option value="encontrado">{t.filterFound}</option>
            <option value="adopcion">{t.filterAdoption}</option>
            <option value="transito">{t.filterTransit}</option>
            <option value="busco_cuidador">{t.filterCaretaker}</option>
            <option value="cuidador_disponible">{t.filterCaretakerAvail}</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">
            {t.filterZone}
          </span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              className="field pl-9"
              placeholder={t.filterZonePlaceholder}
              value={value.zona}
              onChange={(e) => onChange({ ...value, zona: e.target.value })}
            />
          </div>
        </label>
      </div>
    </div>
  );
}
