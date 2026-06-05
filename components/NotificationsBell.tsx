'use client';

import { useEffect, useRef, useState } from 'react';
import { Bell, Dog, Eye, X, CheckCheck, RefreshCw, CheckCircle2, Loader2, Users, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { resolverPost, renovarPost } from '@/lib/posts';
import { aceptarSolicitud, rechazarEliminarAmistad } from '@/lib/amistades';
import FoundModal from '@/components/FoundModal';

interface Notification {
  id:         string;
  post_id:    string | null;
  tipo:       string;
  mensaje:    string;
  leida:      boolean;
  created_at: string;
  meta?:      string | null;  // JSON con datos extra (ej: amistad_id)
}

export default function NotificationsBell() {
  const { user, isAuthenticated } = useAuth();
  const [notifs,      setNotifs]      = useState<Notification[]>([]);
  const [open,        setOpen]        = useState(false);
  const [foundModal,  setFoundModal]  = useState<{ nombre?: string | null } | null>(null);
  const [accioning,   setAccioning]   = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const unread = notifs.filter((n) => !n.leida).length;

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    fetchNotifs();

    // Suscripción realtime
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        (payload) => {
          setNotifs((prev) => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isAuthenticated, user]);

  // Cerrar al click afuera
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function fetchNotifs() {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    if (data) setNotifs(data as Notification[]);
  }

  async function marcarLeida(id: string) {
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, leida: true } : n));
    await supabase.from('notifications').update({ leida: true }).eq('id', id);
  }

  async function marcarTodasLeidas() {
    setNotifs((prev) => prev.map((n) => ({ ...n, leida: true })));
    await supabase.from('notifications').update({ leida: true }).eq('user_id', user!.id);
  }

  async function handleEncontrado(notif: Notification) {
    if (!notif.post_id) return;
    setAccioning(notif.id);
    try {
      await resolverPost(notif.post_id);
      await marcarLeida(notif.id);
      // Extraer nombre del perro del mensaje
      const match = notif.mensaje.match(/\(([^)]+)\)/);
      setFoundModal({ nombre: match?.[1] ?? null });
      setOpen(false);
    } finally { setAccioning(null); }
  }

  async function handleAceptarAmistad(notif: Notification) {
    const meta = notif.meta ? (() => { try { return JSON.parse(notif.meta!); } catch { return {}; } })() : {};
    if (!meta.amistad_id) return;
    setAccioning(notif.id);
    try {
      await aceptarSolicitud(meta.amistad_id);
      // Notificar al solicitante
      if (meta.solicitante_id) {
        await supabase.from('notifications').insert({
          user_id: meta.solicitante_id,
          post_id: null,
          tipo:    'amistad_aceptada',
          mensaje: `¡Tu solicitud de amistad fue aceptada! 🐾`,
          leida:   false,
        });
      }
      await marcarLeida(notif.id);
      // Actualizar mensaje local
      setNotifs(prev => prev.map(n =>
        n.id === notif.id ? { ...n, leida: true, tipo: 'amistad_aceptada' } : n
      ));
    } finally { setAccioning(null); }
  }

  async function handleRechazarAmistad(notif: Notification) {
    const meta = notif.meta ? (() => { try { return JSON.parse(notif.meta!); } catch { return {}; } })() : {};
    if (!meta.amistad_id) return;
    setAccioning(notif.id + '_rec');
    try {
      await rechazarEliminarAmistad(meta.amistad_id);
      await marcarLeida(notif.id);
      setNotifs(prev => prev.filter(n => n.id !== notif.id));
    } finally { setAccioning(null); }
  }

  async function handleRenovar(notif: Notification) {
    if (!notif.post_id) return;
    setAccioning(notif.id);
    try {
      await renovarPost(notif.post_id);
      // Actualizar el campo notified_expiration en el post
      await supabase.from('posts').update({ notified_expiration: false }).eq('id', notif.post_id);
      await marcarLeida(notif.id);
    } finally { setAccioning(null); }
  }

  if (!isAuthenticated) return null;

  return (
    <>
    {foundModal && (
      <FoundModal
        nombrePerro={foundModal.nombre}
        onClose={() => setFoundModal(null)}
      />
    )}
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notificaciones"
        className="relative grid h-10 w-10 place-items-center rounded-2xl text-ink hover:bg-brand-cream transition"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-coral text-[10px] font-bold text-white ring-2 ring-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-black/10 bg-white shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/5 px-4 py-3">
            <span className="font-bold text-ink text-sm">Notificaciones</span>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button type="button" onClick={marcarTodasLeidas}
                  className="flex items-center gap-1 text-xs text-brand-primary font-bold hover:underline">
                  <CheckCheck className="h-3.5 w-3.5" /> Marcar todas leídas
                </button>
              )}
              <button type="button" onClick={() => setOpen(false)}
                className="text-ink-muted hover:text-ink">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Lista */}
          <div className="max-h-80 overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="py-10 text-center text-sm text-ink-muted">
                <Bell className="h-8 w-8 mx-auto mb-2 text-black/10" />
                No tenés notificaciones
              </div>
            ) : (
              notifs.map((n) => (
                <div key={n.id}
                  className={`px-4 py-3 border-b border-black/5 last:border-0 transition ${!n.leida ? 'bg-brand-primary/5' : ''}`}>
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl ${
                      n.tipo === 'expiracion' ? 'bg-amber-100 text-amber-600' :
                      n.tipo === 'visita'     ? 'bg-blue-50 text-blue-500' :
                      !n.leida ? 'bg-brand-primary text-white' : 'bg-brand-cream text-brand-primary'
                    }`}>
                      {n.tipo === 'expiracion'        ? '⏰' :
                       n.tipo === 'visita'            ? <Eye className="h-4 w-4" /> :
                       n.tipo === 'solicitud_amistad' ? <UserPlus className="h-4 w-4" /> :
                       n.tipo === 'amistad_aceptada'  ? <Users className="h-4 w-4" /> :
                       <Dog className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink leading-snug">{n.mensaje}</p>
                      <p className="mt-0.5 text-xs text-ink-muted">{formatFecha(n.created_at)}</p>
                      {n.tipo !== 'expiracion' && n.post_id && (
                        <Link href={`/publicaciones/${n.post_id}`}
                          onClick={() => { marcarLeida(n.id); setOpen(false); }}
                          className="mt-1 inline-block text-xs font-bold text-brand-primary hover:underline">
                          Ver aviso →
                        </Link>
                      )}
                    </div>
                    {!n.leida && n.tipo !== 'expiracion' && (
                      <button type="button" onClick={() => marcarLeida(n.id)}
                        className="shrink-0 text-ink-muted hover:text-ink">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  {/* Botones para solicitud de amistad pendiente */}
                  {n.tipo === 'solicitud_amistad' && !n.leida && (
                    <div className="mt-2 flex gap-2 ml-11">
                      <button type="button"
                        onClick={() => handleAceptarAmistad(n)}
                        disabled={!!accioning}
                        className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-good/15 px-2 py-2 text-xs font-bold text-good hover:bg-good/25 transition disabled:opacity-60">
                        {accioning === n.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                        Aceptar
                      </button>
                      <button type="button"
                        onClick={() => handleRechazarAmistad(n)}
                        disabled={!!accioning}
                        className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-black/8 px-2 py-2 text-xs font-bold text-ink-muted hover:bg-black/15 transition disabled:opacity-60">
                        Rechazar
                      </button>
                    </div>
                  )}

                  {/* Botones de acción para expiración */}
                  {n.tipo === 'expiracion' && n.post_id && (
                    <div className="mt-2 flex gap-2 ml-11">
                      <button type="button"
                        onClick={() => handleEncontrado(n)}
                        disabled={accioning === n.id}
                        className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-good/15 px-2 py-2 text-xs font-bold text-good hover:bg-good/25 transition disabled:opacity-60">
                        {accioning === n.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                        ¡Lo encontré!
                      </button>
                      <button type="button"
                        onClick={() => handleRenovar(n)}
                        disabled={accioning === n.id}
                        className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-brand-primary/10 px-2 py-2 text-xs font-bold text-brand-primary hover:bg-brand-primary/20 transition disabled:opacity-60">
                        {accioning === n.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                        Lo sigo buscando
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
}

function formatFecha(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60)   return 'Ahora';
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
}
