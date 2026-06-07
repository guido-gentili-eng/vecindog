'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { RefreshCw, AlertCircle, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdInfo {
  id:         string;
  titulo:     string;
  subtitulo:  string | null;
  plan:       string;
  anunciante: string | null;
  fecha_fin:  string | null;
  activo:     boolean;
}

const PRECIOS: Record<string, number>  = { basico: 15000, estandar: 28000, premium: 45000 };
const LABELS:  Record<string, string>  = { basico: 'Plan Básico', estandar: 'Plan Estándar', premium: 'Plan Premium' };

export default function RenovarPage() {
  const searchParams = useSearchParams();
  const adIdsParam   = searchParams.get('ads') ?? '';
  const pagoFallido  = searchParams.get('pago') === 'fallido';
  const { t } = useLanguage();

  const adIds = adIdsParam.split(',').filter(Boolean);

  const [ads,     setAds]     = useState<AdInfo[]>([]);
  const [cargando,setCargando]= useState(true);
  const [error,   setError]   = useState('');
  const [pagando, setPagando] = useState(false);

  useEffect(() => {
    if (!adIds.length) { setCargando(false); return; }
    fetch(`/api/ads-info?ids=${adIdsParam}`)
      .then((r) => r.json())
      .then((data) => { setAds(data.ads ?? []); })
      .catch(() => setError('No se pudo cargar la información del anuncio.'))
      .finally(() => setCargando(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adIdsParam]);

  async function handleRenovar() {
    setPagando(true); setError('');
    try {
      const res  = await fetch('/api/pago/renovar-publicidad', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ad_ids: adIds }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) { setError(data.error ?? 'No se pudo iniciar el pago.'); return; }
      window.location.href = data.url;
    } catch {
      setError('Error inesperado. Intentá de nuevo.');
    } finally {
      setPagando(false);
    }
  }

  if (cargando) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!adIds.length || !ads.length) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-bad" />
        <h1 className="mt-4 font-display text-2xl font-black text-ink">{t.pubrvNoEncontrado}</h1>
        <p className="mt-2 text-sm text-ink-muted">{t.pubrvNoEncontradoSub}</p>
        <Link href="/publicitate" className="btn-primary mt-6 inline-flex">{t.pubrvVerPlanes}</Link>
      </div>
    );
  }

  const ad      = ads[0];
  const precio  = PRECIOS[ad.plan];
  const label   = LABELS[ad.plan] ?? ad.plan;
  const vencida = ad.fecha_fin ? new Date(ad.fecha_fin) < new Date() : false;

  return (
    <div className="mx-auto max-w-md py-12 space-y-5">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary">
          <RefreshCw className="h-3.5 w-3.5" /> {t.pubrvChip}
        </span>
        <h1 className="mt-3 font-display text-3xl font-black tracking-tight text-ink">
          {t.pubrvChip} {label}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {vencida ? t.pubrvVencida : t.pubrvExtender}
        </p>
      </div>

      <div className="card p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary/10">
            <Sparkles className="h-5 w-5 text-brand-primary" />
          </div>
          <div>
            <p className="font-bold text-ink">{ad.titulo}</p>
            {ad.subtitulo && <p className="text-xs text-ink-muted">{ad.subtitulo}</p>}
          </div>
        </div>
        <div className="border-t border-black/5 pt-3 flex items-center justify-between text-sm">
          <span className="text-ink-muted">{t.pubrvPlan}</span>
          <span className="font-bold text-ink">{label}</span>
        </div>
        {ad.fecha_fin && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-muted">{t.pubrvVencimientoActual}</span>
            <span className={`font-bold ${vencida ? 'text-bad' : 'text-ink'}`}>
              {new Date(ad.fecha_fin + 'T00:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
              {vencida ? ` ${t.pubrvVencido}` : ''}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-muted">{t.pubrvNuevoVencimiento}</span>
          <span className="font-bold text-good">
            {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
        <div className="border-t border-black/5 pt-3 flex items-center justify-between">
          <span className="font-bold text-ink">{t.pubrvTotal}</span>
          <span className="font-display text-xl font-black text-brand-primary">
            ${precio?.toLocaleString('es-AR')} ARS
          </span>
        </div>
      </div>

      {pagoFallido && (
        <div className="flex items-center gap-2 rounded-2xl bg-bad/10 p-3 text-sm font-bold text-bad">
          <AlertCircle className="h-4 w-4 shrink-0" /> {t.pubrvPagoFallido}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-2xl bg-bad/10 p-3 text-sm font-bold text-bad">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <div className="space-y-2">
        <button
          type="button"
          onClick={handleRenovar}
          disabled={pagando}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-primary py-4 text-sm font-bold text-white shadow-soft transition hover:opacity-90 disabled:opacity-70"
        >
          {pagando
            ? <><Loader2 className="h-4 w-4 animate-spin" /> {t.pubrvCargando}</>
            : <><RefreshCw className="h-4 w-4" /> {t.pubrvBtn} · ${precio?.toLocaleString('es-AR')}</>
          }
        </button>
        <p className="text-center text-xs text-ink-muted">{t.pubrvPagoCon}</p>
      </div>

      <div className="text-center">
        <Link href="/publicitate" className="text-xs text-ink-muted hover:text-brand-primary hover:underline transition">
          {t.pubrvVerTodos}
        </Link>
      </div>
    </div>
  );
}
