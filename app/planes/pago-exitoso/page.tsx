'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';

type Estado = 'cargando' | 'ok' | 'pendiente' | 'error';

export default function PagoExitosoPro() {
  const searchParams  = useSearchParams();
  const router        = useRouter();
  const { refreshProfile } = useAuth();
  const { t } = useLanguage();
  const [estado, setEstado] = useState<Estado>('cargando');

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    const pending   = searchParams.get('pending') === '1';

    if (pending) { setEstado('pendiente'); return; }
    if (!paymentId) { router.replace('/planes'); return; }

    supabase.auth.getSession().then(({ data: { session } }) =>
    fetch('/api/confirmar-pago-pro', {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      body:    JSON.stringify({ payment_id: paymentId }),
    }))
      .then((r) => r.json())
      .then(async (data) => {
        if (data.ok) {
          // refreshProfile no debe bloquear ni causar error visible si falla
          await refreshProfile().catch(() => null);
          setEstado('ok');
        } else if (data.status === 'pending') {
          setEstado('pendiente');
        } else {
          setEstado('error');
        }
      })
      .catch(() => setEstado('error'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-[32px] bg-white p-8 text-center shadow-2xl">

        {estado === 'cargando' && (
          <>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-brand-primary" />
            <p className="mt-4 font-bold text-ink">{t.ppxCargando}</p>
          </>
        )}

        {estado === 'ok' && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-good/10">
              <CheckCircle2 className="h-10 w-10 text-good" />
            </div>
            <h1 className="mt-5 font-display text-2xl font-black text-ink">
              {t.ppxOkTitle} 🎉
            </h1>
            <p className="mt-2 text-sm text-ink-muted">{t.ppxOkSub}</p>
            <div className="mt-6 space-y-2">
              <Link href="/mis-perros"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-primary py-3 text-sm font-bold text-white shadow-soft transition hover:opacity-90">
                <Sparkles className="h-4 w-4" /> {t.ppxIrMisPerros}
              </Link>
              <Link href="/"
                className="flex w-full items-center justify-center rounded-2xl border-2 border-black/10 py-3 text-sm font-bold text-ink-muted transition hover:border-black/20">
                {t.ppxVolver}
              </Link>
            </div>
          </>
        )}

        {estado === 'pendiente' && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-warn/10">
              <Loader2 className="h-10 w-10 text-warn" />
            </div>
            <h1 className="mt-5 font-display text-2xl font-black text-ink">{t.ppxPendienteTitle}</h1>
            <p className="mt-2 text-sm text-ink-muted">{t.ppxPendienteSub}</p>
            <Link href="/" className="mt-6 flex w-full items-center justify-center rounded-2xl border-2 border-black/10 py-3 text-sm font-bold text-ink-muted transition hover:border-black/20">
              {t.ppxVolver}
            </Link>
          </>
        )}

        {estado === 'error' && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-bad/10">
              <AlertCircle className="h-10 w-10 text-bad" />
            </div>
            <h1 className="mt-5 font-display text-2xl font-black text-ink">{t.ppxErrorTitle}</h1>
            <p className="mt-2 text-sm text-ink-muted">
              {t.ppxErrorSub}{' '}
              <a href="mailto:hola@mivecindog.com.ar" className="font-bold text-brand-primary underline">
                hola@mivecindog.com.ar
              </a>.
            </p>
            <Link href="/planes" className="mt-6 flex w-full items-center justify-center rounded-2xl bg-brand-primary py-3 text-sm font-bold text-white transition hover:opacity-90">
              {t.ppxVolverPlanes}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
