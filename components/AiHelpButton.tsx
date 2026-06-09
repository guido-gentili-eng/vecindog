'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, X, Send, Loader2, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Msg {
  role: 'user' | 'assistant';
  content: string;
}

function installBannerVisible() {
  if (typeof window === 'undefined') return false;
  if (sessionStorage.getItem('install_dismissed')) return false;
  if (window.matchMedia('(display-mode: standalone)').matches) return false;
  return /iphone|ipad|ipod|android/i.test(navigator.userAgent);
}

export default function AiHelpButton() {
  const [abierto, setAbierto]   = useState(false);
  const [msgs, setMsgs]         = useState<Msg[]>([]);
  const [input, setInput]       = useState('');
  const [cargando, setCargando] = useState(false);
  const [bannerActivo, setBannerActivo] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setBannerActivo(installBannerVisible());
    // 'storage' only fires in other tabs; use a custom event for same-tab dismiss
    const onDismiss = () => setBannerActivo(installBannerVisible());
    window.addEventListener('install-banner-dismissed', onDismiss);
    return () => window.removeEventListener('install-banner-dismissed', onDismiss);
  }, []);

  useEffect(() => {
    if (abierto) {
      if (msgs.length === 0) {
        setMsgs([{
          role: 'assistant',
          content: '¡Hola! Soy el asistente de Vecindog 🐾 ¿En qué te puedo ayudar?',
        }]);
      }
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [abierto]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, cargando]);

  async function enviar() {
    const texto = input.trim();
    if (!texto || cargando) return;

    const nuevos: Msg[] = [...msgs, { role: 'user', content: texto }];
    setMsgs(nuevos);
    setInput('');
    setCargando(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        setMsgs((prev) => [...prev, {
          role: 'assistant',
          content: 'Para usar el asistente necesitás iniciar sesión en Vecindog.',
        }]);
        return;
      }
      const res = await fetch('/api/ai-help', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: nuevos.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMsgs((prev) => [...prev, {
        role: 'assistant',
        content: data.reply ?? 'No pude responder, intentá de nuevo.',
      }]);
    } catch {
      setMsgs((prev) => [...prev, {
        role: 'assistant',
        content: 'Hubo un error de conexión. Intentá de nuevo.',
      }]);
    } finally {
      setCargando(false);
    }
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className={`fixed ${bannerActivo ? 'bottom-36' : 'bottom-24'} right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary shadow-2xl transition-all hover:scale-110 active:scale-95`}
        aria-label="Ayuda con IA"
      >
        {abierto
          ? <ChevronDown className="h-6 w-6 text-white" />
          : <Bot className="h-6 w-6 text-white" />}
      </button>

      {/* Panel de chat */}
      {abierto && (
        <div className="fixed bottom-44 right-6 z-50 flex w-[340px] max-w-[calc(100vw-24px)] flex-col rounded-[24px] bg-white shadow-2xl ring-1 ring-black/8"
             style={{ maxHeight: 'min(520px, calc(100vh - 120px))' }}>

          {/* Header */}
          <div className="flex items-center gap-3 rounded-t-[24px] bg-brand-primary px-5 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-white">Asistente Vecindog</p>
              <p className="text-xs text-white/70">Impulsado por IA</p>
            </div>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              className="rounded-full p-1 text-white/70 transition hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ minHeight: 0 }}>
            {msgs.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {m.role === 'assistant' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary/15 text-brand-primary">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'rounded-tr-sm bg-brand-primary text-white'
                    : 'rounded-tl-sm bg-[#f0ebe4] text-ink'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}

            {cargando && (
              <div className="flex gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary/15 text-brand-primary">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-[#f0ebe4] px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-muted/50 [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-muted/50 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-muted/50 [animation-delay:300ms]" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-black/8 px-4 py-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); }
                }}
                placeholder="Escribí tu pregunta..."
                rows={1}
                className="flex-1 resize-none rounded-2xl border border-black/10 bg-[#f8f5f0] px-4 py-2.5 text-sm text-ink placeholder-ink-muted/50 focus:border-brand-primary focus:outline-none"
                style={{ maxHeight: '80px' }}
              />
              <button
                type="button"
                onClick={enviar}
                disabled={cargando || !input.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-primary text-white disabled:opacity-40 transition active:scale-95"
              >
                {cargando
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <Send className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
