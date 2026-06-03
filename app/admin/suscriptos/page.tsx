'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, Users, Sparkles, CalendarDays, Mail, AlertCircle, Crown, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ADMIN_EMAIL = 'guido-gentili@live.com.ar';

interface Suscripto {
  id:               string;
  nombre:           string;
  apellido:         string;
  email:            string;
  plan:             'free' | 'pro';
  plan_vencimiento: string | null;
  ciudad:           string;
  created_at:       string;
}

export default function AdminSuscriptosPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [lista,    setLista]    = useState<Suscripto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error,    setError]    = useState('');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    if (loading) return;
    if (!user || user.email !== ADMIN_EMAIL) { router.replace('/'); return; }

    supabase.auth.getSession().then(({ data: { session } }) => {
      fetch('/api/admin/suscriptos', {
        headers: session?.access_token
          ? { 'Authorization': `Bearer ${session.access_token}` }
          : {},
      })
        .then((r) => r.json())
        .then((data) => setLista(data.suscriptos ?? []))
        .catch(() => setError('No se pudieron cargar los suscriptos.'))
        .finally(() => setCargando(false));
    });
  }, [user, loading, router]);

  if (loading || cargando) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-brand-primary" />
      </div>
    );
  }

  const pros   = lista.filter((s) => s.plan === 'pro');
  const gratis = lista.filter((s) => s.plan === 'free');

  const filtrados = lista.filter((s) => {
    const q = busqueda.toLowerCase();
    return (
      s.nombre.toLowerCase().includes(q) ||
      s.apellido.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.ciudad?.toLowerCase().includes(q)
    );
  });

  function formatFecha(f: string | null) {
    if (!f) return '—';
    return new Date(f + 'T00:00:00').toLocaleDateString('es-AR', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  }

  function estaVencido(f: string | null) {
    if (!f) return false;
    return new Date(f) < new Date();
  }

  return (
    <div className="mx-auto max-w-5xl py-8 md:py-10">

      {/* Header */}
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary">
          <Users className="h-3.5 w-3.5" /> Admin
        </span>
        <h1 className="mt-2 font-display text-3xl font-black tracking-tight text-ink">
          Suscriptos
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Usuarios registrados en Vecindog y su plan actual.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="card p-5 text-center">
          <p className="font-display text-3xl font-black text-ink">{lista.length}</p>
          <p className="mt-1 text-sm text-ink-muted">Total usuarios</p>
        </div>
        <div className="card p-5 text-center">
          <p className="font-display text-3xl font-black text-[#7c3aed]">{pros.length}</p>
          <p className="mt-1 text-sm text-ink-muted flex items-center justify-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-[#7c3aed]" /> VecindogPro
          </p>
        </div>
        <div className="card p-5 text-center">
          <p className="font-display text-3xl font-black text-ink-muted">{gratis.length}</p>
          <p className="mt-1 text-sm text-ink-muted">Plan Gratis</p>
        </div>
      </div>

      {error && (
        <div className="mb-5 flex items-center gap-2 rounded-2xl bg-bad/10 p-4 text-sm font-bold text-bad">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {/* Buscador */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar por nombre, email o ciudad…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="field pl-9 w-full"
        />
      </div>

      {/* Tabla */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/8 bg-brand-cream/60">
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-ink-muted">Usuario</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-ink-muted">Email</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-ink-muted">Ciudad</th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-ink-muted">Plan</th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-ink-muted">Vencimiento</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm text-ink-muted">
                  {busqueda ? 'No hay resultados para esa búsqueda.' : 'No hay usuarios registrados.'}
                </td>
              </tr>
            ) : filtrados.map((s) => {
              const vencido = estaVencido(s.plan_vencimiento);
              return (
                <tr key={s.id} className="border-b border-black/5 hover:bg-brand-cream/40 transition">
                  <td className="px-4 py-3 font-semibold text-ink">
                    {s.nombre} {s.apellido}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    <a href={`mailto:${s.email}`} className="hover:text-brand-primary hover:underline transition">
                      {s.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{s.ciudad || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    {s.plan === 'pro' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#7c3aed]/10 px-2.5 py-1 text-xs font-bold text-[#7c3aed]">
                        <Crown className="h-3 w-3" /> Pro
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-black/8 px-2.5 py-1 text-xs font-bold text-ink-muted">
                        Gratis
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {s.plan === 'pro' ? (
                      <span className={`text-xs font-bold ${vencido ? 'text-bad' : 'text-good'}`}>
                        <CalendarDays className="inline h-3 w-3 mr-1" />
                        {formatFecha(s.plan_vencimiento)}
                        {vencido && ' (vencido)'}
                      </span>
                    ) : (
                      <span className="text-xs text-ink-muted">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-right text-xs text-ink-muted">
        {filtrados.length} de {lista.length} usuarios
      </p>
    </div>
  );
}
