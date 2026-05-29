'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { Post } from '@/lib/posts';
import type { Vet } from '@/lib/vetRatings';

/* ──────────────────── Tipos ──────────────────── */

interface LatLng { lat: number; lng: number }

/* ──────────────────── Colores de avisos ──────────────────── */

const CAT_COLOR: Record<string, string> = {
  perdido:    '#ef4444',
  encontrado: '#22c55e',
  adopcion:   '#f97316',
};
const CAT_LABEL: Record<string, string> = {
  perdido:    'Perdido',
  encontrado: 'Encontrado',
  adopcion:   'Adopción',
};

/* ──────────────────── Íconos ──────────────────── */

/** Pin de colores para avisos (teardrop con letra) */
function createPinIcon(categoria: string) {
  const color = CAT_COLOR[categoria] ?? '#6b7280';
  const letra = categoria === 'perdido' ? 'P' : categoria === 'encontrado' ? 'E' : 'A';
  const html = `
    <div style="position:relative;width:30px;height:40px;cursor:pointer;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.35))">
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 30 40" style="position:absolute;top:0;left:0">
        <path d="M15 0C6.7 0 0 6.7 0 15C0 26.3 15 40 15 40S30 26.3 30 15C30 6.7 23.3 0 15 0Z" fill="${color}"/>
        <circle cx="15" cy="15" r="9.5" fill="white" opacity="0.95"/>
      </svg>
      <div style="position:absolute;top:8px;left:0;width:30px;text-align:center;font-size:11px;font-weight:900;color:${color};font-family:Arial,sans-serif;line-height:1">${letra}</div>
    </div>`;
  return L.divIcon({ className: '', html, iconSize: [30, 40], iconAnchor: [15, 40], popupAnchor: [0, -42] });
}

/** Ícono de veterinaria: cuadrado teal con cruz blanca */
const vetIcon = L.divIcon({
  className: '',
  html: `
    <div style="position:relative;width:34px;height:42px;cursor:pointer;filter:drop-shadow(0 2px 5px rgba(0,0,0,0.40))">
      <svg xmlns="http://www.w3.org/2000/svg" width="34" height="42" viewBox="0 0 34 42">
        <!-- cuerpo del pin cuadrado -->
        <rect x="1" y="1" width="32" height="32" rx="8" fill="#0d9488"/>
        <!-- cola apuntando abajo -->
        <path d="M10 33 L17 42 L24 33Z" fill="#0d9488"/>
        <!-- cruz blanca -->
        <rect x="14" y="7"  width="6" height="20" rx="2" fill="white"/>
        <rect x="7"  y="14" width="20" height="6"  rx="2" fill="white"/>
      </svg>
    </div>`,
  iconSize: [34, 42],
  iconAnchor: [17, 42],
  popupAnchor: [0, -44],
});

/** Punto azul para la posición del usuario */
const userIcon = L.divIcon({
  className: '',
  html: `<div style="width:16px;height:16px;background:#3b82f6;border-radius:50%;border:3px solid white;box-shadow:0 0 0 3px rgba(59,130,246,0.35)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

/* ──────────────────── Overpass (veterinarias) ──────────────────── */

// Cache en memoria para no re-pedir la misma zona
const vetCache = new Map<string, Vet[]>();

function areaKey(lat: number, lng: number) {
  return `${lat.toFixed(2)},${lng.toFixed(2)}`;
}

async function fetchVets(lat: number, lng: number, radiusM = 10000): Promise<Vet[]> {
  const key = areaKey(lat, lng);
  if (vetCache.has(key)) return vetCache.get(key)!;

  const query = `[out:json][timeout:25];(node["amenity"="veterinary"](around:${radiusM},${lat},${lng});way["amenity"="veterinary"](around:${radiusM},${lat},${lng});relation["amenity"="veterinary"](around:${radiusM},${lat},${lng}););out center;`;

  try {
    const res = await fetch(
      `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
    );
    const data = await res.json();

    const vets: Vet[] = (data.elements ?? [])
      .map((el: Record<string, unknown>) => {
        const tags = (el.tags ?? {}) as Record<string, string>;
        const center = el.center as { lat: number; lon: number } | undefined;
        const elLat = (el.lat as number | undefined) ?? center?.lat;
        const elLon = (el.lon as number | undefined) ?? center?.lon;
        if (elLat == null || elLon == null) return null;

        const calle  = tags['addr:street']      ?? '';
        const numero = tags['addr:housenumber'] ?? '';
        const dir    = [calle, numero].filter(Boolean).join(' ');

        return {
          id:       el.id as number,
          lat:      elLat,
          lng:      elLon,
          nombre:   tags.name ?? 'Veterinaria',
          telefono: tags.phone ?? tags['contact:phone'],
          direccion: dir || undefined,
          website:  tags.website ?? tags['contact:website'],
          horario:  tags.opening_hours,
        } satisfies Vet;
      })
      .filter(Boolean) as Vet[];

    vetCache.set(key, vets);
    return vets;
  } catch {
    return [];
  }
}

/* ──────────────────── Nominatim geocoding ──────────────────── */

const SESSION_KEY = 'geo_cache_v1';
function loadGeoCache(): Record<string, LatLng> {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? '{}'); }
  catch { return {}; }
}
function saveGeoCache(c: Record<string, LatLng>) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(c)); } catch {}
}

async function geocodificarZona(zona: string, cache: Record<string, LatLng>): Promise<LatLng | null> {
  const key = zona.toLowerCase().trim();
  if (cache[key]) return cache[key];
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(zona + ', Argentina')}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'es', 'User-Agent': 'Vecindog/1.0' } }
    );
    const data = await res.json();
    if (data?.[0]) {
      const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      cache[key] = coords;
      saveGeoCache(cache);
      return coords;
    }
  } catch {}
  return null;
}

function delay(ms: number) { return new Promise<void>((r) => setTimeout(r, ms)); }
function jitter(v: number, a = 0.0008) { return v + (Math.random() - 0.5) * a; }

/* ──────────────────── Props ──────────────────── */

interface MapViewProps {
  center:       LatLng;
  posts:        Post[];
  userLoc:      LatLng | null;
  cargando:     boolean;
  onVetClick?:  (vet: Vet) => void;
}

/* ──────────────────── Componente ──────────────────── */

export default function MapView({ center, posts, userLoc, cargando, onVetClick }: MapViewProps) {
  const containerRef   = useRef<HTMLDivElement>(null);
  const mapRef         = useRef<L.Map | null>(null);
  const userMarkerRef  = useRef<L.Marker | null>(null);
  const vetIdsRef      = useRef<Set<number>>(new Set());
  const lastVetCenter  = useRef<LatLng | null>(null);
  const [, setGeocodificando] = useState(false);
  const [, setColocados]      = useState(0);

  /* ── 1. Inicializar mapa (una sola vez) ── */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [center.lat, center.lng],
      zoom:   14,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── 2. Centrar en nuevo punto ── */
  useEffect(() => {
    mapRef.current?.flyTo([center.lat, center.lng], 14, { duration: 1.2 });
  }, [center]);

  /* ── 3. Marcador de usuario ── */
  useEffect(() => {
    if (!mapRef.current) return;
    userMarkerRef.current?.remove();
    if (userLoc) {
      userMarkerRef.current = L.marker([userLoc.lat, userLoc.lng], { icon: userIcon })
        .bindPopup('<div style="text-align:center;font-size:12px;font-weight:bold;color:#3b82f6">Tu ubicación</div>')
        .addTo(mapRef.current);
    }
  }, [userLoc]);

  /* ── 4. Marcadores de avisos ── */
  useEffect(() => {
    if (cargando || !mapRef.current || posts.length === 0) return;
    const map = mapRef.current;
    const cache = loadGeoCache();
    let cancelled = false;

    async function colocarMarcadores() {
      setGeocodificando(true);
      let count = 0;
      const conCoords = posts.filter((p) => p.lat != null && p.lng != null);
      const sinCoords = posts.filter((p) => p.lat == null || p.lng == null);

      for (const p of conCoords) {
        if (cancelled) return;
        agregarMarcadorPost(map, p, jitter(p.lat!), jitter(p.lng!));
        setColocados(++count);
      }

      const zonas = [...new Set(sinCoords.map((p) => p.zona.toLowerCase().trim()))];
      for (const zona of zonas) {
        if (cancelled) return;
        const coords = await geocodificarZona(zona, cache);
        if (coords) {
          sinCoords
            .filter((p) => p.zona.toLowerCase().trim() === zona)
            .forEach((p) => { agregarMarcadorPost(map, p, jitter(coords.lat), jitter(coords.lng)); setColocados(++count); });
        }
        await delay(1300);
      }
      if (!cancelled) setGeocodificando(false);
    }

    colocarMarcadores();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts, cargando]);

  /* ── 5. Veterinarias (Overpass API) ── */
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    async function cargarVets(lat: number, lng: number) {
      lastVetCenter.current = { lat, lng };
      const vets = await fetchVets(lat, lng);
      vets.forEach((vet) => {
        if (vetIdsRef.current.has(vet.id)) return;
        vetIdsRef.current.add(vet.id);
        agregarMarcadorVet(map, vet, onVetClick);
      });
    }

    cargarVets(center.lat, center.lng);

    // Re-cargar cuando el usuario mueve > 5 km
    function onMoveEnd() {
      const c = map.getCenter();
      if (!lastVetCenter.current) { cargarVets(c.lat, c.lng); return; }
      const dist = map.distance(
        [c.lat, c.lng],
        [lastVetCenter.current.lat, lastVetCenter.current.lng]
      );
      if (dist > 5000) cargarVets(c.lat, c.lng);
    }

    map.on('moveend', onMoveEnd);
    return () => { map.off('moveend', onMoveEnd); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}

/* ──────────────────── Helpers de marcadores ──────────────────── */

function agregarMarcadorPost(map: L.Map, post: Post, lat: number, lng: number) {
  const color = CAT_COLOR[post.categoria] ?? '#6b7280';
  const label = CAT_LABEL[post.categoria] ?? post.categoria;
  const imgHtml = post.images?.[0]
    ? `<img src="${post.images[0]}" style="width:100%;height:96px;object-fit:cover;border-radius:8px;margin-bottom:6px">`
    : '';
  const html = `
    <div style="width:190px;padding:4px 0">
      ${imgHtml}
      <span style="display:inline-block;background:${color};color:white;border-radius:20px;padding:2px 8px;font-size:10px;font-weight:800;margin-bottom:4px">${label}</span>
      <div style="font-weight:700;font-size:13px;color:#1a1a1a;margin-bottom:2px">${post.nombre ?? 'Sin nombre'}</div>
      <div style="font-size:11px;color:#6b6258;margin-bottom:6px">${post.zona} · ${post.fecha}</div>
      <a href="/publicaciones/${post.id}" style="display:block;background:${color};color:white;text-align:center;border-radius:8px;padding:6px;font-size:12px;font-weight:700;text-decoration:none">Ver aviso →</a>
    </div>`;
  L.marker([lat, lng], { icon: createPinIcon(post.categoria) })
    .bindPopup(html, { maxWidth: 210 })
    .addTo(map);
}

function agregarMarcadorVet(map: L.Map, vet: Vet, onVetClick?: (v: Vet) => void) {
  const dirRow = vet.direccion
    ? `<div style="display:flex;align-items:center;gap:5px;margin-top:4px;font-size:11px;color:#4b5563">
         <span>📍</span><span>${vet.direccion}</span>
       </div>`
    : '';

  const horRow = vet.horario
    ? `<div style="display:flex;align-items:flex-start;gap:5px;margin-top:3px;font-size:11px;color:#4b5563">
         <span>🕐</span><span>${vet.horario.replace(/;/g, '<br>')}</span>
       </div>`
    : '';

  const tooltipHtml = `
    <div style="min-width:160px;max-width:220px;padding:2px 0">
      <div style="font-weight:800;font-size:12px;color:#0d9488">${vet.nombre}</div>
      ${dirRow}${horRow}
      ${!dirRow && !horRow ? '<div style="font-size:11px;color:#9ca3af;margin-top:3px">Hacé click para más info</div>' : ''}
    </div>`;

  const marker = L.marker([vet.lat, vet.lng], { icon: vetIcon })
    .bindTooltip(tooltipHtml, {
      direction: 'top',
      offset: [0, -44],
      opacity: 1,
    })
    .addTo(map);

  if (onVetClick) {
    marker.on('click', () => onVetClick(vet));
  }
}
