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
            <li>
              <p className="mb-1.5 text-xs text-ink-muted">WhatsApp</p>
              <a
                href="https://wa.me/5492914050210?text=Hola%2C%20quiero%20publicitar%20mi%20negocio%20en%20Vecindog"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-3 py-2 text-xs font-bold text-white transition hover:opacity-90"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Escribir por WhatsApp
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
