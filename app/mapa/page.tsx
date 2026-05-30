'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { listarPosts, type Post } from '@/lib/posts';
import type { Vet } from '@/lib/vetRatings';
import VetPanel from '@/components/VetPanel';
import { useAuth } from '@/contexts/AuthContext';

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-[#f0ebe3]">
      <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
    </div>
  ),
});

interface LatLng { lat: number; lng: number }

export default function MapaPage() {
  const { ciudad } = useAuth();
  const [posts,       setPosts]       = useState<Post[]>([]);
  const [cargando,    setCargando]    = useState(true);
  const [center,      setCenter]      = useState<LatLng>({ lat: -34.6, lng: -58.44 });
  const [vetSeleccionada, setVetSeleccionada] = useState<Vet | null>(null);

  useEffect(() => {
    listarPosts().then(setPosts).finally(() => setCargando(false));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

  return (
    <div className="relative h-full w-full">
      {cargando && (
        <div className="pointer-events-none absolute left-1/2 top-4 z-[1000] -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 shadow text-xs font-bold text-gray-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-primary" />
            Cargando avisos…
          </div>
        </div>
      )}

      {/* Leyenda */}
      <div className="pointer-events-none absolute bottom-6 left-4 z-[1000]">
        <div className="flex flex-col gap-1.5 rounded-2xl bg-white/90 px-3 py-2.5 shadow text-[11px] font-bold backdrop-blur-sm">
          <span className="flex items-center gap-1.5 text-lost">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-lost" /> Perdido
          </span>
          <span className="flex items-center gap-1.5 text-found">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-found" /> Encontrado
          </span>
          <span className="flex items-center gap-1.5 text-adopt">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-adopt" /> Adopción
          </span>
          <span className="flex items-center gap-1.5" style={{ color: '#0d9488' }}>
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: '#0d9488' }} /> Veterinaria
          </span>
        </div>
      </div>

      {/* Mapa */}
      <MapView
        center={center}
        posts={posts}
        userLoc={null}
        cargando={cargando}
        ciudad={ciudad ?? undefined}
        onVetClick={setVetSeleccionada}
      />

      {/* Panel de veterinaria */}
      <VetPanel
        vet={vetSeleccionada}
        onClose={() => setVetSeleccionada(null)}
      />
    </div>
  );
}
