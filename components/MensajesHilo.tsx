'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, Loader2, Lock, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Mensaje {
  id: string;
  texto: string;
  created_at: string;
  sender_id: string;
  profiles: { nombre: string | null; apellido: string | null; foto_url: string | null } | null;
}

interface Conversacion {
  user_id: string;
  nombre: { nombre: string | null; apellido: string | null; foto_url: string | null } | null;
  ultimo_texto: string;
  ultimo_at: string;
}

interface Props {
  postId: string;
  isAuthenticated: boolean;
  userId: string | null;
}

function fmtHora(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}
function fmtFecha(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}
function nombreDe(p: { nombre: string | null; apellido: string | null } | null) {
  return [p?.nombre, p?.apellido].filter(Boolean).join(' ') || 'Usuario';
}

export default function MensajesHilo({ postId, isAuthenticated, userId }: Props) {
  const [abierto,        setAbierto]        = useState(false);
  const [mensajes,       setMensajes]       = useState<Mensaje[]>([]);
  const [conversaciones, setConversaciones] = useState<Conversacion[] | null>(null);
  const [selectedWith,   setSelectedWith]   = useState<string | null>(null);
  const [texto,          setTexto]          = useState('');
  const [cargando,       setCargando]       = useState(false);
  const [enviando,       setEnviando]       = useState(false);
  const [error,          setError]          = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto || !isAuthenticated) return;
    cargar();

    const channel = supabase
      .channel(`mensajes-${postId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'mensajes', filter: `post_id=eq.${postId}` },
        () => { cargar(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierto, isAuthenticated, selectedWith]);

  useEffect(() => {
    if (abierto && mensajes.length) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, abierto]);

  async function cargar() {
    setCargando(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const params = new URLSearchParams({ post_id: postId });
      if (selectedWith) params.set('with', selectedWith);

      const res = await fetch(`/api/mensajes?${params.toString()}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const json = await res.json();

      if (json.conversaciones) {
        setConversaciones(json.conversaciones);
        setMensajes([]);
        // Si hay una sola conversación, la abrimos directo sin mostrar el selector.
        if (json.conversaciones.length === 1) {
          setSelectedWith(json.conversaciones[0].user_id);
        }
      } else {
        setConversaciones(null);
        setMensajes(json.mensajes ?? []);
      }
    } finally {
      setCargando(false);
    }
  }

  async function handleEnviar() {
    if (!texto.trim() || enviando) return;
    setEnviando(true);
    setError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) { setError('Tu sesión expiró. Recargá la página.'); return; }

      const res = await fetch('/api/mensajes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ post_id: postId, texto, recipient_id: selectedWith ?? undefined }),
      });
      if (!res.ok) throw new Error('Error al enviar');

      setTexto('');
      await cargar();
    } catch {
      setError('No se pudo enviar el mensaje. Intentá de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  const totalBadge = conversaciones ? conversaciones.length : mensajes.length;
  const mostrandoSelector = conversaciones !== null && conversaciones.length > 1 && !selectedWith;

  return (
    <div className="card overflow-hidden border border-black/8">
      {/* Header — toggle */}
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-black/2"
      >
        <MessageCircle className="h-5 w-5 shrink-0 text-brand-primary" />
        <div className="flex-1">
          <p className="font-display text-sm font-extrabold text-ink">Mensajes privados</p>
          <p className="text-xs text-ink-muted">Contacto directo con el dueño del aviso</p>
        </div>
        {totalBadge > 0 && (
          <span className="rounded-full bg-brand-primary/15 px-2 py-0.5 text-xs font-bold text-brand-primary">
            {totalBadge}
          </span>
        )}
        <span className="text-xs font-bold text-ink-muted">{abierto ? '▲' : '▼'}</span>
      </button>

      {abierto && (
        <div className="border-t border-black/8">
          {!isAuthenticated ? (
            <div className="flex flex-col items-center gap-3 px-5 py-6 text-center">
              <Lock className="h-8 w-8 text-ink-muted/40" />
              <p className="text-sm font-bold text-ink">Iniciá sesión para enviar mensajes</p>
              <Link href="/login" className="rounded-2xl bg-brand-primary px-5 py-2.5 text-sm font-bold text-white">
                Iniciar sesión
              </Link>
            </div>
          ) : cargando && !mensajes.length && !conversaciones ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-brand-primary" />
            </div>
          ) : mostrandoSelector ? (
            /* Selector de conversaciones — el dueño tiene más de un visitante escribiéndole */
            <div className="divide-y divide-black/8">
              {conversaciones!.map((c) => (
                <button
                  key={c.user_id}
                  type="button"
                  onClick={() => setSelectedWith(c.user_id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-black/2"
                >
                  {c.nombre?.foto_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.nombre.foto_url} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary/15 text-sm font-bold text-brand-primary">
                      {nombreDe(c.nombre).charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-ink">{nombreDe(c.nombre)}</p>
                    <p className="truncate text-xs text-ink-muted">{c.ultimo_texto}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <>
              {conversaciones && conversaciones.length > 1 && selectedWith && (
                <button
                  type="button"
                  onClick={() => setSelectedWith(null)}
                  className="flex items-center gap-1.5 px-4 pt-3 text-xs font-bold text-brand-primary"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Ver todas las conversaciones
                </button>
              )}

              {/* Lista de mensajes */}
              <div className="max-h-72 overflow-y-auto px-4 py-3 space-y-3">
                {mensajes.length === 0 ? (
                  <p className="py-4 text-center text-sm text-ink-muted">
                    Todavía no hay mensajes. Sé el primero en escribir.
                  </p>
                ) : (
                  mensajes.map((m) => {
                    const esPropio = m.sender_id === userId;
                    const nombre = nombreDe(m.profiles);
                    return (
                      <div
                        key={m.id}
                        className={`flex gap-2 ${esPropio ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        {/* Avatar */}
                        {m.profiles?.foto_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={m.profiles.foto_url}
                            alt={nombre}
                            className="h-8 w-8 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary/15 text-sm font-bold text-brand-primary">
                            {nombre.charAt(0).toUpperCase()}
                          </div>
                        )}

                        {/* Burbuja */}
                        <div className={`max-w-[72%] ${esPropio ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                          {!esPropio && (
                            <p className="text-[10px] font-bold text-ink-muted px-1">{nombre}</p>
                          )}
                          <div className={`rounded-2xl px-3 py-2 text-sm ${
                            esPropio
                              ? 'rounded-tr-sm bg-brand-primary text-white'
                              : 'rounded-tl-sm bg-[#f0ebe4] text-ink'
                          }`}>
                            {m.texto}
                          </div>
                          <p className="text-[10px] text-ink-muted/60 px-1">
                            {fmtFecha(m.created_at)} {fmtHora(m.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="border-t border-black/8 px-4 py-3">
                {error && (
                  <p className="mb-2 text-xs font-bold text-bad">{error}</p>
                )}
                <div className="flex items-end gap-2">
                  <textarea
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleEnviar(); }
                    }}
                    placeholder="Escribí tu mensaje..."
                    rows={2}
                    className="flex-1 resize-none rounded-2xl border border-black/10 bg-[#f8f5f0] px-4 py-2.5 text-sm text-ink placeholder-ink-muted/50 focus:border-brand-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleEnviar}
                    disabled={enviando || !texto.trim()}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-primary text-white disabled:opacity-40 transition active:scale-95"
                  >
                    {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
