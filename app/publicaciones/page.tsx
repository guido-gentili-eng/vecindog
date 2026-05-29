'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ScanSearch, Sparkles, ArrowRight, Dog, Loader2 } from 'lucide-react';
import { type FiltroCategoria } from '@/lib/mockData';
import { listarPosts, postToAnimal, type Post } from '@/lib/posts';
import AnimalCard from '@/components/AnimalCard';
import Filters, { FILTROS_INICIALES, type FiltrosState } from '@/components/Filters';
import AdSlot from '@/components/AdSlot';
import { useAuth } from '@/contexts/AuthContext';
import { nombreCorto } from '@/lib/ciudades';

/** Cuántos avisos reales entre cada ad card */
const AD_INTERVAL = 4;

const CAT_VALIDAS: FiltroCategoria[] = [
  'todas', 'buscar', 'perdido', 'encontrado', 'adopcion'
];

const TITULO_CATEGORIA: Record<FiltroCategoria, string> = {
  todas:      'Todos los avisos',
  buscar:     'Perdidos y encontrados',
  perdido:    'Perros perdidos',
  encontrado: 'Perros encontrados',
  adopcion:   'Perros en adopción'
};

const SUBTITULO_CATEGORIA: Record<FiltroCategoria, string> = {
  todas:      'Los perros publicados por los vecinos de tu ciudad.',
  buscar:     'Perros perdidos y encontrados cerca tuyo.',
  perdido:    'Familias buscando a su perro. ¿Lo viste?',
  encontrado: 'Perros encontrados que buscan a su familia.',
  adopcion:   'Perros que buscan una familia responsable.'
};

export default function PublicacionesPage() {
  const searchParams = useSearchParams();
  const catParam  = searchParams.get('cat');
  const zonaParam = searchParams.get('zona') ?? '';
  const { ciudad } = useAuth();

  const catInicial: FiltroCategoria =
    catParam && (CAT_VALIDAS as string[]).includes(catParam)
      ? (catParam as FiltroCategoria)
      : 'todas';

  const [filtros, setFiltros] = useState<FiltrosState>({
    ...FILTROS_INICIALES,
    categoria: catInicial,
    zona:      zonaParam
  });
  const [posts,    setPosts]    = useState<Post[]>([]);
  const [cargando, setCargando] = useState(true);
  const [fetchErr, setFetchErr] = useState('');

  useEffect(() => {
    setFiltros((f) => ({ ...f, categoria: catInicial, zona: zonaParam }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catParam, zonaParam]);

  /* Cargar posts desde Supabase */
  useEffect(() => {
    setCargando(true);
    listarPosts()
      .then(setPosts)
      .catch((e) => setFetchErr(e.message ?? 'Error al cargar los avisos.'))
      .finally(() => setCargando(false));
  }, []);

  /* Filtros client-side */
  const resultados = useMemo(() => {
    const cat  = filtros.categoria;
    const esp  = filtros.especie;
    const zona = filtros.zona.trim().toLowerCase();

    return posts.filter((p) => {
      if (cat === 'buscar') {
        if (p.categoria !== 'perdido' && p.categoria !== 'encontrado') return false;
      } else if (cat !== 'todas' && p.categoria !== cat) return false;
      if (esp !== 'todas' && p.especie !== esp) return false;
      if (zona && !p.zona.toLowerCase().includes(zona)) return false;
      return true;
    });
  }, [posts, filtros]);

  return (
    <div className="py-8 md:py-10">
      <header className="mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary">
          <Dog className="h-3.5 w-3.5" /> Perros{ciudad ? ` · ${nombreCorto(ciudad)}` : ''}
        </span>
        <h1 className="mt-2 font-display text-3xl font-black tracking-tight text-ink md:text-4xl">
          {TITULO_CATEGORIA[filtros.categoria]}
        </h1>
        <p className="mt-1 text-ink-muted">
          {SUBTITULO_CATEGORIA[filtros.categoria]}{' '}
          {!cargando && (
            <span className="font-bold text-ink">
              {resultados.length} aviso{resultados.length !== 1 ? 's' : ''}
            </span>
          )}
        </p>
      </header>

      {/* Banners de búsqueda */}
      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        {/* Buscar por características */}
        <Link
          href="/buscar"
          className="group flex items-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-primary to-brand-primary-dark p-4 text-white shadow-soft ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-card"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <ScanSearch className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <h2 className="font-display text-sm font-extrabold sm:text-base">Buscar por características</h2>
            <p className="mt-0.5 text-xs text-white/80">
              Color, tamaño, collar, chapita…
            </p>
          </div>
          <ArrowRight className="hidden h-5 w-5 shrink-0 transition group-hover:translate-x-0.5 sm:block" />
        </Link>

        {/* Buscar por foto (próximamente) */}
        <Link
          href="/buscar-por-foto"
          className="group flex items-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#2a1f1c] p-4 text-white shadow-soft ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-card"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <h2 className="font-display text-sm font-extrabold sm:text-base">Buscar por foto</h2>
            <p className="mt-0.5 text-xs text-white/80">
              Subí una foto y comparamos colores
            </p>
          </div>
          <ArrowRight className="hidden h-5 w-5 shrink-0 transition group-hover:translate-x-0.5 sm:block" />
        </Link>
      </div>

      <Filters value={filtros} onChange={setFiltros} />

      <section className="mt-6">
        {cargando ? (
          <div className="flex min-h-[30vh] items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-brand-primary" />
          </div>
        ) : fetchErr ? (
          <div className="card p-8 text-center">
            <p className="font-bold text-bad">{fetchErr}</p>
          </div>
        ) : resultados.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-cream text-brand-primary">
              <Dog className="h-7 w-7" />
            </div>
            <h2 className="mt-3 font-display text-xl font-extrabold text-ink">
              {posts.length === 0
                ? 'Todavía no hay avisos publicados'
                : 'No hay avisos con esos filtros'}
            </h2>
            <p className="mt-1 text-ink-muted">
              {posts.length === 0
                ? '¡Sé el primero en publicar un aviso!'
                : 'Probá cambiar el tipo de aviso o ampliar la zona.'}
            </p>
            {posts.length === 0 && (
              <Link href="/publicar" className="btn-primary mt-4 inline-flex">
                Publicar aviso
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {resultados.map((p, i) => (
              <>
                <AnimalCard key={p.id} animal={postToAnimal(p)} />
                {(i + 1) % AD_INTERVAL === 0 && (
                  <AdSlot key={`ad-${i}`} variant="card" />
                )}
              </>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
