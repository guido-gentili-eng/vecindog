'use client';

import Link from 'next/link';
import { Megaphone, Phone, Star, ExternalLink, ArrowRight } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────────
 * AdSlot — slot reutilizable para publicidad local
 *
 * Variantes:
 *  · "leaderboard" — banner horizontal full-width entre secciones
 *  · "card"        — misma altura que AnimalCard, en la grilla de avisos
 *  · "sidebar"     — compacto, en el panel lateral del detalle
 *
 * Con datos reales:
 *   <AdSlot variant="card" imagen="/logo.png" titulo="Petshop Vecindog"
 *           subtitulo="Todo para tu perro" cta="Ver local" href="https://..." />
 *
 * Sin datos → muestra el placeholder de "Tu negocio aquí".
 * ──────────────────────────────────────────────────────────────────────────── */

export type AdVariant = 'leaderboard' | 'card' | 'sidebar';

interface AdSlotProps {
  variant?: AdVariant;
  /** URL de imagen/logo del anunciante */
  imagen?: string;
  /** Nombre o título del negocio */
  titulo?: string;
  /** Tagline o descripción corta */
  subtitulo?: string;
  /** Texto del botón CTA */
  cta?: string;
  /** URL de destino del ad */
  href?: string;
  /** Nombre del anunciante para el label (ej: "Petshop Central") */
  anunciante?: string;
  className?: string;
}

const CONTACT_EMAIL = 'hola@mivecindog.com.ar';
const CONTACT_PHONE = '+54 9 291 000-0000';

export default function AdSlot({
  variant = 'leaderboard',
  imagen,
  titulo,
  subtitulo,
  cta,
  href,
  anunciante,
  className = '',
}: AdSlotProps) {
  const isReal = !!titulo;

  if (variant === 'leaderboard') {
    return (
      <LeaderboardAd
        isReal={isReal}
        imagen={imagen}
        titulo={titulo}
        subtitulo={subtitulo}
        cta={cta}
        href={href}
        anunciante={anunciante}
        className={className}
      />
    );
  }

  if (variant === 'card') {
    return (
      <CardAd
        isReal={isReal}
        imagen={imagen}
        titulo={titulo}
        subtitulo={subtitulo}
        cta={cta}
        href={href}
        anunciante={anunciante}
        className={className}
      />
    );
  }

  return (
    <SidebarAd
      isReal={isReal}
      imagen={imagen}
      titulo={titulo}
      subtitulo={subtitulo}
      cta={cta}
      href={href}
      anunciante={anunciante}
      className={className}
    />
  );
}

/* ── Badge "Publicidad" ──────────────────────────────────────────────────── */
function AdBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-block rounded-full bg-black/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-current opacity-60 ${className}`}
    >
      Publicidad
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
 * LEADERBOARD — banner horizontal full-width
 * ══════════════════════════════════════════════════════════════════════════ */
function LeaderboardAd({
  isReal, imagen, titulo, subtitulo, cta, href, anunciante, className
}: Omit<AdSlotProps, 'variant'> & { isReal: boolean }) {

  if (isReal && href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={`group relative flex items-center gap-4 overflow-hidden rounded-2xl bg-white p-4 shadow-soft ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-card sm:p-5 ${className}`}
      >
        <AdBadge className="absolute right-3 top-2" />
        {imagen ? (
          <img src={imagen} alt={titulo} className="h-14 w-14 rounded-xl object-cover" />
        ) : (
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-brand-primary/10 text-brand-primary">
            <Star className="h-7 w-7" />
          </span>
        )}
        <div className="flex-1 min-w-0">
          {anunciante && <p className="text-xs font-semibold text-ink-muted">{anunciante}</p>}
          <p className="font-display text-lg font-black text-ink">{titulo}</p>
          {subtitulo && <p className="mt-0.5 truncate text-sm text-ink-muted">{subtitulo}</p>}
        </div>
        <span className="shrink-0 inline-flex items-center gap-1.5 rounded-2xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white">
          {cta ?? 'Ver más'} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </span>
      </a>
    );
  }

  /* ── Placeholder ── */
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c1c1e] to-[#2c2018] p-5 text-white shadow-soft sm:p-6 ${className}`}
    >
      <AdBadge className="absolute right-4 top-3 text-white/50" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Ícono */}
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/10">
          <Megaphone className="h-7 w-7 text-brand-coral" />
        </span>

        {/* Texto */}
        <div className="flex-1">
          <p className="font-display text-lg font-black leading-tight sm:text-xl">
            ¿Tenés un negocio local para dueños de mascotas?
          </p>
          <p className="mt-0.5 text-sm text-white/70">
            Llegá a vecinos que ya están buscando productos y servicios para sus mascotas.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-2 sm:items-end">
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Quiero%20publicitar%20en%20Vecindog`}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-brand-coral px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-coral-dark"
          >
            <Megaphone className="h-4 w-4" /> Publicitate aquí
          </a>
          <span className="flex items-center gap-1 text-xs text-white/50">
            <Phone className="h-3 w-3" /> {CONTACT_PHONE}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
 * CARD — mismo tamaño que AnimalCard, en la grilla de avisos
 * ══════════════════════════════════════════════════════════════════════════ */
function CardAd({
  isReal, imagen, titulo, subtitulo, cta, href, anunciante, className
}: Omit<AdSlotProps, 'variant'> & { isReal: boolean }) {

  const Wrapper = isReal && href
    ? ({ children }: { children: React.ReactNode }) => (
        <a href={href} target="_blank" rel="noopener noreferrer sponsored"
           className={`group card flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-card ${className}`}>
          {children}
        </a>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <div className={`card flex flex-col overflow-hidden ${className}`}>
          {children}
        </div>
      );

  if (isReal) {
    return (
      <Wrapper>
        {/* Imagen o logo */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-cream">
          <AdBadge className="absolute right-2 top-2 z-10" />
          {imagen ? (
            <img src={imagen} alt={titulo} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Star className="h-12 w-12 text-brand-primary/30" />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          {anunciante && <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">{anunciante}</p>}
          <p className="mt-1 font-display text-lg font-black text-ink">{titulo}</p>
          {subtitulo && <p className="mt-1 flex-1 text-sm text-ink-muted">{subtitulo}</p>}
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-brand-primary">
            {cta ?? 'Ver más'} <ExternalLink className="h-3.5 w-3.5" />
          </span>
        </div>
      </Wrapper>
    );
  }

  /* ── Placeholder ── */
  return (
    <div
      className={`card flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-brand-cream to-[#f5e8d4] p-6 text-center ${className}`}
      style={{ minHeight: '220px' }}
    >
      <AdBadge />
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-primary/10">
        <Megaphone className="h-7 w-7 text-brand-primary" />
      </span>
      <div>
        <p className="font-display text-base font-black text-ink">Tu negocio aquí</p>
        <p className="mt-1 text-xs text-ink-muted">
          Veterinarias, petshops, peluquerías caninas y más.
        </p>
      </div>
      <a
        href={`mailto:${CONTACT_EMAIL}?subject=Quiero%20publicitar%20en%20Vecindog`}
        className="mt-1 inline-flex items-center gap-1 rounded-full bg-brand-primary px-4 py-1.5 text-xs font-bold text-white transition hover:bg-brand-coral-dark"
      >
        Consultanos
      </a>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
 * SIDEBAR — panel lateral compacto (detalle de aviso)
 * ══════════════════════════════════════════════════════════════════════════ */
function SidebarAd({
  isReal, imagen, titulo, subtitulo, cta, href, anunciante, className
}: Omit<AdSlotProps, 'variant'> & { isReal: boolean }) {

  if (isReal && href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={`group card flex items-center gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-card ${className}`}
      >
        <AdBadge className="sr-only" />
        {imagen ? (
          <img src={imagen} alt={titulo} className="h-12 w-12 rounded-xl object-cover" />
        ) : (
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-primary/10">
            <Star className="h-6 w-6 text-brand-primary" />
          </span>
        )}
        <div className="flex-1 min-w-0">
          {anunciante && <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">{anunciante}</p>}
          <p className="font-bold text-sm text-ink leading-tight">{titulo}</p>
          {subtitulo && <p className="mt-0.5 truncate text-xs text-ink-muted">{subtitulo}</p>}
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-ink-muted transition group-hover:text-brand-primary group-hover:translate-x-0.5" />
      </a>
    );
  }

  /* ── Placeholder ── */
  return (
    <div className={`card overflow-hidden p-0 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 bg-gradient-to-r from-brand-primary to-brand-coral px-4 py-3">
        <Megaphone className="h-4 w-4 shrink-0 text-white/90" />
        <p className="text-sm font-bold text-white">Espacio publicitario</p>
        <AdBadge className="ml-auto text-white/60" />
      </div>

      <div className="p-5 text-center">
        <p className="font-display text-base font-black text-ink">Tu negocio aquí</p>
        <p className="mt-1 text-xs text-ink-muted leading-relaxed">
          Mostrá tu veterinaria, petshop o servicio a quienes ya están buscando ayuda para sus mascotas.
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=Quiero%20publicitar%20en%20Vecindog`}
          className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-2xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-coral-dark"
        >
          <Megaphone className="h-4 w-4" /> Publicitate
        </a>
        <p className="mt-2 text-[10px] text-ink-muted">{CONTACT_EMAIL}</p>
      </div>
    </div>
  );
}
