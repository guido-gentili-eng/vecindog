'use client';

import { useRef, useState } from 'react';
import { Dog, Mail, Lock, AlertCircle, Loader2, Eye, EyeOff, CheckCircle2, KeyRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type Step = 'form' | 'confirm';

export default function AuthModal() {
  const { hasChosen, loading, signIn, signUp, verifyOtp, resendConfirm, enterAsGuest } = useAuth();

  const [mode,       setMode]       = useState<'login' | 'register'>('register');
  const [step,       setStep]       = useState<Step>('form');
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [showPass,   setShowPass]   = useState(false);
  const [code,       setCode]       = useState('');
  const [error,      setError]      = useState('');
  const [info,       setInfo]       = useState('');
  const [submitting, setSubmitting] = useState(false);
  const codeRef = useRef<HTMLInputElement>(null);

  if (loading || hasChosen) return null;

  function switchMode(m: 'login' | 'register') {
    setMode(m); setStep('form'); setError(''); setInfo(''); setCode('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setInfo(''); setSubmitting(true);
    try {
      if (mode === 'login') {
        const err = await signIn(email, password);
        if (err) {
          if (err.includes('Email not confirmed')) {
            // Reenviar código y mostrar paso de confirmación
            await resendConfirm(email);
            setStep('confirm');
            setInfo('Te reenviamos el código de confirmación al email.');
          } else {
            setError(tradError(err));
          }
        }
      } else {
        const { error: err, needsConfirm } = await signUp(email, password);
        if (err) {
          setError(tradError(err));
        } else if (needsConfirm) {
          setStep('confirm');
          setInfo('');
          setTimeout(() => codeRef.current?.focus(), 100);
        }
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (code.length < 6) { setError('Ingresá el código de 6 dígitos.'); return; }
    setError(''); setSubmitting(true);
    try {
      const err = await verifyOtp(email, code.trim());
      if (err) setError(tradError(err));
      // Si no hay error, onAuthStateChange maneja el login automático
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setError(''); setInfo('');
    await resendConfirm(email);
    setInfo('Código reenviado. Revisá tu bandeja de entrada (y spam).');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="w-full max-w-sm rounded-t-[32px] bg-white px-7 pb-10 pt-7 shadow-2xl sm:rounded-[32px] sm:pb-8">

        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-black/10 sm:hidden" />

        {/* Logo + título */}
        <div className="mb-6 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary text-white shadow-soft">
            {step === 'confirm' ? <KeyRound className="h-8 w-8" /> : <PawIcon className="h-8 w-8" />}
          </span>
          <h1 className="mt-3 font-display text-2xl font-black text-ink">
            {step === 'confirm' ? 'Confirmá tu email' : 'Bienvenido a Vecindog'}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {step === 'confirm'
              ? <>Te enviamos un código de 6 dígitos a <strong>{email}</strong></>
              : 'Registrate para ver los datos de contacto de los avisos.'}
          </p>
        </div>

        {step === 'confirm' ? (
          /* ── Paso 2: ingresar código ── */
          <form onSubmit={handleVerify} className="space-y-3">
            <div>
              <label className="label text-center block mb-1">Código de verificación</label>
              <input
                ref={codeRef}
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={code}
                onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setError(''); }}
                className="field w-full text-center text-2xl font-mono tracking-[0.4em] py-4"
                autoComplete="one-time-code"
              />
            </div>

            {error && (
              <p className="flex items-start gap-1.5 rounded-xl bg-bad/10 p-3 text-sm font-semibold text-bad">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}
              </p>
            )}
            {info && (
              <p className="flex items-start gap-1.5 rounded-xl bg-good/10 p-3 text-sm font-semibold text-good">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />{info}
              </p>
            )}

            <button type="submit" disabled={submitting || code.length < 6}
              className="btn-primary w-full disabled:opacity-60">
              {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Confirmar y entrar'}
            </button>

            <div className="flex items-center justify-between pt-1 text-xs text-ink-muted">
              <button type="button" onClick={handleResend} className="font-bold text-brand-primary hover:underline">
                Reenviar código
              </button>
              <button type="button" onClick={() => { setStep('form'); setCode(''); setError(''); }}
                className="hover:underline">
                Cambiar email
              </button>
            </div>
          </form>
        ) : (
          /* ── Paso 1: email + contraseña ── */
          <>
            <div className="mb-5 flex rounded-2xl bg-brand-cream p-1">
              {(['register', 'login'] as const).map((m) => (
                <button key={m} type="button" onClick={() => switchMode(m)}
                  className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition ${
                    mode === m ? 'bg-white text-ink shadow-soft' : 'text-ink-muted hover:text-ink'
                  }`}>
                  {m === 'register' ? 'Crear cuenta' : 'Iniciar sesión'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                <input type="email" required placeholder="tu@email.com" autoComplete="email"
                  value={email} onChange={(e) => setEmail(e.target.value)} className="field pl-9" />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                <input type={showPass ? 'text' : 'password'} required minLength={6}
                  placeholder="Contraseña (mín. 6 caracteres)"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="field pl-9 pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
                  aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {error && (
                <p className="flex items-start gap-1.5 rounded-xl bg-bad/10 p-3 text-sm font-semibold text-bad">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}
                </p>
              )}

              <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
                {submitting ? <Loader2 className="h-5 w-5 animate-spin" />
                  : mode === 'register' ? 'Crear cuenta gratis' : 'Iniciar sesión'}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 border-t border-black/10" />
              <span className="text-xs text-ink-muted">o</span>
              <div className="flex-1 border-t border-black/10" />
            </div>

            <button type="button" onClick={enterAsGuest}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-black/10 py-3 text-sm font-bold text-ink transition hover:border-brand-primary hover:text-brand-primary">
              <Dog className="h-4 w-4" /> Entrar como invitado
            </button>
            <p className="mt-2 text-center text-xs text-ink-muted">
              Como invitado no podrás ver el WhatsApp de contacto.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function tradError(msg: string): string {
  if (msg.includes('Invalid login credentials')) return 'Email o contraseña incorrectos.';
  if (msg.includes('Email not confirmed'))        return 'Confirmá tu email antes de iniciar sesión.';
  if (msg.includes('User already registered'))    return 'Ya existe una cuenta con ese email. Iniciá sesión.';
  if (msg.includes('Password should be'))         return 'La contraseña debe tener al menos 6 caracteres.';
  if (msg.includes('Unable to validate'))         return 'Email inválido.';
  if (msg.includes('is invalid'))                 return 'Email inválido. Revisá que esté bien escrito.';
  if (msg.includes('rate limit'))                 return 'Demasiados intentos. Esperá unos minutos y volvé a intentar.';
  if (msg.includes('over_email_send_rate_limit')) return 'Demasiados intentos. Esperá unos minutos y volvé a intentar.';
  if (msg.includes('Token has expired'))          return 'El código expiró. Pedí uno nuevo.';
  if (msg.includes('Token not found'))            return 'Código incorrecto. Revisá el email o pedí uno nuevo.';
  if (msg.includes('signup disabled'))            return 'El registro está deshabilitado temporalmente.';
  if (msg.includes('weak password'))              return 'La contraseña es muy débil. Usá al menos 6 caracteres.';
  if (msg.includes('network'))                    return 'Error de conexión. Verificá tu internet.';
  return msg;
}

function PawIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <ellipse cx="7"  cy="11" rx="3" ry="4" />
      <ellipse cx="14" cy="6"  rx="3" ry="4" />
      <ellipse cx="22" cy="6"  rx="3" ry="4" />
      <ellipse cx="29" cy="11" rx="3" ry="4" />
      <path d="M18 14c-6 0-10 5-10 9 0 4 4 6 10 6s10-2 10-6c0-4-9-9-10-9z" />
    </svg>
  );
}
