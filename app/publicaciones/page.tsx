'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ScanSearch, Sparkles, ArrowRight, Dog, Loader2, Search } from 'lucide-react';
import { type FiltroCategoria } from '@/lib/mockData';
import { listarPosts, postToAnimal, type Post } from '@/lib/posts';
import AnimalCard from '@/components/AnimalCard';
import Filters, { FILTROS_INICIALES, type FiltrosState } from '@/components/Filters';
import AdSlot from '@/components/AdSlot';
import { useAuth } from '@/contexts/AuthContext';
import { nombreCorto } from '@/lib/ciudades';

/** Cuántos avisos reales entre cada ad card */
const AD_INTERVAL = 4;
/** Cantidad inicial y de incremento para paginación */
const PAGE_SIZE = 24;

const CAT_VALIDAS: FiltroCategoria[] = [
  'todas', 'buscar', 'perdido', 'encontrado', 'adopcion', 'transito', 'busco_cuidador', 'cuidador_disponible'
];

const TITULO_CATEGORIA: Record<FiltroCategoria, string> = {
  todas:                'Todos los avisos',
  buscar:               'Perdidos y vistos',
  perdido:              'Perros perdidos',
  encontrado:           'Perros vistos',
  adopcion:             'Perros en adopción',
  transito:             'Perros en tránsito',
  busco_cuidador:       'Buscan cuidador',
  cuidador_disponible:  'Cuidadores disponibles',
};

const SUBTITULO_CATEGORIA: Record<FiltroCategoria, string> = {
  todas:                'Los perros publicados por los vecinos de tu ciudad.',
  buscar:               'Perros perdidos y vistos cerca tuyo.',
  perdido:              'Familias buscando a su perro. ¿Lo viste?',
  encontrado:           'Perros vistos en la calle que buscan a su familia.',
  adopcion:             'Perros que buscan una familia responsable.',
  transito:             'Perros que alguien tiene temporalmente o vio en la calle.',
  busco_cuidador:       'Dueños que buscan alguien de confianza para cuidar a su perro.',
  cuidador_disponible:  'Vecinos disponibles para cuidar perros de la comunidad.',
};

export default function PublicacionesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const catParam   = searchParams.get('cat');
  const zonaParam  = searchParams.get('zona') ?? '';
  const soloParam  = searchParams.get('solo') === '1';
  const uidParam   = searchParams.get('uid') ?? '';   // para filtro admin
  const { ciudad, user, isAuthenticated } = useAuth();

  const catInicial: FiltroCategoria =
    catParam && (CAT_VALIDAS as string[]).includes(catParam)
      ? (catParam as FiltroCategoria)
      : 'todas';

  const [filtros, setFiltros] = useState<FiltrosState>({
    ...FILTROS_INICIALES,
    categoria: catInicial,
    zona:      zonaParam,
    soloMios:  soloParam,
  });
  const [posts,    setPosts]    = useState<Post[]>([]);
  const [cargando, setCargando] = useState(true);
  const [fetchErr, setFetchErr] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [visibles, setVisibles] = useState(PAGE_SIZE);

  /* Scroll al tope al montar la página */
  useEffect(() => { window.scrollTo(0, 0); }, []);

  /* Sync URL → filtros cuando el usuario navega atrás/adelante */
  useEffect(() => {
    setFiltros((f) => ({
      ...f,
      categoria: catInicial,
      zona:      zonaParam,
      soloMios:  soloParam,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catParam, zonaParam, soloParam]);

  /* Sync filtros → URL para bookmarking y botón atrás */
  const handleFiltrosChange = useCallback((nuevos: FiltrosState) => {
    setFiltros(nuevos);
    setVisibles(PAGE_SIZE);

    const params = new URLSearchParams();
    if (nuevos.categoria !== 'todas') params.set('cat', nuevos.categoria);
    if (nuevos.zona.trim())           params.set('zona', nuevos.zona.trim());
    if (nuevos.soloMios)              params.set('solo', '1');
    if (uidParam)                     params.set('uid', uidParam);

    const qs = params.toString();
    router.push(`/publicaciones${qs ? `?${qs}` : ''}`);
  }, [router, uidParam]);

  /* Reset paginación cuando cambia la búsqueda de texto */
  useEffect(() => {
    setVisibles(PAGE_SIZE);
  }, [busqueda]);

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
    const cat    = filtros.categoria;
    const esp    = filtros.especie;
    const zona   = filtros.zona.trim().toLowerCase();
    const needle = busqueda.trim().toLowerCase();

    return posts.filter((p) => {
      // Filtro admin por uid en URL (solo lectura, no interactivo)
      if (uidParam && p.user_id !== uidParam) return false;
      if (filtros.soloMios && user?.id) {
        if (p.user_id !== user.id) return false;
      }
      if (cat === 'buscar') {
        if (p.categoria !== 'perdido' && p.categoria !== 'encontrado') return false;
      } else if (cat !== 'todas' && p.categoria !== cat) return false;
      if (esp !== 'todas' && p.especie !== esp) return false;
      if (zona && !p.zona.toLowerCase().includes(zona)) return false;
      // Búsqueda de texto libre
      if (needle) {
        const haystack = `${p.nombre ?? ''} ${p.descripcion ?? ''} ${p.zona ?? ''}`.toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });
  }, [posts, filtros, user, uidParam, busqueda]);

  /* Slice para paginación */
  const visiblesSlice = resultados.slice(0, visibles);

  return (
    <div className="py-8 md:py-10">
      <header className="mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary">
          <Dog className="h-3.5 w-3.5" /> Perros{ciudad ? ` · ${nombreCorto(ciudad)}` : ''}
        </span>
        <h1 className="mt-2 font-display text-3xl font-black tracking-tight text-ink md:text-4xl">
          {filtros.soloMios ? 'Mis publicaciones' : TITULO_CATEGORIA[filtros.categoria]}
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

        {/* Buscar por foto */}
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

      {/* Búsqueda de texto libre */}
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, zona, descripción…"
          className="w-full rounded-xl border border-border bg-white py-2.5 pl-9 pr-4 text-sm text-ink placeholder-ink-muted shadow-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
        />
      </div>

      <Filters value={filtros} onChange={handleFiltrosChange} isAuthenticated={isAuthenticated} />

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
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visiblesSlice.map((p, i) => (
                <React.Fragment key={p.id}>
                  <AnimalCard animal={postToAnimal(p)} />
                  {(i + 1) % AD_INTERVAL === 0 && (
                    <AdSlot key={`ad-${i}`} variant="card" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Paginación + contador */}
            <div className="mt-8 flex flex-col items-center gap-3">
              <p className="text-sm text-ink-muted">
                Mostrando <span className="font-bold text-ink">{visiblesSlice.length}</span> de{' '}
                <span className="font-bold text-ink">{resultados.length}</span> aviso{resultados.length !== 1 ? 's' : ''}
              </p>
              {visibles < resultados.length && (
                <button
                  onClick={() => setVisibles((v) => v + PAGE_SIZE)}
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  Cargar más avisos
                </button>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
