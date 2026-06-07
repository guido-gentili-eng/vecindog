'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Loader2, Clock, AlertCircle, MapPin, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function PagoExitosoComercioPage() {
  const params    = useSearchParams();
  const adsParam  = params.get('ads') ?? '';
  const pending   = params.get('pending') === '1';
  const paymentId = params.get('payment_id') ?? params.get('collection_id') ?? '';

  const [activado, setActivado] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    if (pending || !adsParam) { setCargando(false); return; }
    if (!paymentId)           { setCargando(false); return; }

    const adIds = adsParam.split(',').filter(Boolean);
    if (adIds.length === 0)   { setCargando(false); return; }

    supabase.auth.getSession().then(({ data: { session } }) =>
      fetch('/api/confirmar-pago', {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ payment_id: paymentId, ad_ids: adIds }),
      })
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setActivado(true);
        else setError(data.error ?? 'No se pudo activar el negocio.');
      })
      .catch(() => setError('Error de conexión al activar.'))
      .finally(() => setCargando(false));
  }, [adsParam, pending, paymentId]);

  if (cargando) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        <p className="font-bold text-ink">Verificando pago y activando tu negocio…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="card p-8 md:p-10">

        <div className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${
          error   ? 'bg-bad/15 text-bad'   :
          pending ? 'bg-warn/15 text-warn' :
          'bg-good/15 text-good'
        }`}>
          {error   ? <AlertCircle className="h-9 w-9" /> :
           pending  ? <Clock className="h-9 w-9" />       :
           <CheckCircle2 className="h-9 w-9" />}
        </div>

        <h1 className="mt-5 font-display text-2xl font-black text-ink md:text-3xl">
          {error   ? 'Hubo un problema'           :
           pending  ? '¡Pago en proceso!'          :
           activado ? '¡Bienvenido a la Red!'      :
           '¡Pago recibido!'}
        </h1>

        <p className="mt-2 text-ink-muted">
          {error
            ? 'Escribinos a hola@mivecindog.com.ar y lo resolvemos rápido.'
            : pending
            ? 'Tu pago está siendo procesado. Tu negocio se activa automáticamente al confirmarse.'
            : activado
            ? 'Tu negocio ya es parte de la Red Vecindog y aparece en el mapa para los vecinos dueños de perros.'
            : 'Recibirás una confirmación por email cuando tu negocio esté activo en el mapa.'}
        </p>

        {error && (
          <p className="mt-3 rounded-2xl bg-bad/10 px-4 py-3 text-sm font-semibold text-bad">{error}</p>
        )}

        {!pending && !error && activado && (
          <div className="mt-5 rounded-2xl bg-good/10 p-4 text-left space-y-2">
            <p className="text-xs font-bold uppercase tracking-wide text-good">Tu negocio ahora tiene</p>
            {[
              { icon: MapPin, label: 'Presencia en el mapa de búsqueda de perros' },
              { icon: Phone,  label: 'Teléfono y dirección visibles para los vecinos' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Icon className="h-4 w-4 shrink-0 text-good" /> {label}
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 rounded-2xl bg-brand-cream p-4 text-left text-sm text-ink-muted">
          <p className="font-bold text-ink">Red Vecindog · 30 días</p>
          <p className="mt-1">
            ¿Necesitás actualizar algún dato? Escribinos a{' '}
            <strong>hola@mivecindog.com.ar</strong>
          </p>
        </div>

        <Link href="/" className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-brand-primary hover:underline">
          Ir a la app <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
