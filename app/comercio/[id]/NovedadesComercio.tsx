'use client';

import { useEffect, useState } from 'react';
import { Megaphone } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

interface Novedad {
  id: string;
  titulo: string;
  texto: string | null;
  imagen_url: string | null;
  created_at: string;
}

function fmtFecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function NovedadesComercio({ adId }: { adId: string }) {
  const { t } = useLanguage();
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`/api/novedades?ad_id=${adId}`)
      .then((r) => r.json())
      .then((d) => setNovedades(d.novedades ?? []))
      .finally(() => setCargando(false));
  }, [adId]);

  if (cargando || novedades.length === 0) return null;

  return (
    <div className="mb-5 rounded-[20px] bg-white border border-black/5 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-black/5">
        <Megaphone className="h-4 w-4 text-brand-primary" />
        <h2 className="font-display text-sm font-extrabold text-ink uppercase tracking-wide">{t.revNovedades}</h2>
      </div>
      <div className="divide-y divide-black/5">
        {novedades.map((n) => (
          <div key={n.id} className="px-5 py-4">
            {n.imagen_url && (
              <div className="relative mb-3 w-full overflow-hidden rounded-2xl" style={{ maxHeight: '192px', height: '192px' }}>
                <Image src={n.imagen_url} alt={n.titulo} fill className="object-cover" sizes="(max-width:768px) 100vw, 600px" />
              </div>
            )}
            <p className="font-bold text-ink">{n.titulo}</p>
            {n.texto && <p className="mt-1 text-sm text-ink-muted leading-relaxed">{n.texto}</p>}
            <p className="mt-2 text-xs text-ink-muted/60">{fmtFecha(n.created_at)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
