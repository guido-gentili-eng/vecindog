'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Check, X, Sparkles, Dog, Lock, AlertCircle,
  Bell, Users, Camera, ScanSearch, Trophy,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import PagoModal from '@/components/PagoModal';

/* ── Features ── */

const FEATURES_FREE = [
  { icon: Dog,       label: '1 perro registrado' },
  { icon: Check,     label: '5 publicaciones de avisos (perdido/encontrado)' },
  { icon: Check,     label: 'Perfil básico del perro (foto, nombre, raza, color)' },
  { icon: Check,     label: 'Acceso a avisos, mapa y adopciones' },
];

const FEATURES_BLOQUEADAS = [
  { icon: Trophy,    label: 'Los más escapistas' },
  { icon: Camera,    label: 'Búsqueda por foto con IA' },
  { icon: ScanSearch,label: 'Búsqueda avanzada por características' },
  { icon: Users,     label: 'Panel de Amigos' },
  { icon: Bell,      label: 'Notificaciones en tiempo real' },
  { icon: Lock,      label: 'Instagram y Facebook en el perfil' },
];

const FEATURES_PRO = [
  { label: 'Todo lo del plan Gratis' },
  { label: 'Perros ilimitados' },
  { label: 'Publicaciones ilimitadas' },
  { label: 'Perfil completo (chip, vacunas, estudios, historial de peso, alergias…)' },
  { label: 'Los más escapistas 🏃' },
  { label: 'Búsqueda por foto con IA 📷' },
  { label: 'Búsqueda avanzada por características' },
  { label: 'Panel de Amigos' },
  { label: 'Notificaciones en tiempo real 🔔' },
  { label: 'Instagram y Facebook en el perfil' },
  { label: 'Acceso a Mi red Vecindog 🐾' },
];

/* ── Página ── */

export default function PlanesPage() {
  const { user, profile, isPro, isAuthenticated } = useAuth();
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [error,     setError]     = useState('');

  const vencimiento = profile?.plan_vencimiento
    ? new Date(profile.plan_vencimiento).toLocaleDateString('es-AR', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : null;

  /* Redirige al Checkout Pro de Mercado Pago */
  async function handleMercadoPago() {
    if (!isAuthenticated) { router.push('/'); return; }
    setError('');
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) { setError('Iniciá sesión primero.'); return; }

    const res  = await fetch('/api/pago/pro', {
      method:  'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    const data = await res.json();

    if (!res.ok || !data.url) {
      setError(data.error ?? 'No se pudo iniciar el pago.');
      throw new Error(data.error);   // le avisa al modal para que deje de cargar
    }
    window.location.href = data.url;
  }

  function handleSuscribirse() {
    if (!isAuthenticated) { router.push('/'); return; }
    setError('');
    setModalOpen(true);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:py-14">

      {/* Header */}
      <div className="mb-10 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary">
          <Sparkles className="h-3.5 w-3.5" /> Planes
        </span>
        <h1 className="mt-3 font-display text-4xl font-black tracking-tight text-ink md:text-5xl">
          Elegí tu plan
        </h1>
        <p className="mt-2 text-base text-ink-muted">
          Vecindog es gratis para empezar. Pasate a Pro para la experiencia completa.
        </p>
        {isPro && vencimiento && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-good/10 px-4 py-2 text-sm font-bold text-good ring-1 ring-good/20">
            <Check className="h-4 w-4" /> Plan activo hasta el {vencimiento}
          </div>
        )}
        {error && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-bad/10 px-4 py-2 text-sm font-bold text-bad ring-1 ring-bad/20">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* ── Plan Gratis ── */}
        <div className="flex flex-col rounded-[24px] border-2 border-black/8 bg-white p-7">
          <div className="mb-1 text-xs font-bold uppercase tracking-widest text-ink-muted">Plan</div>
          <div className="font-display text-3xl font-black text-ink">Gratis</div>
          <div className="mt-1 text-2xl font-extrabold text-ink">$0</div>
          <p className="mt-2 text-sm text-ink-muted">Para empezar a buscar y registrar a tu perro.</p>

          <div className="my-6 border-t border-black/6" />

          <ul className="flex-1 space-y-2.5">
            {FEATURES_FREE.map(({ label }) => (
              <li key={label} className="flex items-start gap-2.5 text-sm text-ink">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-good" />
                {label}
              </li>
            ))}
            {FEATURES_BLOQUEADAS.map(({ label }) => (
              <li key={label} className="flex items-start gap-2.5 text-sm text-ink-muted line-through">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted/40" />
                {label}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            {!isPro ? (
              <div className="flex w-full items-center justify-center rounded-2xl border-2 border-black/10 py-3 text-sm font-bold text-ink-muted">
                Plan actual
              </div>
            ) : (
              <Link href="/"
                className="flex w-full items-center justify-center rounded-2xl border-2 border-black/10 py-3 text-sm font-bold text-ink-muted transition hover:border-black/20">
                Volver al inicio
              </Link>
            )}
          </div>
        </div>

        {/* ── Plan Pro ── */}
        <div className="relative flex flex-col rounded-[24px] bg-gradient-to-br from-brand-primary to-[#c0392b] p-7 text-white shadow-2xl">
          {/* Badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold px-4 py-1 text-xs font-extrabold text-[#5b3a0e] shadow">
              <Sparkles className="h-3 w-3" /> RECOMENDADO
            </span>
          </div>

          <div className="mb-1 text-xs font-bold uppercase tracking-widest text-white/60">Plan</div>
          <div className="font-display text-3xl font-black">VecindogPro</div>
          <div className="mt-1">
            <span className="text-3xl font-extrabold">$1.000</span>
            <span className="ml-1 text-sm text-white/70">/ mes</span>
          </div>
          <p className="mt-2 text-sm text-white/80">La experiencia completa para encontrar y cuidar a tu perro.</p>

          <div className="my-6 border-t border-white/20" />

          <ul className="flex-1 space-y-2.5">
            {FEATURES_PRO.map(({ label }) => (
              <li key={label} className="flex items-start gap-2.5 text-sm text-white">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-white/80" />
                {label}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            {isPro ? (
              <div className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/20 py-3 text-sm font-bold text-white">
                <Check className="h-4 w-4" /> Plan activo
              </div>
            ) : !isAuthenticated ? (
              <Link href="/"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-sm font-extrabold text-brand-primary shadow transition hover:opacity-90">
                <Sparkles className="h-4 w-4" /> Iniciá sesión para suscribirte
              </Link>
            ) : (
              <button type="button" onClick={handleSuscribirse}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-sm font-extrabold text-brand-primary shadow transition hover:opacity-90">
                <Sparkles className="h-4 w-4" /> Suscribirme
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-ink-muted">
        Podés pagar con Mercado Pago (saldo, efectivo), tarjeta de débito o crédito.
        La suscripción no se renueva automáticamente — vence a los 30 días.
      </p>

      {/* Modal de pago */}
      <PagoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onMercadoPago={handleMercadoPago}
        precio={1000}
        descripcion="VecindogPro — Suscripción mensual · 30 días de acceso completo"
      />
    </div>
  );
}
