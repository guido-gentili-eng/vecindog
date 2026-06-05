'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ArrowRight, ImageIcon } from 'lucide-react';
import { listarPostsResueltos, type Post } from '@/lib/posts';

const EMOJI_CATEGORIA: Record<string, string> = {
  perdido:    '🏠 Volvió a casa',
  encontrado: '🏠 Volvió a casa',
  adopcion:   '❤️ Fue adoptado',
};

export default function VolvieronACasa() {
  const [posts,    setPosts]    = useState<Post[]>([]);
  const [total,    setTotal]    = useState(0);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    listarPostsResueltos(4)
      .then((data) => {
        setPosts(data);
        setTotal(data.length); // placeholder; en el futuro podemos hacer count(*)
      })
      .finally(() => setCargando(false));
  }, []);

  // No renderizar si no hay historias todavía
  if (!cargando && posts.length === 0) return null;

  return (
    <section aria-label="Volvieron a casa">
      {/* Encabezado */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fde8e8] px-3 py-1 text-xs font-bold text-[#c0392b]">
            <Heart className="h-3.5 w-3.5 fill-current" /> Historias reales
          </span>
          <h2 className="mt-2 font-display text-2xl font-black tracking-tight text-ink md:text-3xl">
            Volvieron a casa 🏠
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Gracias a la comunidad, estos perros reencontraron a su familia.
          </p>
        </div>
        <Link
          href="/reencontrados"
          className="inline-flex items-center gap-1 text-sm font-bold text-brand-primary hover:underline"
        >
          Ver todos <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Lista vertical */}
      {cargando ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-2xl bg-black/5" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <HistoriaCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Contador motivacional */}
      {!cargando && total > 0 && (
        <p className="mt-5 text-center text-sm text-ink-muted">
          🐾{' '}
          <span className="font-extrabold text-ink">{total} perro{total !== 1 ? 's' : ''}</span>
          {' '}reencontrado{total !== 1 ? 's' : ''} con la ayuda de Vecindog.{' '}
          <Link href="/publicaciones" className="font-bold text-brand-primary hover:underline">
            ¿Podés ayudar a otro?
          </Link>
        </p>
      )}
    </section>
  );
}

function HistoriaCard({ post }: { post: Post }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2 shadow-soft ring-1 ring-black/5">
      {/* Foto miniatura */}
      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-brand-cream">
        {post.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.images[0]}
            alt={post.nombre ?? 'Perro reencontrado'}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageIcon className="h-5 w-5 text-brand-primary/20" />
          </div>
        )}
      </div>

      {/* Nombre y badge */}
      <div className="flex-1 min-w-0">
        <p className="font-display text-sm font-extrabold text-ink truncate">
          {post.nombre ?? 'Sin nombre'}
        </p>
        <p className="text-xs text-ink-muted">
          {EMOJI_CATEGORIA[post.categoria] ?? '🏠 Reencontrado'}
        </p>
      </div>

      <Heart className="h-4 w-4 shrink-0 fill-good text-good" />
    </div>
  );
}
