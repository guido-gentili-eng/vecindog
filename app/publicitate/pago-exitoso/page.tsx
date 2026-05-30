'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react';

const PLAN_LABEL: Record<string, string> = {
  basico:   'Plan Básico',
  estandar: 'Plan Estándar',
  premium:  'Plan Premium',
};

export default function PagoExitosoPage() {
  const params  = useSearchParams();
  const plan    = params.get('plan') ?? 'estandar';
  const pending = params.get('pending') === '1';
  const waLink  = `https://wa.me/5492914050210?text=${encodeURIComponent('Hola! Acabo de contratar el ' + (PLAN_LABEL[plan] ?? 'plan') + ' en Vecindog. ¿Cuándo activamos el anuncio?')}`;

  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="card p-8 md:p-10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-good/15 text-good">
          <CheckCircle2 className="h-9 w-9" />
        </div>

        <h1 className="mt-5 font-display text-2xl font-black text-ink md:text-3xl">
          {pending ? '¡Pago en proceso!' : '¡Pago confirmado!'}
        </h1>

        <p className="mt-2 text-ink-muted">
          {pending
            ? 'Tu pago está siendo procesado. Te avisamos por email cuando se confirme.'
            : <>Recibimos tu pago del <strong>{PLAN_LABEL[plan] ?? plan}</strong>.</>}
        </p>

        <div className="mt-6 rounded-2xl bg-brand-cream p-4 text-left text-sm text-ink-muted">
          <p className="font-bold text-ink">¿Qué sigue?</p>
          <ol className="mt-2 space-y-1.5 list-decimal list-inside">
            <li>Escribinos por WhatsApp para enviarnos el logo y datos de tu negocio</li>
            <li>Activamos tu anuncio en menos de 24 hs</li>
            <li>Te mandamos confirmación cuando esté visible</li>
          </ol>
        </div>

        <a href={waLink} target="_blank" rel="noopener noreferrer"
          className="btn-primary mt-6 w-full justify-center">
          <MessageCircle className="h-5 w-5" /> Enviar datos por WhatsApp
        </a>

        <Link href="/" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-brand-primary hover:underline">
          Volver al inicio <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
