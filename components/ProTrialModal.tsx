'use client';

import { useEffect, useState } from 'react';
import {
  X, Sparkles, Loader2, Check,
  Camera, Bell, Users, Trophy, Heart, Car,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const SESSION_KEY = 'vecindog_pro_trial_offered';

const BENEFICIOS = [
  { icon: Camera,  label: 'Búsqueda por foto con IA 📷' },
  { icon: Trophy,  label: 'Top Escapistas del barrio 🏃' },
  { icon: Bell,    label: 'Notificaciones en tiempo real 🔔' },
  { icon: Users,   label: 'Panel de Amigos y red vecinal' },
  { icon: Heart,   label: 'Registro como cuidador o transportador' },
  { icon: Car,     label: 'Perros y publicaciones ilimitados' },
];

export default function ProTrialModal() {
  const { isAuthenticated, isPro, profile, profileLoading, refreshProfile } = useAuth();
  const [visible,  setVisible]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);
  const [error,    setError]    = useState('');

  useEffect(() => {
    if (profileLoading) return;
    if (!isAuthenticated) return;
    if (isPro) return;
    if (profile?.plan_trial_usado) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    // Pequeño delay para que el usuario vea la app primero
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, [isAuthenticated, isPro, profile?.plan_trial_usado, profileLoading]);

  function dismiss() {
    sessionStorage.setItem(SESSION_KEY, '1');
    setVisible(false);
  }

  async function activar() {
    setLoading(true);
    setError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) { setError('Iniciá sesión de nuevo.'); return; }

      const res  = await fetch('/api/trial/pro', {
        method:  'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();

      if (!res.ok) { setError(data.error ?? 'No se pudo activar. Intentá de nuevo.'); return; }

      await refreshProfile();
      setDone(true);
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      setError('Error de conexión. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="w-full max-w-sm overflow-hidden rounded-t-[32px] bg-white shadow-2xl sm:rounded-[32px]">

        {/* Header degradado */}
        <div className="relative bg-gradient-to-br from-brand-primary to-[#c0392b] px-6 pb-6 pt-5 text-white">
          {!done && (
            <button
              type="button"
              onClick={dismiss}
              className="absolute right-4 top-4 rounded-xl p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-brand-gold px-3 py-1 text-xs font-extrabold text-[#5b3a0e]">
            <Sparkles className="h-3 w-3" /> EXCLUSIVO PARA VOS
          </div>
          <h2 className="font-display text-2xl font-black leading-tight">
            {done ? '¡Ya tenés Pro activado! 🎉' : '3 meses de Pro\ncompletamente gratis'}
          </h2>
          {!done && (
            <p className="mt-1.5 text-sm text-white/80">
              Sin tarjeta. Sin compromiso. Activalo en un click.
            </p>
          )}
        </div>

        <div className="px-6 py-5">
          {done ? (
            /* ── Estado: activado ── */
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-good/10">
                <Check className="h-8 w-8 text-good" />
              </div>
              <p className="text-sm text-ink-muted leading-relaxed">
                Tenés acceso completo a todas las funciones Pro por los próximos <strong>3 meses</strong>. ¡Explorá todo lo que Vecindog tiene para ofrecerte!
              </p>
              <button
                type="button"
                onClick={dismiss}
                className="w-full rounded-2xl bg-brand-primary py-3 text-sm font-extrabold text-white shadow-soft transition hover:opacity-90"
              >
                ¡Empezar a explorar!
              </button>
            </div>
          ) : (
            /* ── Estado: oferta ── */
            <div className="space-y-4">
              <ul className="space-y-2">
                {BENEFICIOS.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2.5 text-sm text-ink">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10">
                      <Icon className="h-3.5 w-3.5 text-brand-primary" />
                    </span>
                    {label}
                  </li>
                ))}
              </ul>

              {error && (
                <p className="rounded-xl bg-bad/10 px-3 py-2 text-xs font-semibold text-bad">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={activar}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-primary py-3.5 text-sm font-extrabold text-white shadow-soft transition hover:opacity-90 disabled:opacity-60"
              >
                {loading
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <Sparkles className="h-4 w-4" />
                }
                {loading ? 'Activando…' : 'Activar mis 3 meses gratis'}
              </button>

              <button
                type="button"
                onClick={dismiss}
                className="w-full py-2 text-xs font-semibold text-ink-muted transition hover:text-ink"
              >
                Quizás más tarde
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
