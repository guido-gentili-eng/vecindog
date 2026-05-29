'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Camera, ImagePlus, X, AlertCircle, Sparkles, ArrowLeft,
  ScanSearch, RotateCw, MapPin, Calendar, ArrowRight, ImageIcon, ChevronDown,
} from 'lucide-react';
import { MAX_PESO_MB, TIPOS_IMAGEN_PERMITIDOS, ACCEPT_IMAGEN, ETIQUETA_CATEGORIA } from '@/lib/mockData';
import { listarPosts, type Post } from '@/lib/posts';

/* ─────────────── Tipos ─────────────── */

interface FotoPreview { file: File; url: string; pesoMb: number; }
interface ColorRGB    { r: number; g: number; b: number; }
interface PostConScore { post: Post; score: number; }

type Tamano = 'pequeño' | 'mediano' | 'grande' | '';

/* ─────────────── Helpers de color ─────────────── */

async function extraerColor(src: string): Promise<ColorRGB | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const S = 40;
        const canvas = document.createElement('canvas');
        canvas.width = S; canvas.height = S;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(null); return; }
        ctx.drawImage(img, 0, 0, S, S);
        const { data } = ctx.getImageData(0, 0, S, S);
        const px = data.length / 4;
        let r = 0, g = 0, b = 0;
        for (let i = 0; i < data.length; i += 4) { r += data[i]; g += data[i+1]; b += data[i+2]; }
        resolve({ r: Math.round(r/px), g: Math.round(g/px), b: Math.round(b/px) });
      } catch { resolve(null); }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function similitudColor(a: ColorRGB, b: ColorRGB): number {
  const dist = Math.sqrt((a.r-b.r)**2 + (a.g-b.g)**2 + (a.b-b.b)**2);
  return Math.max(0, Math.round(100 - (dist / 441) * 100));
}

/* ─────────────── Página ─────────────── */

export default function BuscarPorFotoPage() {
  const [foto,       setFoto]       = useState<FotoPreview | null>(null);
  const [tamano,     setTamano]     = useState<Tamano>('');
  const [error,      setError]      = useState('');
  const [resultados, setResultados] = useState<PostConScore[] | null>(null);
  const [cargando,   setCargando]   = useState(false);
  const [paso,       setPaso]       = useState('');
  const [verTodos,   setVerTodos]   = useState(false);

  const inputGaleriaRef = useRef<HTMLInputElement>(null);
  const inputCamaraRef  = useRef<HTMLInputElement>(null);
  const urlRef          = useRef<string | null>(null);

  useEffect(() => () => { if (urlRef.current) URL.revokeObjectURL(urlRef.current); }, []);

  function handleAgregar(files: FileList | null) {
    setError('');
    if (!files?.length) return;
    const f = files[0];
    if (!TIPOS_IMAGEN_PERMITIDOS.includes(f.type)) {
      setError(`"${f.name}" no es una imagen válida.`); return;
    }
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    const url = URL.createObjectURL(f);
    urlRef.current = url;
    setFoto({ file: f, url, pesoMb: f.size / (1024 * 1024) });
    setResultados(null); setVerTodos(false);
  }

  function handleRemover() {
    if (foto) URL.revokeObjectURL(foto.url);
    urlRef.current = null;
    setFoto(null); setResultados(null); setVerTodos(false); setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!foto) { setError('Subí una foto del perro para buscar.'); return; }
    setError(''); setCargando(true); setResultados(null); setVerTodos(false);

    try {
      setPaso('Analizando tu foto…');
      const colorFoto = await extraerColor(foto.url);

      setPaso('Buscando avisos…');
      const todos      = await listarPosts();
      const candidatos = todos.filter(p => p.categoria !== 'adopcion');

      setPaso('Comparando…');
      const scored: PostConScore[] = await Promise.all(
        candidatos.map(async (post) => {
          /* 1. Similitud visual de color (base) */
          let score = 50;
          if (colorFoto && post.images?.[0]) {
            const colorPost = await extraerColor(post.images[0]);
            if (colorPost) score = similitudColor(colorFoto, colorPost);
          }

          /* 2. Ajuste por tamaño — penaliza fuerte si no coincide */
          if (tamano && post.tamano) {
            if (post.tamano === tamano) {
              score = Math.min(100, score + 10);   // bonus coincidencia
            } else {
              score = Math.max(0, score - 40);     // penaliza mismatch fuerte
            }
          }

          return { post, score };
        })
      );

      const sorted = scored.sort((a, b) => b.score - a.score);
      setResultados(sorted);

      setTimeout(() => {
        document.getElementById('resultados')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    } catch {
      setError('No se pudo completar la búsqueda. Intentá de nuevo.');
    } finally {
      setCargando(false); setPaso('');
    }
  }

  function handleReset() {
    handleRemover();
    setTamano('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* Separar top de secundarios */
  const topMatch    = resultados?.[0] ?? null;
  const secundarios = resultados?.slice(1).filter(r => r.score >= 40) ?? [];

  return (
    <div className="mx-auto max-w-2xl py-8 md:py-10">
      <Link href="/publicaciones"
        className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> Volver a los avisos
      </Link>

      <header className="mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary">
          <Sparkles className="h-3.5 w-3.5" /> Búsqueda por similitud visual
        </span>
        <h1 className="mt-3 flex items-center gap-2 font-display text-3xl font-bold text-ink">
          <ScanSearch className="h-7 w-7 text-brand-primary" /> Buscar por foto
        </h1>
        <p className="mt-2 text-ink-muted">
          Subí una foto y elegí el tamaño. Analizamos los colores y te mostramos el aviso más parecido.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* ── Foto ── */}
        <section className="card p-5 md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Camera className="h-5 w-5 text-brand-primary" />
            <h2 className="font-display text-lg font-extrabold text-ink">Foto del perro</h2>
          </div>

          {foto ? (
            <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl ring-2 ring-brand-primary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={foto.url} alt="Foto" className="h-64 w-full object-cover" />
              <button type="button" onClick={handleRemover} aria-label="Eliminar"
                className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => inputGaleriaRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-brand-primary/40 bg-brand-cream/60 py-14 text-brand-primary transition hover:border-brand-primary hover:bg-brand-cream">
              <ImagePlus className="h-10 w-10" />
              <span className="text-sm font-bold">Tocá para subir una foto</span>
              <span className="text-xs text-ink-muted">JPG, PNG o WEBP</span>
            </button>
          )}

          <input ref={inputGaleriaRef} type="file" accept={ACCEPT_IMAGEN} className="hidden"
            onChange={e => { handleAgregar(e.target.files); e.target.value = ''; }} />
          <input ref={inputCamaraRef} type="file" accept="image/*" capture="environment" className="hidden"
            onChange={e => { handleAgregar(e.target.files); e.target.value = ''; }} />

          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => inputGaleriaRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-primary/10 px-3 py-2 text-sm font-semibold text-brand-primary transition hover:bg-brand-primary/15">
              <ImagePlus className="h-4 w-4" /> Galería
            </button>
            <button type="button" onClick={() => inputCamaraRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-primary/10 px-3 py-2 text-sm font-semibold text-brand-primary transition hover:bg-brand-primary/15">
              <Camera className="h-4 w-4" /> Sacar foto
            </button>
          </div>
        </section>

        {/* ── Tamaño (refina la búsqueda) ── */}
        <section className="card p-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-muted">
            Tamaño del perro <span className="font-normal normal-case text-ink-muted/60">(opcional — mejora los resultados)</span>
          </p>
          <div className="flex gap-2">
            {([['pequeño','Chico'], ['mediano','Mediano'], ['grande','Grande']] as const).map(([v, l]) => (
              <button key={v} type="button"
                onClick={() => setTamano(tamano === v ? '' : v)}
                className={`flex-1 rounded-2xl border-2 py-2.5 text-sm font-bold transition ${
                  tamano === v
                    ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                    : 'border-black/10 text-ink-muted hover:border-brand-primary/40'
                }`}>
                {l}
              </button>
            ))}
          </div>
        </section>

        {error && (
          <p className="flex items-start gap-1.5 text-sm text-bad">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> <span>{error}</span>
          </p>
        )}

        <div className="flex gap-2">
          <button type="submit" disabled={cargando || !foto}
            className="btn-primary flex-1 disabled:opacity-60">
            {cargando
              ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> {paso || 'Analizando…'}</>
              : <><ScanSearch className="h-5 w-5" /> Buscar coincidencias</>
            }
          </button>
          <button type="button" onClick={handleReset} className="btn-secondary">
            <RotateCw className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* ── Resultados ── */}
      {resultados !== null && (
        <section id="resultados" className="mt-10 scroll-mt-24 space-y-6">

          {/* Top match */}
          {topMatch && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-good" />
                <h2 className="font-display text-xl font-extrabold text-ink">Mejor coincidencia</h2>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
                  topMatch.score >= 75 ? 'bg-good/15 text-good' :
                  topMatch.score >= 50 ? 'bg-warn/20 text-[#8a5a00]' :
                  'bg-black/8 text-ink-muted'
                }`}>
                  {topMatch.score}% similar
                </span>
              </div>

              <Link href={`/publicaciones/${topMatch.post.id}`}
                className="group block overflow-hidden rounded-2xl bg-white shadow-card ring-2 ring-brand-primary/30 transition hover:-translate-y-0.5">
                {/* Foto grande */}
                <div className="relative h-48 w-full overflow-hidden bg-brand-cream">
                  {topMatch.post.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={topMatch.post.images[0]} alt=""
                      className="h-full w-full object-cover transition group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-brand-primary/20">
                      <ImageIcon className="h-12 w-12" />
                    </div>
                  )}
                  {/* Barra de similitud */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/20">
                        <div className={`h-full rounded-full ${
                          topMatch.score >= 75 ? 'bg-good' :
                          topMatch.score >= 50 ? 'bg-warn' : 'bg-white/50'
                        }`} style={{ width: `${topMatch.score}%` }} />
                      </div>
                      <span className="text-sm font-extrabold text-white">{topMatch.score}%</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                        topMatch.post.categoria === 'perdido'    ? 'bg-lost text-white' :
                        topMatch.post.categoria === 'encontrado' ? 'bg-found text-white' :
                        'bg-adopt text-[#5b3a0e]'
                      }`}>
                        {ETIQUETA_CATEGORIA[topMatch.post.categoria]}
                      </span>
                      <h3 className="mt-1 font-display text-xl font-extrabold text-ink">
                        {topMatch.post.nombre ?? 'Sin nombre'}
                      </h3>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-brand-primary transition group-hover:gap-2">
                      Ver aviso <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                  {/* Chips de características */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {topMatch.post.raza   && <Chip>{topMatch.post.raza}</Chip>}
                    {topMatch.post.color  && <Chip>{topMatch.post.color}</Chip>}
                    {topMatch.post.tamano && <Chip className="capitalize">{topMatch.post.tamano}</Chip>}
                    {topMatch.post.collar  === true  && <Chip>Con collar</Chip>}
                    {topMatch.post.chapita === true  && <Chip>Con chapita</Chip>}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{topMatch.post.descripcion}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-ink-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-brand-primary" />
                      <span className="font-bold text-ink">{topMatch.post.zona}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {topMatch.post.fecha}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Secundarios */}
          {secundarios.length > 0 && (
            <div>
              <button type="button" onClick={() => setVerTodos(v => !v)}
                className="mb-3 flex w-full items-center gap-2">
                <ChevronDown className={`h-4 w-4 text-ink-muted transition-transform ${verTodos ? 'rotate-180' : ''}`} />
                <h2 className="font-display text-base font-extrabold text-ink">
                  Otras posibilidades
                </h2>
                <span className="badge bg-black/8 text-ink-muted">{secundarios.length}</span>
              </button>

              {verTodos && (
                <div className="space-y-3">
                  {secundarios.map(({ post, score }) => (
                    <SecundarioCard key={post.id} post={post} score={score} />
                  ))}
                </div>
              )}
            </div>
          )}

          {resultados.length === 0 && (
            <div className="card p-6 text-center">
              <p className="font-bold text-ink">No hay avisos publicados todavía.</p>
              <Link href="/publicaciones" className="btn-secondary mt-4 inline-flex">Ver todos los avisos</Link>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

/* ─────────────── Sub-componentes ─────────────── */

function Chip({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`rounded-full bg-brand-cream px-2.5 py-0.5 text-xs font-semibold text-ink ${className}`}>
      {children}
    </span>
  );
}

function SecundarioCard({ post, score }: { post: Post; score: number }) {
  return (
    <Link href={`/publicaciones/${post.id}`}
      className="group flex gap-3 overflow-hidden rounded-2xl bg-white p-3 shadow-soft ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-card">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-brand-cream">
        {post.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.images[0]} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-primary/20">
            <ImageIcon className="h-6 w-6" />
          </div>
        )}
        <span className="absolute bottom-0.5 left-0.5 right-0.5 rounded text-center text-[9px] font-extrabold bg-black/55 text-white">
          {score}%
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <span className={`inline-block rounded-full px-1.5 py-0.5 text-[9px] font-extrabold ${
            post.categoria === 'perdido' ? 'bg-lost text-white' : 'bg-found text-white'
          }`}>
            {ETIQUETA_CATEGORIA[post.categoria]}
          </span>
          <p className="font-display text-sm font-extrabold text-ink">{post.nombre ?? 'Sin nombre'}</p>
          <p className="line-clamp-1 text-xs text-ink-muted">{post.descripcion}</p>
        </div>
        <span className="flex items-center gap-1 text-[11px] font-semibold text-ink-muted">
          <MapPin className="h-3 w-3 text-brand-primary" /> {post.zona}
        </span>
      </div>
    </Link>
  );
}
