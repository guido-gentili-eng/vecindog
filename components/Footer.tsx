'use client';

import Link from 'next/link';
import { BrandBadge } from '@/components/Logo';
import { Heart, Megaphone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  const LINKS = {
    app: [
      { href: '/',                label: t.footerLinkInicio },
      { href: '/publicaciones',   label: t.footerLinkAvisos },
      { href: '/publicar',        label: t.footerLinkPublicar },
      { href: '/buscar-por-foto', label: t.footerLinkBuscarFoto },
    ],
    comunidad: [
      { href: '/publicaciones?cat=perdido',    label: t.footerLinkPerdidos },
      { href: '/publicaciones?cat=encontrado', label: t.footerLinkVistos },
      { href: '/publicaciones?cat=adopcion',   label: t.footerLinkAdopcion },
      { href: '/publicaciones?cat=transito',   label: t.footerLinkTransito },
    ],
  };

  return (
    <footer className="mt-16 border-t border-black/5 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:grid-cols-2 md:grid-cols-5">
        {/* Brand */}
        <div className="sm:col-span-2">
          <BrandBadge size="md" highlight />
          <p className="mt-3 max-w-xs text-sm text-ink-muted">{t.footerSub}</p>
          <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted">
            <Heart className="h-3.5 w-3.5 text-brand-primary fill-current" /> {t.footerAvailableIn}
          </p>
        </div>

        {/* Links App */}
        <div>
          <h3 className="font-display text-sm font-extrabold uppercase tracking-wide text-ink">
            {t.footerAppSection}
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {LINKS.app.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-ink-muted hover:text-brand-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Links Comunidad */}
        <div>
          <h3 className="font-display text-sm font-extrabold uppercase tracking-wide text-ink">
            {t.footerComunidadSection}
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {LINKS.comunidad.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-ink-muted hover:text-brand-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Links Negocios */}
        <div>
          <h3 className="font-display text-sm font-extrabold uppercase tracking-wide text-ink">
            {t.footerNegociosSection}
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                href="/publicitate"
                className="inline-flex items-center gap-1.5 font-bold text-brand-primary hover:underline"
              >
                <Megaphone className="h-3.5 w-3.5" /> Publicitate
              </Link>
            </li>
            <li>
              <a href="mailto:hola@mivecindog.com.ar" className="text-ink-muted hover:text-brand-primary">
                hola@mivecindog.com.ar
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-black/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-ink-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Vecindog · Buscá. Encontrá. Adoptá.</p>
          <div className="flex items-center gap-4">
            <Link href="/terminos" className="hover:text-brand-primary transition">{t.footerTerms}</Link>
            <Link href="/privacidad" className="hover:text-brand-primary transition">{t.footerPrivacy}</Link>
            <p>{t.footerMadeWith}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
