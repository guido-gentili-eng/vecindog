'use client';

import { MapPin, MessageCircle, Ban, Heart, Users2, BadgeCheck, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type IconType = React.ComponentType<{ className?: string }>;

export default function TrustSection() {
  const { t } = useLanguage();

  const ITEMS: { icon: IconType; titulo: string; texto: string }[] = [
    { icon: MapPin,        titulo: t.trust1Title, texto: t.trust1Text },
    { icon: MessageCircle, titulo: t.trust2Title, texto: t.trust2Text },
    { icon: Ban,           titulo: t.trust3Title, texto: t.trust3Text },
    { icon: Heart,         titulo: t.trust4Title, texto: t.trust4Text },
    { icon: Users2,        titulo: t.trust5Title, texto: t.trust5Text },
    { icon: BadgeCheck,    titulo: t.trust6Title, texto: t.trust6Text },
  ];

  return (
    <section className="relative overflow-hidden rounded-[28px] bg-white p-6 shadow-soft ring-1 ring-black/5 md:p-10">
      <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-brand-primary/5" />
      <div className="pointer-events-none absolute -bottom-16 -left-12 h-56 w-56 rounded-full bg-good/5" />

      <div className="relative">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-brand-primary/10 text-brand-primary">
            <Shield className="h-5 w-5" />
          </span>
          <h2 className="font-display text-xl font-extrabold text-ink md:text-2xl">{t.trustTitle}</h2>
        </div>
        <p className="mt-1 text-sm text-ink-muted">{t.trustSub}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((it) => (
            <div key={it.titulo} className="flex items-start gap-3 rounded-2xl bg-brand-cream/70 p-4 transition hover:bg-brand-cream">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-brand-primary shadow-sm">
                <it.icon className="h-5 w-5" />
              </div>
              <div className="leading-snug">
                <p className="text-sm font-extrabold text-ink">{it.titulo}</p>
                <p className="mt-0.5 text-xs text-ink-muted">{it.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
