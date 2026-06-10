'use client';

import { useEffect, useState, useRef } from 'react';
import { Users, Search, X, Loader2, UserPlus, CheckCircle2, Clock, Dog, UserMinus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  buscarPerrosPorNombre,
  listarMisAmistades,
  enviarSolicitud,
  aceptarSolicitud,
  rechazarEliminarAmistad,
  type Amistad,
} from '@/lib/amistades';
import { supabase } from '@/lib/supabase';

interface PerroResult {
  perro_id:       string;
  nombre:         string;
  raza:           string | null;
  foto_url:       string | null;
  owner_id:       string;
  owner_nombre:   string | null;
  owner_apellido: string | null;
  owner_ciudad:   string | null;
}

export default function AmigosPanel({ onClose }: { onClose: () => void }) {
  const { user, profile } = useAuth();
  const [tab, setTab]           = useState<'amigos' | 'buscar'>('amigos');
  const [query, setQuery]       = useState('');
  const [resultados, setResultados] = useState<PerroResult[]>([]);
  const [buscando,  setBuscando]    = useState(false);
  const [amistades, setAmistades]   = useState<Amistad[]>([]);
  const [perfilesMap, setPerfilesMap] = useState<Record<string, { nombre: string | null; apellido: string | null; foto_url: string | null; ciudad: string | null }>>({});
  const [accionando, setAccionando] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRef    = useRef<HTMLDivElement>(null);

  // Cerrar al click afuera
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  // Cargar amistades al abrir
  useEffect(() => {
    if (!user) return;
    listarMisAmistades(user.id).then(async (amis) => {
      setAmistades(amis);
      // Cargar perfiles de amigos
      const ids = amis.map((a) =>
        a.solicitante_id === user.id ? a.receptor_id : a.solicitante_id,
      );
      if (!ids.length) return;
      const { data } = await supabase
        .from('profiles')
        .select('id, nombre, apellido, foto_url, ciudad')
        .in('id', ids);
      const map: typeof perfilesMap = {};
      for (const p of data ?? []) map[p.id] = p;
      setPerfilesMap(map);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Buscar perros con debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) { setResultados([]); return; }
    debounceRef.current = setTimeout(async () => {
      setBuscando(true);
      try {
        const res = await buscarPerrosPorNombre(query);
        // Excluir perros propios
        setResultados(res.filter((r) => r.owner_id !== user?.id));
      } finally {
        setBuscando(false);
      }
    }, 400);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Aceptadas
  const amigoIds = new Set(
    amistades.filter(a => a.estado === 'aceptada').map(a =>
      a.solicitante_id === user?.id ? a.receptor_id : a.solicitante_id
    )
  );
  // Pendientes enviadas
  const pendientesEnviadas = new Set(
    amistades.filter(a => a.estado === 'pendiente' && a.solicitante_id === user?.id).map(a => a.receptor_id)
  );
  // Pendientes recibidas
  const pendientesRecibidas = amistades.filter(
    a => a.estado === 'pendiente' && a.receptor_id === user?.id
  );

  async function handleEnviar(ownerId: string) {
    if (!user) return;
    setAccionando(ownerId);
    try {
      await enviarSolicitud(user.id, ownerId, profile?.nombre ?? 'Alguien');
      // Recargar amistades
      const amis = await listarMisAmistades(user.id);
      setAmistades(amis);
    } finally {
      setAccionando(null);
    }
  }

  async function handleAceptar(amistadId: string, solicitanteId: string) {
    setAccionando(amistadId);
    try {
      await aceptarSolicitud(amistadId);
      // Notificar al solicitante
      await supabase.from('notifications').insert({
        user_id: solicitanteId,
        post_id: null,
        tipo:    'amistad_aceptada',
        mensaje: `${profile?.nombre ?? 'Tu vecino'} aceptó tu solicitud de amistad 🐾`,
        leida:   false,
      });
      const amis = await listarMisAmistades(user!.id);
      setAmistades(amis);
    } finally {
      setAccionando(null);
    }
  }

  async function handleEliminar(amistadId: string) {
    setAccionando(amistadId);
    try {
      await rechazarEliminarAmistad(amistadId);
      setAmistades(prev => prev.filter(a => a.id !== amistadId));
    } finally {
      setAccionando(null);
    }
  }

  const amigosAceptados = amistades.filter(a => a.estado === 'aceptada');

  return (
    <div
      ref={panelRef}
      className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-2xl ring-1 ring-black/10 sm:inset-y-4 sm:right-4 sm:rounded-3xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-brand-primary" />
          <h2 className="font-display text-lg font-black text-ink">Amigos</h2>
          {amigosAceptados.length > 0 && (
            <span className="rounded-full bg-brand-primary/10 px-2 py-0.5 text-xs font-bold text-brand-primary">
              {amigosAceptados.length}
            </span>
          )}
        </div>
        <button type="button" onClick={onClose} className="rounded-xl p-1.5 hover:bg-black/5">
          <X className="h-5 w-5 text-ink-muted" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-black/5 px-4 pt-2">
        {(['amigos', 'buscar'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`mr-4 pb-2.5 text-sm font-bold transition border-b-2 ${
              tab === t
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            {t === 'amigos' ? 'Mis amigos' : 'Buscar perro'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* ── TAB AMIGOS ── */}
        {tab === 'amigos' && (
          <>
            {/* Solicitudes recibidas pendientes */}
            {pendientesRecibidas.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
                  Solicitudes recibidas ({pendientesRecibidas.length})
                </p>
                {pendientesRecibidas.map((a) => {
                  const p = perfilesMap[a.solicitante_id];
                  return (
                    <div key={a.id} className="flex items-center gap-3 rounded-2xl bg-brand-primary/5 p-3">
                      <AvatarCircle nombre={p?.nombre} fotoUrl={p?.foto_url} />
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-bold text-sm text-ink">
                          {p?.nombre ?? 'Usuario'} {p?.apellido ?? ''}
                        </p>
                        {p?.ciudad && <p className="truncate text-xs text-ink-muted">{p.ciudad}</p>}
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          disabled={accionando === a.id}
                          onClick={() => handleAceptar(a.id, a.solicitante_id)}
                          className="rounded-xl bg-good/10 px-2.5 py-1.5 text-xs font-bold text-good hover:bg-good/20 disabled:opacity-60 transition"
                        >
                          {accionando === a.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : '✓ Aceptar'}
                        </button>
                        <button
                          type="button"
                          disabled={accionando === a.id}
                          onClick={() => handleEliminar(a.id)}
                          className="rounded-xl bg-black/5 px-2.5 py-1.5 text-xs font-bold text-ink-muted hover:bg-black/10 transition"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Lista de amigos aceptados */}
            {amigosAceptados.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
                  Amigos ({amigosAceptados.length})
                </p>
                {amigosAceptados.map((a) => {
                  const friendId = a.solicitante_id === user?.id ? a.receptor_id : a.solicitante_id;
                  const p = perfilesMap[friendId];
                  return (
                    <div key={a.id} className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-3">
                      <AvatarCircle nombre={p?.nombre} fotoUrl={p?.foto_url} />
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-bold text-sm text-ink">
                          {p?.nombre ?? 'Usuario'} {p?.apellido ?? ''}
                        </p>
                        {p?.ciudad && <p className="truncate text-xs text-ink-muted">{p.ciudad}</p>}
                      </div>
                      <button
                        type="button"
                        disabled={accionando === a.id}
                        onClick={() => handleEliminar(a.id)}
                        title="Eliminar amigo"
                        className="rounded-xl p-1.5 text-ink-muted/40 hover:bg-bad/10 hover:text-bad transition disabled:opacity-60"
                      >
                        <UserMinus className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : pendientesRecibidas.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-cream text-brand-primary">
                  <Users className="h-7 w-7" />
                </div>
                <p className="font-display font-extrabold text-ink">Todavía no tenés amigos</p>
                <p className="text-sm text-ink-muted">
                  Buscá el nombre del perro de tu vecino y mandále una solicitud.
                </p>
                <button
                  type="button"
                  onClick={() => setTab('buscar')}
                  className="btn-primary mt-1"
                >
                  Buscar perro
                </button>
              </div>
            ) : null}
          </>
        )}

        {/* ── TAB BUSCAR ── */}
        {tab === 'buscar' && (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input
                type="text"
                className="field pl-9"
                placeholder="Nombre del perro o dueño…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              {buscando && (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-ink-muted" />
              )}
            </div>

            {query.trim().length > 0 && resultados.length === 0 && !buscando && (
              <p className="py-6 text-center text-sm text-ink-muted">
                No encontramos ningún perro con ese nombre.
              </p>
            )}

            {resultados.length > 0 && (
              <div className="space-y-2">
                {resultados.map((r) => {
                  const yaAmigo   = amigoIds.has(r.owner_id);
                  const pendiente = pendientesEnviadas.has(r.owner_id);
                  return (
                    <div key={r.perro_id} className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-3">
                      {r.foto_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={r.foto_url} alt={r.nombre}
                          className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                      ) : (
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-cream">
                          <Dog className="h-6 w-6 text-brand-primary/40" />
                        </span>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-bold text-sm text-ink">{r.nombre}</p>
                        <p className="truncate text-xs text-ink-muted">
                          de {r.owner_nombre ?? 'Usuario'}
                          {r.raza ? ` · ${r.raza}` : ''}
                          {r.owner_ciudad ? ` · ${r.owner_ciudad}` : ''}
                        </p>
                      </div>
                      {yaAmigo ? (
                        <span className="flex items-center gap-1 rounded-full bg-good/10 px-2.5 py-1 text-xs font-bold text-good">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Amigos
                        </span>
                      ) : pendiente ? (
                        <span className="flex items-center gap-1 rounded-full bg-black/8 px-2.5 py-1 text-xs font-bold text-ink-muted">
                          <Clock className="h-3.5 w-3.5" /> Pendiente
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={accionando === r.owner_id}
                          onClick={() => handleEnviar(r.owner_id)}
                          className="flex items-center gap-1 rounded-full bg-brand-primary/10 px-2.5 py-1 text-xs font-bold text-brand-primary hover:bg-brand-primary/20 disabled:opacity-60 transition"
                        >
                          {accionando === r.owner_id
                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            : <><UserPlus className="h-3.5 w-3.5" /> Agregar</>
                          }
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {!query.trim() && (
              <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-ink-muted">
                <Search className="h-8 w-8 text-black/15" />
                <p>Escribí el nombre del perro de tu vecino para buscarlo.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function AvatarCircle({ nombre, fotoUrl }: { nombre?: string | null; fotoUrl?: string | null }) {
  if (fotoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={fotoUrl} alt={nombre ?? ''} className="h-10 w-10 shrink-0 rounded-full object-cover" />
    );
  }
  const inicial = nombre?.[0]?.toUpperCase() ?? '?';
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 font-bold text-brand-primary">
      {inicial}
    </span>
  );
}
