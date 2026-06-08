'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft, Phone, MapPin, Clock, ExternalLink, Building2, Loader2,
  Stethoscope, ShoppingBag, Scissors, Award, Footprints, Home,
  Lock, Sparkles, Search, X, ChevronRight, PenLine,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { buscarCiudades } from '@/lib/ciudades';
import type { Ad } from '@/lib/ads';

const CATEGORIAS: Record<string, {
  label: string;
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
  bg: string;
  text: string;
}> = {
  'veterinaria':       { label: 'Veterinaria',       slug: 'Veterinaria',       icon: Stethoscope, bg: 'bg-blue-50',   text: 'text-blue-600' },
  'pet-shop':          { label: 'Pet Shop',           slug: 'Pet Shop',          icon: ShoppingBag, bg: 'bg-green-50',  text: 'text-green-600' },
  'peluqueria-canina': { label: 'Peluquería Canina',  slug: 'Peluquería Canina', icon: Scissors,    bg: 'bg-pink-50',   text: 'text-pink-600' },
  'adiestrador':       { label: 'Adiestrador',        slug: 'Adiestrador',       icon: Award,       bg: 'bg-purple-50', text: 'text-purple-600' },
  'paseador':          { label: 'Paseador',           slug: 'Paseador',          icon: Footprints,  bg: 'bg-orange-50', text: 'text-orange-500' },
  'guarderia-hotel':   { label: 'Guardería / Hotel',  slug: 'Guardería / Hotel', icon: Home,        bg: 'bg-amber-50',  text: 'text-amber-600' },
};

export default function CategoriaPage() {
  const params  = useParams();
  const router  = useRouter();
  const catKey  = params?.categoria as string;
  const cat     = CATEGORIAS[catKey];
  const { t } = useLanguage();

  const { isPro, loading: authLoading, ciudad, setCiudad } = useAuth();

  const [comercios, setComerciosState] = useState<Ad[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!cat || !ciudad) { setDataLoading(false); return; }

    const hoy = new Date().toISOString().slice(0, 10);
    Promise.resolve(
      supabase
        .from('ads')
        .select('*')
        .eq('variant', 'comercio')
        .eq('activo', true)
        .eq('categoria_local', cat.slug)
        .ilike('direccion_comercio', `%${ciudad}%`)
        .or(`fecha_fin.is.null,fecha_fin.gte.${hoy}`)
        .order('created_at', { ascending: false })
    ).then(({ data }) => {
      setComerciosState((data as Ad[]) ?? []);
    }).then(() => setDataLoading(false), () => setDataLoading(false));
  }, [catKey, cat, ciudad]);

  if (!cat) {
    return (
      <div className="py-16 text-center">
        <p className="text-ink-muted">{t.rvcatNoEncontrado}</p>
        <Link href="/red-vecindog" className="mt-4 inline-flex items-center gap-1 font-bold text-brand-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> {t.rvcatVolverRvn}
        </Link>
      </div>
    );
  }

  const Icon    = cat.icon;
  const cargando = authLoading || dataLoading;

  if (!authLoading && !ciudad) {
    return <CiudadGate onConfirm={setCiudad} />;
  }

  return (
    <div className="py-10 md:py-14">

      <div className="mb-10">
        <Link
          href="/red-vecindog"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-muted transition hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" /> {t.rvcatBack}
        </Link>

        <div className="mt-4 flex items-center gap-4">
          <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${cat.bg}`}>
            <Icon className={`h-7 w-7 ${cat.text}`} />
          </div>
          <div>
            <h1 className="font-display text-3xl font-black text-ink md:text-4xl">{cat.label}</h1>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-ink-muted">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-primary" />
              {ciudad}
            </p>
            {!cargando && isPro && (
              <p className="mt-1 text-sm text-ink-muted">
                {comercios.length === 0
                  ? t.rvcatSinInscrip
                  : `${comercios.length} negocio${comercios.length !== 1 ? 's' : ''} adherido${comercios.length !== 1 ? 's' : ''}`}
              </p>
            )}
          </div>
        </div>
      </div>

      {cargando ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-7 w-7 animate-spin text-amber-500" />
        </div>
      ) : !isPro ? (
        <ProGate
          count={comercios.length}
          onVerPro={() => router.push('/planes')}
        />
      ) : comercios.length === 0 ? (
        <EmptyState categoria={cat.label} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {comercios.map((c) => (
            <ComercioCard key={c.id} comercio={c} />
          ))}
        </div>
      )}

    </div>
  );
}

function ProGate({
  count,
  onVerPro,
}: {
  count: number;
  onVerPro: () => void;
}) {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-md py-8 text-center">
      <div className="card p-8 md:p-10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#5b21b6]/10">
          <Lock className="h-8 w-8 text-[#5b21b6]" />
        </div>

        <h2 className="mt-5 font-display text-2xl font-black text-ink">
          {t.rvcatProTitle}
        </h2>

        <p className="mt-2 text-ink-muted">
          {count > 0 && <span>{count} negocios adheridos. </span>}
          {t.rvcatProSub}
        </p>

        <div className="mt-6 rounded-2xl bg-brand-cream p-4 text-left">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-muted">{t.rvcatProBeneficios}</p>
          <ul className="space-y-1.5">
            {[
              'Todo lo del plan Gratis',
              'Perros ilimitados',
              'Publicaciones ilimitadas',
              'Perfil completo (chip, vacunas, estudios médicos, historial)',
              'Los más escapistas 🏃',
              'Búsqueda por foto con IA 📷',
              'Búsqueda avanzada por características',
              'Panel de Amigos',
              'Notificaciones en tiempo real 🔔',
              'Instagram y Facebook en el perfil',
              'Acceso a Mi red Vecindog 🐾',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-ink">
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#5b21b6]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={onVerPro}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#5b21b6] to-[#4c1d95] px-5 py-3.5 font-bold text-white shadow-soft transition hover:opacity-90"
        >
          <Sparkles className="h-4 w-4" /> {t.rvcatVerPro}
        </button>

        <Link
          href="/red-vecindog"
          className="mt-3 inline-block text-sm font-semibold text-ink-muted hover:text-ink"
        >
          {t.rvcatVolverRvn}
        </Link>
      </div>
    </div>
  );
}

function ComercioCard({ comercio: c }: { comercio: Ad }) {
  const { t } = useLanguage();
  const horario = [c.horario_apertura, c.horario_cierre].filter(Boolean).join(' – ');

  return (
    <div className="card overflow-hidden p-0">
      {c.imagen_url ? (
        <div className="relative h-44 w-full overflow-hidden">
          <Image src={c.imagen_url} alt={c.titulo} fill className="object-cover" sizes="(max-width:768px) 100vw, 360px" />
        </div>
      ) : (
        <div className="flex h-44 items-center justify-center bg-brand-cream">
          <Building2 className="h-10 w-10 text-ink-muted/30" />
        </div>
      )}

      <div className="p-5">
        <h2 className="font-display text-lg font-black text-ink leading-tight">{c.titulo}</h2>
        {c.subtitulo && <p className="mt-0.5 text-sm text-ink-muted">{c.subtitulo}</p>}

        <div className="mt-4 space-y-2">
          {c.telefono_comercio && (
            <a
              href={`tel:${c.telefono_comercio.replace(/[\s\-\(\)]/g, '')}`}
              className="flex items-center gap-2 text-sm font-semibold text-ink transition hover:text-brand-primary"
            >
              <Phone className="h-4 w-4 shrink-0 text-ink-muted" />
              {c.telefono_comercio}
            </a>
          )}
          {c.direccion_comercio && (
            <div className="flex items-start gap-2 text-sm text-ink-muted">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{c.direccion_comercio}</span>
            </div>
          )}
          {(horario || c.dias_atencion) && (
            <div className="flex items-start gap-2 text-sm text-ink-muted">
              <Clock className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                {c.dias_atencion && <span className="block">{c.dias_atencion}</span>}
                {horario && <span>{horario} hs</span>}
              </span>
            </div>
          )}
        </div>

        {c.href && !c.href.startsWith('tel:') && (
          <a
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-700 transition hover:border-amber-400 hover:bg-amber-100"
          >
            <ExternalLink className="h-4 w-4" /> {t.rvcatVerNegocio}
          </a>
        )}
      </div>
    </div>
  );
}

function CiudadGate({ onConfirm }: { onConfirm: (c: string) => void }) {
  const { t } = useLanguage();
  const [query,      setQuery]      = useState('');
  const [custom,     setCustom]     = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const resultados = query.trim().length > 0 ? buscarCiudades(query) : [];

  function confirmar(nombre: string) {
    if (!nombre.trim()) return;
    onConfirm(nombre.trim());
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center py-10">
      <div className="card w-full max-w-md p-8 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
          <MapPin className="h-7 w-7" />
        </span>
        <h2 className="mt-4 font-display text-2xl font-black text-ink">
          {t.rvcatCiudadTitle}
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          {t.rvcatCiudadSub}
        </p>

        <div className="mt-5 text-left">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted pointer-events-none" />
            <input
              type="text"
              placeholder={t.rvcatCiudadPh}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowCustom(false); setCustom(''); }}
              className="field w-full pl-10 pr-10"
              autoFocus
            />
            {query && (
              <button type="button" onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-ink-muted hover:text-ink">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {query.trim().length > 0 && !showCustom && (
            <div className="mt-1 max-h-56 overflow-y-auto rounded-2xl bg-white shadow-lg ring-1 ring-black/10">
              {resultados.length === 0 ? (
                <div className="py-4 text-center">
                  <p className="text-sm text-ink-muted">No encontramos <strong>&quot;{query}&quot;</strong></p>
                  <button type="button" onClick={() => setShowCustom(true)}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-2xl bg-brand-primary/10 px-3 py-1.5 text-sm font-bold text-brand-primary">
                    <PenLine className="h-3.5 w-3.5" /> {t.rvcatUsarDeTodas.replace('{q}', query.trim())}
                  </button>
                </div>
              ) : (
                resultados.map((c) => (
                  <button key={c.nombre} type="button" onClick={() => confirmar(c.nombre)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-brand-cream">
                    <MapPin className="h-4 w-4 shrink-0 text-brand-primary/60" />
                    <div className="flex-1">
                      <span className="block font-bold text-ink">{c.nombre}</span>
                      <span className="block text-xs text-ink-muted">{c.provincia}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-ink-muted/40" />
                  </button>
                ))
              )}
            </div>
          )}

          {showCustom && (
            <div className="mt-3">
              <input
                type="text"
                placeholder="Ej: Villa Regina"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && confirmar(custom)}
                className="field w-full"
                autoFocus
              />
              <div className="mt-2 flex gap-2">
                <button type="button" onClick={() => setShowCustom(false)}
                  className="flex-1 rounded-2xl border-2 border-black/10 py-2.5 text-sm font-bold text-ink-muted hover:border-brand-primary hover:text-brand-primary">
                  {t.rvcatVolver}
                </button>
                <button type="button" onClick={() => confirmar(custom)} disabled={!custom.trim()}
                  className="flex-1 rounded-2xl bg-brand-primary py-2.5 text-sm font-bold text-white disabled:opacity-40">
                  {t.rvcatConfirmar}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ categoria }: { categoria: string }) {
  const { t } = useLanguage();
  return (
    <div className="py-16 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-amber-50">
        <Building2 className="h-8 w-8 text-amber-400" />
      </div>
      <h2 className="mt-5 font-display text-xl font-black text-ink">
        {t.rvcatEmptyTitle}
      </h2>
      <p className="mt-1 text-sm text-ink-muted">{categoria}</p>
      <p className="mt-2 text-ink-muted">
        {t.rvcatEmptySub}
      </p>
      <Link
        href="/red-vecindog"
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 font-bold text-white transition hover:bg-amber-600"
      >
        {t.rvcatRegistrar}
      </Link>
    </div>
  );
}
