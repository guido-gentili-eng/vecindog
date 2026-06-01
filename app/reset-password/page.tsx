'use client';

import { useEffect, useState } from 'react';
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, KeyRound, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useLanguage, LanguageSwitcher } from '@/contexts/LanguageContext';

type PageState = 'waiting' | 'ready' | 'success' | 'invalid';

export default function ResetPasswordPage() {
  const { t } = useLanguage();
  const [pageState,  setPageState]  = useState<PageState>('waiting');
  const [password,   setPassword]   = useState('');
  const [confirm,    setConfirm]    = useState('');
  const [showPass,   setShowPass]   = useState(false);
  const [showConf,   setShowConf]   = useState(false);
  const [error,      setError]      = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setPageState('ready');
      }
    });

    // Timeout: si en 8s no llegó el evento, el link es inválido
    const timer = setTimeout(() => {
      setPageState((prev) => prev === 'waiting' ? 'invalid' : prev);
    }, 8000);

    return () => { subscription.unsubscribe(); clearTimeout(timer); };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError(t.errPasswordMismatch); return; }
    setError(''); setSubmitting(true);
    try {
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) {
        setError(err.message);
      } else {
        await supabase.auth.signOut();
        setPageState('success');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-sm rounded-t-[32px] bg-white px-7 pb-10 pt-7 shadow-2xl sm:rounded-[32px] sm:pb-8">
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-black/10 sm:hidden" />

        <LanguageSwitcher />

        <div className="mb-6 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary text-white shadow-soft">
            <KeyRound className="h-8 w-8" />
          </span>
          <h1 className="mt-3 font-display text-2xl font-black text-ink">
            {pageState === 'success' ? t.updatePasswordSuccess : t.newPasswordTitle}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {pageState === 'success'
              ? t.updatePasswordSuccessSub
              : pageState === 'invalid'
              ? t.invalidResetLink
              : pageState === 'waiting'
              ? '...'
              : t.newPasswordSub}
          </p>
        </div>

        {pageState === 'waiting' && (
          <div className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
          </div>
        )}

        {pageState === 'invalid' && (
          <div className="space-y-4">
            <p className="flex items-start gap-1.5 rounded-xl bg-bad/10 p-3 text-sm font-semibold text-bad">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{t.invalidResetLink}
            </p>
            <Link href="/"
              className="flex w-full items-center justify-center gap-1.5 rounded-2xl border-2 border-black/10 py-3 text-sm font-bold text-ink transition hover:border-brand-primary hover:text-brand-primary">
              <ArrowLeft className="h-4 w-4" /> {t.backToLogin}
            </Link>
          </div>
        )}

        {pageState === 'success' && (
          <div className="space-y-4">
            <p className="flex items-start gap-1.5 rounded-xl bg-good/10 p-3 text-sm font-semibold text-good">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />{t.updatePasswordSuccessSub}
            </p>
            <Link href="/"
              className="btn-primary w-full flex items-center justify-center">
              {t.backToLogin}
            </Link>
          </div>
        )}

        {pageState === 'ready' && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Eye className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted pointer-events-none" />
              <input
                type={showPass ? 'text' : 'password'}
                required minLength={6}
                placeholder={t.newPasswordPlaceholder}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="field pl-9 pr-10"
                autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
                aria-label={showPass ? t.hidePassword : t.showPassword}>
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="relative">
              <Eye className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted pointer-events-none" />
              <input
                type={showConf ? 'text' : 'password'}
                required minLength={6}
                placeholder={t.confirmPasswordPlaceholder}
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setError(''); }}
                className="field pl-9 pr-10"
                autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowConf(!showConf)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
                aria-label={showConf ? t.hidePassword : t.showPassword}>
                {showConf ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <p className="flex items-start gap-1.5 rounded-xl bg-bad/10 p-3 text-sm font-semibold text-bad">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}
              </p>
            )}

            <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
              {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : t.btnUpdatePassword}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
