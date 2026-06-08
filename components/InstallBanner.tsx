'use client';

import { useEffect, useState } from 'react';
import { X, Share, Plus } from 'lucide-react';

/* ── Detectores ── */
function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}
function isAndroid() {
  return /android/i.test(navigator.userAgent);
}
function isInStandaloneMode() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator && (window.navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallBanner() {
  const [platform,    setPlatform]    = useState<'ios' | 'android' | null>(null);
  const [deferredPrompt, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSTip,  setShowIOSTip]  = useState(false);
  const [dismissed,   setDismissed]   = useState(false);
  const [installed,   setInstalled]   = useState(false);

  useEffect(() => {
    // No mostrar si ya está instalado o en SSR
    if (typeof window === 'undefined') return;
    if (isInStandaloneMode()) { setInstalled(true); return; }
    if (sessionStorage.getItem('install_dismissed')) { setDismissed(true); return; }

    if (isIOS()) setPlatform('ios');
    else if (isAndroid()) setPlatform('android');

    // Captura el evento de instalación de Android/Chrome.
    // Solo llamamos preventDefault() en Android, donde mostramos nuestro propio banner.
    // En otros contextos (desktop) dejamos que el navegador maneje el evento nativo.
    const handler = (e: Event) => {
      if (isAndroid()) e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function handleAndroid() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setDeferred(null);
  }

  function handleDismiss() {
    setDismissed(true);
    sessionStorage.setItem('install_dismissed', '1');
    window.dispatchEvent(new Event('install-banner-dismissed'));
  }

  // No mostrar si ya instalado o descartado
  if (installed || dismissed) return null;
  // Solo mostrar en mobile
  if (!platform) return null;

  return (
    <>
      {/* Banner flotante */}
      <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2">
        <div className="card p-4 shadow-xl ring-2 ring-brand-primary/20">

          {/* Header del banner */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-primary shadow">
              <svg viewBox="0 0 32 32" className="h-6 w-6" fill="white">
                <ellipse cx="7"  cy="11" rx="3" ry="4" />
                <ellipse cx="14" cy="6"  rx="3" ry="4" />
                <ellipse cx="22" cy="6"  rx="3" ry="4" />
                <ellipse cx="29" cy="11" rx="3" ry="4" />
                <path d="M18 14c-6 0-10 5-10 9 0 4 4 6 10 6s10-2 10-6c0-4-9-9-10-9z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-display font-black text-sm text-ink">Instalá Vecindog gratis</p>
              <p className="text-xs text-ink-muted">Agregala a tu pantalla de inicio</p>
            </div>
            <button onClick={handleDismiss} className="rounded-lg p-1 text-ink-muted hover:text-ink">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Dos botones: Android e iOS */}
          <div className="grid grid-cols-2 gap-2">
            {/* Android */}
            <button
              onClick={platform === 'android' && deferredPrompt ? handleAndroid : () => setShowIOSTip(false)}
              disabled={platform === 'android' && !deferredPrompt}
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition
                ${platform === 'android'
                  ? 'bg-[#3ddc84] text-[#1a1a1a] hover:opacity-90'
                  : 'bg-brand-cream text-ink-muted cursor-default'}`}
            >
              {/* Android logo */}
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor">
                <path d="M17.523 15.341a.98.98 0 0 1-.97-.97.98.98 0 0 1 .97-.97.98.98 0 0 1 .97.97.98.98 0 0 1-.97.97m-11.046 0a.98.98 0 0 1-.97-.97.98.98 0 0 1 .97-.97.98.98 0 0 1 .97.97.98.98 0 0 1-.97.97M17.65 9.5 19.2 6.77a.35.35 0 1 0-.607-.35l-1.57 2.76A10.17 10.17 0 0 0 12 8.1a10.17 10.17 0 0 0-5.023 1.08L5.407 6.42a.35.35 0 1 0-.607.35L6.35 9.5C3.73 11.01 2 13.76 2 16.9h20c0-3.14-1.73-5.89-4.35-7.4"/>
              </svg>
              Android
              {platform === 'android' && <span className="text-[10px] opacity-70">← Tuyo</span>}
            </button>

            {/* iOS */}
            <button
              onClick={platform === 'ios' ? () => setShowIOSTip(true) : undefined}
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition
                ${platform === 'ios'
                  ? 'bg-[#1c1c1e] text-white hover:opacity-90'
                  : 'bg-brand-cream text-ink-muted cursor-default'}`}
            >
              {/* Apple logo */}
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              iPhone
              {platform === 'ios' && <span className="text-[10px] opacity-70">← Tuyo</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Modal iOS con instrucciones */}
      {showIOSTip && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowIOSTip(false)} />
          <div className="relative rounded-t-3xl bg-white p-6 pb-10 shadow-2xl">
            <button
              onClick={() => setShowIOSTip(false)}
              className="absolute right-4 top-4 rounded-xl p-1.5 text-ink-muted hover:bg-brand-cream"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary">
                <svg viewBox="0 0 32 32" className="h-7 w-7" fill="white">
                  <ellipse cx="7"  cy="11" rx="3" ry="4" />
                  <ellipse cx="14" cy="6"  rx="3" ry="4" />
                  <ellipse cx="22" cy="6"  rx="3" ry="4" />
                  <ellipse cx="29" cy="11" rx="3" ry="4" />
                  <path d="M18 14c-6 0-10 5-10 9 0 4 4 6 10 6s10-2 10-6c0-4-9-9-10-9z" />
                </svg>
              </div>
              <div>
                <p className="font-display text-lg font-black text-ink">Instalá Vecindog</p>
                <p className="text-xs text-ink-muted">En 3 pasos desde Safari</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-black text-white">1</span>
                <div>
                  <p className="font-bold text-sm text-ink flex items-center gap-1.5">
                    Tocá el ícono Compartir
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#007AFF] text-white">
                      <Share className="h-3.5 w-3.5" />
                    </span>
                  </p>
                  <p className="text-xs text-ink-muted mt-0.5">Está en la barra de abajo de Safari, en el centro.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-black text-white">2</span>
                <div>
                  <p className="font-bold text-sm text-ink flex items-center gap-1.5">
                    Tocá "Agregar a pantalla de inicio"
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-brand-cream">
                      <Plus className="h-3.5 w-3.5 text-ink" />
                    </span>
                  </p>
                  <p className="text-xs text-ink-muted mt-0.5">Deslizá hacia abajo en el menú de Safari hasta encontrarlo.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-black text-white">3</span>
                <div>
                  <p className="font-bold text-sm text-ink">Tocá "Agregar" arriba a la derecha</p>
                  <p className="text-xs text-ink-muted mt-0.5">¡Listo! Vecindog queda en tu pantalla de inicio 🐾</p>
                </div>
              </div>
            </div>

            {/* Flecha apuntando abajo (hacia el botón de Safari) */}
            <div className="mt-6 text-center">
              <p className="text-xs font-semibold text-brand-primary animate-bounce">
                ↓ El botón Compartir está abajo en Safari ↓
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
