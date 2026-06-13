import type { Metadata } from 'next';
import Link from 'next/link';
import { Smartphone, Apple, Share2, PlusSquare, Chrome, MoreVertical, Check, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Descargá Vecindog | Instalá la app en tu celular',
  description: 'Instalá Vecindog en tu iPhone o Android en segundos. Sin App Store, directo desde el navegador.',
};

const STEPS_IOS = [
  {
    icon: '🌐',
    title: 'Abrí Safari',
    desc: 'Entrá a https://mivecindog.com.ar desde Safari (no Chrome). En iPhone, Safari es el navegador por defecto.',
  },
  {
    icon: '⬆️',
    title: 'Tocá el botón Compartir',
    desc: 'Es el ícono de la cajita con la flechita hacia arriba, en la barra de abajo del navegador.',
  },
  {
    icon: '➕',
    title: 'Elegí "Agregar a pantalla de inicio"',
    desc: 'Deslizá hacia abajo en el menú hasta encontrar esa opción y tocala.',
  },
  {
    icon: '✅',
    title: 'Tocá "Agregar"',
    desc: '¡Listo! Vecindog aparece en tu pantalla de inicio con su ícono propio.',
  },
];

const STEPS_ANDROID = [
  {
    icon: '🌐',
    title: 'Abrí Chrome',
    desc: 'Entrá a mivecindog.com.ar desde Google Chrome en tu celular Android.',
  },
  {
    icon: '⋮',
    title: 'Tocá los 3 puntos',
    desc: 'En la esquina superior derecha de Chrome aparecen tres puntitos verticales. Tocalos.',
  },
  {
    icon: '➕',
    title: 'Elegí "Agregar a pantalla de inicio"',
    desc: 'Buscá esa opción en el menú y tocala. En algunos Android aparece un banner automático.',
  },
  {
    icon: '✅',
    title: 'Tocá "Agregar"',
    desc: '¡Listo! Vecindog queda en tu pantalla de inicio igual que cualquier otra app.',
  },
];

function StepCard({ icon, title, desc, num }: { icon: string; title: string; desc: string; num: number }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-primary/10 font-display text-lg font-black text-brand-primary">
        {num}
      </div>
      <div className="flex-1 pt-1">
        <p className="font-display text-base font-extrabold text-ink">
          <span className="mr-1.5">{icon}</span>{title}
        </p>
        <p className="mt-0.5 text-sm leading-relaxed text-ink-muted">{desc}</p>
      </div>
    </div>
  );
}

export default function DescargasPage() {
  return (
    <div className="py-10 md:py-14">

      <Link href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm font-bold text-brand-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> Volver
      </Link>

      {/* Hero */}
      <section className="mb-14 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary">
          <Smartphone className="h-3.5 w-3.5" /> App gratuita
        </span>
        <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-ink md:text-5xl">
          Instalá Vecindog<br className="hidden sm:block" /> en tu celular
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-ink-muted">
          Sin pasar por el App Store ni el Play Store. Directo desde el navegador, gratis, en menos de un minuto.
        </p>

        {/* Preview del ícono */}
        <div className="mt-8 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-[22px] bg-brand-primary shadow-xl">
            {/* Huella */}
            <svg viewBox="0 0 32 32" className="h-14 w-14" fill="white">
              <ellipse cx="7"  cy="11" rx="3" ry="4" />
              <ellipse cx="14" cy="6"  rx="3" ry="4" />
              <ellipse cx="22" cy="6"  rx="3" ry="4" />
              <ellipse cx="29" cy="11" rx="3" ry="4" />
              <path d="M18 14c-6 0-10 5-10 9 0 4 4 6 10 6s10-2 10-6c0-4-9-9-10-9z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Dos columnas: iOS y Android */}
      <section className="grid gap-8 md:grid-cols-2 md:gap-10">

        {/* iPhone */}
        <div className="card p-7">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#1c1c1e] text-white">
              <Apple className="h-6 w-6" />
            </span>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-ink-muted">Para</p>
              <h2 className="font-display text-xl font-black text-ink">iPhone</h2>
            </div>
          </div>

          <div className="space-y-5">
            {STEPS_IOS.map((s, i) => (
              <StepCard key={i} num={i + 1} {...s} />
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-brand-cream px-4 py-3 text-xs font-semibold text-ink-muted">
            💡 <strong>Importante:</strong> usá Safari, no Chrome. iOS solo permite instalar apps desde Safari.
          </div>
        </div>

        {/* Android */}
        <div className="card p-7">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#3ddc84] text-[#1c1c1e]">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                <path d="M17.523 15.341a.98.98 0 0 1-.97-.97.98.98 0 0 1 .97-.97.98.98 0 0 1 .97.97.98.98 0 0 1-.97.97m-11.046 0a.98.98 0 0 1-.97-.97.98.98 0 0 1 .97-.97.98.98 0 0 1 .97.97.98.98 0 0 1-.97.97M17.65 9.5 19.2 6.77a.35.35 0 1 0-.607-.35l-1.57 2.76A10.17 10.17 0 0 0 12 8.1a10.17 10.17 0 0 0-5.023 1.08L5.407 6.42a.35.35 0 1 0-.607.35L6.35 9.5C3.73 11.01 2 13.76 2 16.9h20c0-3.14-1.73-5.89-4.35-7.4"/>
              </svg>
            </span>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-ink-muted">Para</p>
              <h2 className="font-display text-xl font-black text-ink">Android</h2>
            </div>
          </div>

          <div className="space-y-5">
            {STEPS_ANDROID.map((s, i) => (
              <StepCard key={i} num={i + 1} {...s} />
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-brand-cream px-4 py-3 text-xs font-semibold text-ink-muted">
            💡 <strong>Tip:</strong> Chrome suele mostrar automáticamente un banner para instalar. Prestá atención al abrirla.
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-14 text-center">
        <div className="card mx-auto max-w-md p-8">
          <Check className="mx-auto h-10 w-10 text-good" />
          <h3 className="mt-3 font-display text-xl font-black text-ink">Ya está todo listo</h3>
          <p className="mt-2 text-sm text-ink-muted">
            La app funciona igual que una app nativa. Abrís, cerrás, recibís notificaciones — sin ocupar espacio del App Store.
          </p>
          <a
            href="https://mivecindog.com.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-5 justify-center w-full"
          >
            Ir a mivecindog.com.ar
          </a>
        </div>
      </section>

    </div>
  );
}
