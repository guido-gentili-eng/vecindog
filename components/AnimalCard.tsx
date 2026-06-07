'use client';

import Link from 'next/link';
import { MapPin, Calendar, ArrowRight, ImageIcon, Images, Heart, Clock } from 'lucide-react';
import type { Animal } from '@/lib/mockData';
import { useLanguage } from '@/contexts/LanguageContext';

const COLOR_CATEGORIA: Record<Animal['categoria'], string> = {
  perdido:             'bg-lost text-white',
  encontrado:          'bg-found text-white',
  adopcion:            'bg-adopt text-[#5b3a0e]',
  transito:            'bg-[#7c3aed] text-white',
  busco_cuidador:      'bg-teal-600 text-white',
  cuidador_disponible: 'bg-teal-800 text-white',
};

function diasRestantes(fecha: string): number {
  const ms = new Date(fecha).getTime();
  if (isNaN(ms)) return 0;
  return Math.ceil((ms - Date.now()) / (1000 * 60 * 60 * 24));
}

export default function AnimalCard({ animal }: { animal: Animal }) {
  const { t } = useLanguage();
  const principal = animal.imagenes?.[0];
  const cantidadFotos = animal.imagenes?.length ?? 0;

  const CAT_LABELS: Record<Animal['categoria'], string> = {
    perdido:             t.catPerdido,
    encontrado:          t.catEncontrado,
    adopcion:            t.catAdopcion,
    transito:            t.catTransito,
    busco_cuidador:      t.catBuscoCuidador,
    cuidador_disponible: t.catCuidadorDisponible,
  };

  return (
    <Link
      href={`/publicaciones/${animal.id}`}
      className="group flex flex-col overflow-hidden rounded-[24px] bg-white shadow-soft ring-1 ring-black/5 transition duration-200 hover:-translate-y-1 hover:shadow-card"
    >
      <div className="relative aspect-[5/4] w-full overflow-hidden bg-brand-cream">
        {principal ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={principal}
            alt={animal.nombre ?? t.cardNoName}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
          />
        ) : (
          <PlaceholderFoto label={t.cardNoPhoto} />
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/30 to-transparent" />

        <span className="absolute left-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-brand-primary text-white shadow-md">
          <PawSvg className="h-3.5 w-3.5" />
        </span>

        <span className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-white/95 text-brand-primary shadow-md ring-1 ring-black/5">
          <Heart className="h-3.5 w-3.5" />
        </span>

        <span className={`absolute bottom-3 left-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold shadow-md ${COLOR_CATEGORIA[animal.categoria]}`}>
          {CAT_LABELS[animal.categoria]}
        </span>

        {cantidadFotos > 1 && (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
            <Images className="h-3.5 w-3.5" /> {cantidadFotos}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-extrabold leading-tight text-ink">
          {animal.nombre ?? t.cardNoName}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-sm text-ink-muted">{animal.descripcion}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-brand-primary" />
            <span className="font-bold text-ink">{animal.zona}</span>
            {animal.ciudad && <span className="text-ink-muted">· {animal.ciudad}</span>}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> {animal.fecha}
          </span>
          {animal.horario && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {animal.horario}
            </span>
          )}
        </div>

        {animal.categoria === 'transito' && animal.situacion_transito === 'tengo' && animal.fecha_limite_transito && (() => {
          const dias = diasRestantes(animal.fecha_limite_transito);
          const color = dias <= 2 ? 'bg-bad/10 text-bad' : dias <= 6 ? 'bg-warn/15 text-[#7a4f00]' : 'bg-good/10 text-good';
          const label = dias < 0
            ? t.cardExpired
            : dias === 0 ? t.cardLastDay
            : dias === 1 ? t.cardOneDayLeft
            : t.cardDaysLeft.replace('{n}', String(dias));
          return (
            <span className={`mt-2 inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${color}`}>
              <Clock className="h-3 w-3" /> {label}
            </span>
          );
        })()}

        {animal.categoria === 'transito' && animal.situacion_transito === 'calle' && (
          <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-[#7c3aed]/10 px-2.5 py-1 text-xs font-bold text-[#7c3aed]">
            📍 {t.cardStreetSighting}
          </span>
        )}

        {animal.recompensa ? (
          <p className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-brand-primary/10 px-2.5 py-1 text-xs font-bold text-brand-primary">
            {t.cardRewardPrefix}{animal.recompensa.toLocaleString('es-AR')}
          </p>
        ) : null}

        <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-3">
          <span className="text-xs font-semibold text-ink-muted">{t.cardTapInfo}</span>
          <span className="inline-flex items-center gap-1 text-sm font-extrabold text-brand-primary transition group-hover:gap-2">
            {t.cardSeePost} <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function PlaceholderFoto({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-brand-cream text-ink-muted">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-sm">
        <ImageIcon className="h-7 w-7 text-brand-primary/60" />
      </div>
      <p className="mt-2 text-xs">{label}</p>
    </div>
  );
}

function PawSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <ellipse cx="7" cy="11" rx="3" ry="4" />
      <ellipse cx="14" cy="6" rx="3" ry="4" />
      <ellipse cx="22" cy="6" rx="3" ry="4" />
      <ellipse cx="29" cy="11" rx="3" ry="4" />
      <path d="M18 14c-6 0-10 5-10 9 0 4 4 6 10 6s10-2 10-6c0-4-4-9-10-9z" />
    </svg>
  );
}
