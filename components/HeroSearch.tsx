'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';

export default function HeroSearch() {
  const router = useRouter();
  const [zona, setZona] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = zona.trim();
    router.push(query ? `/publicaciones?zona=${encodeURIComponent(query)}` : '/publicaciones');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 flex items-stretch overflow-hidden rounded-2xl bg-white p-1.5 shadow-md ring-1 ring-black/5"
    >
      <label className="flex flex-1 items-center gap-2 px-3">
        <Search className="h-5 w-5 text-ink-muted" />
        <input
          type="text"
          value={zona}
          onChange={(e) => setZona(e.target.value)}
          placeholder="¿En qué barrio buscás? Ej: Centro"
          className="w-full bg-transparent py-3 text-base text-ink outline-none placeholder:text-ink-muted"
          aria-label="Buscar por barrio o zona"
        />
      </label>
      <button
        type="submit"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-brand-primary px-4 py-3 text-sm font-bold text-white transition hover:opacity-95 sm:px-5 sm:text-base"
      >
        Buscar <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
