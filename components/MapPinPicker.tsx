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
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 59.57 89.72" width="32" height="48" style="filter:drop-shadow(0 2px 5px rgba(0,0,0,0.40))">
  <path fill="#d31323" d="M29.79,0C13.34,0,0,13.34,0,29.79,0,53.16,21.13,65.1,29.79,89.72c8.66-24.62,29.79-36.56,29.79-59.93C59.57,13.34,46.24,0,29.79,0ZM35.22,51.3c-.29.07-.58.14-.87.2-.57,3.35-.69,7.15-.66,7.26,0,0,0,0,0,0-.07.04-3.33-2.52-5.14-5.57-.14-.23-.26-.45-.38-.67-8.91-.35-16.29-6.5-18.57-15.58-2.77-11.04,3.93-22.24,14.97-25.01s22.24,3.93,25.01,14.97c2.77,11.04-3.32,21.63-14.36,24.4Z"/>
  <g fill="#413f3f">
    <path d="M23.05,33.88c-1.24.15-2.39-.95-2.57-2.46-.24-1.96.54-3.89,1.77-4.04,1.24-.15,2.48,1.67,2.7,3.49.19,1.51-.66,2.86-1.9,3.01Z"/>
    <path d="M32.78,40.28c-1.76-.04-2.43-.82-3.56-.84-1.13-.02-1.83.73-3.59.7-2.3-.05-3.96-2.94-1.83-4.79,2.65-2.3,3.45-5.24,5.61-5.19,2.17.04,2.84,3.02,5.39,5.42,2.05,1.94.28,4.76-2.02,4.71Z"/>
    <path d="M30.05,26.32c.19-1.82,1.41-3.67,2.64-3.53,1.24.13,2.05,2.05,1.84,4.01-.16,1.51-1.3,2.63-2.53,2.5-1.24-.13-2.11-1.47-1.95-2.98Z"/>
    <path d="M24.42,26.59c-.13-1.97.76-3.85,2-3.93,1.24-.08,2.38,1.81,2.49,3.64.1,1.52-.83,2.82-2.07,2.9-1.24.08-2.33-1.09-2.43-2.61Z"/>
    <path d="M35.61,34.14c-1.23-.2-2.02-1.59-1.77-3.09.3-1.81,1.62-3.58,2.84-3.37,1.23.2,1.93,2.16,1.6,4.11-.25,1.5-1.45,2.56-2.67,2.35Z"/>
  </g>
  <path fill="#ba0022" d="M28.55,53.2c-.14-.23-.26-.45-.38-.67-8.91-.35-16.29-6.5-18.57-15.58-2.77-11.04,3.93-22.24,14.97-25.01,1.75-.44,3.49-.61,5.21-.6V0C13.34,0,0,13.34,0,29.79c0,23.37,21.13,35.31,29.79,59.93v-34.77c-.44-.56-.87-1.14-1.24-1.75Z"/>
</svg>`;

const PIN_ICON = L.divIcon({
  html: PIN_SVG,
  className: '',
  iconSize:   [32, 48],
  iconAnchor: [16, 48],
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
