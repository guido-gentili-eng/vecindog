'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Plus, Menu, X, LogOut, User, Megaphone, MapPin, Dog, Map, ChevronDown, Download, LayoutDashboard, Store, Calculator } from 'lucide-react';
import { BrandBadge } from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage, type Lang } from '@/contexts/LanguageContext';
import { nombreCorto } from '@/lib/ciudades';
import NotificationsBell from '@/components/NotificationsBell';
import HowItWorksSheet from '@/components/HowItWorksSheet';

const LANGS: { lang: Lang; flag: string; label: string }[] = [
  { lang: 'es', flag: '🇦🇷', label: 'ES' },
  { lang: 'en', flag: '🇺🇸', label: 'EN' },
  { lang: 'pt', flag: '🇧🇷', label: 'PT' },
];

export default function Header() {
  const [open,        setOpen]        = useState(false);
  const [langOpen,    setLangOpen]    = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mapaSheet,   setMapaSheet]   = useState(false);
  const langRef    = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const { user, profile, isGuest, isAuthenticated, isPro, signOut, loading, ciudad, clearCiudad } = useAuth();
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current    && !langRef.current.contains(e.target as Node))    setLangOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const NAV_T = [
    { href: '/',              label: t.navInicio  },
    { href: '/mapa',          label: t.navMapa,   icon: 'map' },
    { href: '/publicaciones', label: t.navAvisos  },
  ];

  const navConPerros = isAuthenticated
    ? [...NAV_T, { href: '/mis-perros', label: t.navMisPerros }]
    : NAV_T;

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-2">
        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="Ir al inicio de Vecindog">
          <BrandBadge size="md" highlight />
        </Link>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {navConPerros.map((item) =>
            item.href === '/mapa' ? (
              <Link key={item.href} href="/mapa" className="btn-ghost">
                <span className="flex items-center gap-1"><Map className="h-3.5 w-3.5" />{item.label}</span>
              </Link>
            ) : (
              <Link key={item.href} href={item.href} className="btn-ghost">
                {item.href === '/mis-perros'
                  ? <span className="flex items-center gap-1"><Dog className="h-3.5 w-3.5" />{item.label}</span>
                  : item.label}
              </Link>
            )
          )}
          <Link
            href="/publicitate"
            className="inline-flex items-center gap-1 rounded-2xl px-3 py-1.5 text-sm font-bold text-brand-primary transition hover:bg-brand-primary/10"
          >
            <Megaphone className="h-3.5 w-3.5" /> {t.navPublicitate}
          </Link>
          <Link
            href="/red-vecindog"
            className="inline-flex items-center gap-1 rounded-2xl px-3 py-1.5 text-sm font-bold text-amber-600 transition hover:bg-amber-50"
          >
            <Store className="h-3.5 w-3.5" /> {t.navRedVecindog}
          </Link>
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-1.5">
          {/* Ciudad (desktop) */}
          {ciudad && (
            <button
              type="button"
              onClick={clearCiudad}
              title="Cambiar ciudad"
              className="hidden items-center gap-1 rounded-2xl bg-brand-cream px-2.5 py-1.5 text-xs font-bold text-ink transition hover:bg-brand-primary/10 hover:text-brand-primary lg:inline-flex"
            >
              <MapPin className="h-3.5 w-3.5 text-brand-primary" />
              {nombreCorto(ciudad)}
            </button>
          )}

          {/* Desktop: idioma + campanita + perfil/publicar */}
          {!loading && (
            <div className="hidden items-center gap-1.5 lg:flex">

              {/* Selector de idioma — dropdown */}
              <div ref={langRef} className="relative">
                <button type="button" onClick={() => setLangOpen((o) => !o)}
                  className="flex items-center gap-1 rounded-2xl bg-brand-cream px-2.5 py-1.5 text-xs font-bold text-ink transition hover:bg-brand-primary/10 h-[30px]">
                  <span>{LANGS.find((l) => l.lang === lang)?.flag}</span>
                  <span>{LANGS.find((l) => l.lang === lang)?.label}</span>
                  <ChevronDown className={`h-3 w-3 text-ink-muted transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full mt-1 z-50 flex flex-col gap-0.5 rounded-2xl bg-white p-1 shadow-lg ring-1 ring-black/10">
                    {LANGS.filter((l) => l.lang !== lang).map(({ lang: l, flag, label }) => (
                      <button key={l} type="button"
                        onClick={() => { setLang(l); setLangOpen(false); }}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-ink-muted hover:bg-brand-cream hover:text-ink transition whitespace-nowrap">
                        <span>{flag}</span><span>{label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/descargas"
                title="Descargar app"
                className="grid h-[30px] w-[30px] place-items-center rounded-2xl bg-brand-cream text-ink-muted transition hover:bg-brand-primary/10 hover:text-brand-primary"
              >
                <Download className="h-3.5 w-3.5" />
              </Link>

              {isAuthenticated && <NotificationsBell />}

              {isAuthenticated ? (
                /* Dropdown Mi perfil */
                <div ref={profileRef} className="relative">
                  <button type="button" onClick={() => setProfileOpen((o) => !o)}
                    className="inline-flex items-center gap-1 rounded-2xl bg-gradient-to-br from-brand-coral to-brand-coral-dark px-2.5 py-1.5 text-xs font-bold text-white shadow-soft transition hover:from-brand-coral-dark hover:to-brand-coral-dark h-[30px]">
                    <User className="h-4 w-4" /> {t.navMiPerfil}
                    <ChevronDown className={`h-3 w-3 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-1 z-50 w-52 flex flex-col gap-0.5 rounded-2xl bg-white p-1.5 shadow-lg ring-1 ring-black/10">
                      <Link href="/mi-perfil" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink hover:bg-brand-cream transition">
                        <User className="h-4 w-4 text-brand-primary" /> {t.navEnterPerfil}
                      </Link>
                      <Link href="/planes" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink hover:bg-brand-cream transition">
                        <Megaphone className="h-4 w-4 text-brand-primary" />
                        {isPro ? t.navMiPlanPro : t.navPlanes}
                      </Link>
                      <Link href="/mi-comercio" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink hover:bg-brand-cream transition">
                        <Store className="h-4 w-4 text-amber-600" /> {t.navMiComercio}
                      </Link>
                      <button type="button" onClick={() => { clearCiudad(); setProfileOpen(false); }}
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink hover:bg-brand-cream transition w-full text-left">
                        <MapPin className="h-4 w-4 text-brand-primary" /> {t.navCambiarUbicacion}
                      </button>
                      {user?.email === (process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? '') && (
                        <>
                          <div className="my-1 border-t border-black/5" />
                          <Link href="/admin" onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink hover:bg-brand-cream transition">
                            <LayoutDashboard className="h-4 w-4 text-brand-primary" /> {t.navPanelAdmin}
                          </Link>
                        </>
                      )}
                      <div className="my-1 border-t border-black/5" />
                      <button type="button" onClick={() => { signOut(); setProfileOpen(false); }}
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-bad hover:bg-bad/5 transition">
                        <LogOut className="h-4 w-4" /> {t.navCerrarSesion}
                      </button>
                    </div>
                  )}
                </div>
              ) : isGuest ? (
                <div className="flex items-center gap-1.5">
                  <span className="rounded-2xl bg-brand-cream px-3 py-1.5 text-xs font-semibold text-ink-muted">
                    {t.navInvitado}
                  </span>
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="inline-flex items-center gap-1 rounded-2xl border border-black/10 bg-white px-3 py-1.5 text-xs font-bold text-ink transition hover:border-brand-primary hover:text-brand-primary"
                  >
                    <LogOut className="h-3.5 w-3.5" /> {t.navSalir}
                  </button>
                </div>
              ) : (
                <Link href="/publicar"
                  className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-br from-brand-coral to-brand-coral-dark px-3 py-1.5 text-sm font-bold text-white shadow-soft transition hover:from-brand-coral-dark hover:to-brand-coral-dark">
                  <Plus className="h-4 w-4" /> {t.navPublicar}
                </Link>
              )}
            </div>
          )}

          {/* Hamburger mobile */}
          <button
            type="button"
            aria-label="Abrir menú"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-2xl text-ink hover:bg-brand-cream lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Drawer mobile */}
      {open && (
        <div className="border-t border-black/5 bg-white lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {navConPerros.map((item) =>
              item.href === '/mapa' ? (
                <Link
                  key={item.href}
                  href="/mapa"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-3 text-base font-semibold text-ink hover:bg-brand-cream"
                >
                  <Map className="h-4 w-4 text-brand-primary" />
                  {item.label}
                </Link>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-3 text-base font-semibold text-ink hover:bg-brand-cream"
                >
                  {item.href === '/mis-perros' && <Dog className="h-4 w-4 text-brand-primary" />}
                  {item.label}
                </Link>
              )
            )}
            <Link
              href="/publicitate"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-3 text-base font-bold text-brand-primary hover:bg-brand-primary/10"
            >
              <Megaphone className="h-4 w-4" /> {t.navPublicitate}
            </Link>
            <Link
              href="/red-vecindog"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-3 text-base font-bold text-amber-600 hover:bg-amber-50"
            >
              <Store className="h-4 w-4" /> {t.navRedVecindog}
            </Link>
            <Link
              href="/descargas"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-3 text-base font-bold text-brand-primary hover:bg-brand-primary/10"
            >
              <Download className="h-4 w-4" /> {t.navDescargas}
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
                  <div className="mt-2 border-t border-black/5 pt-2">
                    <Link href="/mi-perfil" onClick={() => setOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-3 text-base font-semibold text-ink hover:bg-brand-cream">
                      <User className="h-4 w-4 text-brand-primary" /> {t.navEnterPerfil}
                    </Link>
                    <Link href="/mi-comercio" onClick={() => setOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-3 text-base font-semibold text-ink hover:bg-brand-cream">
                      <Store className="h-4 w-4 text-amber-600" /> {t.navMiComercio}
                    </Link>
                    <button type="button" onClick={() => { signOut(); setOpen(false); }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-base font-semibold text-bad hover:bg-bad/5">
                      <LogOut className="h-4 w-4" /> {t.navCerrarSesion}
                    </button>
                  </div>
                )}
                {isGuest && (
                  <div className="mt-2 border-t border-black/5 pt-2">
                    <p className="px-3 py-1 text-xs font-semibold text-ink-muted">{t.navModoInvitado}</p>
                    <button
                      type="button"
                      onClick={() => { signOut(); setOpen(false); }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-base font-semibold text-bad hover:bg-bad/5 transition"
                    >
                      <LogOut className="h-4 w-4" /> {t.navSalirCrearCuenta}
                    </button>
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
                      {nombreCorto(ciudad)} · <span className="text-brand-primary">{t.navCambiarCiudad}</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </nav>
        </div>
      )}
      {mapaSheet && (
        <HowItWorksSheet featureKey="mapa" onClose={() => setMapaSheet(false)} />
      )}
    </header>
  );
}
