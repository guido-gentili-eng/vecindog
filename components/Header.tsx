'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Plus, Menu, X, LogOut, User, Megaphone, MapPin, Dog, Map, ChevronDown } from 'lucide-react';
import { BrandBadge } from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage, type Lang } from '@/contexts/LanguageContext';
import { nombreCorto } from '@/lib/ciudades';
import NotificationsBell from '@/components/NotificationsBell';

const LANGS: { lang: Lang; flag: string; label: string }[] = [
  { lang: 'es', flag: '🇦🇷', label: 'ES' },
  { lang: 'en', flag: '🇺🇸', label: 'EN' },
  { lang: 'pt', flag: '🇧🇷', label: 'PT' },
];

const NAV = [
  { href: '/',              label: 'Inicio'  },
  { href: '/mapa',          label: 'Mapa',   icon: 'map' },
  { href: '/publicaciones', label: 'Avisos'  },
];

export default function Header() {
  const [open,     setOpen]     = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { user, profile, isGuest, isAuthenticated, signOut, loading, ciudad, clearCiudad } = useAuth();
  const { lang, setLang } = useLanguage();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navConPerros = isAuthenticated
    ? [...NAV, { href: '/mis-perros', label: 'Mis perros' }]
    : NAV;

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="Ir al inicio de Vecindog">
          <BrandBadge size="md" highlight />
        </Link>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-1 md:flex">
          {navConPerros.map((item) => (
            <Link key={item.href} href={item.href} className="btn-ghost">
              {item.href === '/mis-perros'
                ? <span className="flex items-center gap-1"><Dog className="h-3.5 w-3.5" />{item.label}</span>
                : item.href === '/mapa'
                ? <span className="flex items-center gap-1"><Map className="h-3.5 w-3.5" />{item.label}</span>
                : item.label}
            </Link>
          ))}
          <Link
            href="/publicitate"
            className="inline-flex items-center gap-1 rounded-2xl px-3 py-1.5 text-sm font-bold text-brand-primary transition hover:bg-brand-primary/10"
          >
            <Megaphone className="h-3.5 w-3.5" /> Publicitate
          </Link>
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          {/* Ciudad (desktop) */}
          {ciudad && (
            <button
              type="button"
              onClick={clearCiudad}
              title="Cambiar ciudad"
              className="hidden items-center gap-1.5 rounded-2xl bg-brand-cream px-3 py-1.5 text-xs font-bold text-ink transition hover:bg-brand-primary/10 hover:text-brand-primary md:inline-flex"
            >
              <MapPin className="h-3.5 w-3.5 text-brand-primary" />
              {nombreCorto(ciudad)}
            </button>
          )}

          {/* Estado de autenticación + idioma (desktop) */}
          {!loading && (
            <div className="hidden items-center gap-2 md:flex">
              {isAuthenticated ? (
                <>
                  <span className="inline-flex items-center gap-1.5 rounded-2xl bg-brand-cream px-3 py-1.5 text-xs font-bold text-ink">
                    <User className="h-3.5 w-3.5 text-brand-primary" />
                    {profile ? `${profile.nombre} ${profile.apellido}` : user?.email?.split('@')[0]}
                  </span>
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="inline-flex items-center gap-1 rounded-2xl px-3 py-1.5 text-xs font-bold text-ink-muted transition hover:bg-brand-cream hover:text-bad"
                    aria-label="Cerrar sesión"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Salir
                  </button>
                </>
              ) : isGuest ? (
                <span className="inline-flex items-center gap-1 rounded-2xl bg-brand-cream px-3 py-1.5 text-xs font-semibold text-ink-muted">
                  Invitado
                </span>
              ) : null}

              {/* Selector de idioma — dropdown */}
              <div ref={langRef} className="relative">
                <button
                  type="button"
                  onClick={() => setLangOpen((o) => !o)}
                  className="flex items-center gap-1 rounded-2xl bg-brand-cream px-2.5 py-1.5 text-xs font-bold text-ink transition hover:bg-brand-primary/10"
                >
                  <span>{LANGS.find((l) => l.lang === lang)?.flag}</span>
                  <span>{LANGS.find((l) => l.lang === lang)?.label}</span>
                  <ChevronDown className={`h-3 w-3 text-ink-muted transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full mt-1 z-50 flex flex-col gap-0.5 rounded-2xl bg-white p-1 shadow-lg ring-1 ring-black/10">
                    {LANGS.filter((l) => l.lang !== lang).map(({ lang: l, flag, label }) => (
                      <button key={l} type="button"
                        onClick={() => { setLang(l); setLangOpen(false); }}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-ink-muted hover:bg-brand-cream hover:text-ink transition whitespace-nowrap"
                      >
                        <span>{flag}</span><span>{label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <NotificationsBell />

          <Link
            href="/publicar"
            className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-br from-brand-coral to-brand-coral-dark px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:from-brand-coral-dark hover:to-brand-coral-dark"
          >
            <Plus className="h-4 w-4" /> Publicar
          </Link>

          {/* Hamburger mobile */}
          <button
            type="button"
            aria-label="Abrir menú"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-2xl text-ink hover:bg-brand-cream md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Drawer mobile */}
      {open && (
        <div className="border-t border-black/5 bg-white md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {navConPerros.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-3 text-base font-semibold text-ink hover:bg-brand-cream"
              >
                {item.href === '/mis-perros' && <Dog className="h-4 w-4 text-brand-primary" />}
                {item.href === '/mapa'        && <Map className="h-4 w-4 text-brand-primary" />}
                {item.label}
              </Link>
            ))}
            <Link
              href="/publicitate"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-3 text-base font-bold text-brand-primary hover:bg-brand-primary/10"
            >
              <Megaphone className="h-4 w-4" /> Publicitate
            </Link>
            {/* Selector de idioma mobile */}
            <div className="mt-2 border-t border-black/5 pt-3 px-3">
              <p className="mb-2 text-xs font-bold text-ink-muted uppercase tracking-wide">Idioma / Language</p>
              <div className="flex gap-2">
                {LANGS.map(({ lang: l, flag, label }) => (
                  <button key={l} type="button" onClick={() => setLang(l)}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold transition ${
                      lang === l ? 'bg-brand-primary text-white' : 'bg-brand-cream text-ink-muted hover:text-ink'
                    }`}>
                    <span>{flag}</span><span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Auth en mobile */}
            {!loading && (
              <>
                {isAuthenticated && (
                  <>
                    <div className="mt-2 border-t border-black/5 pt-2">
                      <Link
                        href="/mi-perfil"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-3 text-base font-semibold text-ink hover:bg-brand-cream"
                      >
                        <User className="h-4 w-4 text-brand-primary" /> Mi perfil
                      </Link>
                      <button
                        type="button"
                        onClick={() => { signOut(); setOpen(false); }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-base font-semibold text-bad hover:bg-bad/5"
                      >
                        <LogOut className="h-4 w-4" /> Cerrar sesión
                      </button>
                    </div>
                  </>
                )}
                {isGuest && (
                  <div className="mt-2 border-t border-black/5 pt-2 px-3 py-2">
                    <p className="text-xs font-semibold text-ink-muted">Modo invitado · <Link href="/" className="text-brand-primary underline" onClick={() => setOpen(false)}>Crear cuenta</Link></p>
                  </div>
                )}
                {ciudad && (
                  <div className="mt-2 border-t border-black/5 pt-2">
                    <button
                      type="button"
                      onClick={() => { clearCiudad(); setOpen(false); }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-ink-muted hover:bg-brand-cream"
                    >
                      <MapPin className="h-4 w-4 text-brand-primary" />
                      {nombreCorto(ciudad)} · <span className="text-brand-primary">Cambiar ciudad</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
