'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ScanSearch, Sparkles, ArrowRight, Dog, Loader2, Search, Navigation } from 'lucide-react';
import { type FiltroCategoria } from '@/lib/mockData';
import { listarPosts, postToAnimal, type Post } from '@/lib/posts';
import AnimalCard from '@/components/AnimalCard';
import Filters, { FILTROS_INICIALES, type FiltrosState } from '@/components/Filters';
import AdSlot from '@/components/AdSlot';
import { useAuth } from '@/contexts/AuthContext';
import { nombreCorto } from '@/lib/ciudades';
import { useLanguage } from '@/contexts/LanguageContext';

/** Cuántos avisos reales entre cada ad card */
const AD_INTERVAL = 4;
/** Cantidad inicial y de incremento para paginación */
const PAGE_SIZE = 24;

const CAT_VALIDAS: FiltroCategoria[] = [
  'todas', 'buscar', 'perdido', 'encontrado', 'adopcion', 'transito', 'busco_cuidador', 'cuidador_disponible'
];

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}


export default function PublicacionesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const catParam   = searchParams.get('cat');
  const zonaParam  = searchParams.get('zona') ?? '';
  const soloParam  = searchParams.get('solo') === '1';
  const uidParam   = searchParams.get('uid') ?? '';   // para filtro admin
  const { ciudad, user, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const TITULO_CATEGORIA: Record<FiltroCategoria, string> = {
    todas:                t.pubTitleAll,
    buscar:               t.pubTitleBuscar,
    perdido:              t.pubTitlePerdido,
    encontrado:           t.pubTitleEncontrado,
    adopcion:             t.pubTitleAdopcion,
    transito:             t.pubTitleTransito,
    busco_cuidador:       t.pubTitleCuidador,
    cuidador_disponible:  t.pubTitleCuidadorDisp,
  };

  const SUBTITULO_CATEGORIA: Record<FiltroCategoria, string> = {
    todas:                t.pubSubAll,
    buscar:               t.pubSubBuscar,
    perdido:              t.pubSubPerdido,
    encontrado:           t.pubSubEncontrado,
    adopcion:             t.pubSubAdopcion,
    transito:             t.pubSubTransito,
    busco_cuidador:       t.pubSubCuidador,
    cuidador_disponible:  t.pubSubCuidadorDisp,
  };

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
  const [posts,       setPosts]       = useState<Post[]>([]);
  const [cargando,    setCargando]    = useState(true);
  const [fetchErr,    setFetchErr]    = useState('');
  const [busqueda,    setBusqueda]    = useState('');
  const [visibles,    setVisibles]    = useState(PAGE_SIZE);
  const [userCoords,  setUserCoords]  = useState<{ lat: number; lng: number } | null>(null);
  const [cercaniaOn,  setCercaniaOn]  = useState(false);
  const [gpsLoading,  setGpsLoading]  = useState(false);
  const [gpsError,    setGpsError]    = useState(false);

  /* Scroll al tope al montar la página */
  useEffect(() => { window.scrollTo(0, 0); }, []);

  async function toggleCercania() {
    if (cercaniaOn) {
      setCercaniaOn(false);
      return;
    }
    if (userCoords) {
      setCercaniaOn(true);
      return;
    }
    setGpsLoading(true);
    setGpsError(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setCercaniaOn(true);
        setGpsLoading(false);
      },
      () => { setGpsLoading(false); setGpsError(true); setTimeout(() => setGpsError(false), 4000); },
      { timeout: 8000 }
    );
  }

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

    const filtered = posts.filter((p) => {
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

    if (cercaniaOn && userCoords) {
      return [...filtered].sort((a, b) => {
        const dA = a.lat != null && a.lng != null
          ? haversineKm(userCoords.lat, userCoords.lng, a.lat, a.lng)
          : Infinity;
        const dB = b.lat != null && b.lng != null
          ? haversineKm(userCoords.lat, userCoords.lng, b.lat, b.lng)
          : Infinity;
        return dA - dB;
      });
    }
    return filtered;
  }, [posts, filtros, user, uidParam, busqueda, cercaniaOn, userCoords]);

  /* Slice para paginación */
  const visiblesSlice = resultados.slice(0, visibles);

  return (
    <div className="py-8 md:py-10">
      <header className="mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary">
          <Dog className="h-3.5 w-3.5" /> Perros{ciudad ? ` · ${nombreCorto(ciudad)}` : ''}
        </span>
        <h1 className="mt-2 font-display text-3xl font-black tracking-tight text-ink md:text-4xl">
          {filtros.soloMios ? t.pubMyPosts : TITULO_CATEGORIA[filtros.categoria]}
        </h1>
        <p className="mt-1 text-ink-muted">
          {SUBTITULO_CATEGORIA[filtros.categoria]}{' '}
          {!cargando && (
            <span className="font-bold text-ink">
              {resultados.length} {resultados.length !== 1 ? t.pubPostWordPlural : t.pubPostWord}
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
            <h2 className="font-display text-sm font-extrabold sm:text-base">{t.pubBuscarCaractTitle}</h2>
            <p className="mt-0.5 text-xs text-white/80">
              {t.pubBuscarCaractCTA}
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
            <h2 className="font-display text-sm font-extrabold sm:text-base">{t.pubBuscarFotoTitle}</h2>
            <p className="mt-0.5 text-xs text-white/80">
              {t.pubBuscarFotoCTA}
            </p>
          </div>
          <ArrowRight className="hidden h-5 w-5 shrink-0 transition group-hover:translate-x-0.5 sm:block" />
        </Link>
      </div>

      {/* Búsqueda de texto libre + Cerca mío */}
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder={t.pubSearchPlaceholder}
            className="w-full rounded-xl border border-border bg-white py-2.5 pl-9 pr-4 text-sm text-ink placeholder-ink-muted shadow-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
          />
        </div>
        <button
          type="button"
          onClick={toggleCercania}
          disabled={gpsLoading}
          title="Ordenar por cercanía"
          className={`flex shrink-0 items-center gap-1.5 rounded-xl border-2 px-3 py-2 text-sm font-bold transition ${
            cercaniaOn
              ? 'border-brand-primary bg-brand-primary text-white'
              : 'border-black/10 bg-white text-ink-muted hover:border-brand-primary/40 hover:text-brand-primary'
          }`}
        >
          {gpsLoading
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <Navigation className="h-4 w-4" />
          }
          <span className="hidden sm:inline">Cerca mío</span>
        </button>
      </div>

      {gpsError && (
        <p className="mt-2 text-xs font-semibold text-bad">No se pudo obtener tu ubicación. Verificá los permisos del navegador.</p>
      )}

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
              {t.pubEmpty}
            </h2>
            <p className="mt-1 text-ink-muted">
              {t.pubEmptySub}
            </p>
            {posts.length === 0 && (
              <Link href="/publicar" className="btn-primary mt-4 inline-flex">
                {t.navPublicar}
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
                <span className="font-bold text-ink">{resultados.length}</span> {resultados.length !== 1 ? t.pubPostWordPlural : t.pubPostWord}
              </p>
              {visibles < resultados.length && (
                <button
                  onClick={() => setVisibles((v) => v + PAGE_SIZE)}
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  {t.pubShowMore}
                </button>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
