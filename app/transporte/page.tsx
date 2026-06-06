'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Phone, MapPin, Calendar, ChevronRight, User, Star, ArrowLeft } from 'lucide-react';
import { listarPostsCuidado, resolverPost, type Post } from '@/lib/posts';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function TransportePage() {
  const router   = useRouter();
  const { user } = useAuth();
  const [transportadores, setTransportadores] = useState<Post[]>([]);
  const [promedios, setPromedios] = useState<Record<string, number>>({});
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      const posts = await listarPostsCuidado('transportador_disponible');
      if (!posts.length) { setCargando(false); return; }

      // Traer todos los ratings de estos transportadores en una sola query
      const { data: ratings } = await supabase
        .from('transportador_ratings')
        .select('transportador_post_id, estrellas')
        .in('transportador_post_id', posts.map((p) => p.id));

      // Calcular promedio por post
      const mapa: Record<string, { suma: number; total: number }> = {};
      for (const r of ratings ?? []) {
        if (!mapa[r.transportador_post_id]) mapa[r.transportador_post_id] = { suma: 0, total: 0 };
        mapa[r.transportador_post_id].suma  += r.estrellas;
        mapa[r.transportador_post_id].total += 1;
      }
      const promediosCalc: Record<string, number> = {};
      for (const [id, { suma, total }] of Object.entries(mapa)) {
        promediosCalc[id] = suma / total;
      }
      setPromedios(promediosCalc);

      // Ordenar: primero los que tienen calificación (mayor primero), luego los sin calificación
      posts.sort((a, b) => (promediosCalc[b.id] ?? -1) - (promediosCalc[a.id] ?? -1));
      setTransportadores(posts);
      setCargando(false);
    }
    cargar();
  }, []);

  async function handleResolver(id: string) {
    await resolverPost(id);
    setTransportadores((p) => p.filter((x) => x.id !== id));
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">

      <button type="button" onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-1 text-sm font-bold text-brand-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> Volver
      </button>

      {/* Hero */}
      <div className="mb-10 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
          <Car className="h-3.5 w-3.5" /> Transporte de perros
        </span>
        <h1 className="mt-3 font-display text-4xl font-black text-ink">Transporte de perros</h1>
        <p className="mt-3 text-ink-muted">
          Encontrá un vecino de confianza para transportar a tu perro, o anotate para ayudar a otros.
        </p>
      </div>

      {/* CTA registrarse */}
      <Link
        href="/transporte/quiero-transportar"
        className="group mb-8 flex overflow-hidden rounded-3xl bg-blue-700 text-white shadow-soft ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-card"
      >
        <div className="flex flex-1 items-start gap-4 p-6">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/20">
            <Car className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-display text-xl font-extrabold leading-tight">Quiero transportar perros</h2>
            <p className="mt-1 text-sm text-white/80">
              Anotate como transportador disponible para ayudar a vecinos que lo necesiten.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold opacity-80 transition group-hover:gap-2 group-hover:opacity-100">
              Registrarme <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>

      {/* Listado */}
      <h3 className="mb-3 font-display text-base font-black text-ink flex items-center gap-2">
        <Car className="h-4 w-4 text-blue-700" /> Transportadores disponibles
        {transportadores.length > 0 && (
          <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
            {transportadores.length}
          </span>
        )}
      </h3>

      {cargando ? (
        <div className="space-y-3">
          {[1,2,3].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-brand-cream" />)}
        </div>
      ) : transportadores.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50 px-5 py-6 text-center text-sm text-blue-600">
          Todavía no hay transportadores.{' '}
          <Link href="/transporte/quiero-transportar" className="font-bold underline">¡Sé el primero!</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {transportadores.map((p) => (
            <TransportadorCard key={p.id} post={p} promedio={promedios[p.id]} mio={p.user_id === user?.id} onResolver={() => handleResolver(p.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function TransportadorCard({ post: p, promedio, mio, onResolver }: { post: Post; promedio?: number; mio: boolean; onResolver: () => void }) {
  const foto = p.images?.[0];

  return (
    <div className="card flex gap-4 p-4">
      <div className="shrink-0">
        {foto ? (
          <img src={foto} alt={p.nombre ?? ''} className="h-16 w-16 rounded-2xl object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
            <User className="h-7 w-7 text-blue-600" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-base font-extrabold text-ink truncate">
            {p.nombre ?? 'Transportador disponible'}
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

        {promedio != null && (
          <div className="mt-0.5 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < Math.round(promedio) ? 'fill-amber-400 text-amber-400' : 'text-black/10'}`} />
            ))}
            <span className="text-xs font-bold text-ink ml-0.5">{promedio.toFixed(1)}</span>
          </div>
        )}

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

        <Link
          href={`/transporte/transportador/${p.id}`}
          className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
        >
          <Star className="h-3 w-3" /> Ver perfil y calificaciones
        </Link>
      </div>

      {p.contacto && (
        <a
          href={`https://wa.me/${p.contacto.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 self-center rounded-2xl bg-blue-600 p-2.5 text-white transition hover:bg-blue-700"
          title="Contactar por WhatsApp"
        >
          <Phone className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
