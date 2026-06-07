'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Heart, MapPin, Calendar, ImageIcon, ArrowLeft, Loader2, Dog,
} from 'lucide-react';
import { listarPostsResueltos, type Post } from '@/lib/posts';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ReencontradosPage() {
  const { t } = useLanguage();
  const [posts,    setPosts]    = useState<Post[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    listarPostsResueltos(100)
      .then(setPosts)
      .finally(() => setCargando(false));
  }, []);

  const etiquetaResuelto: Record<string, string> = {
    perdido:    t.reLabelHome,
    encontrado: t.reLabelHome,
    adopcion:   t.reLabelAdopted,
  };

  return (
    <div className="py-8 md:py-10">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm font-bold text-brand-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> {t.reBack}
      </Link>

      {/* Header */}
      <header className="mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fde8e8] px-3 py-1 text-xs font-bold text-[#c0392b]">
          <Heart className="h-3.5 w-3.5 fill-current" /> {t.reChip}
        </span>
        <h1 className="mt-3 font-display text-4xl font-black tracking-tight text-ink">
          {t.reTitle}
        </h1>
        <p className="mt-2 max-w-xl text-ink-muted">
          {t.reSub}
        </p>

        {/* Contador */}
        {!cargando && posts.length > 0 && (
          <div className="mt-5 inline-flex items-center gap-3 rounded-2xl bg-good/10 px-5 py-3">
            <Heart className="h-5 w-5 fill-current text-good" />
            <div>
              <p className="font-display text-2xl font-black text-good">{posts.length}</p>
              <p className="text-xs font-bold text-good/80">
                {posts.length === 1 ? t.reDogSingular : t.reDogPlural}
              </p>
            </div>
          </div>
        )}
      </header>

      {/* Contenido */}
      {cargando ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-brand-primary" />
        </div>
      ) : posts.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-cream text-brand-primary">
            <Dog className="h-7 w-7" />
          </div>
          <h2 className="mt-4 font-display text-xl font-extrabold text-ink">
            {t.reEmpty}
          </h2>
          <p className="mt-2 text-ink-muted">
            {t.reEmptySub}
          </p>
          <Link href="/publicaciones" className="btn-primary mt-5 inline-flex">
            {t.reActiveListings}
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <HistoriaCardGrande key={post.id} post={post} etiquetas={etiquetaResuelto} labelDefault={t.reLabelDefault} />
          ))}
        </div>
      )}

      {/* CTA al pie */}
      {!cargando && posts.length > 0 && (
        <div className="mt-12 rounded-2xl bg-brand-primary/5 p-8 text-center">
          <p className="font-display text-xl font-extrabold text-ink">
            {t.reCtaTitle}
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            {t.reCtaSub}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link href="/publicar?cat=perdido" className="btn-primary">
              {t.reLostBtn}
            </Link>
            <Link href="/publicar?cat=encontrado" className="btn-secondary">
              {t.reFoundBtn}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function HistoriaCardGrande({ post, etiquetas, labelDefault }: { post: Post; etiquetas: Record<string, string>; labelDefault: string }) {
  return (
    <Link
      href={`/publicaciones/${post.id}`}
      className="group overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-card"
    >
      {/* Foto */}
      <div className="relative h-48 w-full overflow-hidden bg-brand-cream">
        {post.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.images[0]}
            alt={post.nombre ?? 'Perro reencontrado'}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-primary/20">
            <ImageIcon className="h-12 w-12" />
          </div>
        )}

        {/* Badge */}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-good px-2.5 py-1 text-xs font-extrabold text-white shadow">
          <Heart className="h-3.5 w-3.5 fill-current" />
          {etiquetas[post.categoria] ?? labelDefault}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <h2 className="font-display text-xl font-extrabold text-ink">
          {post.nombre ?? 'Sin nombre'}
        </h2>
        {post.raza && (
          <p className="text-sm text-ink-muted">{post.raza}</p>
        )}
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-ink-muted">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-brand-primary" />
            <span className="font-semibold text-ink">{post.zona}</span>
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> {post.fecha}
          </span>
        </div>
        {post.descripcion && (
          <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{post.descripcion}</p>
        )}
      </div>
    </Link>
  );
}
