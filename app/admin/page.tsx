'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Users, Sparkles, Megaphone, TrendingUp, UserCheck, AlertTriangle, MapPin, Phone, Mail, ExternalLink, Crown, Dog, Syringe, ChevronDown, ChevronUp, ArrowDownAZ, Clock, PauseCircle, Trash2, PlayCircle, FileText, CheckCircle2, X, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { type Profile } from '@/contexts/AuthContext';
import { type Perro as PerroCompleto } from '@/lib/perros';
import { supabase } from '@/lib/supabase';
import PerroDocumento from '@/components/PerroDocumento';

const ADMIN_EMAIL = 'guido-gentili@live.com.ar';

interface Usuario {
  id:          string;
  email:       string;
  created_at:  string;
  nombre:      string;
  apellido:    string;
  telefono:    string;
  ciudad:      string;
  provincia:   string;
  direccion:   string;
  plan:        string;
  suspendido?: boolean;
}

interface PostAdmin {
  id:        string;
  categoria: string;
  nombre:    string | null;
  zona:      string;
  fecha:     string;
  estado:    string;
  images:    string[];
}

interface PerroRow {
  id:           string;
  nombre:       string;
  raza:         string;
  color:        string;
  tamano:       string;
  tieneVacunas: boolean;
  cantVacunas:  number;
}

interface Stats {
  cuentas: {
    total:       number;
    pro:         number;
    gratis:      number;
    proVencidos: number;
  };
  negocios: {
    total:   number;
    activos: number;
  };
  ultimosUsuarios: Usuario[];
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const tokenRef   = useRef('');
  const [stats,      setStats]      = useState<Stats | null>(null);
  const [cargando,   setCargando]   = useState(true);
  const [error,      setError]      = useState('');
  const [perrosMap,  setPerrosMap]  = useState<Record<string, PerroRow[]>>({});
  const [postsMap,   setPostsMap]   = useState<Record<string, PostAdmin[]>>({});
  const [expandido,  setExpandido]  = useState<{ uid: string; tipo: 'perros' | 'avisos' } | null>(null);
  const [loadingExp, setLoadingExp] = useState<string | null>(null);
  const [orden,       setOrden]       = useState<'az' | 'recientes'>('az');
  const [accionando,  setAccionando]  = useState<string | null>(null);
  const [confirmar,   setConfirmar]   = useState<{ uid: string; accion: 'pausar' | 'eliminar' } | null>(null);
  const [planModal,     setPlanModal]     = useState<{ uid: string; nombre: string; plan: string } | null>(null);
  const [nuevoPlan,     setNuevoPlan]     = useState<'free' | 'pro'>('free');
  const [planVenc,      setPlanVenc]      = useState('');
  const [guardandoPlan, setGuardandoPlan] = useState(false);
  const [carnetModal,   setCarnetModal]   = useState<{ perro: PerroCompleto; profile: Profile | null } | null>(null);
  const [loadingCarnet, setLoadingCarnet] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user || user.email !== ADMIN_EMAIL) { router.replace('/'); return; }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.access_token) { setError('Sin sesión'); setCargando(false); return; }
      tokenRef.current = session.access_token;

      fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.error) { setError(data.error); return; }
          setStats(data);
        })
        .catch(() => setError('No se pudieron cargar los datos.'))
        .finally(() => setCargando(false));
    });
  }, [user, loading, router]);

  async function ejecutarAccion(uid: string, accion: 'pausar' | 'reactivar' | 'eliminar') {
    setAccionando(uid); setConfirmar(null);
    try {
      await fetch('/api/admin/user-action', {
        method:  'POST',
        headers: { 'Authorization': `Bearer ${tokenRef.current}`, 'Content-Type': 'application/json' },
        body:    JSON.stringify({ uid, accion }),
      });
      if (accion === 'eliminar') {
        setStats((prev) => prev ? {
          ...prev,
          ultimosUsuarios: prev.ultimosUsuarios.filter((u) => u.id !== uid),
          cuentas: { ...prev.cuentas, total: prev.cuentas.total - 1 },
        } : prev);
      } else {
        setStats((prev) => prev ? {
          ...prev,
          ultimosUsuarios: prev.ultimosUsuarios.map((u) =>
            u.id === uid ? { ...u, suspendido: accion === 'pausar' } : u
          ),
        } : prev);
      }
    } finally {
      setAccionando(null);
    }
  }

  async function verCarnet(perroId: string) {
    setLoadingCarnet(perroId);
    try {
      const res  = await fetch(`/api/admin/perro-carnet?perroId=${perroId}`, {
        headers: { Authorization: `Bearer ${tokenRef.current}` },
      });
      const data = await res.json();
      if (data.perro) setCarnetModal({ perro: data.perro as PerroCompleto, profile: data.profile as Profile | null });
    } finally {
      setLoadingCarnet(null);
    }
  }

  async function cambiarPlan() {
    if (!planModal) return;
    setGuardandoPlan(true);
    try {
      await fetch('/api/admin/user-plan', {
        method:  'POST',
        headers: { 'Authorization': `Bearer ${tokenRef.current}`, 'Content-Type': 'application/json' },
        body:    JSON.stringify({ uid: planModal.uid, plan: nuevoPlan, plan_vencimiento: nuevoPlan === 'pro' && planVenc ? planVenc : null }),
      });
      setStats((prev) => {
        if (!prev) return prev;
        const oldPlan    = planModal.plan;
        const proDelta   = (nuevoPlan === 'pro'  ? 1 : 0) - (oldPlan === 'pro'  ? 1 : 0);
        const gratisDelta = (nuevoPlan === 'free' ? 1 : 0) - (oldPlan === 'free' ? 1 : 0);
        return {
          ...prev,
          ultimosUsuarios: prev.ultimosUsuarios.map((u) =>
            u.id === planModal.uid ? { ...u, plan: nuevoPlan } : u
          ),
          cuentas: {
            ...prev.cuentas,
            pro:    prev.cuentas.pro    + proDelta,
            gratis: prev.cuentas.gratis + gratisDelta,
          },
        };
      });
      setPlanModal(null);
    } finally {
      setGuardandoPlan(false);
    }
  }

  async function toggleSeccion(uid: string, tipo: 'perros' | 'avisos') {
    if (expandido?.uid === uid && expandido?.tipo === tipo) { setExpandido(null); return; }
    setExpandido({ uid, tipo });
    const yaCache = tipo === 'perros' ? perrosMap[uid] : postsMap[uid];
    if (yaCache !== undefined) return;
    setLoadingExp(uid + tipo);
    try {
      const endpoint = tipo === 'perros' ? `/api/admin/user-dogs?uid=${uid}` : `/api/admin/user-posts?uid=${uid}`;
      const res  = await fetch(endpoint, { headers: { Authorization: `Bearer ${tokenRef.current}` } });
      const data = await res.json();
      if (tipo === 'perros') setPerrosMap((prev) => ({ ...prev, [uid]: data.perros ?? [] }));
      else                   setPostsMap ((prev) => ({ ...prev, [uid]: data.posts  ?? [] }));
    } finally {
      setLoadingExp(null);
    }
  }

  if (loading || cargando) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <AlertTriangle className="mx-auto h-10 w-10 text-bad" />
        <p className="mt-4 font-bold text-ink">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  const STAT_CARDS = [
    { label: 'Cuentas totales',   val: stats.cuentas.total,       icon: Users,      color: 'text-ink',          bg: 'bg-black/5' },
    { label: 'VecindogPro',       val: stats.cuentas.pro,         icon: Sparkles,   color: 'text-[#7c3aed]',    bg: 'bg-[#7c3aed]/10' },
    { label: 'Plan Gratis',       val: stats.cuentas.gratis,      icon: UserCheck,  color: 'text-ink-muted',    bg: 'bg-black/5' },
    { label: 'Pro vencidos',      val: stats.cuentas.proVencidos, icon: AlertTriangle, color: 'text-bad',       bg: 'bg-bad/10' },
    { label: 'Negocios anunc.',   val: stats.negocios.total,      icon: Megaphone,  color: 'text-brand-primary',bg: 'bg-brand-primary/10' },
    { label: 'Anuncios activos',  val: stats.negocios.activos,    icon: TrendingUp, color: 'text-good',         bg: 'bg-good/10' },
  ];

  return (
    <div className="mx-auto max-w-3xl py-8 md:py-10">

      <div className="mb-8">
        <h1 className="font-display text-3xl font-black tracking-tight text-ink">Panel</h1>
        <p className="mt-1 text-sm text-ink-muted">Resumen de Vecindog</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 mb-8">
        {STAT_CARDS.map(({ label, val, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5 flex items-center gap-4">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <p className={`font-display text-2xl font-black ${color}`}>{val}</p>
              <p className="text-xs text-ink-muted leading-tight">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lista de usuarios */}
      <div className="card overflow-hidden">
        <div className="border-b border-black/8 px-5 py-4 flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-display text-base font-extrabold text-ink">
            <Users className="h-4 w-4 text-brand-primary" /> Usuarios ({stats.ultimosUsuarios.length})
          </h2>
          {/* Toggle orden */}
          <div className="flex rounded-xl border border-black/10 overflow-hidden text-xs font-bold">
            <button
              type="button"
              onClick={() => setOrden('az')}
              className={`flex items-center gap-1 px-3 py-1.5 transition ${orden === 'az' ? 'bg-brand-primary text-white' : 'text-ink-muted hover:bg-brand-cream'}`}
            >
              <ArrowDownAZ className="h-3.5 w-3.5" /> A-Z
            </button>
            <button
              type="button"
              onClick={() => setOrden('recientes')}
              className={`flex items-center gap-1 px-3 py-1.5 transition ${orden === 'recientes' ? 'bg-brand-primary text-white' : 'text-ink-muted hover:bg-brand-cream'}`}
            >
              <Clock className="h-3.5 w-3.5" /> Recientes
            </button>
          </div>
        </div>
        {/* Contenedor scrollable */}
        <ul className="divide-y divide-black/5 max-h-[600px] overflow-y-auto">
          {[...stats.ultimosUsuarios].sort((a, b) => {
            if (orden === 'recientes') {
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
            const na = `${a.nombre} ${a.apellido}`.toLowerCase().trim();
            const nb = `${b.nombre} ${b.apellido}`.toLowerCase().trim();
            return na.localeCompare(nb, 'es');
          }).map((u) => {
            const nombreCompleto = [u.nombre, u.apellido].filter(Boolean).join(' ') || '(sin nombre)';
            const ubicacion      = [u.ciudad, u.provincia].filter(Boolean).join(', ');
            return (
              <li key={u.id} className="px-5 py-4 hover:bg-brand-cream/40 transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-1">
                    {/* Nombre + badge plan */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-ink">{nombreCompleto}</p>
                      {u.plan === 'pro' && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-[#7c3aed]/10 px-2 py-0.5 text-[10px] font-bold text-[#7c3aed]">
                          <Crown className="h-2.5 w-2.5" /> Pro
                        </span>
                      )}
                      <span className="text-xs text-ink-muted">
                        · {new Date(u.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                      <Mail className="h-3 w-3 shrink-0" />
                      <a href={`mailto:${u.email}`} className="hover:text-brand-primary hover:underline transition truncate">
                        {u.email}
                      </a>
                    </div>

                    {/* Teléfono */}
                    {u.telefono && (
                      <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                        <Phone className="h-3 w-3 shrink-0" />
                        <a href={`tel:${u.telefono}`} className="hover:text-brand-primary transition">
                          {u.telefono}
                        </a>
                      </div>
                    )}

                    {/* Dirección */}
                    {(u.direccion || ubicacion) && (
                      <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span>{[u.direccion, ubicacion].filter(Boolean).join(' — ')}</span>
                      </div>
                    )}
                  </div>

                  {/* Botones */}
                  <div className="shrink-0 flex flex-col gap-1.5">
                    <button type="button" onClick={() => toggleSeccion(u.id, 'avisos')}
                      className={`inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${expandido?.uid === u.id && expandido?.tipo === 'avisos' ? 'border-brand-primary bg-brand-primary/10 text-brand-primary' : 'border-brand-primary/30 text-brand-primary hover:bg-brand-primary/10'}`}>
                      <FileText className="h-3 w-3" /> Avisos
                      {expandido?.uid === u.id && expandido?.tipo === 'avisos' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                    <button type="button" onClick={() => toggleSeccion(u.id, 'perros')}
                      className={`inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${expandido?.uid === u.id && expandido?.tipo === 'perros' ? 'border-black/30 bg-black/8 text-ink' : 'border-black/15 text-ink-muted hover:border-brand-primary/30 hover:text-brand-primary'}`}>
                      <Dog className="h-3 w-3" /> Perros
                      {expandido?.uid === u.id && expandido?.tipo === 'perros' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                    <button type="button"
                      onClick={() => { setPlanModal({ uid: u.id, nombre: nombreCompleto, plan: u.plan }); setNuevoPlan(u.plan === 'pro' ? 'pro' : 'free'); setPlanVenc(''); }}
                      className="inline-flex items-center gap-1 rounded-xl border border-[#7c3aed]/30 bg-[#7c3aed]/5 px-3 py-1.5 text-xs font-bold text-[#7c3aed] hover:bg-[#7c3aed]/10 transition">
                      <Crown className="h-3 w-3" /> Plan
                    </button>
                    {u.suspendido ? (
                      <button type="button" disabled={accionando === u.id}
                        onClick={() => ejecutarAccion(u.id, 'reactivar')}
                        className="inline-flex items-center gap-1 rounded-xl border border-good/40 bg-good/5 px-3 py-1.5 text-xs font-bold text-good hover:bg-good/10 transition disabled:opacity-60">
                        <PlayCircle className="h-3 w-3" /> Reactivar
                      </button>
                    ) : (
                      <button type="button" disabled={accionando === u.id}
                        onClick={() => setConfirmar({ uid: u.id, accion: 'pausar' })}
                        className="inline-flex items-center gap-1 rounded-xl border border-warn/40 bg-warn/5 px-3 py-1.5 text-xs font-bold text-[#7a4f00] hover:bg-warn/10 transition disabled:opacity-60">
                        <PauseCircle className="h-3 w-3" /> Pausar
                      </button>
                    )}
                    <button type="button" disabled={accionando === u.id}
                      onClick={() => setConfirmar({ uid: u.id, accion: 'eliminar' })}
                      className="inline-flex items-center gap-1 rounded-xl border border-bad/30 bg-bad/5 px-3 py-1.5 text-xs font-bold text-bad hover:bg-bad/10 transition disabled:opacity-60">
                      <Trash2 className="h-3 w-3" /> Eliminar
                    </button>
                  </div>
                </div>

                {/* Panel expandible — Perros o Avisos */}
                {expandido?.uid === u.id && (
                  <div className="mt-3 rounded-2xl border border-black/8 bg-brand-cream/50 p-3">
                    {loadingExp === u.id + expandido.tipo ? (
                      <div className="flex items-center gap-2 text-xs text-ink-muted">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Cargando {expandido.tipo}…
                      </div>

                    ) : expandido.tipo === 'perros' ? (
                      !perrosMap[u.id] || perrosMap[u.id].length === 0 ? (
                        <p className="text-xs text-ink-muted">Sin perros registrados.</p>
                      ) : (
                        <ul className="space-y-1.5">
                          {perrosMap[u.id].map((p) => (
                            <li key={p.id} className="flex items-center gap-2 text-xs">
                              <Dog className="h-3.5 w-3.5 shrink-0 text-brand-primary" />
                              <button
                                type="button"
                                onClick={() => verCarnet(p.id)}
                                disabled={loadingCarnet === p.id}
                                className="font-bold text-ink hover:text-brand-primary hover:underline transition disabled:opacity-60 flex items-center gap-1"
                              >
                                {loadingCarnet === p.id
                                  ? <Loader2 className="h-3 w-3 animate-spin" />
                                  : <><CreditCard className="h-3 w-3 opacity-50" /> {p.nombre}</>
                                }
                              </button>
                              {[p.raza, p.color, p.tamano].filter(Boolean).length > 0 && (
                                <span className="text-ink-muted">· {[p.raza, p.color, p.tamano].filter(Boolean).join(', ')}</span>
                              )}
                              {p.tieneVacunas ? (
                                <span className="ml-auto inline-flex items-center gap-0.5 rounded-full bg-good/15 px-2 py-0.5 font-bold text-good">
                                  <Syringe className="h-2.5 w-2.5" /> {p.cantVacunas} vacuna{p.cantVacunas !== 1 ? 's' : ''}
                                </span>
                              ) : (
                                <span className="ml-auto inline-flex items-center rounded-full bg-black/8 px-2 py-0.5 font-bold text-ink-muted">
                                  Sin vacunas
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )

                    ) : (
                      !postsMap[u.id] || postsMap[u.id].length === 0 ? (
                        <p className="text-xs text-ink-muted">Sin avisos publicados.</p>
                      ) : (
                        <ul className="space-y-1.5">
                          {postsMap[u.id].map((p) => {
                            const catColor: Record<string, string> = {
                              perdido: 'text-lost', encontrado: 'text-found',
                              adopcion: 'text-[#7a4f00]', transito: 'text-[#7c3aed]',
                            };
                            const catLabel: Record<string, string> = {
                              perdido: 'Perdido', encontrado: 'Visto',
                              adopcion: 'Adopción', transito: 'Tránsito',
                            };
                            return (
                              <li key={p.id} className="flex items-center gap-2 text-xs">
                                <FileText className={`h-3.5 w-3.5 shrink-0 ${catColor[p.categoria] ?? 'text-ink-muted'}`} />
                                <span className="font-bold text-ink">{p.nombre ?? 'Sin nombre'}</span>
                                <span className="text-ink-muted">· {p.zona} · {p.fecha}</span>
                                <span className={`ml-auto shrink-0 font-bold ${catColor[p.categoria] ?? ''}`}>
                                  {catLabel[p.categoria] ?? p.categoria}
                                </span>
                                {p.estado === 'resuelto' ? (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-good shrink-0" />
                                ) : (
                                  <span className="h-2 w-2 rounded-full bg-good shrink-0" />
                                )}
                                <a href={`/publicaciones/${p.id}`} target="_blank" rel="noopener noreferrer"
                                  className="shrink-0 text-brand-primary hover:underline">
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      )
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Modal carnet de mascota */}
      {carnetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md">
            {/* Botón cerrar */}
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => setCarnetModal(null)}
                className="flex items-center gap-1.5 rounded-2xl bg-white/90 px-4 py-2 text-sm font-bold text-ink shadow-lg hover:bg-white transition"
              >
                <X className="h-4 w-4" /> Cerrar
              </button>
            </div>
            <PerroDocumento
              perro={carnetModal.perro}
              profile={carnetModal.profile}
              perdido={false}
            />
          </div>
        </div>
      )}

      {/* Modal cambio de plan */}
      {planModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-[28px] bg-white p-7 shadow-2xl">
            <h3 className="font-display text-lg font-black text-ink">Plan de {planModal.nombre}</h3>
            <p className="mt-1 mb-5 text-xs text-ink-muted">
              Plan actual:{' '}
              {planModal.plan === 'pro'
                ? <span className="inline-flex items-center gap-0.5 rounded-full bg-[#7c3aed]/10 px-2 py-0.5 font-bold text-[#7c3aed]"><Crown className="h-2.5 w-2.5" /> Pro</span>
                : <span className="font-bold">Gratis</span>
              }
            </p>

            <div className="space-y-2 mb-5">
              {(['free', 'pro'] as const).map((p) => (
                <button key={p} type="button" onClick={() => setNuevoPlan(p)}
                  className={`w-full flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-sm font-bold transition ${
                    nuevoPlan === p
                      ? p === 'pro' ? 'border-[#7c3aed] bg-[#7c3aed]/5 text-[#7c3aed]' : 'border-brand-primary bg-brand-primary/5 text-ink'
                      : 'border-black/10 text-ink-muted hover:border-black/20'
                  }`}>
                  <div className={`h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center ${nuevoPlan === p ? (p === 'pro' ? 'border-[#7c3aed]' : 'border-brand-primary') : 'border-black/20'}`}>
                    {nuevoPlan === p && <div className={`h-2 w-2 rounded-full ${p === 'pro' ? 'bg-[#7c3aed]' : 'bg-brand-primary'}`} />}
                  </div>
                  {p === 'pro' ? <><Crown className="h-3.5 w-3.5" /> VecindogPro</> : 'Gratis'}
                </button>
              ))}
            </div>

            {nuevoPlan === 'pro' && (
              <div className="mb-5">
                <label className="text-xs font-bold text-ink-muted mb-1.5 block">
                  Vencimiento <span className="font-normal">(opcional — vacío = sin vencimiento)</span>
                </label>
                <input type="date" value={planVenc} onChange={(e) => setPlanVenc(e.target.value)}
                  className="w-full rounded-xl border border-black/15 px-3 py-2 text-sm text-ink focus:border-[#7c3aed] focus:outline-none transition" />
              </div>
            )}

            <div className="flex gap-2">
              <button type="button" onClick={cambiarPlan} disabled={guardandoPlan}
                className="flex-1 rounded-2xl py-2.5 text-sm font-extrabold text-white bg-[#7c3aed] hover:opacity-90 transition disabled:opacity-60">
                {guardandoPlan ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : 'Guardar'}
              </button>
              <button type="button" onClick={() => setPlanModal(null)}
                className="flex-1 rounded-2xl border-2 border-black/10 py-2.5 text-sm font-bold text-ink-muted transition hover:border-black/20">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      {confirmar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-[28px] bg-white p-7 shadow-2xl">
            <h3 className="font-display text-lg font-black text-ink">
              {confirmar.accion === 'eliminar' ? '¿Eliminar usuario?' : '¿Pausar usuario?'}
            </h3>
            <p className="mt-2 text-sm text-ink-muted leading-relaxed">
              {confirmar.accion === 'eliminar'
                ? 'Esta acción es irreversible. Se borrará la cuenta, el perfil y todos sus datos de Vecindog.'
                : 'El usuario recibirá un email avisando que su cuenta está siendo revisada, y no podrá acceder a la app hasta que la reactives.'}
            </p>
            <div className="mt-5 flex gap-2">
              <button type="button"
                onClick={() => ejecutarAccion(confirmar.uid, confirmar.accion)}
                disabled={!!accionando}
                className={`flex-1 rounded-2xl py-2.5 text-sm font-extrabold text-white transition disabled:opacity-60 ${
                  confirmar.accion === 'eliminar' ? 'bg-bad hover:bg-bad/90' : 'bg-[#b45309] hover:opacity-90'
                }`}>
                {accionando
                  ? <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                  : confirmar.accion === 'eliminar' ? 'Sí, eliminar' : 'Sí, pausar'}
              </button>
              <button type="button" onClick={() => setConfirmar(null)}
                className="flex-1 rounded-2xl border-2 border-black/10 py-2.5 text-sm font-bold text-ink-muted transition hover:border-black/20">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
