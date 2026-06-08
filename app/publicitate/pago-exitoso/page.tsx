'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Loader2, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';

const PLAN_LABEL: Record<string, string> = {
  basico:   'Plan Básico',
  estandar: 'Plan Estándar',
  premium:  'Plan Premium',
};

const PLAN_SLOTS_LABEL: Record<string, string[]> = {
  basico:   ['Sidebar en detalle de aviso'],
  estandar: ['Sidebar en detalle de aviso', 'Card en grilla de avisos'],
  premium:  ['Banner en página de inicio', 'Card en grilla de avisos', 'Sidebar en detalle de aviso'],
};

export default function PagoExitosoPage() {
  const params      = useSearchParams();
  const plan        = params.get('plan') ?? 'estandar';
  const adsParam    = params.get('ads') ?? '';
  const pending     = params.get('pending') === '1';
  const renovacion  = params.get('renovacion') === '1';
  const paymentId   = params.get('payment_id') ?? params.get('collection_id') ?? '';
  const { t } = useLanguage();

  const esTrial   = params.get('trial') === '1';
  const [activado, setActivado] = useState(esTrial);
  const [cargando, setCargando] = useState(!esTrial);
  const [error,    setError]    = useState('');

  useEffect(() => {
    if (esTrial) return;
    if (pending || !adsParam) { setCargando(false); return; }

    const adIds = adsParam.split(',').filter(Boolean);
    if (adIds.length === 0) { setCargando(false); return; }

    if (!paymentId) { setCargando(false); return; }

    supabase.auth.getSession().then(({ data: { session } }) =>
    fetch('/api/confirmar-pago', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      body: JSON.stringify({ payment_id: paymentId, ad_ids: adIds }),
    }))
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setActivado(true);
        else setError(data.error ?? 'No se pudo activar el anuncio.');
      })
      .catch(() => setError('Error de conexión al activar el anuncio.'))
      .finally(() => setCargando(false));
  }, [adsParam, esTrial, pending, paymentId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (cargando) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        <p className="font-bold text-ink">{t.pubpxCargando}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="card p-8 md:p-10">

        <div className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${
          error ? 'bg-bad/15 text-bad' :
          pending ? 'bg-warn/15 text-warn' :
          'bg-good/15 text-good'
        }`}>
          {error   ? <AlertCircle className="h-9 w-9" /> :
           pending  ? <Clock className="h-9 w-9" /> :
           <CheckCircle2 className="h-9 w-9" />}
        </div>

        <h1 className="mt-5 font-display text-2xl font-black text-ink md:text-3xl">
          {error                     ? t.pubpxErrorTitle     :
           pending                   ? t.pubpxPendienteTitle :
           activado && renovacion    ? t.pubpxRenovadoTitle  :
           activado                  ? t.pubpxActivadoTitle  :
           t.pubpxPagoTitle}
        </h1>

        <p className="mt-2 text-ink-muted">
          {error
            ? t.pubpxErrorSub
            : pending
            ? t.pubpxPendienteSub
            : activado && renovacion
            ? t.pubpxRenovadoSub
            : activado
            ? t.pubpxActivadoSub
            : t.pubpxPagoSub}
        </p>

        {error && (
          <p className="mt-3 rounded-2xl bg-bad/10 px-4 py-3 text-sm font-semibold text-bad">
            {error}
          </p>
        )}

        {esTrial && activado && (
          <div className="mt-4 rounded-2xl bg-brand-primary/10 px-4 py-3 text-sm font-bold text-brand-primary">
            🎁 Primer mes activado sin costo · Recibirás un aviso antes de que venza para renovar
          </div>
        )}

        {!pending && !error && activado && (
          <div className="mt-5 rounded-2xl bg-good/10 p-4 text-left">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-good">{t.pubpxEspacios}</p>
            <ul className="space-y-1">
              {(PLAN_SLOTS_LABEL[plan] ?? []).map((slot) => (
                <li key={slot} className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-good" /> {slot}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-5 rounded-2xl bg-brand-cream p-4 text-left text-sm text-ink-muted">
          <p className="font-bold text-ink">{PLAN_LABEL[plan] ?? plan} · 30 días</p>
          <p className="mt-1">
            {t.pubpxActualizar}{' '}
            <strong>hola@mivecindog.com.ar</strong> o por WhatsApp al{' '}
            <strong>+54 9 291 405-0210</strong>
          </p>
        </div>

        <Link href="/" className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-brand-primary hover:underline">
          {t.pubpxIrApp} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
