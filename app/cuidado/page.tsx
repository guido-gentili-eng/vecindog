'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HandHeart, Search, Phone, MapPin, Calendar, ChevronRight, User, Star, ArrowLeft } from 'lucide-react';
import { listarPostsCuidado, resolverPost, type Post } from '@/lib/posts';
import { useAuth } from '@/contexts/AuthContext';

export default function CuidadoPage() {
  const router   = useRouter();
  const { user } = useAuth();
  const [buscadores, setBuscadores] = useState<Post[]>([]);
  const [cuidadores, setCuidadores] = useState<Post[]>([]);
  const [cargando, setCargando]     = useState(true);

  useEffect(() => {
    Promise.all([
      listarPostsCuidado('busco_cuidador'),
      listarPostsCuidado('cuidador_disponible'),
    ]).then(([b, c]) => {
      setBuscadores(b);
      setCuidadores(c);
    }).finally(() => setCargando(false));
  }, []);

  async function handleResolver(id: string, cat: 'busco_cuidador' | 'cuidador_disponible') {
    await resolverPost(id);
    if (cat === 'busco_cuidador') setBuscadores((p) => p.filter((x) => x.id !== id));
    else setCuidadores((p) => p.filter((x) => x.id !== id));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">

      <button type="button" onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-1 text-sm font-bold text-brand-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> Volver
      </button>

      {/* Hero */}
      <div className="mb-10 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-700">
          <HandHeart className="h-3.5 w-3.5" /> Cuidado de perros
        </span>
        <h1 className="mt-3 font-display text-4xl font-black text-ink">Cuidado de perros</h1>
        <p className="mt-3 text-ink-muted">
          Encontrá un vecino de confianza para cuidar a tu perro, o anotate para cuidar perros de la comunidad.
        </p>
        <p className="mt-2 text-xs font-semibold text-bad/80">
          Esta sección es exclusivamente para intercambios entre vecinos. Está prohibido ofrecer servicios comerciales o cobrar por el cuidado.
        </p>
      </div>

      {/* Grid 2 columnas: izquierda = busco cuidador, derecha = quiero cuidar */}
      <div className="grid gap-6 md:grid-cols-2 md:items-start">

        {/* ── Columna izquierda: Busco cuidador ── */}
        <div>
          <Link
            href="/cuidado/busco-cuidador"
            className="group mb-4 flex overflow-hidden rounded-3xl bg-teal-600 text-white shadow-soft ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-card"
          >
            <div className="flex flex-1 items-start gap-4 p-6">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/20">
                <Search className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display text-xl font-extrabold leading-tight">Busco cuidador</h2>
                <p className="mt-1 text-sm text-white/80">
                  Publicá un aviso con los datos de tu perro y encontrá a alguien que lo cuide.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold opacity-80 transition group-hover:gap-2 group-hover:opacity-100">
                  Publicar pedido <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </Link>

          <h3 className="mb-3 font-display text-base font-black text-ink flex items-center gap-2">
            <Search className="h-4 w-4 text-teal-600" /> Buscan cuidador
            {buscadores.length > 0 && (
              <span className="ml-1 rounded-full bg-teal-100 px-2 py-0.5 text-xs font-bold text-teal-700">
                {buscadores.length}
              </span>
            )}
          </h3>
          {cargando ? (
            <div className="space-y-3">
              {[1,2].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-brand-cream" />)}
            </div>
          ) : buscadores.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-teal-200 bg-teal-50 px-5 py-6 text-center text-sm text-teal-600">
              Todavía no hay avisos.{' '}
              <Link href="/cuidado/busco-cuidador" className="font-bold underline">¡Publicá el primero!</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {buscadores.map((p) => (
                <PostCuidadoCard key={p.id} post={p} mio={p.user_id === user?.id} onResolver={() => handleResolver(p.id, 'busco_cuidador')} />
              ))}
            </div>
          )}
        </div>

        {/* ── Columna derecha: Quiero cuidar ── */}
        <div>
          <Link
            href="/cuidado/quiero-cuidar"
            className="group mb-4 flex overflow-hidden rounded-3xl bg-teal-800 text-white shadow-soft ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-card"
          >
            <div className="flex flex-1 items-start gap-4 p-6">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/20">
                <HandHeart className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display text-xl font-extrabold leading-tight">Quiero cuidar</h2>
                <p className="mt-1 text-sm text-white/80">
                  Anotate como cuidador disponible para ayudar a vecinos que lo necesiten.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold opacity-80 transition group-hover:gap-2 group-hover:opacity-100">
                  Registrarme <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </Link>

          <h3 className="mb-3 font-display text-base font-black text-ink flex items-center gap-2">
            <HandHeart className="h-4 w-4 text-teal-700" /> Cuidadores disponibles
            {cuidadores.length > 0 && (
              <span className="ml-1 rounded-full bg-teal-100 px-2 py-0.5 text-xs font-bold text-teal-700">
                {cuidadores.length}
              </span>
            )}
          </h3>
          {cargando ? (
            <div className="space-y-3">
              {[1,2].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-brand-cream" />)}
            </div>
          ) : cuidadores.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-teal-200 bg-teal-50 px-5 py-6 text-center text-sm text-teal-600">
              Todavía no hay cuidadores.{' '}
              <Link href="/cuidado/quiero-cuidar" className="font-bold underline">¡Sé el primero!</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {cuidadores.map((p) => (
                <PostCuidadoCard key={p.id} post={p} mio={p.user_id === user?.id} onResolver={() => handleResolver(p.id, 'cuidador_disponible')} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

/* ── Card de post de cuidado ── */
function PostCuidadoCard({ post: p, mio, onResolver }: { post: Post; mio: boolean; onResolver: () => void }) {
  const esCuidador = p.categoria === 'cuidador_disponible';
  const foto = p.images?.[0];

  return (
    <div className="card flex gap-4 p-4">
      {/* Foto o avatar */}
      <div className="shrink-0">
        {foto ? (
          <img src={foto} alt={p.nombre ?? ''} className="h-16 w-16 rounded-2xl object-cover" />
        ) : (
          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${esCuidador ? 'bg-teal-100' : 'bg-brand-cream'}`}>
            {esCuidador
              ? <User className="h-7 w-7 text-teal-600" />
              : <HandHeart className="h-7 w-7 text-teal-600" />}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-base font-extrabold text-ink truncate">
            {p.nombre ?? (esCuidador ? 'Cuidador disponible' : 'Busca cuidador')}
          </p>
          {mio && (
            <button
              type="button"
              onClick={onResolver}
              className="shrink-0 rounded-xl bg-bad/10 px-2.5 py-1 text-xs font-bold text-bad transition hover:bg-bad/20"
            >
              Dar de baja
            </button>
          )}
        </div>

        {p.descripcion && (
          <p className="mt-0.5 text-sm text-ink-muted line-clamp-2">{p.descripcion}</p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
          {p.zona && (
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.zona}</span>
          )}
          {p.horario && (
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {p.horario}</span>
          )}
        </div>

        {/* Ver perfil (solo cuidadores) */}
        {esCuidador && (
          <Link
            href={`/cuidado/cuidador/${p.id}`}
            className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:underline"
          >
            <Star className="h-3 w-3" /> Ver perfil y calificaciones
          </Link>
        )}
      </div>

      {p.contacto && (
        <a
          href={`https://wa.me/${p.contacto.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 self-center rounded-2xl bg-teal-600 p-2.5 text-white transition hover:bg-teal-700"
          title="Contactar por WhatsApp"
        >
          <Phone className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
