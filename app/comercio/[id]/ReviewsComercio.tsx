'use client';

import { useEffect, useState } from 'react';
import { Star, Loader2, CheckCircle2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';

interface Review {
  id: string;
  estrellas: number;
  comentario: string | null;
  created_at: string;
  user_id: string;
  profiles: { nombre: string | null; apellido: string | null; foto_url: string | null } | null;
}

interface Props {
  adId: string;
  nombreComercio: string;
}

function Estrellas({ n, size = 'sm' }: { n: number; size?: 'sm' | 'lg' }) {
  const sz = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <Star key={i} className={`${sz} ${i <= n ? 'fill-[#F59E0B] text-[#F59E0B]' : 'fill-none text-black/15'}`} />
      ))}
    </div>
  );
}

function fmtFecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ReviewsComercio({ adId, nombreComercio }: Props) {
  const { t } = useLanguage();
  const [reviews,     setReviews]     = useState<Review[]>([]);
  const [promedio,    setPromedio]    = useState(0);
  const [total,       setTotal]       = useState(0);
  const [miReview,    setMiReview]    = useState<Review | null>(null);
  const [cargando,    setCargando]    = useState(true);
  const [modalOpen,   setModalOpen]   = useState(false);

  // Form
  const [estrellas,   setEstrellas]   = useState(0);
  const [hover,       setHover]       = useState(0);
  const [comentario,  setComentario]  = useState('');
  const [enviando,    setEnviando]    = useState(false);
  const [enviado,     setEnviado]     = useState(false);
  const [error,       setError]       = useState('');
  const [authed,      setAuthed]      = useState(false);
  const [token,       setToken]       = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthed(!!session?.user);
      setToken(session?.access_token ?? null);
    });
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function cargar() {
    setCargando(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = {};
      if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
      const res = await fetch(`/api/comercio-reviews?ad_id=${adId}`, { headers });
      const json = await res.json();
      setReviews(json.reviews ?? []);
      setPromedio(json.promedio ?? 0);
      setTotal(json.total ?? 0);
      setMiReview(json.miReview ?? null);
      if (json.miReview) {
        setEstrellas(json.miReview.estrellas);
        setComentario(json.miReview.comentario ?? '');
      }
    } finally {
      setCargando(false);
    }
  }

  async function handleEnviar() {
    if (!estrellas || enviando) return;
    setEnviando(true); setError('');
    try {
      const res = await fetch('/api/comercio-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ad_id: adId, estrellas, comentario }),
      });
      if (!res.ok) throw new Error();
      setEnviado(true);
      await cargar();
      setTimeout(() => { setModalOpen(false); setEnviado(false); }, 1500);
    } catch {
      setError(t.revErrReview);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="rounded-[20px] bg-white border border-black/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="font-display text-sm font-extrabold text-ink uppercase tracking-wide">{t.revReviews}</h2>
            {total > 0 && (
              <div className="flex items-center gap-2 mt-0.5">
                <Estrellas n={Math.round(promedio)} />
                <span className="text-xs font-bold text-ink">{promedio.toFixed(1)}</span>
                <span className="text-xs text-ink-muted">({total})</span>
              </div>
            )}
          </div>
        </div>
        {authed && (
          <button
            onClick={() => setModalOpen(true)}
            className="rounded-2xl bg-brand-primary/10 px-4 py-2 text-xs font-bold text-brand-primary transition hover:bg-brand-primary/20"
          >
            {miReview ? t.revEditarReview : t.revEscribirReview}
          </button>
        )}
      </div>

      {/* Lista */}
      <div className="divide-y divide-black/5">
        {cargando ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-brand-primary" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-2xl mb-2">⭐</p>
            <p className="text-sm font-bold text-ink">{t.revSinReviews}</p>
            <p className="text-xs text-ink-muted mt-1">{t.revPrimero.replace('{nombre}', nombreComercio)}</p>
          </div>
        ) : (
          reviews.map((r) => {
            const nombre = [r.profiles?.nombre, r.profiles?.apellido].filter(Boolean).join(' ') || 'Usuario';
            return (
              <div key={r.id} className="px-5 py-4">
                <div className="flex items-start gap-3">
                  {r.profiles?.foto_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.profiles.foto_url} alt={nombre} className="h-9 w-9 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary/15 text-sm font-bold text-brand-primary shrink-0">
                      {nombre.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-ink">{nombre}</p>
                      <p className="text-xs text-ink-muted/60">{fmtFecha(r.created_at)}</p>
                    </div>
                    <Estrellas n={r.estrellas} />
                    {r.comentario && (
                      <p className="mt-1.5 text-sm text-ink leading-relaxed">{r.comentario}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de review */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={() => !enviando && setModalOpen(false)}>
          <div
            className="w-full max-w-sm rounded-t-[32px] bg-white px-6 pb-8 pt-6 shadow-2xl sm:rounded-[32px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-black/10 sm:hidden" />
            {enviado ? (
              <div className="py-4 text-center">
                <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-[#3F8B5C]" />
                <p className="font-display text-xl font-black text-ink">{t.revGracias}</p>
              </div>
            ) : (
              <>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-xl font-black text-ink">{t.revOpinion}</h2>
                    <p className="text-sm text-ink-muted">{nombreComercio}</p>
                  </div>
                  <button onClick={() => setModalOpen(false)} className="rounded-full p-1.5 text-ink-muted hover:bg-black/5">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Estrellas selector */}
                <div className="mb-4 flex justify-center gap-2">
                  {[1,2,3,4,5].map((i) => (
                    <button
                      key={i}
                      onMouseEnter={() => setHover(i)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setEstrellas(i)}
                      className="p-1 transition"
                    >
                      <Star className={`h-9 w-9 ${i <= (hover || estrellas) ? 'fill-[#F59E0B] text-[#F59E0B]' : 'fill-none text-black/20'}`} />
                    </button>
                  ))}
                </div>

                <div className="mb-4">
                  <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder={t.revPlaceholder}
                    rows={3}
                    className="w-full resize-none rounded-2xl border border-black/10 bg-[#f8f5f0] px-4 py-3 text-sm text-ink placeholder-ink-muted/50 focus:border-brand-primary focus:outline-none"
                  />
                </div>

                {error && <p className="mb-3 text-xs font-bold text-bad">{error}</p>}

                <button
                  onClick={handleEnviar}
                  disabled={!estrellas || enviando}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-primary py-3.5 text-sm font-bold text-white disabled:opacity-40"
                >
                  {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : t.revPublicar}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
