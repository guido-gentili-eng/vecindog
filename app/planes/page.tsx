'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Check, X, Sparkles, Dog, Lock, AlertCircle, Loader2,
  Bell, Users, Camera, ScanSearch, Trophy, ArrowLeft, Car, Heart, MapPin,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import PagoModal from '@/components/PagoModal';
import { PRECIO_PRO_ARS } from '@/lib/planes';

/* ── Features ── */

/* ── Página ── */

export default function PlanesPage() {
  const { profile, isPro, isAuthenticated, refreshProfile } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  const FEATURES_FREE = [
    { icon: Dog,        label: t.plansFeat1Dog },
    { icon: Check,      label: t.plansFeat5Posts },
    { icon: Check,      label: t.plansFeatBasicProfile },
    { icon: Check,      label: t.plansFeatMapAccess },
  ];

  const FEATURES_BLOQUEADAS = [
    { icon: Trophy,     label: t.plansFeatTopEscapees },
    { icon: Camera,     label: t.plansFeatPhotoAI },
    { icon: ScanSearch, label: t.plansFeatAdvSearch },
    { icon: Users,      label: t.plansFeatFriends },
    { icon: Bell,       label: t.plansFeatNotifs },
    { icon: Lock,       label: t.plansFeatSocial },
    { icon: MapPin,     label: t.plansFeatBusinessMap },
    { icon: Car,        label: t.plansFeatTransport },
    { icon: Heart,      label: t.plansFeatCare },
  ];

  const FEATURES_PRO = [
    { label: t.plansProFeatAll },
    { label: t.plansProFeatUnlimitedDogs },
    { label: t.plansProFeatUnlimitedPosts },
    { label: t.plansProFeatFullProfile },
    { label: `${t.plansFeatTopEscapees} 🏃` },
    { label: `${t.plansFeatPhotoAI} 📷` },
    { label: t.plansFeatAdvSearch },
    { label: t.plansFeatFriends },
    { label: `${t.plansFeatNotifs} 🔔` },
    { label: t.plansFeatSocial },
    { label: t.plansProFeatNetwork },
    { label: `${t.plansFeatBusinessMap} 📍` },
    { label: `${t.plansFeatTransport} 🚗` },
    { label: `${t.plansFeatCare} 🐾` },
  ];

  const [modalOpen,    setModalOpen]    = useState(false);
  const [error,        setError]        = useState('');
  const [trialLoading, setTrialLoading] = useState(false);
  const [trialOk,      setTrialOk]      = useState(false);

  const trialUsado = profile?.plan_trial_usado ?? false;

  const vencimiento = profile?.plan_vencimiento
    ? new Date(profile.plan_vencimiento).toLocaleDateString('es-AR', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : null;

  /* Activa el primer mes gratis sin pasar por MercadoPago */
  async function handleTrialGratis() {
    if (!isAuthenticated) { router.push('/'); return; }
    setError('');
    setTrialLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) { setError('Iniciá sesión primero.'); return; }

      const res  = await fetch('/api/trial/pro', {
        method:  'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'No se pudo activar el trial.'); return; }

      await refreshProfile();
      setTrialOk(true);
    } finally {
      setTrialLoading(false);
    }
  }

  /* Redirige al Checkout Pro de Mercado Pago */
  async function handleMercadoPago() {
    if (!isAuthenticated) { router.push('/'); return; }
    setError('');
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) { setError('Iniciá sesión primero.'); return; }

    const res  = await fetch('/api/pago/pro', {
      method:  'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    const data = await res.json();

    if (!res.ok || !data.url) {
      setError(data.error ?? 'No se pudo iniciar el pago.');
      throw new Error(data.error);   // le avisa al modal para que deje de cargar
    }
    window.location.href = data.url;
  }

  function handleSuscribirse() {
    if (!isAuthenticated) { router.push('/'); return; }
    setError('');
    setModalOpen(true);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:py-14">

      {/* Volver */}
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-1 text-sm font-bold text-brand-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> {t.plansBack}
      </button>

      {/* Header */}
      <div className="mb-10 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary">
          <Sparkles className="h-3.5 w-3.5" /> {t.navPlanes}
        </span>
        <h1 className="mt-3 font-display text-4xl font-black tracking-tight text-ink md:text-5xl">
          {t.plansTitle}
        </h1>
        <p className="mt-2 text-base text-ink-muted">
          {t.plansSub}
        </p>
        {isPro && vencimiento && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-good/10 px-4 py-2 text-sm font-bold text-good ring-1 ring-good/20">
            <Check className="h-4 w-4" /> {t.plansActiveUntil} {vencimiento}
          </div>
        )}
        {error && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-bad/10 px-4 py-2 text-sm font-bold text-bad ring-1 ring-bad/20">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* ── Plan Gratis ── */}
        <div className="flex flex-col rounded-[24px] border-2 border-black/8 bg-white p-7">
          <div className="mb-1 text-xs font-bold uppercase tracking-widest text-ink-muted">Plan</div>
          <div className="font-display text-3xl font-black text-ink">{t.plansFreeLabel}</div>
          <div className="mt-1 text-2xl font-extrabold text-ink">{t.plansFreePrice}</div>
          <p className="mt-2 text-sm text-ink-muted">{t.plansFreeSub}</p>

          <div className="my-6 border-t border-black/6" />

          <ul className="flex-1 space-y-2.5">
            {FEATURES_FREE.map(({ label }) => (
              <li key={label} className="flex items-start gap-2.5 text-sm text-ink">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-good" />
                {label}
              </li>
            ))}
            {FEATURES_BLOQUEADAS.map(({ label }) => (
              <li key={label} className="flex items-start gap-2.5 text-sm text-ink-muted line-through">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted/40" />
                {label}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            {!isPro ? (
              <div className="flex w-full items-center justify-center rounded-2xl border-2 border-black/10 py-3 text-sm font-bold text-ink-muted">
                {t.plansCurrentPlan}
              </div>
            ) : (
              <Link href="/"
                className="flex w-full items-center justify-center rounded-2xl border-2 border-black/10 py-3 text-sm font-bold text-ink-muted transition hover:border-black/20">
                {t.plansGoHome}
              </Link>
            )}
          </div>
        </div>

        {/* ── Plan Pro ── */}
        <div className="relative flex flex-col rounded-[24px] bg-gradient-to-br from-brand-primary to-[#c0392b] p-7 text-white shadow-2xl">
          {/* Badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold px-4 py-1 text-xs font-extrabold text-[#5b3a0e] shadow">
              <Sparkles className="h-3 w-3" /> {t.plansRecommended}
            </span>
          </div>

          <div className="mb-1 text-xs font-bold uppercase tracking-widest text-white/60">Plan</div>
          <div className="font-display text-3xl font-black">{t.plansProLabel}</div>
          {!trialUsado && !isPro ? (
            <div className="mt-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-extrabold text-white">
                {t.plansTrialBadge}
              </div>
              <div className="mt-1 text-sm text-white/70">{t.plansTrialAfter} {t.plansProPrice}{t.plansPerMonth}</div>
            </div>
          ) : (
            <div className="mt-1">
              <span className="text-3xl font-extrabold">{t.plansProPrice}</span>
              <span className="ml-1 text-sm text-white/70">{t.plansPerMonth}</span>
            </div>
          )}
          <p className="mt-2 text-sm text-white/80">{t.plansProSub}</p>

          <div className="my-6 border-t border-white/20" />

          <ul className="flex-1 space-y-2.5">
            {FEATURES_PRO.map(({ label }) => (
              <li key={label} className="flex items-start gap-2.5 text-sm text-white">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-white/80" />
                {label}
              </li>
            ))}
          </ul>

          <div className="mt-8 space-y-3">
            {trialOk ? (
              <div className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/20 py-3 text-sm font-bold text-white">
                <Check className="h-4 w-4" /> {t.plansTrialActive}
              </div>
            ) : isPro ? (
              <div className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/20 py-3 text-sm font-bold text-white">
                <Check className="h-4 w-4" /> {t.plansActive}
              </div>
            ) : !isAuthenticated ? (
              <Link href="/"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-sm font-extrabold text-brand-primary shadow transition hover:opacity-90">
                <Sparkles className="h-4 w-4" /> {t.plansLoginFirst}
              </Link>
            ) : !trialUsado ? (
              <>
                <button type="button" onClick={handleTrialGratis} disabled={trialLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-sm font-extrabold text-brand-primary shadow transition hover:opacity-90 disabled:opacity-60">
                  {trialLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {trialLoading ? t.plansActivating : t.plansStartFree}
                </button>
                <button type="button" onClick={handleSuscribirse}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/30 py-2.5 text-xs font-bold text-white/80 transition hover:bg-white/10">
                  {t.plansPayNow} ({t.plansProPrice}{t.plansPerMonth})
                </button>
              </>
            ) : (
              <button type="button" onClick={handleSuscribirse}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-sm font-extrabold text-brand-primary shadow transition hover:opacity-90">
                <Sparkles className="h-4 w-4" /> {t.plansSubscribe}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-ink-muted">
        {t.plansMpNote}
      </p>

      {/* Modal de pago */}
      <PagoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onMercadoPago={handleMercadoPago}
        precio={PRECIO_PRO_ARS}
        descripcion="VecindogPro — Suscripción mensual · 30 días de acceso completo"
      />
    </div>
  );
}
