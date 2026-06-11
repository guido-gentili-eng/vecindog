'use client';

import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { nombreCorto } from '@/lib/ciudades';

export default function Hero() {
  const { ciudad } = useAuth();
  const { t } = useLanguage();
  const cityLabel = ciudad ? nombreCorto(ciudad) : 'Argentina';

  return (
    <section className="relative overflow-hidden rounded-[28px] shadow-soft ring-1 ring-black/10">
      {/* Foto de fondo */}
      <Image
        src="/hero.jpg"
        alt="Persona abrazando a su perro"
        fill
        priority
        className="object-cover object-center"
        style={{ transform: 'scaleX(-1)' }}
        sizes="(max-width: 768px) 100vw, 900px"
      />
      {/* Overlay oscuro para legibilidad del texto */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/35 to-black/10" />

      {/* Contenido */}
      <div className="relative px-6 py-8 text-right md:px-10 md:py-12 flex flex-col items-end">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white shadow-sm ring-1 ring-white/30 backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          {t.heroChip} · {cityLabel}
        </span>

        <h1 className="mt-3 font-display text-3xl font-black leading-[1.05] tracking-tight text-white md:text-5xl">
          {t.heroTitle}{' '}
          <span className="text-[#ff6b6b]">{t.heroTitleAccent}</span>
        </h1>

        <p className="mt-2 max-w-sm text-sm text-white/85 md:text-base">
          {t.heroSub}{' '}
          <strong className="font-bold text-white">{t.heroSubBold}</strong>.
        </p>
      </div>
    </section>
  );
}
