'use client';

import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[28px] shadow-soft ring-1 ring-black/10">
      <Image
        src="/hero.jpg"
        alt="Persona abrazando a su perro"
        fill
        priority
        className="object-cover object-center"
        sizes="(max-width: 768px) 100vw, 900px"
      />
      <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-black/15 to-transparent" />

      <div className="relative px-6 py-6 text-right md:px-10 md:py-8 flex flex-col items-end justify-center min-h-[260px] md:min-h-[320px]">
        <h1 className="font-display font-bold tracking-tight text-white/90 text-2xl md:text-[41pt]" style={{ lineHeight: '1.15' }} >
          <span className="block">Buscá.</span>
          <span className="block">Encontrá.</span>
          <span className="block">Adoptá.</span>
        </h1>
      </div>
    </section>
  );
}
