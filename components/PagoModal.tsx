'use client';

import { useState } from 'react';
import {
  X, CreditCard, Loader2, CheckCircle2, AlertCircle,
  Shield, Lock, Sparkles, ChevronRight,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

/* ─────────────────────────── Tipos globales MP ─────────────────────────── */
declare global {
  interface Window {
    MercadoPago?: new (
      publicKey: string,
      options?: { locale: string }
    ) => {
      createCardToken: (data: {
        cardNumber:            string;
        cardholderName:        string;
        cardExpirationMonth:   string;
        cardExpirationYear:    string;
        securityCode:          string;
        identificationType:    string;
        identificationNumber:  string;
      }) => Promise<{
        id:                string;
        first_six_digits?: string;
        luhn_validation?:  boolean;
        cause?:            Array<{ code: string; description: string }>;
        error?:            string;
      }>;
    };
  }
}

/* ─────────────────────────── Helpers de tarjeta ─────────────────────────── */

type TipoTarjeta = 'visa' | 'master' | 'amex' | 'naranja' | 'cabal' | '';

function detectarTipo(num: string): TipoTarjeta {
  const n = num.replace(/\s/g, '');
  if (/^4/.test(n)) return 'visa';
  if (/^5[1-5]|^222[1-9]|^22[3-9]\d|^2[3-6]\d{2}|^27[01]\d|^2720/.test(n)) return 'master';
  if (/^3[47]/.test(n)) return 'amex';
  if (/^589562/.test(n)) return 'naranja';
  if (/^589657|^600691/.test(n)) return 'cabal';
  return '';
}

const TIPO_LABEL: Record<string, string> = {
  visa: 'Visa', master: 'Mastercard', amex: 'Amex', naranja: 'Naranja', cabal: 'Cabal',
};
const TIPO_MP_ID: Record<string, string> = {
  visa: 'visa', master: 'master', amex: 'amex', naranja: 'naranja', cabal: 'cabal',
};
const TIPO_COLOR: Record<string, string> = {
  visa:    'bg-blue-50  text-blue-600',
  master:  'bg-orange-50 text-orange-500',
  amex:    'bg-green-50 text-green-600',
  naranja: 'bg-orange-50 text-orange-400',
  cabal:   'bg-sky-50   text-sky-500',
};

function formatNumero(val: string, esAmex: boolean): string {
  const d = val.replace(/\D/g, '').slice(0, esAmex ? 15 : 16);
  if (esAmex) return d.replace(/^(\d{0,4})(\d{0,6})(\d{0,5})$/, (_, a, b, c) =>
    [a, b, c].filter(Boolean).join(' ')
  );
  return d.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function luhn(num: string): boolean {
  const d = num.replace(/\D/g, '');
  if (!d) return false;
  let sum = 0, alt = false;
  for (let i = d.length - 1; i >= 0; i--) {
    let v = parseInt(d[i], 10);
    if (alt) { v *= 2; if (v > 9) v -= 9; }
    sum += v; alt = !alt;
  }
  return sum % 10 === 0;
}

function validarExpiry(val: string): boolean {
  const [mm, yy] = val.split('/');
  if (!mm || !yy || mm.length !== 2 || yy.length !== 2) return false;
  const mes = parseInt(mm, 10);
  if (mes < 1 || mes > 12) return false;
  const now  = new Date();
  const anio = 2000 + parseInt(yy, 10);
  if (anio < now.getFullYear()) return false;
  if (anio === now.getFullYear() && mes < now.getMonth() + 1) return false;
  return true;
}

async function cargarSDK(): Promise<void> {
  if (window.MercadoPago) return;
  return new Promise((resolve, reject) => {
    const prev = document.querySelector('script[src*="sdk.mercadopago.com/js/v2"]');
    if (prev) { prev.addEventListener('load', () => resolve()); return; }
    const s = document.createElement('script');
    s.src     = 'https://sdk.mercadopago.com/js/v2';
    s.async   = true;
    s.onload  = () => resolve();
    s.onerror = () => reject(new Error('No se pudo cargar el SDK de Mercado Pago.'));
    document.head.appendChild(s);
  });
}

/* ─────────────────────────── Interfaces ─────────────────────────── */

interface CardForm {
  numero:      string;
  nombre:      string;
  vencimiento: string;
  cvv:         string;
  dni:         string;
  cuotas:      number;
}

const FORM_VACIO: CardForm = {
  numero: '', nombre: '', vencimiento: '', cvv: '', dni: '', cuotas: 1,
};

type Step = 'metodo' | 'tarjeta' | 'procesando' | 'exito' | 'error';

/* ─────────────────────────── Componente ─────────────────────────── */

export default function PagoModal({
  isOpen,
  onClose,
  onMercadoPago,
  precio    = 1000,
  descripcion = 'VecindogPro — Suscripción 30 días',
}: {
  isOpen:       boolean;
  onClose:      () => void;
  onMercadoPago:() => Promise<void>;
  precio?:      number;
  descripcion?: string;
}) {
  const { refreshProfile } = useAuth();
  const [step,      setStep]      = useState<Step>('metodo');
  const [errorMsg,  setErrorMsg]  = useState('');
  const [mpLoading, setMpLoading] = useState(false);
  const [form,      setForm]      = useState<CardForm>(FORM_VACIO);
  const [errors,    setErrors]    = useState<Partial<Record<keyof CardForm, string>>>({});

  const tipo   = detectarTipo(form.numero);
  const esAmex = tipo === 'amex';
  const cvvLen = esAmex ? 4 : 3;

  function campo<K extends keyof CardForm>(k: K, v: CardForm[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  }

  function handleNumero(val: string) {
    // recalc esAmex from new value before formatting
    const rawTipo = detectarTipo(val.replace(/\s/g, ''));
    const amex    = rawTipo === 'amex';
    setForm((f) => ({ ...f, numero: formatNumero(val, amex), cvv: '' }));
    setErrors((e) => ({ ...e, numero: '', cvv: '' }));
  }

  function handleExpiry(val: string) {
    const d = val.replace(/\D/g, '').slice(0, 4);
    const f = d.length >= 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
    campo('vencimiento', f);
  }

  function validar(): boolean {
    const errs: Partial<Record<keyof CardForm, string>> = {};
    const num = form.numero.replace(/\s/g, '');

    if (!num)
      errs.numero = 'Ingresá el número de tarjeta.';
    else if (!luhn(num))
      errs.numero = 'Número de tarjeta inválido.';
    else if (esAmex && num.length !== 15)
      errs.numero = 'American Express tiene 15 dígitos.';
    else if (!esAmex && num.length !== 16)
      errs.numero = 'El número debe tener 16 dígitos.';

    if (!form.nombre.trim())
      errs.nombre = 'Ingresá el nombre tal como figura en la tarjeta.';

    if (!validarExpiry(form.vencimiento))
      errs.vencimiento = 'Fecha inválida o tarjeta vencida.';

    if (form.cvv.length !== cvvLen)
      errs.cvv = `El código de seguridad debe tener ${cvvLen} dígitos.`;

    if (!/^\d{7,8}$/.test(form.dni))
      errs.dni = 'Ingresá tu DNI (7 u 8 dígitos, sin puntos).';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmitTarjeta(e: React.FormEvent) {
    e.preventDefault();
    if (!validar()) return;
    setStep('procesando');

    try {
      /* 1. Cargar SDK de Mercado Pago */
      await cargarSDK();
      const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
      if (!publicKey || !window.MercadoPago)
        throw new Error('Configuración de pago incompleta. Contactá a soporte.');

      const mp = new window.MercadoPago(publicKey, { locale: 'es-AR' });
      const [mm, yy] = form.vencimiento.split('/');

      /* 2. Tokenizar la tarjeta en el browser (nunca toca nuestro server) */
      const tokenResult = await mp.createCardToken({
        cardNumber:           form.numero.replace(/\s/g, ''),
        cardholderName:       form.nombre.toUpperCase(),
        cardExpirationMonth:  mm,
        cardExpirationYear:   `20${yy}`,
        securityCode:         form.cvv,
        identificationType:   'DNI',
        identificationNumber: form.dni,
      });

      if (!tokenResult.id || tokenResult.error) {
        const causa = tokenResult.cause?.[0];
        const MP_ERRORES: Record<string, string> = {
          '205':  'Número de tarjeta inválido.',
          '208':  'Fecha de vencimiento incorrecta.',
          '209':  'Fecha de vencimiento incorrecta.',
          '212':  'DNI inválido.',
          '213':  'DNI inválido.',
          '214':  'DNI inválido.',
          '220':  'Banco no disponible. Intentá más tarde.',
          '221':  'Nombre del titular inválido.',
          '224':  'CVV incorrecto.',
          'E301': 'Número de tarjeta inválido.',
          'E302': 'CVV incorrecto.',
          'E401': 'Datos del titular inválidos.',
        };
        throw new Error(
          (causa?.code && MP_ERRORES[causa.code])
            ? MP_ERRORES[causa.code]
            : 'No se pudo verificar la tarjeta. Revisá los datos ingresados.'
        );
      }

      /* 3. Obtener sesión y enviar token al backend */
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token)
        throw new Error('Sesión expirada. Iniciá sesión de nuevo.');

      const res = await fetch('/api/pago/tarjeta', {
        method:  'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type':  'application/json',
        },
        body: JSON.stringify({
          cardToken:       tokenResult.id,
          cuotas:          form.cuotas,
          paymentMethodId: TIPO_MP_ID[tipo] ?? 'visa',
        }),
      });

      const data = await res.json();

      if (data.ok) {
        await refreshProfile();
        setStep('exito');
        return;
      }

      if (data.needs3DS && data.redirectUrl) {
        /* Redirigir al desafío 3D Secure del banco */
        window.location.href = data.redirectUrl;
        return;
      }

      throw new Error(
        data.reason ?? data.error ?? 'El pago fue rechazado. Verificá los datos e intentá de nuevo.'
      );

    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error inesperado. Intentá de nuevo.');
      setStep('error');
    }
  }

  async function handleMercadoPago() {
    setMpLoading(true);
    try { await onMercadoPago(); }
    catch { setMpLoading(false); }
  }

  function reset() {
    setStep('metodo'); setForm(FORM_VACIO);
    setErrors({}); setErrorMsg(''); setMpLoading(false);
  }

  if (!isOpen) return null;

  /* ─── Render ─── */
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) { reset(); onClose(); } }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-t-[32px] bg-white shadow-2xl sm:rounded-[32px]">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/6 px-6 pb-4 pt-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">VecindogPro · ${precio.toLocaleString('es-AR')}/mes</p>
            <h2 className="font-display text-xl font-black text-ink">
              {step === 'metodo'     && 'Elegí cómo pagar'}
              {step === 'tarjeta'    && 'Datos de la tarjeta'}
              {step === 'procesando' && 'Procesando pago…'}
              {step === 'exito'      && '¡Pago exitoso!'}
              {step === 'error'      && 'Pago rechazado'}
            </h2>
          </div>
          <button type="button" onClick={() => { reset(); onClose(); }}
            className="rounded-xl p-2 text-ink-muted transition hover:bg-brand-cream hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto px-6 py-6">

          {/* ══ STEP: Selección de método ══ */}
          {step === 'metodo' && (
            <div className="space-y-3">
              <p className="mb-4 text-sm text-ink-muted">{descripcion}</p>

              {/* Mercado Pago */}
              <button type="button" onClick={handleMercadoPago} disabled={mpLoading}
                className="flex w-full items-center gap-4 rounded-2xl border-2 border-[#00b1ea]/30 bg-[#00b1ea]/5 px-5 py-4 text-left transition hover:border-[#00b1ea]/60 hover:bg-[#00b1ea]/10 disabled:opacity-60">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#00b1ea]/15 text-sm font-black text-[#00b1ea]">
                  MP
                </div>
                <div className="flex-1">
                  <p className="font-bold text-ink">Mercado Pago</p>
                  <p className="text-xs text-ink-muted">Saldo MP, tarjeta, Rapipago, etc.</p>
                </div>
                {mpLoading
                  ? <Loader2 className="h-5 w-5 animate-spin text-ink-muted" />
                  : <ChevronRight className="h-5 w-5 text-ink-muted" />
                }
              </button>

              {/* Tarjeta directa */}
              <button type="button" onClick={() => setStep('tarjeta')}
                className="flex w-full items-center gap-4 rounded-2xl border-2 border-brand-primary/30 bg-brand-primary/5 px-5 py-4 text-left transition hover:border-brand-primary/60 hover:bg-brand-primary/10">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-primary/15">
                  <CreditCard className="h-6 w-6 text-brand-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-ink">Tarjeta de débito o crédito</p>
                  <p className="text-xs text-ink-muted">Visa · Mastercard · Amex · Naranja · Cabal</p>
                </div>
                <ChevronRight className="h-5 w-5 text-ink-muted" />
              </button>

              <p className="flex items-center justify-center gap-1.5 pt-2 text-xs text-ink-muted">
                <Lock className="h-3 w-3" /> Pago seguro · No se renueva automáticamente
              </p>
            </div>
          )}

          {/* ══ STEP: Formulario tarjeta ══ */}
          {step === 'tarjeta' && (
            <form onSubmit={handleSubmitTarjeta} noValidate className="space-y-4">

              {/* Número de tarjeta */}
              <div>
                <label className="label flex items-center justify-between">
                  <span>Número de tarjeta</span>
                  {tipo && (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${TIPO_COLOR[tipo]}`}>
                      {TIPO_LABEL[tipo]}
                    </span>
                  )}
                </label>
                <input
                  className={`field w-full font-mono tracking-widest ${errors.numero ? 'border-bad ring-1 ring-bad/30' : ''}`}
                  placeholder="0000 0000 0000 0000"
                  value={form.numero}
                  onChange={(e) => handleNumero(e.target.value)}
                  inputMode="numeric"
                  autoComplete="cc-number"
                  maxLength={esAmex ? 17 : 19}
                />
                {errors.numero && (
                  <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-bad">
                    <AlertCircle className="h-3 w-3 shrink-0" /> {errors.numero}
                  </p>
                )}
              </div>

              {/* Nombre titular */}
              <div>
                <label className="label">Nombre del titular</label>
                <input
                  className={`field w-full uppercase placeholder:normal-case ${errors.nombre ? 'border-bad ring-1 ring-bad/30' : ''}`}
                  placeholder="Igual que en la tarjeta"
                  value={form.nombre}
                  onChange={(e) => campo('nombre', e.target.value.toUpperCase())}
                  autoComplete="cc-name"
                />
                {errors.nombre && (
                  <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-bad">
                    <AlertCircle className="h-3 w-3 shrink-0" /> {errors.nombre}
                  </p>
                )}
              </div>

              {/* Vencimiento + CVV */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Vencimiento</label>
                  <input
                    className={`field w-full font-mono ${errors.vencimiento ? 'border-bad ring-1 ring-bad/30' : ''}`}
                    placeholder="MM/AA"
                    value={form.vencimiento}
                    onChange={(e) => handleExpiry(e.target.value)}
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    maxLength={5}
                  />
                  {errors.vencimiento && (
                    <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-bad">
                      <AlertCircle className="h-3 w-3 shrink-0" /> {errors.vencimiento}
                    </p>
                  )}
                </div>
                <div>
                  <label className="label">{esAmex ? 'CID (4 dígitos)' : 'CVV'}</label>
                  <input
                    className={`field w-full font-mono ${errors.cvv ? 'border-bad ring-1 ring-bad/30' : ''}`}
                    placeholder={esAmex ? '0000' : '000'}
                    value={form.cvv}
                    type="password"
                    onChange={(e) => campo('cvv', e.target.value.replace(/\D/g, '').slice(0, cvvLen))}
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    maxLength={cvvLen}
                  />
                  {errors.cvv && (
                    <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-bad">
                      <AlertCircle className="h-3 w-3 shrink-0" /> {errors.cvv}
                    </p>
                  )}
                </div>
              </div>

              {/* DNI */}
              <div>
                <label className="label">DNI del titular</label>
                <input
                  className={`field w-full ${errors.dni ? 'border-bad ring-1 ring-bad/30' : ''}`}
                  placeholder="Sin puntos ni espacios"
                  value={form.dni}
                  onChange={(e) => campo('dni', e.target.value.replace(/\D/g, '').slice(0, 8))}
                  inputMode="numeric"
                />
                {errors.dni && (
                  <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-bad">
                    <AlertCircle className="h-3 w-3 shrink-0" /> {errors.dni}
                  </p>
                )}
              </div>

              {/* Cuotas */}
              <div>
                <label className="label">Cuotas</label>
                <select
                  className="field w-full"
                  value={form.cuotas}
                  onChange={(e) => campo('cuotas', parseInt(e.target.value, 10))}
                >
                  <option value={1}>1 cuota de ${precio.toLocaleString('es-AR')}</option>
                  <option value={3}>3 cuotas de ${Math.ceil(precio * 1.0 / 3).toLocaleString('es-AR')} (sin interés)</option>
                  <option value={6}>6 cuotas de ${Math.ceil(precio * 1.15 / 6).toLocaleString('es-AR')} (con interés)</option>
                  <option value={12}>12 cuotas de ${Math.ceil(precio * 1.35 / 12).toLocaleString('es-AR')} (con interés)</option>
                </select>
              </div>

              {/* Botón pagar */}
              <button type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-primary py-3.5 text-sm font-extrabold text-white shadow-soft transition hover:opacity-90">
                <Shield className="h-4 w-4" />
                Pagar ${precio.toLocaleString('es-AR')}
              </button>

              {/* Badges de seguridad */}
              <div className="flex items-center justify-center gap-5 pt-1">
                <span className="flex items-center gap-1 text-[11px] text-ink-muted">
                  <Lock className="h-3 w-3" /> Cifrado SSL
                </span>
                <span className="flex items-center gap-1 text-[11px] text-ink-muted">
                  <Shield className="h-3 w-3" /> 3D Secure
                </span>
                <span className="text-[11px] text-ink-muted font-bold">
                  PCI DSS
                </span>
              </div>

              <button type="button"
                onClick={() => setStep('metodo')}
                className="flex w-full items-center justify-center pt-1 text-xs font-semibold text-ink-muted transition hover:text-ink">
                ← Volver a métodos de pago
              </button>
            </form>
          )}

          {/* ══ STEP: Procesando ══ */}
          {step === 'procesando' && (
            <div className="flex flex-col items-center gap-5 py-10 text-center">
              <div className="relative flex h-20 w-20 items-center justify-center">
                <Loader2 className="absolute h-20 w-20 animate-spin text-brand-primary/20" />
                <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
              </div>
              <div>
                <p className="font-bold text-ink">Verificando y procesando tu pago…</p>
                <p className="mt-1 text-sm text-ink-muted">No cierres esta ventana. Puede tardar unos segundos.</p>
              </div>
              {/* Paso a paso */}
              <div className="w-full space-y-2 rounded-2xl bg-brand-cream p-4 text-left">
                {['Verificando tarjeta con Mercado Pago', 'Procesando el pago de forma segura', 'Activando tu cuenta Pro'].map((txt, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-ink-muted">
                    <Loader2 className="h-3 w-3 animate-spin shrink-0" />
                    {txt}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ STEP: Éxito ══ */}
          {step === 'exito' && (
            <div className="flex flex-col items-center gap-5 py-6 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-good/10">
                <CheckCircle2 className="h-10 w-10 text-good" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-black text-ink">¡Bienvenido a VecindogPro! 🎉</h3>
                <p className="mt-1 text-sm text-ink-muted">
                  Tu cuenta ya tiene acceso completo por 30 días.
                </p>
              </div>
              <div className="w-full space-y-2">
                <button type="button"
                  onClick={() => { reset(); onClose(); window.location.href = '/mis-perros'; }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-primary py-3 text-sm font-bold text-white shadow-soft transition hover:opacity-90">
                  <Sparkles className="h-4 w-4" /> Ir a Mis perros
                </button>
                <button type="button"
                  onClick={() => { reset(); onClose(); }}
                  className="flex w-full items-center justify-center rounded-2xl border-2 border-black/10 py-3 text-sm font-bold text-ink-muted transition hover:border-black/20">
                  Cerrar
                </button>
              </div>
            </div>
          )}

          {/* ══ STEP: Error ══ */}
          {step === 'error' && (
            <div className="flex flex-col items-center gap-5 py-6 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-bad/10">
                <AlertCircle className="h-10 w-10 text-bad" />
              </div>
              <div>
                <h3 className="font-display text-xl font-black text-ink">Pago rechazado</h3>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">{errorMsg}</p>
              </div>
              <div className="w-full space-y-2">
                <button type="button"
                  onClick={() => { setStep('tarjeta'); setErrorMsg(''); }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-primary py-3 text-sm font-bold text-white shadow-soft transition hover:opacity-90">
                  <CreditCard className="h-4 w-4" /> Reintentar con tarjeta
                </button>
                <button type="button"
                  onClick={() => { setStep('metodo'); setErrorMsg(''); }}
                  className="flex w-full items-center justify-center rounded-2xl border-2 border-black/10 py-3 text-sm font-bold text-ink-muted transition hover:border-black/20">
                  Cambiar método de pago
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
