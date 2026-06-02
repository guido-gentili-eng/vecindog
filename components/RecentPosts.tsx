import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ANIMALES } from '@/lib/mockData';
import AnimalCard from '@/components/AnimalCard';

export default function RecentPosts() {
  const recientes = [...ANIMALES]
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, 6);

  const conteo = {
    activos:     ANIMALES.length,
    perdidos:    ANIMALES.filter((a) => a.categoria === 'perdido').length,
    encontrados: ANIMALES.filter((a) => a.categoria === 'encontrado').length,
    adopcion:    ANIMALES.filter((a) => a.categoria === 'adopcion').length
  };

  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-3xl font-black tracking-tight text-ink md:text-4xl">
            Avisos recientes
          </h2>
          <p className="mt-1 text-ink-muted">Lo último que publicaron tus vecinos.</p>
        </div>
        <Link
          href="/publicaciones"
          className="hidden items-center gap-1 text-sm font-bold text-brand-primary hover:underline sm:inline-flex"
        >
          Ver todos <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Chips de filtro rápido */}
      <div className="hide-scrollbar mb-5 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        <Chip href="/publicaciones">Todos ({conteo.activos})</Chip>
        <Chip href="/publicaciones?cat=perdido"    tone="bg-lost/10 text-lost">Perdidos ({conteo.perdidos})</Chip>
        <Chip href="/publicaciones?cat=encontrado" tone="bg-found/10 text-found">Vistos ({conteo.encontrados})</Chip>
        <Chip href="/publicaciones?cat=adopcion"   tone="bg-adopt/15 text-[#8a6014]">En adopción ({conteo.adopcion})</Chip>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {recientes.map((a) => (
          <AnimalCard key={a.id} animal={a} />
        ))}
      </div>

      <div className="mt-6 text-center sm:hidden">
        <Link href="/publicaciones" className="btn-primary inline-flex">
          Ver todos los avisos <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function Chip({
  href, children, tone = 'bg-white text-ink'
}: {
  href: string;
  children: React.ReactNode;
  tone?: string;
}) {
  return (
    <Link
      href={href}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-sm ${tone}`}
    >
      {children}
    </Link>
  );
}
