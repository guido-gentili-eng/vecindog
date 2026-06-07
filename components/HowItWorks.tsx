'use client';

import Link from 'next/link';
import { Camera, Users2, MessageCircle, Heart, ArrowRight, Calculator } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type IconType = React.ComponentType<{ className?: string }>;

export default function HowItWorks() {
  const { t } = useLanguage();

  const PASOS: { n: number; icon: IconType; titulo: string; texto: string }[] = [
    { n: 1, icon: Camera,        titulo: t.howStep1Title, texto: t.howStep1Text },
    { n: 2, icon: Users2,        titulo: t.howStep2Title, texto: t.howStep2Text },
    { n: 3, icon: MessageCircle, titulo: t.howStep3Title, texto: t.howStep3Text },
    { n: 4, icon: Heart,         titulo: t.howStep4Title, texto: t.howStep4Text },
  ];

  return (
    <section>
      <header className="mb-8 text-center md:mb-10">
        <span className="inline-flex items-center rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary">
          {t.how4Steps}
        </span>
        <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-ink md:text-4xl">
          {t.howTitle}
        </h2>
        <p className="mt-2 text-ink-muted">{t.howSub}</p>
      </header>

      <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PASOS.map((p, i) => (
          <div key={p.n} className="group relative">
            <div className="card relative h-full p-6 pt-9 transition hover:-translate-y-0.5 hover:shadow-card">
              <div className="absolute -top-4 left-6 grid h-10 w-10 place-items-center rounded-2xl bg-brand-primary font-black text-white shadow-soft ring-4 ring-brand-cream">
                {p.n}
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-cream text-brand-primary">
                <p.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-extrabold text-ink">{p.titulo}</h3>
              <p className="mt-1 text-sm text-ink-muted">{p.texto}</p>
            </div>
            {i < PASOS.length - 1 && (
              <ArrowRight
                aria-hidden="true"
                className="pointer-events-none absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-brand-primary/40 lg:block"
              />
            )}
          </div>
        ))}
      </div>

      <Link
        href="/calculadora-edad"
        className="mt-8 flex flex-col items-center gap-3 rounded-2xl bg-gradient-to-br from-brand-cream to-brand-cream-soft p-6 ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-card group text-center"
      >
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-primary/10 text-brand-primary">
          <Calculator className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-display text-base font-extrabold text-ink">{t.calcTitle}</h3>
          <p className="mt-0.5 text-sm text-ink-muted">{t.calcSub}</p>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary group-hover:underline">
          {t.calcCta} <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </span>
      </Link>
    </section>
  );
}
