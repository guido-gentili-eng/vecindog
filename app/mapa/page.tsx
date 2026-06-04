'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { listarPosts, type Post } from '@/lib/posts';
import { listarComerciosConUbicacion, type Ad } from '@/lib/ads';
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
  const [posts,     setPosts]     = useState<Post[]>([]);
  const [comercios, setComercio]  = useState<Ad[]>([]);
  const [cargando,  setCargando]  = useState(true);
  const [center,    setCenter]    = useState<LatLng>({ lat: -34.6, lng: -58.44 });

  useEffect(() => {
    listarPosts().then(setPosts).finally(() => setCargando(false));
    listarComerciosConUbicacion().then(setComercio);

    // 1. Intentar geolocalización del navegador (más precisa)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        // 2. Si falla o el usuario rechaza → geocodificar la ciudad guardada
        () => { if (ciudad) geocodificarCiudad(ciudad); }
      );
    } else if (ciudad) {
      // Sin soporte de geolocalización → usar ciudad guardada
      geocodificarCiudad(ciudad);
    }
  }, [ciudad]);   // eslint-disable-line react-hooks/exhaustive-deps

  async function geocodificarCiudad(nombre: string) {
    try {
      const q   = encodeURIComponent(`${nombre}, Argentina`);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&countrycodes=ar`,
        { headers: { 'User-Agent': 'Vecindog/1.0 (noreply@mivecindog.com.ar)' } }
      );
      const data = await res.json();
      if (data?.[0]) {
        setCenter({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
      }
    } catch { /* sin coords, queda el default */ }
  }

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
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-found" /> Visto
          </span>
          <span className="flex items-center gap-1.5 text-adopt">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-adopt" /> Adopción
          </span>
          <span className="flex items-center gap-1.5" style={{ color: '#7c3aed' }}>
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: '#7c3aed' }} /> En la calle
          </span>
          {comercios.length > 0 && (
            <span className="flex items-center gap-1.5" style={{ color: '#0d9488' }}>
              <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: '#0d9488' }} /> Red Vecindog
            </span>
          )}
        </div>
      </div>

      <MapView
        center={center}
        posts={posts.filter(p => p.categoria !== 'transito' || p.situacion_transito === 'calle')}
        comercios={comercios}
        userLoc={null}
        cargando={cargando}
        ciudad={ciudad ?? undefined}
      />
    </div>
  );
}
