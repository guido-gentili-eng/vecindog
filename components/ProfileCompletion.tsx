'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, X, ChevronRight } from 'lucide-react';
import type { Perro } from '@/lib/perros';
import type { Vacuna } from '@/lib/perros';
import type { Estudio } from '@/lib/estudios';
import type { Peso } from '@/lib/pesos';
import type { ContactoEmergencia } from '@/lib/contactos-emergencia';

interface Props {
  perro: Perro;
  vacunas: Vacuna[];
  estudios: Estudio[];
  pesos: Peso[];
  contactos: ContactoEmergencia[];
}

interface CheckItem {
  key: string;
  label: string;
  done: boolean;
  opcional?: boolean;
  skipKey?: string;
}

function buildChecklist(
  perro: Perro,
  vacunas: Vacuna[],
  estudios: Estudio[],
  pesos: Peso[],
  contactos: ContactoEmergencia[],
  skipped: Set<string>,
): CheckItem[] {
  return [
    { key: 'foto',      label: 'Foto de perfil',             done: !!perro.foto_url },
    { key: 'raza',      label: 'Raza',                       done: !!perro.raza },
    { key: 'color',     label: 'Color',                      done: !!perro.color },
    { key: 'fecha_nac', label: 'Fecha de nacimiento',        done: !!perro.fecha_nac },
    { key: 'chip',      label: 'Número de chip',             done: !!perro.chip },
    { key: 'vet',       label: 'Datos del veterinario',      done: !!(perro.vet_nombre || perro.vet_telefono) },
    { key: 'vacunas',   label: 'Vacunas registradas',        done: vacunas.length > 0 },
    { key: 'peso',      label: 'Peso registrado',            done: pesos.length > 0 },
    { key: 'contacto',  label: 'Contacto de emergencia',     done: contactos.length > 0 },
    {
      key: 'laboratorio',
      label: 'Análisis de sangre',
      done: estudios.some((e) => e.tipo === 'laboratorio') || skipped.has('laboratorio'),
      opcional: true,
      skipKey: 'laboratorio',
    },
  ];
}

export default function ProfileCompletion({ perro, vacunas, estudios, pesos, contactos }: Props) {
  const storageKey   = `perfil_completion_seen_${perro.id}`;
  const skipPrefix   = `perro_skip_`;
  const [visible,    setVisible]  = useState(false);
  const [skipped,    setSkipped]  = useState<Set<string>>(new Set());
  const [dismissed,  setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seenThisSession = sessionStorage.getItem(storageKey);
    if (seenThisSession) return;

    const savedSkips = new Set<string>(
      ['laboratorio'].filter((k) => localStorage.getItem(`${skipPrefix}${k}_${perro.id}`) === '1')
    );
    setSkipped(savedSkips);

    const items = buildChecklist(perro, vacunas, estudios, pesos, contactos, savedSkips);
    const allDone = items.every((i) => i.done);
    if (!allDone) setVisible(true);
  }, [perro.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function dismiss() {
    sessionStorage.setItem(storageKey, '1');
    setVisible(false);
    setDismissed(true);
  }

  function skipItem(skipKey: string) {
    localStorage.setItem(`${skipPrefix}${skipKey}_${perro.id}`, '1');
    setSkipped((prev) => new Set([...prev, skipKey]));
  }

  const items = buildChecklist(perro, vacunas, estudios, pesos, contactos, skipped);
  const done  = items.filter((i) => i.done).length;
  const total = items.length;
  const pct   = Math.round((done / total) * 100);
  const allDone = done === total;

  /* Progress bar shown inline in the profile header area */
  if (!visible && dismissed) return null;

  /* Compact badge shown after dismissal — always visible */
  if (!visible) {
    if (allDone) {
      return (
        <div className="mb-5 flex items-center gap-2 rounded-2xl bg-good/10 px-4 py-3">
          <CheckCircle2 className="h-5 w-5 text-good shrink-0" />
          <p className="text-sm font-bold text-good">Perfil completo 🎉</p>
        </div>
      );
    }
    return (
      <button
        onClick={() => setVisible(true)}
        className="mb-5 flex w-full items-center gap-3 rounded-2xl border border-brand-primary/20 bg-brand-primary/5 px-4 py-3 text-left transition hover:bg-brand-primary/10"
      >
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold text-ink">Completar perfil</p>
            <span className="text-xs font-bold text-brand-primary">{pct}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-black/10">
            <div className="h-1.5 rounded-full bg-brand-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-ink-muted" />
      </button>
    );
  }

  /* Full modal */
  const pending = items.filter((i) => !i.done);

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/50 sm:items-center px-4 pb-4 sm:pb-0">
      <div className="w-full max-w-sm rounded-[28px] bg-white shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <p className="font-display text-lg font-black text-ink">
              {allDone ? 'Perfil completo 🎉' : `Completá el perfil de ${perro.nombre}`}
            </p>
            <p className="text-xs text-ink-muted mt-0.5">{done} de {total} secciones completas</p>
          </div>
          <button onClick={dismiss} className="rounded-full p-1.5 text-ink-muted hover:bg-black/5 transition">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-5 pb-3">
          <div className="h-2 w-full rounded-full bg-black/10">
            <div className="h-2 rounded-full bg-brand-primary transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Items */}
        <div className="px-5 pb-5 space-y-2 max-h-[60vh] overflow-y-auto">
          {allDone ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <span className="text-5xl">🐕</span>
              <p className="text-sm text-ink-muted leading-relaxed">
                ¡Excelente! Completaste todos los datos de {perro.nombre}. Tu perfil está al 100%.
              </p>
            </div>
          ) : (
            <>
              {pending.map((item) => (
                <div key={item.key} className="flex items-center gap-3 rounded-2xl bg-black/4 px-3 py-2.5">
                  <div className="h-5 w-5 shrink-0 rounded-full border-2 border-black/20" />
                  <p className="flex-1 text-sm font-semibold text-ink">{item.label}</p>
                  {item.opcional && item.skipKey && !skipped.has(item.skipKey) && (
                    <button
                      onClick={() => skipItem(item.skipKey!)}
                      className="shrink-0 rounded-xl border border-black/10 px-2.5 py-1 text-[11px] font-bold text-ink-muted hover:bg-black/5 transition whitespace-nowrap"
                    >
                      No tengo
                    </button>
                  )}
                </div>
              ))}
              {items.filter((i) => i.done).map((item) => (
                <div key={item.key} className="flex items-center gap-3 rounded-2xl px-3 py-2 opacity-50">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-good" />
                  <p className="flex-1 text-sm font-semibold text-ink line-through">{item.label}</p>
                </div>
              ))}
            </>
          )}
        </div>

        {/* CTA */}
        <div className="px-5 pb-5">
          <button
            onClick={dismiss}
            className="w-full rounded-2xl bg-brand-primary py-3 text-sm font-bold text-white"
          >
            {allDone ? '¡Genial!' : 'Entendido, voy a completarlo'}
          </button>
        </div>

      </div>
    </div>
  );
}
