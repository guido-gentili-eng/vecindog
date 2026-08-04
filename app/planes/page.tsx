'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Check, Sparkles, ArrowLeft,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PlanesPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const FEATURES = [
    { label: t.plansFeatMapAccess },
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

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:py-14">

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
      </div>

      {/* Card única */}
      <div className="relative flex flex-col rounded-[24px] bg-gradient-to-br from-brand-primary to-[#c0392b] p-7 text-white shadow-2xl">
        <div className="mb-1 text-xs font-bold uppercase tracking-widest text-white/60">Plan</div>
        <div className="font-display text-3xl font-black">{t.plansProLabel}</div>
        <p className="mt-2 text-sm text-white/80">{t.plansProSub}</p>

        <div className="my-6 border-t border-white/20" />

        <ul className="space-y-2.5">
          {FEATURES.map(({ label }) => (
            <li key={label} className="flex items-start gap-2.5 text-sm text-white">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-white/80" />
              {label}
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <Link href="/"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-sm font-extrabold text-brand-primary shadow transition hover:opacity-90">
            <Sparkles className="h-4 w-4" /> {t.plansGoHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
