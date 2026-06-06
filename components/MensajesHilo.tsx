'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, Loader2, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Mensaje {
  id: string;
  texto: string;
  created_at: string;
  sender_id: string;
  profiles: { nombre: string | null; apellido: string | null; foto_url: string | null } | null;
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

export default function MensajesHilo({ postId, isAuthenticated, userId }: Props) {
  const [abierto,    setAbierto]    = useState(false);
  const [mensajes,   setMensajes]   = useState<Mensaje[]>([]);
  const [texto,      setTexto]      = useState('');
  const [cargando,   setCargando]   = useState(false);
  const [enviando,   setEnviando]   = useState(false);
  const [error,      setError]      = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto || !isAuthenticated) return;
    cargarMensajes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierto, isAuthenticated]);

  useEffect(() => {
    if (abierto) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, abierto]);

  async function cargarMensajes() {
    setCargando(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const res = await fetch(`/api/mensajes?post_id=${postId}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const json = await res.json();
      setMensajes(json.mensajes ?? []);
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
        body: JSON.stringify({ post_id: postId, texto }),
      });
      if (!res.ok) throw new Error('Error al enviar');

      setTexto('');
      await cargarMensajes();
    } catch {
      setError('No se pudo enviar el mensaje. Intentá de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

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
        {mensajes.length > 0 && (
          <span className="rounded-full bg-brand-primary/15 px-2 py-0.5 text-xs font-bold text-brand-primary">
            {mensajes.length}
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
          ) : (
            <>
              {/* Lista de mensajes */}
              <div className="max-h-72 overflow-y-auto px-4 py-3 space-y-3">
                {cargando ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-brand-primary" />
                  </div>
                ) : mensajes.length === 0 ? (
                  <p className="py-4 text-center text-sm text-ink-muted">
                    Todavía no hay mensajes. Sé el primero en escribir.
                  </p>
                ) : (
                  mensajes.map((m) => {
                    const esPropio = m.sender_id === userId;
                    const nombre = [m.profiles?.nombre, m.profiles?.apellido].filter(Boolean).join(' ') || 'Usuario';
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
