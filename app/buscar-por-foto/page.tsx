'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Camera, ImagePlus, X, AlertCircle, Sparkles, ArrowLeft,
  ScanSearch, RotateCw, MapPin, Calendar, ArrowRight, ImageIcon,
  ChevronDown, Check, Loader2,
} from 'lucide-react';
import { TIPOS_IMAGEN_PERMITIDOS, ACCEPT_IMAGEN, ETIQUETA_CATEGORIA, COLORES_PERRO } from '@/lib/mockData';
import { listarPosts, type Post } from '@/lib/posts';

/* ─────────────── Tipos ─────────────── */

interface FotoPreview { file: File; url: string; }
interface ColorRGB    { r: number; g: number; b: number; }
interface PostConScore { post: Post; score: number; matches: string[]; }

interface AnalisisIA {
  color:       string | null;
  tamano:      'pequeño' | 'mediano' | 'grande' | null;
  raza:        string | null;
  descripcion: string | null;
}

type Tamano = 'pequeño' | 'mediano' | 'grande' | '';

/* ─────────────── Paleta de colores ─────────────── */

const COLOR_CSS: Record<string, string> = {
  'Negro':    '#222222',
  'Blanco':   '#e8e4dc',
  'Marron':   '#7a4518',
  'Caramelo': '#bf7a2e',
  'Dorado':   '#c8a03c',
  'Gris':     '#909090',
  'Atigrado': '#6a5032',
  'Tricolor': '#7a5a3a',
  'Manchado': '#967860',
};

/* ─────────────── Helpers de color visual ─────────────── */

const COLOR_RGB: Record<string, ColorRGB> = {
  'Negro':    { r: 30,  g: 30,  b: 30  },
  'Blanco':   { r: 240, g: 240, b: 240 },
  'Marron':   { r: 120, g: 70,  b: 30  },
  'Caramelo': { r: 190, g: 130, b: 60  },
  'Dorado':   { r: 200, g: 160, b: 70  },
  'Gris':     { r: 140, g: 140, b: 140 },
  'Atigrado': { r: 100, g: 80,  b: 50  },
  'Tricolor': { r: 120, g: 90,  b: 60  },
  'Manchado': { r: 150, g: 120, b: 90  },
};

async function extraerColor(src: string): Promise<ColorRGB | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const S = 80;
        const canvas = document.createElement('canvas');
        canvas.width = S; canvas.height = S;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(null); return; }
        ctx.drawImage(img, img.width * 0.2, img.height * 0.2, img.width * 0.6, img.height * 0.6, 0, 0, S, S);
        const { data } = ctx.getImageData(0, 0, S, S);
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          const br = (data[i] + data[i+1] + data[i+2]) / 3;
          if (br > 230 || br < 15) continue;
          r += data[i]; g += data[i+1]; b += data[i+2]; count++;
        }
        if (count === 0) resolve(null);
        else resolve({ r: Math.round(r/count), g: Math.round(g/count), b: Math.round(b/count) });
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

function normalizar(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
}

function textosCoinciden(a: string, b: string): boolean {
  const na = normalizar(a), nb = normalizar(b);
  return na === nb || na.includes(nb) || nb.includes(na);
}

/* ─────────────── Scoring ─────────────── */

async function calcularScore(
  post: Post,
  colorFoto: ColorRGB | null,
  colorElegido: string,
  raza: string,
  tamano: Tamano,
  collar: boolean | null,
  chapita: boolean | null,
): Promise<PostConScore> {
  let score = 0, maxPosible = 0;
  const matches: string[] = [];

  // 1. Similitud visual de color (20 pts)
  maxPosible += 20;
  if (colorFoto && post.images?.[0]) {
    const colorPost = await extraerColor(post.images[0]);
    if (colorPost) score += Math.round((similitudColor(colorFoto, colorPost) / 100) * 20);
  }

  // 2. Color elegido vs post.color (30 pts)
  if (colorElegido) {
    maxPosible += 30;
    if (post.color && textosCoinciden(colorElegido, post.color)) {
      score += 30; matches.push(`Color: ${post.color}`);
    }
  }

  // 3. Raza (30 pts)
  if (raza) {
    maxPosible += 30;
    if (post.raza && textosCoinciden(raza, post.raza)) {
      score += 30; matches.push(`Raza: ${post.raza}`);
    }
  }

  // 4. Tamaño (15 pts)
  if (tamano) {
    maxPosible += 15;
    if (post.tamano === tamano) {
      score += 15; matches.push(`Tamaño: ${post.tamano}`);
    } else if (post.tamano) {
      score = Math.max(0, score - 8);
    }
  }

  // 5. Collar (5 pts)
  if (collar !== null) {
    maxPosible += 5;
    if (post.collar === collar) { score += 5; matches.push(collar ? 'Con collar' : 'Sin collar'); }
  }

  // 6. Chapita (5 pts)
  if (chapita !== null) {
    maxPosible += 5;
    if (post.chapita === chapita) { score += 5; matches.push(chapita ? 'Con chapita' : 'Sin chapita'); }
  }

  const pct = maxPosible > 0 ? Math.max(0, Math.min(100, Math.round((score / maxPosible) * 100))) : 0;
  return { post, score: pct, matches };
}

/* ─────────────── Página ─────────────── */

export default function BuscarPorFotoPage() {
  const [foto,          setFoto]          = useState<FotoPreview | null>(null);
  const [analizando,    setAnalizando]    = useState(false);
  const [analisisIA,    setAnalisisIA]    = useState<AnalisisIA | null>(null);
  const [colorElegido,  setColorElegido]  = useState('');
  const [raza,          setRaza]          = useState('');
  const [tamano,        setTamano]        = useState<Tamano>('');
  const [collar,        setCollar]        = useState<boolean | null>(null);
  const [chapita,       setChapita]       = useState<boolean | null>(null);
  const [error,         setError]         = useState('');
  const [resultados,    setResultados]    = useState<PostConScore[] | null>(null);
  const [cargando,      setCargando]      = useState(false);
  const [paso,          setPaso]          = useState('');
  const [verTodos,      setVerTodos]      = useState(false);

  const inputGaleriaRef = useRef<HTMLInputElement>(null);
  const inputCamaraRef  = useRef<HTMLInputElement>(null);
  const urlRef          = useRef<string | null>(null);

  useEffect(() => () => { if (urlRef.current) URL.revokeObjectURL(urlRef.current); }, []);

  async function handleAgregar(files: FileList | null) {
    setError('');
    if (!files?.length) return;
    const f = files[0];
    if (!TIPOS_IMAGEN_PERMITIDOS.includes(f.type)) {
      setError(`"${f.name}" no es una imagen válida.`); return;
    }
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    const url = URL.createObjectURL(f);
    urlRef.current = url;
    setFoto({ file: f, url });
    setResultados(null); setVerTodos(false); setAnalisisIA(null);

    // Analizar con IA automáticamente
    setAnalizando(true);
    try {
      const fd = new FormData();
      fd.append('foto', f);
      const res  = await fetch('/api/analizar-foto', { method: 'POST', body: fd });
      const data = await res.json();

      if (data.ok && !data.error) {
        const ia: AnalisisIA = {
          color:       data.color ?? null,
          tamano:      data.tamano ?? null,
          raza:        data.raza   ?? null,
          descripcion: data.descripcion ?? null,
        };
        setAnalisisIA(ia);
        // Auto-completar los filtros con lo que detectó la IA
        if (ia.color && COLORES_PERRO.includes(ia.color)) setColorElegido(ia.color);
        if (ia.tamano) setTamano(ia.tamano);
        if (ia.raza)   setRaza(ia.raza);
      }
    } catch { /* IA falló, seguimos sin ella */ }
    finally { setAnalizando(false); }
  }

  function handleRemover() {
    if (foto) URL.revokeObjectURL(foto.url);
    urlRef.current = null;
    setFoto(null); setResultados(null); setVerTodos(false);
    setError(''); setAnalisisIA(null);
    setColorElegido(''); setRaza(''); setTamano(''); setCollar(null); setChapita(null);
  }

  function toggleCollar(val: boolean)  { setCollar(prev => prev === val ? null : val); }
  function toggleChapita(val: boolean) { setChapita(prev => prev === val ? null : val); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!foto) { setError('Subí una foto del perro para buscar.'); return; }
    setError(''); setCargando(true); setResultados(null); setVerTodos(false);

    try {
      setPaso('Analizando foto…');
      const colorFoto = await extraerColor(foto.url);

      setPaso('Buscando avisos…');
      const todos      = await listarPosts();
      const candidatos = todos.filter(p => p.categoria !== 'adopcion');

      setPaso('Comparando…');
      const scored = await Promise.all(
        candidatos.map(post => calcularScore(post, colorFoto, colorElegido, raza, tamano, collar, chapita))
      );
      setResultados(scored.sort((a, b) => b.score - a.score));

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const topMatch    = resultados?.[0] ?? null;
  const secundarios = resultados?.slice(1).filter(r => r.score >= 30) ?? [];

  return (
    <div className="mx-auto max-w-2xl py-8 md:py-10">
      <Link href="/publicaciones"
        className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> Volver a los avisos
      </Link>

      <header className="mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary">
          <Sparkles className="h-3.5 w-3.5" /> Búsqueda con IA
        </span>
        <h1 className="mt-3 flex items-center gap-2 font-display text-3xl font-bold text-ink">
          <ScanSearch className="h-7 w-7 text-brand-primary" /> Buscar por foto
        </h1>
        <p className="mt-2 text-ink-muted">
          Subí una foto — la IA detecta la raza, color y tamaño automáticamente.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* ── Foto ── */}
        <section className="card p-5 md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Camera className="h-5 w-5 text-brand-primary" />
            <h2 className="font-display text-lg font-extrabold text-ink">Foto del perro</h2>
            <span className="ml-auto rounded-full bg-brand-primary/10 px-2 py-0.5 text-[10px] font-bold text-brand-primary">
              Requerida
            </span>
          </div>

          {foto ? (
            <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl ring-2 ring-brand-primary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={foto.url} alt="Foto subida" className="h-64 w-full object-cover" />
              <button type="button" onClick={handleRemover} aria-label="Eliminar"
                className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80">
                <X className="h-4 w-4" />
              </button>

              {/* Estado IA */}
              {analizando && (
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-black/70 py-3 text-sm font-bold text-white backdrop-blur-sm">
                  <Loader2 className="h-4 w-4 animate-spin" /> Analizando con IA…
                </div>
              )}
              {!analizando && analisisIA?.descripcion && (
                <div className="absolute inset-x-0 bottom-0 bg-black/70 px-3 py-2 backdrop-blur-sm">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-white">
                    <Sparkles className="h-3 w-3 text-brand-coral shrink-0" />
                    {analisisIA.descripcion}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <button type="button" onClick={() => inputGaleriaRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-brand-primary/40 bg-brand-cream/60 py-14 text-brand-primary transition hover:border-brand-primary hover:bg-brand-cream">
              <ImagePlus className="h-10 w-10" />
              <span className="text-sm font-bold">Tocá para subir una foto</span>
              <span className="text-xs text-ink-muted">La IA detecta raza, color y tamaño automáticamente</span>
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

        {/* ── Resultado IA ── */}
        {analisisIA && !analizando && (
          <div className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 px-4 py-3">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-extrabold text-brand-primary">
              <Sparkles className="h-3.5 w-3.5" /> IA detectó
            </p>
            <div className="flex flex-wrap gap-2">
              {analisisIA.color && (
                <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-ink shadow-sm">
                  <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: COLOR_CSS[analisisIA.color] }} />
                  {analisisIA.color}
                </span>
              )}
              {analisisIA.raza && (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-ink shadow-sm">
                  {analisisIA.raza}
                </span>
              )}
              {analisisIA.tamano && (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-ink shadow-sm capitalize">
                  {analisisIA.tamano}
                </span>
              )}
            </div>
            <p className="mt-2 text-[11px] text-ink-muted">Los filtros se completaron automáticamente. Podés ajustarlos abajo.</p>
          </div>
        )}

        {/* ── Color principal ── */}
        <section className="card p-5">
          <div className="mb-3 flex items-center gap-2">
            <p className="text-sm font-extrabold text-ink">Color principal</p>
            {analisisIA?.color && colorElegido === analisisIA.color && (
              <span className="ml-auto flex items-center gap-1 text-[10px] font-bold text-brand-primary">
                <Sparkles className="h-3 w-3" /> IA
              </span>
            )}
            <span className="ml-auto text-xs text-ink-muted">Opcional</span>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {COLORES_PERRO.map(c => {
              const activo    = colorElegido === c;
              const esIA      = analisisIA?.color === c;
              return (
                <button key={c} type="button" onClick={() => setColorElegido(activo ? '' : c)}
                  className={`relative flex flex-col items-center gap-1.5 rounded-xl border-2 py-2.5 px-1 text-[11px] font-bold transition ${
                    activo
                      ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                      : esIA
                      ? 'border-brand-primary/40 bg-brand-primary/5 text-ink'
                      : 'border-black/8 text-ink-muted hover:border-brand-primary/30'
                  }`}>
                  <span className="h-7 w-7 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: COLOR_CSS[c] }} />
                  {c}
                  {activo && (
                    <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-brand-primary text-white">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  )}
                  {esIA && !activo && (
                    <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-brand-primary/60 text-white text-[8px] font-black">
                      IA
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Raza ── */}
        <section className="card p-5">
          <div className="mb-3 flex items-center gap-2">
            <p className="text-sm font-extrabold text-ink">Raza</p>
            {analisisIA?.raza && (
              <span className="ml-1 flex items-center gap-1 text-[10px] font-bold text-brand-primary">
                <Sparkles className="h-3 w-3" /> IA: {analisisIA.raza}
              </span>
            )}
            <span className="ml-auto text-xs text-ink-muted">Opcional</span>
          </div>
          <input
            type="text"
            value={raza}
            onChange={e => setRaza(e.target.value)}
            placeholder="Ej: Labrador, Golden, Mestizo…"
            className="w-full rounded-xl border-2 border-black/10 bg-white px-3 py-2.5 text-sm text-ink focus:border-brand-primary focus:outline-none"
          />
        </section>

        {/* ── Tamaño ── */}
        <section className="card p-5">
          <div className="mb-3 flex items-center gap-2">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">Tamaño</p>
            {analisisIA?.tamano && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-brand-primary">
                <Sparkles className="h-3 w-3" /> IA
              </span>
            )}
            <span className="ml-auto text-xs text-ink-muted">Opcional</span>
          </div>
          <div className="flex gap-2">
            {([['pequeño', 'Chico'], ['mediano', 'Mediano'], ['grande', 'Grande']] as const).map(([v, l]) => (
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

        {/* ── Collar y chapita ── */}
        <section className="card p-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-muted">
            Accesorios <span className="font-normal normal-case text-ink-muted/60">— Opcional</span>
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1.5 text-xs font-semibold text-ink-muted">Collar</p>
              <div className="flex gap-1.5">
                {([true, false] as const).map(val => (
                  <button key={String(val)} type="button" onClick={() => toggleCollar(val)}
                    className={`flex-1 rounded-xl border-2 py-2 text-xs font-bold transition ${
                      collar === val
                        ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                        : 'border-black/10 text-ink-muted hover:border-brand-primary/30'
                    }`}>
                    {val ? 'Sí' : 'No'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold text-ink-muted">Chapita</p>
              <div className="flex gap-1.5">
                {([true, false] as const).map(val => (
                  <button key={String(val)} type="button" onClick={() => toggleChapita(val)}
                    className={`flex-1 rounded-xl border-2 py-2 text-xs font-bold transition ${
                      chapita === val
                        ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                        : 'border-black/10 text-ink-muted hover:border-brand-primary/30'
                    }`}>
                    {val ? 'Sí' : 'No'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {error && (
          <p className="flex items-start gap-1.5 text-sm text-bad">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> <span>{error}</span>
          </p>
        )}

        <div className="flex gap-2">
          <button type="submit" disabled={cargando || !foto || analizando}
            className="btn-primary flex-1 disabled:opacity-60">
            {cargando
              ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> {paso || 'Buscando…'}</>
              : analizando
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Analizando foto…</>
              : <><ScanSearch className="h-5 w-5" /> Buscar coincidencias</>
            }
          </button>
          <button type="button" onClick={handleReset} className="btn-secondary" title="Reiniciar">
            <RotateCw className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* ── Resultados ── */}
      {resultados !== null && (
        <section id="resultados" className="mt-10 scroll-mt-24 space-y-6">

          {resultados[0] && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-good" />
                <h2 className="font-display text-xl font-extrabold text-ink">Mejor coincidencia</h2>
                <ScoreBadge score={resultados[0].score} />
              </div>
              <PostCard post={resultados[0].post} score={resultados[0].score} matches={resultados[0].matches} grande />
            </div>
          )}

          {secundarios.length > 0 && (
            <div>
              <button type="button" onClick={() => setVerTodos(v => !v)}
                className="mb-3 flex w-full items-center gap-2">
                <ChevronDown className={`h-4 w-4 text-ink-muted transition-transform ${verTodos ? 'rotate-180' : ''}`} />
                <h2 className="font-display text-base font-extrabold text-ink">Otras posibilidades</h2>
                <span className="badge bg-black/8 text-ink-muted">{secundarios.length}</span>
              </button>
              {verTodos && (
                <div className="space-y-3">
                  {secundarios.map(({ post, score, matches }) => (
                    <PostCard key={post.id} post={post} score={score} matches={matches} />
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

/* ─────────────── Componentes ─────────────── */

function scoreColor(score: number) {
  return score >= 75 ? 'bg-good' : score >= 50 ? 'bg-warn' : 'bg-white/50';
}

function ScoreBadge({ score }: { score: number }) {
  const cls = score >= 75 ? 'bg-good/15 text-good'
            : score >= 50 ? 'bg-warn/20 text-[#8a5a00]'
            : 'bg-black/8 text-ink-muted';
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${cls}`}>{score}% similar</span>;
}

function Chip({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`rounded-full bg-brand-cream px-2.5 py-0.5 text-xs font-semibold text-ink ${className}`}>
      {children}
    </span>
  );
}

function PostCard({ post, score, matches, grande = false }: { post: Post; score: number; matches: string[]; grande?: boolean }) {
  if (grande) {
    return (
      <Link href={`/publicaciones/${post.id}`}
        className="group block overflow-hidden rounded-2xl bg-white shadow-card ring-2 ring-brand-primary/30 transition hover:-translate-y-0.5">
        <div className="relative h-48 w-full overflow-hidden bg-brand-cream">
          {post.images?.[0]
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={post.images[0]} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />
            : <div className="flex h-full items-center justify-center text-brand-primary/20"><ImageIcon className="h-12 w-12" /></div>
          }
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/20">
                <div className={`h-full rounded-full ${scoreColor(score)}`} style={{ width: `${score}%` }} />
              </div>
              <span className="text-sm font-extrabold text-white">{score}%</span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                post.categoria === 'perdido' ? 'bg-lost text-white' :
                post.categoria === 'encontrado' ? 'bg-found text-white' : 'bg-adopt text-[#5b3a0e]'
              }`}>{ETIQUETA_CATEGORIA[post.categoria]}</span>
              <h3 className="mt-1 font-display text-xl font-extrabold text-ink">{post.nombre ?? 'Sin nombre'}</h3>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-brand-primary transition group-hover:gap-2">
              Ver aviso <ArrowRight className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {post.raza   && <Chip>{post.raza}</Chip>}
            {post.color  && <Chip>{post.color}</Chip>}
            {post.tamano && <Chip className="capitalize">{post.tamano}</Chip>}
            {post.collar  === true && <Chip>Con collar</Chip>}
            {post.chapita === true && <Chip>Con chapita</Chip>}
          </div>
          {matches.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {matches.map(m => (
                <span key={m} className="inline-flex items-center gap-1 rounded-full bg-good/10 px-2 py-0.5 text-[10px] font-bold text-good">
                  <Check className="h-2.5 w-2.5" /> {m}
                </span>
              ))}
            </div>
          )}
          <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{post.descripcion}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-ink-muted">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-brand-primary" />
              <span className="font-bold text-ink">{post.zona}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {post.fecha}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/publicaciones/${post.id}`}
      className="group flex gap-3 overflow-hidden rounded-2xl bg-white p-3 shadow-soft ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-card">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-brand-cream">
        {post.images?.[0]
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={post.images[0]} alt="" className="h-full w-full object-cover" />
          : <div className="flex h-full items-center justify-center text-brand-primary/20"><ImageIcon className="h-6 w-6" /></div>
        }
        <span className="absolute bottom-0.5 left-0.5 right-0.5 rounded text-center text-[9px] font-extrabold bg-black/55 text-white">
          {score}%
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <span className={`inline-block rounded-full px-1.5 py-0.5 text-[9px] font-extrabold ${
            post.categoria === 'perdido' ? 'bg-lost text-white' : 'bg-found text-white'
          }`}>{ETIQUETA_CATEGORIA[post.categoria]}</span>
          <p className="font-display text-sm font-extrabold text-ink">{post.nombre ?? 'Sin nombre'}</p>
          {matches.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-0.5">
              {matches.map(m => (
                <span key={m} className="text-[9px] font-semibold text-good">✓ {m}</span>
              ))}
            </div>
          )}
          <p className="line-clamp-1 text-xs text-ink-muted">{post.descripcion}</p>
        </div>
        <span className="flex items-center gap-1 text-[11px] font-semibold text-ink-muted">
          <MapPin className="h-3 w-3 text-brand-primary" /> {post.zona}
        </span>
      </div>
    </Link>
  );
}

