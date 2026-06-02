'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search, ChevronLeft, Dog, MapPin, Calendar, Clock,
  CheckCircle2, XCircle, HelpCircle, Loader2, ArrowRight, ImageIcon,
} from 'lucide-react';
import { listarPosts, type Post } from '@/lib/posts';
import { ETIQUETA_CATEGORIA } from '@/lib/mockData';
import RazaAutocomplete from '@/components/RazaAutocomplete';

/* ─────────────── Tipos del formulario ─────────────── */

type Triestado = 'si' | 'no' | 'ns';  // sí / no / no sé

interface BuscarForm {
  raza:       string;
  color:      string;
  tamano:     'pequeño' | 'mediano' | 'grande' | '';
  sexo:       'macho' | 'hembra' | 'ns';
  collar:     Triestado;
  colorCollar: string;
  chapita:    Triestado;
  zona:       string;
  fecha:      string;
  horario:    string;
}

interface Resultado {
  post:       Post;
  score:      number;
  max:        number;
  porcentaje: number;
  excluir:    boolean;
}

const FORM_INICIAL: BuscarForm = {
  raza: '', color: '', tamano: '', sexo: 'ns',
  collar: 'ns', colorCollar: '', chapita: 'ns',
  zona: '', fecha: '', horario: '',
};

const COLORES = [
  'Negro', 'Blanco', 'Marrón', 'Caramelo', 'Dorado', 'Gris',
  'Atigrado', 'Tricolor', 'Manchado', 'Canela',
];

const COLOR_CATEGORIA: Record<string, string> = {
  perdido:    'bg-lost text-white',
  encontrado: 'bg-found text-white',
  adopcion:   'bg-adopt text-[#5b3a0e]',
};

/* ─────────────── Matching ─────────────── */

function norm(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/**
 * Nuevo sistema de matching: filtros obligatorios + score de confianza.
 *
 * Si un criterio está especificado Y el aviso tiene ese dato Y no coincide → EXCLUIR.
 * Si el aviso no tiene ese dato → no excluir (puede ser que no lo cargaron).
 * El score sirve solo para ordenar entre los que pasan el filtro.
 */
function calcularScore(post: Post, f: BuscarForm): { score: number; max: number; excluir: boolean } {
  const desc = norm(post.descripcion);
  const zona = norm(post.zona);
  let score   = 0;
  let max     = 0;
  let excluir = false;

  /* ── RAZA (filtro obligatorio + score alto) ── */
  if (f.raza.trim()) {
    max += 40;
    const razaBuscada = norm(f.raza);
    if (post.raza) {
      const razaPost = norm(post.raza);
      if (razaPost.includes(razaBuscada) || razaBuscada.includes(razaPost)) {
        score += 40; // coincidencia exacta en campo estructurado
      } else if (desc.includes(razaBuscada)) {
        score += 20; // menciona la raza en la descripción
      } else {
        excluir = true; // tiene raza distinta → excluir
      }
    } else {
      // No tiene raza cargada → buscar en descripción
      if (desc.includes(razaBuscada)) score += 20;
      // Si no está en descripción, no excluir (dato ausente = desconocido)
    }
  }

  /* ── COLOR (filtro obligatorio) ── */
  if (f.color && !excluir) {
    max += 30;
    const colorBuscado = norm(f.color);
    if (post.color) {
      if (norm(post.color) === colorBuscado || norm(post.color).includes(colorBuscado)) {
        score += 30;
      } else if (desc.includes(colorBuscado)) {
        score += 15; // mencionado en descripción aunque campo distinto
      } else {
        excluir = true; // color claramente diferente → excluir
      }
    } else {
      if (desc.includes(colorBuscado)) score += 15;
      // Si no, dato ausente → no excluir
    }
  }

  /* ── TAMAÑO (filtro obligatorio) ── */
  if (f.tamano && !excluir) {
    max += 15;
    const palabrasTamano: Record<string, string[]> = {
      pequeño: ['pequeno', 'pequeño', 'chico', 'mini', 'toy'],
      mediano: ['mediano'],
      grande:  ['grande'],
    };
    if (post.tamano) {
      if (post.tamano === f.tamano) {
        score += 15;
      } else {
        excluir = true; // tamaño diferente → excluir
      }
    } else {
      if (palabrasTamano[f.tamano]?.some((p) => desc.includes(p))) score += 15;
    }
  }

  /* ── SEXO (filtro obligatorio) ── */
  if (f.sexo !== 'ns' && !excluir) {
    max += 10;
    // El sexo puede estar en la descripción o en el campo estructurado
    const sexoPost = (post as unknown as Record<string, string | undefined>).sexo;
    if (sexoPost) {
      if (norm(sexoPost) === f.sexo) {
        score += 10;
      } else {
        excluir = true;
      }
    } else if (desc.includes(f.sexo)) {
      score += 10;
    } else {
      // Buscar variantes
      const esMacho  = ['macho', 'perrito', 'cachorro macho'].some((p) => desc.includes(p));
      const esHembra = ['hembra', 'perrita', 'cachorra'].some((p) => desc.includes(p));
      if (f.sexo === 'macho'  && esHembra) { excluir = true; }
      else if (f.sexo === 'hembra' && esMacho) { excluir = true; }
      else if (f.sexo === 'macho'  && esMacho)  { score += 10; }
      else if (f.sexo === 'hembra' && esHembra) { score += 10; }
    }
  }

  /* ── COLLAR (filtro cuando hay datos explícitos) ── */
  if (f.collar !== 'ns' && !excluir) {
    max += 8;
    if (post.collar !== null && post.collar !== undefined) {
      if ((f.collar === 'si') === post.collar) score += 8;
      else excluir = true;
    } else {
      if (f.collar === 'si' && desc.includes('collar') && !desc.includes('sin collar')) score += 8;
      else if (f.collar === 'no' && (desc.includes('sin collar') || !desc.includes('collar'))) score += 8;
    }
  }

  /* Color del collar (solo informativo, no excluye) */
  if (f.collar === 'si' && f.colorCollar.trim() && !excluir) {
    max += 5;
    if (desc.includes(norm(f.colorCollar))) score += 5;
  }

  /* ── CHAPITA (filtro cuando hay datos explícitos) ── */
  if (f.chapita !== 'ns' && !excluir) {
    max += 7;
    if (post.chapita !== null && post.chapita !== undefined) {
      if ((f.chapita === 'si') === post.chapita) score += 7;
      else excluir = true;
    } else {
      if (f.chapita === 'si' && (desc.includes('chapita') || desc.includes('plaquita'))) score += 7;
      else if (f.chapita === 'no' && desc.includes('sin chapita')) score += 7;
    }
  }

  /* ── ZONA (no excluye, pero suma mucho si coincide) ── */
  if (f.zona.trim() && !excluir) {
    max += 15;
    const zonaBuscada = norm(f.zona);
    if (zona.includes(zonaBuscada) || zonaBuscada.includes(zona.split(',')[0])) score += 15;
    else if (zona.split(' ').some((w) => w.length > 3 && zonaBuscada.includes(w))) score += 8;
  }

  /* ── FECHA (rango de 7 días, no excluye) ── */
  if (f.fecha && !excluir) {
    max += 5;
    const dias = Math.abs(new Date(post.fecha).getTime() - new Date(f.fecha).getTime()) / (1000 * 60 * 60 * 24);
    if (dias <= 3) score += 5;
    else if (dias <= 7) score += 3;
  }

  /* ── HORARIO (±3 hs, no excluye) ── */
  if (f.horario && post.horario && !excluir) {
    max += 5;
    const [hB, mB] = f.horario.split(':').map(Number);
    const [hP, mP] = post.horario.split(':').map(Number);
    if (Math.abs((hB * 60 + mB) - (hP * 60 + mP)) <= 180) score += 5;
  }

  return { score, max, excluir };
}

/* ─────────────── Página ─────────────── */

export default function BuscarPage() {
  const [form,      setForm]      = useState<BuscarForm>(FORM_INICIAL);
  const [resultados, setResultados] = useState<Resultado[] | null>(null);
  const [cargando,  setCargando]  = useState(false);
  const [buscado,   setBuscado]   = useState(false);

  function campo<K extends keyof BuscarForm>(k: K, v: BuscarForm[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setBuscado(false);

    try {
      /* Traer TODOS los posts (en un futuro se puede filtrar server-side) */
      const todos = await listarPosts();

      /* Solo "encontrado" y "perdido" para buscar coincidencias */
      const candidatos = todos.filter((p) => p.categoria !== 'adopcion');

      const hayAlgunCriterio =
        form.raza.trim() || form.color || form.tamano ||
        form.sexo !== 'ns' || form.collar !== 'ns' || form.chapita !== 'ns' ||
        form.zona.trim() || form.fecha;

      let lista: Resultado[];

      if (!hayAlgunCriterio) {
        /* Sin criterios → mostrar todos los encontrado/perdido sin score */
        lista = candidatos.map((post) => ({
          post, score: 0, max: 0, porcentaje: 0, excluir: false,
        }));
      } else {
        lista = candidatos
          .map((post) => {
            const { score, max, excluir } = calcularScore(post, form);
            const porcentaje = max > 0 ? Math.round((score / max) * 100) : 0;
            return { post, score, max, porcentaje, excluir };
          })
          .filter((r) => !r.excluir && r.score > 0)
          .sort((a, b) => b.porcentaje - a.porcentaje);
      }

      setResultados(lista);
    } finally {
      setCargando(false);
      setBuscado(true);
    }
  }

  return (
    <div className="mx-auto max-w-2xl py-8 md:py-10">
      {/* Back */}
      <Link
        href="/publicaciones"
        className="mb-5 inline-flex items-center gap-1 text-sm font-semibold text-ink-muted transition hover:text-ink"
      >
        <ChevronLeft className="h-4 w-4" /> Volver a los avisos
      </Link>

      {/* Header */}
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary">
          <Search className="h-3.5 w-3.5" /> Buscar por características
        </span>
        <h1 className="mt-2 font-display text-3xl font-black tracking-tight text-ink">
          ¿Cómo era el perro?
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Completá lo que sepas. Cuanto más datos, mejores las coincidencias.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── Características ── */}
        <div className="card p-5 sm:p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-base font-extrabold text-ink">
            <Dog className="h-4 w-4 text-brand-primary" /> Características del perro
          </h2>

          <div className="space-y-4">
            {/* Raza */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Raza</label>
                <RazaAutocomplete value={form.raza} onChange={(v) => campo('raza', v)} />
                <p className="mt-1 text-xs text-ink-muted">Si especificás raza, solo aparecen perros de esa raza</p>
              </div>

              {/* Color */}
              <div>
                <label className="label">Color principal</label>
                <select
                  className="field w-full"
                  value={form.color}
                  onChange={(e) => campo('color', e.target.value)}
                >
                  <option value="">No sé / no recuerdo</option>
                  {COLORES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Tamaño */}
            <div>
              <label className="label">Tamaño</label>
              <div className="flex gap-2">
                {([['pequeño', 'Chico'], ['mediano', 'Mediano'], ['grande', 'Grande']] as const).map(([v, l]) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => campo('tamano', form.tamano === v ? '' : v)}
                    className={`flex-1 rounded-2xl border-2 py-2.5 text-sm font-bold transition ${
                      form.tamano === v
                        ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                        : 'border-black/10 text-ink-muted hover:border-brand-primary/40'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Sexo */}
            <div>
              <label className="label">Sexo</label>
              <div className="flex gap-2">
                {([['macho', 'Macho'], ['hembra', 'Hembra'], ['ns', 'No sé']] as const).map(([v, l]) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => campo('sexo', v)}
                    className={`flex-1 rounded-2xl border-2 py-2.5 text-sm font-bold transition ${
                      form.sexo === v
                        ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                        : 'border-black/10 text-ink-muted hover:border-brand-primary/40'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Collar */}
            <div>
              <label className="label">¿Tenía collar?</label>
              <TriestadoBotones value={form.collar} onChange={(v) => campo('collar', v)} />
            </div>

            {/* Color del collar (solo si tiene collar) */}
            {form.collar === 'si' && (
              <div>
                <label className="label">Color del collar</label>
                <input
                  className="field w-full"
                  placeholder="Rojo, azul, negro…"
                  value={form.colorCollar}
                  onChange={(e) => campo('colorCollar', e.target.value)}
                />
              </div>
            )}

            {/* Chapita */}
            <div>
              <label className="label">¿Tenía chapita / plaquita identificadora?</label>
              <TriestadoBotones value={form.chapita} onChange={(v) => campo('chapita', v)} />
            </div>
          </div>
        </div>

        {/* ── Dónde / cuándo ── */}
        <div className="card p-5 sm:p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-base font-extrabold text-ink">
            <MapPin className="h-4 w-4 text-brand-primary" /> Dónde y cuándo
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Zona / barrio</label>
              <input
                className="field w-full"
                placeholder="Villa Mitre, Centro…"
                value={form.zona}
                onChange={(e) => campo('zona', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Fecha aproximada</label>
              <input
                type="date"
                className="field w-full"
                value={form.fecha}
                onChange={(e) => campo('fecha', e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Horario aproximado (±3 hs)</label>
              <input
                type="time"
                className="field w-full sm:w-48"
                value={form.horario}
                onChange={(e) => campo('horario', e.target.value)}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="btn-primary w-full disabled:opacity-60"
        >
          {cargando
            ? <><Loader2 className="h-5 w-5 animate-spin" /> Buscando…</>
            : <><Search className="h-5 w-5" /> Buscar coincidencias</>
          }
        </button>
      </form>

      {/* ── Resultados ── */}
      {buscado && resultados !== null && (
        <div className="mt-8">
          <h2 className="mb-4 font-display text-xl font-extrabold text-ink">
            {resultados.length === 0
              ? 'Sin coincidencias'
              : `${resultados.length} aviso${resultados.length !== 1 ? 's' : ''} encontrado${resultados.length !== 1 ? 's' : ''}`}
          </h2>

          {resultados.length === 0 ? (
            <div className="card p-8 text-center">
              <Dog className="mx-auto h-10 w-10 text-brand-primary/30" />
              <p className="mt-3 font-bold text-ink">
                No encontramos avisos que coincidan
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                Probá con menos filtros o revisá todos los avisos.
              </p>
              <Link
                href="/publicaciones?cat=encontrado"
                className="btn-secondary mt-4 inline-flex"
              >
                Ver todos los vistos
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {resultados.map(({ post, porcentaje, max }) => (
                <ResultadoCard
                  key={post.id}
                  post={post}
                  porcentaje={porcentaje}
                  mostrarScore={max > 0}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────── Sub-componentes ─────────────── */

function TriestadoBotones({
  value, onChange,
}: {
  value: Triestado;
  onChange: (v: Triestado) => void;
}) {
  return (
    <div className="flex gap-2">
      {([
        ['si', 'Sí',    CheckCircle2],
        ['no', 'No',    XCircle],
        ['ns', 'No sé', HelpCircle],
      ] as const).map(([v, l, Icon]) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-2xl border-2 py-2.5 text-sm font-bold transition ${
            value === v
              ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
              : 'border-black/10 text-ink-muted hover:border-brand-primary/40'
          }`}
        >
          <Icon className="h-4 w-4" /> {l}
        </button>
      ))}
    </div>
  );
}

function ResultadoCard({
  post, porcentaje, mostrarScore,
}: {
  post:         Post;
  porcentaje:   number;
  mostrarScore: boolean;
}) {
  const principal = post.images?.[0];

  const scoreColor =
    porcentaje >= 70 ? 'bg-good/15 text-good' :
    porcentaje >= 40 ? 'bg-warn/20 text-[#8a5a00]' :
    'bg-black/5 text-ink-muted';

  return (
    <Link
      href={`/publicaciones/${post.id}`}
      className="group flex gap-4 overflow-hidden rounded-2xl bg-white p-4 shadow-soft ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-card"
    >
      {/* Foto */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-brand-cream">
        {principal ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={principal}
            alt={post.nombre ?? 'Sin nombre'}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-primary/20">
            <ImageIcon className="h-8 w-8" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                post.categoria in { perdido: 1, encontrado: 1, adopcion: 1 }
                  ? (post.categoria === 'perdido' ? 'bg-lost text-white' :
                     post.categoria === 'encontrado' ? 'bg-found text-white' :
                     'bg-adopt text-[#5b3a0e]')
                  : 'bg-black/10 text-ink'
              }`}>
                {ETIQUETA_CATEGORIA[post.categoria] ?? post.categoria}
              </span>
              <h3 className="mt-1 font-display text-base font-extrabold text-ink">
                {post.nombre ?? 'Sin nombre'}
              </h3>
            </div>
            {mostrarScore && (
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-extrabold ${scoreColor}`}>
                {porcentaje}%
              </span>
            )}
          </div>
          <p className="mt-0.5 line-clamp-2 text-xs text-ink-muted">
            {post.descripcion}
          </p>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-ink-muted">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-brand-primary" />
            <span className="font-bold text-ink">{post.zona}</span>
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" /> {post.fecha}
          </span>
          {post.horario && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {post.horario}
            </span>
          )}
          <span className="ml-auto flex items-center gap-0.5 font-bold text-brand-primary transition group-hover:gap-1">
            Ver aviso <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
