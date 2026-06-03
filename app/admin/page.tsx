'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Users, Sparkles, Megaphone, TrendingUp, UserCheck, AlertTriangle, MapPin, Phone, Mail, ExternalLink, Crown, Dog, Syringe, ChevronDown, ChevronUp, ArrowDownAZ, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const ADMIN_EMAIL = 'guido-gentili@live.com.ar';

interface Usuario {
  id:         string;
  email:      string;
  created_at: string;  // ISO string
  nombre:     string;
  apellido:   string;
  telefono:   string;
  ciudad:     string;
  provincia:  string;
  direccion:  string;
  plan:       string;
}

interface Perro {
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
  const [perrosMap,  setPerrosMap]  = useState<Record<string, Perro[]>>({});
  const [expandido,  setExpandido]  = useState<string | null>(null);
  const [loadingDog, setLoadingDog] = useState<string | null>(null);
  const [orden,      setOrden]      = useState<'az' | 'recientes'>('az');

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

  async function togglePerros(uid: string, token: string) {
    if (expandido === uid) { setExpandido(null); return; }
    setExpandido(uid);
    if (perrosMap[uid]) return; // ya cargados
    setLoadingDog(uid);
    try {
      const res  = await fetch(`/api/admin/user-dogs?uid=${uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPerrosMap((prev) => ({ ...prev, [uid]: data.perros ?? [] }));
    } finally {
      setLoadingDog(null);
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
                    <a
                      href={`/publicaciones?uid=${u.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-xl border border-brand-primary/30 px-3 py-1.5 text-xs font-bold text-brand-primary hover:bg-brand-primary/10 transition"
                    >
                      <ExternalLink className="h-3 w-3" /> Avisos
                    </a>
                    <button
                      type="button"
                      onClick={() => togglePerros(u.id, tokenRef.current)}
                      className="inline-flex items-center gap-1 rounded-xl border border-black/15 px-3 py-1.5 text-xs font-bold text-ink-muted hover:border-brand-primary/30 hover:text-brand-primary transition"
                    >
                      <Dog className="h-3 w-3" />
                      Perros
                      {expandido === u.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                  </div>
                </div>

                {/* Panel de perros expandible */}
                {expandido === u.id && (
                  <div className="mt-3 ml-0 rounded-2xl border border-black/8 bg-brand-cream/50 p-3">
                    {loadingDog === u.id ? (
                      <div className="flex items-center gap-2 text-xs text-ink-muted">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Cargando perros…
                      </div>
                    ) : !perrosMap[u.id] || perrosMap[u.id].length === 0 ? (
                      <p className="text-xs text-ink-muted">Sin perros registrados.</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {perrosMap[u.id].map((p) => (
                          <li key={p.id} className="flex items-center gap-2 text-xs">
                            <Dog className="h-3.5 w-3.5 shrink-0 text-brand-primary" />
                            <span className="font-bold text-ink">{p.nombre}</span>
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
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
