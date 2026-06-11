'use client';

import { useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Dog, Mail, Lock, AlertCircle, Loader2, Eye, EyeOff, CheckCircle2, KeyRound, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage, LanguageSwitcher } from '@/contexts/LanguageContext';

type Step = 'form' | 'confirm' | 'forgot';

// Rutas públicas donde NO debe aparecer el modal de login
const PUBLIC_PATHS = [
  '/historia/',
  '/reencontrados',
  '/terminos',
  '/privacidad',
  '/planes',
  '/reset-password',
  '/verificar',
  '/buscar',
  '/mapa',
  '/calculadora-edad',
  '/adoptar',
];

export default function AuthModal() {
  const { hasChosen, loading, signIn, signUp, signInWithGoogle, verifyOtp, resendConfirm, resetPassword, enterAsGuest } = useAuth();
  const { t } = useLanguage();
  const pathname = usePathname();

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
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) return null;

  function switchMode(m: 'login' | 'register') {
    setMode(m); setStep('form'); setError(''); setInfo(''); setCode('');
  }

  function tradError(msg: string): string {
    if (msg.includes('Invalid login credentials')) return t.errInvalidCredentials;
    if (msg.includes('Email not confirmed'))        return t.errEmailNotConfirmed;
    if (msg.includes('User already registered'))    return t.errAlreadyRegistered;
    if (msg.includes('Password should be'))         return t.errWeakPassword;
    if (msg.includes('Unable to validate'))         return t.errInvalidEmail;
    if (msg.includes('is invalid'))                 return t.errInvalidEmail;
    if (msg.includes('rate limit'))                 return t.errRateLimit;
    if (msg.includes('over_email_send_rate_limit')) return t.errRateLimit;
    if (msg.includes('Token has expired'))          return t.errTokenExpired;
    if (msg.includes('Token not found'))            return t.errTokenNotFound;
    if (msg.includes('signup disabled'))            return t.errSignupDisabled;
    if (msg.includes('weak password'))              return t.errWeakPassword;
    if (msg.includes('network'))                    return t.errNetwork;
    return msg;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setInfo(''); setSubmitting(true);
    try {
      if (mode === 'login') {
        const err = await signIn(email, password);
        if (err) {
          if (err.includes('Email not confirmed')) {
            await resendConfirm(email);
            setStep('confirm');
            setInfo(t.infoResent);
          } else {
            setError(tradError(err));
          }
        } else {
          window.location.href = '/';
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
    if (code.length < 6) { setError(t.codeError); return; }
    setError(''); setSubmitting(true);
    try {
      const err = await verifyOtp(email, code.trim());
      if (err) {
        const isTokenError = err.includes('is invalid') || err.includes('Unable to validate') || err.includes('Token');
        if (isTokenError) {
          setError(t.errTokenExpired);
        } else {
          setError(tradError(err));
        }
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setError(''); setInfo('');
    await resendConfirm(email);
    setInfo(t.infoResentOk);
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setSubmitting(true);
    try {
      const err = await resetPassword(email);
      if (err) {
        setError(tradError(err));
      } else {
        setInfo(t.forgotSuccess);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="w-full max-w-sm rounded-t-[32px] bg-white px-7 pb-10 pt-7 shadow-2xl sm:rounded-[32px] sm:pb-8">

        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-black/10 sm:hidden" />

        {/* Selector de idioma */}
        <LanguageSwitcher />

        {/* Logo + título */}
        <div className="mb-6 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary text-white shadow-soft">
            {step === 'confirm' ? <KeyRound className="h-8 w-8" /> : <PawIcon className="h-8 w-8" />}
          </span>
          <h1 className="mt-3 font-display text-2xl font-black text-ink">
            {step === 'confirm' ? t.confirmEmail
              : step === 'forgot' ? t.forgotTitle
              : t.welcome}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {step === 'confirm'
              ? <>{t.confirmEmailSub} <strong>{email}</strong></>
              : step === 'forgot'
              ? t.forgotSub
              : t.welcomeSub}
          </p>
        </div>

        {step === 'confirm' ? (
          /* ── Paso: ingresar código OTP ── */
          <form onSubmit={handleVerify} className="space-y-3">
            <div>
              <label className="label text-center block mb-1">{t.codeLabel}</label>
              <input
                ref={codeRef}
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={code}
                onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setError(''); }}
                className="field w-full text-center text-xl font-mono tracking-[0.3em] py-4"
                autoComplete="one-time-code"
              />
            </div>

            {error && <AlertBanner>{error}</AlertBanner>}
            {info  && <InfoBanner>{info}</InfoBanner>}

            <button type="submit" disabled={submitting || code.length < 6}
              className="btn-primary w-full disabled:opacity-60">
              {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : t.btnConfirm}
            </button>

            <div className="flex items-center justify-between pt-1 text-xs text-ink-muted">
              <button type="button" onClick={handleResend} className="font-bold text-brand-primary hover:underline">
                {t.resendCode}
              </button>
              <button type="button" onClick={() => { setStep('form'); setCode(''); setError(''); }}
                className="hover:underline">
                {t.changeEmail}
              </button>
            </div>
          </form>

        ) : step === 'forgot' ? (
          /* ── Paso: recuperar contraseña ── */
          <form onSubmit={handleForgot} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input type="email" required placeholder={t.emailPlaceholder}
                value={email} onChange={(e) => setEmail(e.target.value)} className="field pl-9" />
            </div>

            {error && <AlertBanner>{error}</AlertBanner>}
            {info  && <InfoBanner>{info}</InfoBanner>}

            {!info && (
              <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
                {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : t.btnSendReset}
              </button>
            )}

            <button type="button"
              onClick={() => { setStep('form'); setMode('login'); setError(''); setInfo(''); }}
              className="flex w-full items-center justify-center gap-1.5 text-sm font-bold text-ink-muted hover:text-brand-primary transition">
              <ArrowLeft className="h-4 w-4" /> {t.backToLogin}
            </button>
          </form>

        ) : (
          /* ── Paso principal: email + contraseña ── */
          <>
            <div className="mb-5 flex rounded-2xl bg-brand-cream p-1">
              {(['register', 'login'] as const).map((m) => (
                <button key={m} type="button" onClick={() => switchMode(m)}
                  className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition ${
                    mode === m ? 'bg-white text-ink shadow-soft' : 'text-ink-muted hover:text-ink'
                  }`}>
                  {m === 'register' ? t.tabRegister : t.tabLogin}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                <input type="email" required placeholder={t.emailPlaceholder} autoComplete="email"
                  value={email} onChange={(e) => setEmail(e.target.value)} className="field pl-9" />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                <input type={showPass ? 'text' : 'password'} required minLength={6}
                  placeholder={t.passwordPlaceholder}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="field pl-9 pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
                  aria-label={showPass ? t.hidePassword : t.showPassword}>
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Link "olvidé contraseña" — solo en login */}
              {mode === 'login' && (
                <div className="text-right">
                  <button type="button"
                    onClick={() => { setStep('forgot'); setError(''); setInfo(''); }}
                    className="text-xs font-bold text-brand-primary hover:underline">
                    {t.forgotLink}
                  </button>
                </div>
              )}

              {/* Checkbox términos — solo en registro */}
              {mode === 'register' && (
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-brand-primary shrink-0" />
                  <span className="text-xs text-ink-muted leading-relaxed">
                    {t.termsPrefix}{' '}
                    <a href="/terminos" target="_blank" className="font-bold text-brand-primary underline">{t.termsLink}</a>
                    {' '}{t.termsMiddle}{' '}
                    <a href="/privacidad" target="_blank" className="font-bold text-brand-primary underline">{t.privacyLink}</a>
                    {' '}{t.termsSuffix}
                  </span>
                </label>
              )}

              {error && <AlertBanner>{error}</AlertBanner>}

              <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
                {submitting ? <Loader2 className="h-5 w-5 animate-spin" />
                  : mode === 'register' ? t.btnRegister : t.btnLogin}
              </button>
            </form>

            <div className="my-4 flex items-center gap-3">
              <div className="flex-1 border-t border-black/10" />
              <span className="text-xs text-ink-muted">{t.or}</span>
              <div className="flex-1 border-t border-black/10" />
            </div>

            <button type="button" onClick={signInWithGoogle}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-black/10 bg-white py-3 text-sm font-bold text-ink transition hover:border-black/20 hover:bg-black/5">
              <GoogleIcon className="h-5 w-5" />
              {t.continueGoogle}
            </button>

            <div className="my-4 flex items-center gap-3">
              <div className="flex-1 border-t border-black/10" />
              <span className="text-xs text-ink-muted">{t.or}</span>
              <div className="flex-1 border-t border-black/10" />
            </div>

            <button type="button" onClick={enterAsGuest}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-black/10 py-3 text-sm font-bold text-ink transition hover:border-brand-primary hover:text-brand-primary">
              <Dog className="h-4 w-4" /> {t.enterGuest}
            </button>
            <p className="mt-2 text-center text-xs text-ink-muted">
              {t.guestNote}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function AlertBanner({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-1.5 rounded-xl bg-bad/10 p-3 text-sm font-semibold text-bad">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{children}
    </p>
  );
}

function InfoBanner({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-1.5 rounded-xl bg-good/10 p-3 text-sm font-semibold text-good">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />{children}
    </p>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
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
