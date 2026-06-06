'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { CheckCircle2, Navigation } from 'lucide-react';

interface Props {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
  onConfirm: () => void;
}

const PIN_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
  <filter id="s"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.35"/></filter>
  <ellipse cx="18" cy="42" rx="6" ry="2.5" fill="rgba(0,0,0,0.18)"/>
  <path d="M18 2C10.27 2 4 8.27 4 16c0 10.5 14 26 14 26S32 26.5 32 16C32 8.27 25.73 2 18 2z"
    fill="#EE5A3B" filter="url(#s)"/>
  <circle cx="18" cy="16" r="6" fill="white"/>
</svg>`;

const PIN_ICON = L.divIcon({
  html: PIN_SVG,
  className: '',
  iconSize:   [36, 44],
  iconAnchor: [18, 44],
});

export default function MapPinPicker({ lat, lng, onChange, onConfirm }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<L.Map | null>(null);
  const markerRef    = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: 16,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(map);

    const marker = L.marker([lat, lng], { icon: PIN_ICON, draggable: true }).addTo(map);

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      onChange(pos.lat, pos.lng);
    });

    // Click en el mapa mueve el pin
    map.on('click', (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      onChange(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current    = map;
    markerRef.current = marker;

    return () => { map.remove(); mapRef.current = null; markerRef.current = null; };
  }, []);

  // Actualizar pin si cambian las coords desde afuera
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      mapRef.current?.setView([lat, lng], mapRef.current.getZoom(), { animate: true });
    }
  }, [lat, lng]);

  return (
    <div className="rounded-2xl overflow-hidden ring-1 ring-black/10 shadow-soft">
      <div className="bg-brand-primary/5 px-4 py-2.5 flex items-center gap-2 border-b border-black/5">
        <Navigation className="h-4 w-4 text-brand-primary shrink-0" />
        <p className="text-xs font-bold text-ink">
          Mové el pin al lugar exacto — tocá el mapa o arrastrá el marcador
        </p>
      </div>
      <div ref={containerRef} style={{ height: '260px', width: '100%' }} />
      <div className="px-4 py-3 bg-white border-t border-black/5">
        <button
          type="button"
          onClick={onConfirm}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-primary py-3 text-sm font-bold text-white transition hover:opacity-90 active:scale-[0.99]"
        >
          <CheckCircle2 className="h-4 w-4" /> Confirmar ubicación
        </button>
      </div>
    </div>
  );
}
