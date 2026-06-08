'use client';

import Link from 'next/link';
import { MessageCircle, Shield, Lock, Flag, UserPlus, EyeOff } from 'lucide-react';
import ShareButton from '@/components/ShareButton';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  waNumero:   string;
  waTexto:    string;
  animalId:   string;
  sinContacto?: boolean;
}

export default function ContactBlock({ waNumero, waTexto, animalId, sinContacto }: Props) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="card animate-pulse p-6">
        <div className="h-5 w-40 rounded-lg bg-black/10" />
        <div className="mt-4 h-11 w-full rounded-2xl bg-black/10" />
      </div>
    );
  }

  /* ── Invitado o sin sesión: bloquear contacto ── */
  if (!isAuthenticated) {
    return (
      <div className="card overflow-hidden p-0">
        {/* Banner rojo */}
        <div className="flex items-center gap-2 bg-brand-primary px-5 py-3">
          <Lock className="h-4 w-4 shrink-0 text-white/80" />
          <p className="text-sm font-bold text-white">
            Contacto solo para usuarios registrados
          </p>
        </div>

        <div className="p-6">
          {/* Número difuminado */}
          <div className="mb-5 flex flex-col items-center gap-1 rounded-2xl bg-brand-cream py-5">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">WhatsApp</p>
            <p className="select-none text-xl font-extrabold tracking-widest text-ink"
               style={{ filter: 'blur(7px)', userSelect: 'none' }}>
              +54 9 291 555‑9999
            </p>
          </div>

          <p className="mb-4 text-sm text-ink-muted">
            Creá una cuenta gratuita para ver el número y contactar directamente al vecino por WhatsApp.
          </p>

          {/* CTA */}
          <Link
            href="/"
            className="btn-primary w-full justify-center"
            onClick={() => {
              // Forzar que aparezca el modal borrando el flag de invitado
              if (typeof window !== 'undefined') {
                localStorage.removeItem('vecindog_guest');
                window.location.href = '/';
              }
            }}
          >
            <UserPlus className="h-5 w-5" />
            Crear cuenta gratis
          </Link>

          <p className="mt-3 inline-flex items-start gap-1.5 text-xs text-ink-muted">
            <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-primary" />
            Es gratis, sin spam. Solo para proteger a la comunidad.
          </p>
        </div>
      </div>
    );
  }

  /* ── Sin contacto: quien lo vio no quiere recibir mensajes ── */
  if (sinContacto) {
    return (
      <div className="card p-6">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-black/5">
            <EyeOff className="h-5 w-5 text-ink-muted" />
          </div>
          <div>
            <h2 className="font-display text-base font-extrabold text-ink">Sin contacto directo</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Quien publicó este aviso prefirió no dejar su número. Podés compartir el aviso para que llegue a más personas.
            </p>
          </div>
        </div>
        <div className="mt-4">
          <ShareButton
            label="Compartir aviso"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-2xl border-2 border-black/10 bg-white px-3 py-2.5 text-sm font-bold text-ink transition hover:border-brand-primary hover:text-brand-primary"
          />
        </div>
      </div>
    );
  }

  /* ── Autenticado: mostrar WhatsApp ── */
  return (
    <div className="card p-6">
      <h2 className="font-display text-base font-extrabold text-ink">
        Contactá al vecino
      </h2>
      <p className="mt-1 text-sm text-ink-muted">
        El contacto es directo por WhatsApp. Coordiná en un lugar seguro.
      </p>
      <a
        href={`https://wa.me/${waNumero}?text=${waTexto}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary mt-4 w-full"
      >
        <MessageCircle className="h-5 w-5" /> Escribir por WhatsApp
      </a>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <ShareButton
          label="Compartir"
          className="inline-flex items-center justify-center gap-1.5 rounded-2xl border-2 border-black/10 bg-white px-3 py-2.5 text-sm font-bold text-ink transition hover:border-brand-primary hover:text-brand-primary"
        />
        <Link
          href={`mailto:hola@mivecindog.com.ar?subject=Reporte%20aviso%20${animalId}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-2xl border-2 border-black/10 bg-white px-3 py-2.5 text-sm font-bold text-ink transition hover:border-bad hover:text-bad"
        >
          <Flag className="h-4 w-4" /> Reportar
        </Link>
      </div>

      <p className="mt-4 inline-flex items-start gap-1.5 text-xs text-ink-muted">
        <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-primary" />
        Nunca pagues recompensas por adelantado. Encuéntrense en un lugar visible.
      </p>
    </div>
  );
}
