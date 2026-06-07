'use client';

import Link from 'next/link';
import { Search, MapPin, Home, ArrowRight, Footprints, HandHeart, Car } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

function PawPrintBg({ className = '' }: { className?: string }) {
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

export default function ActionCards() {
  const { t } = useLanguage();

  const ACCIONES = [
    {
      href: '/publicar?cat=perdido',
      icon: Search,
      titulo: t.accionBuscando,
      texto: t.accionBuscandoText,
      chip: t.chipPerdidos,
      bg: 'bg-brand-coral-bright', text: 'text-white', iconBg: 'bg-white/22', accent: 'bg-brand-coral-dark',
    },
    {
      href: '/publicar?cat=encontrado',
      icon: MapPin,
      titulo: t.accionViPerdido,
      texto: t.accionViPerdidoText,
      chip: t.chipTarda1Min,
      bg: 'bg-brand-sage', text: 'text-white', iconBg: 'bg-white/22', accent: 'bg-brand-sage-dark',
    },
    {
      href: '/publicar?cat=adopcion',
      icon: Home,
      titulo: t.accionDoyAdopcion,
      texto: t.accionDoyAdopcionText,
      chip: t.chipComunidadCuidada,
      bg: 'bg-brand-coral', text: 'text-white', iconBg: 'bg-white/22', accent: 'bg-brand-coral-dark',
    },
    {
      href: '/publicar?cat=transito',
      icon: Footprints,
      titulo: t.accionTransito,
      texto: t.accionTransitoText,
      chip: t.chipComunidad,
      bg: 'bg-[#5b21b6]', text: 'text-white', iconBg: 'bg-white/22', accent: 'bg-[#4c1d95]',
    },
  ];

  return (
    <section aria-label="Acciones principales">
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
        {ACCIONES.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className={`group relative flex overflow-hidden rounded-[22px] shadow-soft ring-1 ring-black/5 transition duration-200 hover:-translate-y-0.5 hover:shadow-card active:scale-[0.99] ${a.bg} ${a.text}`}
          >
            <div className={`w-1.5 shrink-0 ${a.accent}`} />
            <div className="relative flex flex-1 items-start gap-3 p-4 sm:gap-4 sm:p-5">
              <PawPrintBg className="pointer-events-none absolute -bottom-3 -right-3 h-20 w-20 rotate-12 opacity-15" />
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl shadow-inner backdrop-blur-sm sm:h-14 sm:w-14">
                <span className={`grid h-full w-full place-items-center rounded-2xl ${a.iconBg}`}>
                  <a.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                </span>
              </div>
              <div className="flex-1">
                {a.chip && (
                  <span className="inline-flex items-center rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm">
                    {a.chip}
                  </span>
                )}
                <h3 className="mt-1 font-display text-lg font-extrabold leading-tight sm:text-xl">{a.titulo}</h3>
                <p className="mt-0.5 text-xs leading-snug opacity-90 sm:text-sm">{a.texto}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold opacity-80 transition group-hover:gap-2 group-hover:opacity-100">
                  {t.accionEmpezar} <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-3 sm:mt-4 grid gap-3 sm:gap-4 sm:grid-cols-2">
        <a
          href="/cuidado"
          className="group relative flex overflow-hidden rounded-[22px] bg-teal-600 text-white shadow-soft ring-1 ring-black/5 transition duration-200 hover:-translate-y-0.5 hover:shadow-card active:scale-[0.99]"
        >
          <div className="w-1.5 shrink-0 bg-teal-800" />
          <div className="relative flex flex-1 items-start gap-4 p-4 sm:p-5">
            <PawPrintBg className="pointer-events-none absolute -bottom-3 -right-3 h-20 w-20 rotate-12 opacity-15" />
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl shadow-inner backdrop-blur-sm sm:h-14 sm:w-14">
              <span className="grid h-full w-full place-items-center rounded-2xl bg-white/22">
                <HandHeart className="h-6 w-6 sm:h-7 sm:w-7" />
              </span>
            </div>
            <div>
              <span className="inline-flex items-center rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm">
                {t.accionNuevo}
              </span>
              <h3 className="mt-1 font-display text-lg font-extrabold leading-tight sm:text-xl">{t.accionCuidado}</h3>
              <p className="mt-0.5 text-xs leading-snug opacity-90 sm:text-sm">{t.accionCuidadoText}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold opacity-80 transition group-hover:gap-2 group-hover:opacity-100">
                {t.accionEmpezar} <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </a>

        <a
          href="/transporte"
          className="group relative flex overflow-hidden rounded-[22px] bg-blue-600 text-white shadow-soft ring-1 ring-black/5 transition duration-200 hover:-translate-y-0.5 hover:shadow-card active:scale-[0.99]"
        >
          <div className="w-1.5 shrink-0 bg-blue-800" />
          <div className="relative flex flex-1 items-start gap-4 p-4 sm:p-5">
            <PawPrintBg className="pointer-events-none absolute -bottom-3 -right-3 h-20 w-20 rotate-12 opacity-15" />
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl shadow-inner backdrop-blur-sm sm:h-14 sm:w-14">
              <span className="grid h-full w-full place-items-center rounded-2xl bg-white/22">
                <Car className="h-6 w-6 sm:h-7 sm:w-7" />
              </span>
            </div>
            <div>
              <span className="inline-flex items-center rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm">
                {t.accionNuevo}
              </span>
              <h3 className="mt-1 font-display text-lg font-extrabold leading-tight sm:text-xl">{t.accionTransporte}</h3>
              <p className="mt-0.5 text-xs leading-snug opacity-90 sm:text-sm">{t.accionTransporteText}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold opacity-80 transition group-hover:gap-2 group-hover:opacity-100">
                {t.accionEmpezar} <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}
