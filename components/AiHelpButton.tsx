'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Send, Loader2, ChevronDown } from 'lucide-react';

function VecindogPin({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 59.57 89.72" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="currentColor" d="M29.79,0C13.34,0,0,13.34,0,29.79,0,53.16,21.13,65.1,29.79,89.72c8.66-24.62,29.79-36.56,29.79-59.93C59.57,13.34,46.24,0,29.79,0ZM35.22,51.3c-.29.07-.58.14-.87.2-.57,3.35-.69,7.15-.66,7.26,0,0,0,0,0,0-.07.04-3.33-2.52-5.14-5.57-.14-.23-.26-.45-.38-.67-8.91-.35-16.29-6.5-18.57-15.58-2.77-11.04,3.93-22.24,14.97-25.01s22.24,3.93,25.01,14.97c2.77,11.04-3.32,21.63-14.36,24.4Z"/>
      <g fill="currentColor" opacity=".55">
        <path d="M23.05,33.88c-1.24.15-2.39-.95-2.57-2.46-.24-1.96.54-3.89,1.77-4.04,1.24-.15,2.48,1.67,2.7,3.49.19,1.51-.66,2.86-1.9,3.01Z"/>
        <path d="M32.78,40.28c-1.76-.04-2.43-.82-3.56-.84-1.13-.02-1.83.73-3.59.7-2.3-.05-3.96-2.94-1.83-4.79,2.65-2.3,3.45-5.24,5.61-5.19,2.17.04,2.84,3.02,5.39,5.42,2.05,1.94.28,4.76-2.02,4.71Z"/>
        <path d="M30.05,26.32c.19-1.82,1.41-3.67,2.64-3.53,1.24.13,2.05,2.05,1.84,4.01-.16,1.51-1.3,2.63-2.53,2.5-1.24-.13-2.11-1.47-1.95-2.98Z"/>
        <path d="M24.42,26.59c-.13-1.97.76-3.85,2-3.93,1.24-.08,2.38,1.81,2.49,3.64.1,1.52-.83,2.82-2.07,2.9-1.24.08-2.33-1.09-2.43-2.61Z"/>
        <path d="M35.61,34.14c-1.23-.2-2.02-1.59-1.77-3.09.3-1.81,1.62-3.58,2.84-3.37,1.23.2,1.93,2.16,1.6,4.11-.25,1.5-1.45,2.56-2.67,2.35Z"/>
      </g>
    </svg>
  );
}
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
          : <VecindogPin className="h-6 w-6 text-white" />}
      </button>

      {/* Panel de chat */}
      {abierto && (
        <div className="fixed bottom-44 right-6 z-50 flex w-[340px] max-w-[calc(100vw-24px)] flex-col rounded-[24px] bg-white shadow-2xl ring-1 ring-black/8"
             style={{ maxHeight: 'min(520px, calc(100vh - 120px))' }}>

          {/* Header */}
          <div className="flex items-center gap-3 rounded-t-[24px] bg-brand-primary px-5 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <VecindogPin className="h-5 w-5 text-white" />
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
                    <VecindogPin className="h-4 w-4" />
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
                  <VecindogPin className="h-4 w-4" />
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
