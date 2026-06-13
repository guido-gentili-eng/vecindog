'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Megaphone, Star, ExternalLink, ArrowRight } from 'lucide-react';
import { getAdForSlot, type Ad, type AdVariant } from '@/lib/ads';
import { useLanguage } from '@/contexts/LanguageContext';
import { CONTACT_EMAIL, WHATSAPP_PUBLICIDAD } from '@/lib/contact';

interface AdSlotProps {
  variant?: AdVariant;
  className?: string;
}

export default function AdSlot({ variant = 'leaderboard', className = '' }: AdSlotProps) {
  const [ad, setAd] = useState<Ad | null | 'loading'>('loading');

  useEffect(() => {
    getAdForSlot(variant).then(setAd).catch(() => setAd(null));
  }, [variant]);

  if (ad === 'loading') return null;

  if (variant === 'leaderboard') return <LeaderboardAd ad={ad} className={className} />;
  if (variant === 'card')        return <CardAd ad={ad} className={className} />;
  return <SidebarAd ad={ad} className={className} />;
}

/* ── Badge ── */
function AdBadge({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-block rounded-full bg-black/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-current opacity-60 ${className}`}>
      Publicidad
    </span>
  );
}

/* ── LEADERBOARD ── */
function LeaderboardAd({ ad, className }: { ad: Ad | null; className: string }) {
  const { t } = useLanguage();
  if (ad) {
    return (
      <a href={ad.href} target="_blank" rel="noopener noreferrer sponsored"
        className={`group relative flex items-center gap-4 overflow-hidden rounded-2xl bg-white p-4 shadow-soft ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-card sm:p-5 ${className}`}>
        <AdBadge className="absolute right-3 top-2" />
        {(ad.imagen_logo_url ?? ad.imagen_url) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={(ad.imagen_logo_url ?? ad.imagen_url)!} alt={ad.titulo} className="h-14 w-14 rounded-xl object-cover" />
        ) : (
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-brand-primary/10 text-brand-primary">
            <Star className="h-7 w-7" />
          </span>
        )}
        <div className="flex-1 min-w-0">
          {ad.anunciante && <p className="text-xs font-semibold text-ink-muted">{ad.anunciante}</p>}
          <p className="font-display text-lg font-black text-ink">{ad.titulo}</p>
          {ad.subtitulo && <p className="mt-0.5 truncate text-sm text-ink-muted">{ad.subtitulo}</p>}
        </div>
        <span className="shrink-0 inline-flex items-center gap-1.5 rounded-2xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white">
          {ad.cta ?? 'Ver más'} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </span>
      </a>
    );
  }
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c1c1e] to-[#2c2018] p-5 text-white shadow-soft sm:p-6 ${className}`}>
      <AdBadge className="absolute right-4 top-3 text-white/50" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/10">
          <Megaphone className="h-7 w-7 text-brand-coral" />
        </span>
        <div className="flex-1">
          <p className="font-display text-lg font-black leading-tight sm:text-xl">{t.adBannerTitle}</p>
          <p className="mt-0.5 text-sm text-white/70">{t.adBannerSub}</p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <Link href="/publicitate"
            className="inline-flex items-center gap-1.5 rounded-2xl bg-brand-coral px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-coral-dark">
            <Megaphone className="h-4 w-4" /> {t.adBannerCta}
          </Link>
          <a href={WHATSAPP_PUBLICIDAD} target="_blank" rel="noopener noreferrer"
            className="text-xs text-white/50 hover:text-white/80 transition">WhatsApp</a>
        </div>
      </div>
    </div>
  );
}

/* ── CARD ── */
function CardAd({ ad, className }: { ad: Ad | null; className: string }) {
  if (ad) {
    return (
      <a href={ad.href} target="_blank" rel="noopener noreferrer sponsored"
        className={`group card flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-card ${className}`}>
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-cream">
          <AdBadge className="absolute right-2 top-2 z-10" />
          {ad.imagen_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={ad.imagen_url} alt={ad.titulo} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Star className="h-12 w-12 text-brand-primary/30" />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          {ad.anunciante && <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">{ad.anunciante}</p>}
          <p className="mt-1 font-display text-lg font-black text-ink">{ad.titulo}</p>
          {ad.subtitulo && <p className="mt-1 flex-1 text-sm text-ink-muted">{ad.subtitulo}</p>}
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-brand-primary">
            {ad.cta ?? 'Ver más'} <ExternalLink className="h-3.5 w-3.5" />
          </span>
        </div>
      </a>
    );
  }
  return (
    <div className={`card flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-brand-cream to-[#f5e8d4] p-6 text-center ${className}`} style={{ minHeight: '220px' }}>
      <AdBadge />
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-primary/10">
        <Megaphone className="h-7 w-7 text-brand-primary" />
      </span>
      <div>
        <p className="font-display text-base font-black text-ink">Tu negocio aquí</p>
        <p className="mt-1 text-xs text-ink-muted">Veterinarias, petshops, peluquerías caninas y más.</p>
      </div>
      <Link href="/publicitate"
        className="mt-1 inline-flex items-center gap-1 rounded-full bg-brand-primary px-4 py-1.5 text-xs font-bold text-white transition hover:bg-brand-coral-dark">
        Consultanos
      </Link>
    </div>
  );
}

/* ── SIDEBAR ── */
function SidebarAd({ ad, className }: { ad: Ad | null; className: string }) {
  if (ad) {
    return (
      <a href={ad.href} target="_blank" rel="noopener noreferrer sponsored"
        className={`group card flex items-center gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-card ${className}`}>
        <AdBadge className="sr-only" />
        {(ad.imagen_logo_url ?? ad.imagen_url) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={(ad.imagen_logo_url ?? ad.imagen_url)!} alt={ad.titulo} className="h-12 w-12 rounded-xl object-cover" />
        ) : (
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-primary/10">
            <Star className="h-6 w-6 text-brand-primary" />
          </span>
        )}
        <div className="flex-1 min-w-0">
          {ad.anunciante && <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">{ad.anunciante}</p>}
          <p className="font-bold text-sm text-ink leading-tight">{ad.titulo}</p>
          {ad.subtitulo && <p className="mt-0.5 truncate text-xs text-ink-muted">{ad.subtitulo}</p>}
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-ink-muted transition group-hover:text-brand-primary group-hover:translate-x-0.5" />
      </a>
    );
  }
  return (
    <div className={`card overflow-hidden p-0 ${className}`}>
      <div className="flex items-center gap-2 bg-gradient-to-r from-brand-primary to-brand-coral px-4 py-3">
        <Megaphone className="h-4 w-4 shrink-0 text-white/90" />
        <p className="text-sm font-bold text-white">Espacio publicitario</p>
        <AdBadge className="ml-auto text-white/60" />
      </div>
      <div className="p-5 text-center">
        <p className="font-display text-base font-black text-ink">Tu negocio aquí</p>
        <p className="mt-1 text-xs text-ink-muted leading-relaxed">Mostrá tu veterinaria, petshop o servicio a quienes ya están buscando ayuda para sus mascotas.</p>
        <Link href="/publicitate"
          className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-2xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-coral-dark">
          <Megaphone className="h-4 w-4" /> Publicitate
        </Link>
        <p className="mt-2 text-[10px] text-ink-muted">{CONTACT_EMAIL}</p>
      </div>
    </div>
  );
}
