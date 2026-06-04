'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { Post } from '@/lib/posts';
import type { Ad } from '@/lib/ads';

/* ──────────────────── Tipos ──────────────────── */

interface LatLng { lat: number; lng: number }

/* ──────────────────── Colores de avisos ──────────────────── */

const CAT_COLOR: Record<string, string> = {
  perdido:    '#ef4444',
  encontrado: '#22c55e',
  adopcion:   '#f97316',
  transito:   '#7c3aed',
};
const CAT_LABEL: Record<string, string> = {
  perdido:    'Perdido',
  encontrado: 'Visto',
  adopcion:   'Adopción',
  transito:   'En la calle',
};

/* ──────────────────── Íconos ──────────────────── */

/** Pin Vecindog con color de categoría */
function createPinIcon(categoria: string) {
  const pinColor  = CAT_COLOR[categoria] ?? '#6b7280';
  const dogColor  = '#1A1A1A';
  const eyeColor  = '#F5EFE6';
  const html = `
    <div style="width:36px;height:44px;cursor:pointer;filter:drop-shadow(0 2px 5px rgba(0,0,0,0.40))">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="36" height="44">
        <path d="M50 4 C72 4 90 22 90 44 C90 66 50 116 50 116 C50 116 10 66 10 44 C10 22 28 4 50 4 Z" fill="${pinColor}"/>
        <circle cx="50" cy="44" r="30" fill="#F5EFE6"/>
        <g transform="translate(50 44)" fill="${dogColor}">
          <ellipse cx="-13" cy="-8" rx="7" ry="13" transform="rotate(-22 -13 -8)"/>
          <ellipse cx="-2" cy="0" rx="18" ry="14"/>
          <ellipse cx="14" cy="3" rx="10" ry="7.5"/>
          <ellipse cx="22" cy="2" rx="2.5" ry="2"/>
        </g>
        <circle cx="46" cy="40" r="1.8" fill="${eyeColor}"/>
        <path d="M72 49 Q78 55 78 62 Q78 68 74 68 Q70 68 70 62 Q70 56 72 52" fill="none" stroke="${dogColor}" stroke-width="3" stroke-linecap="round"/>
      </svg>
    </div>`;
  return L.divIcon({ className: '', html, iconSize: [36, 44], iconAnchor: [18, 44], popupAnchor: [0, -46] });
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

/* ──────────────────── Nominatim geocoding ──────────────────── */

const SESSION_KEY = 'geo_cache_v3';
function loadGeoCache(): Record<string, LatLng> {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? '{}'); }
  catch { return {}; }
}
function saveGeoCache(c: Record<string, LatLng>) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(c)); } catch {}
}

async function geocodificarZona(
  zona: string,
  cache: Record<string, LatLng>,
  ciudad?: string,
  centerHint?: LatLng,
): Promise<LatLng | null> {
  const ciudadSuffix = ciudad ? `|${ciudad.toLowerCase().trim()}` : '';
  const key = `${zona.toLowerCase().trim()}${ciudadSuffix}`;
  if (cache[key]) return cache[key];

  // Query: si hay ciudad y la zona no la menciona, agregarla
  const ciudadLower = ciudad?.toLowerCase() ?? '';
  const zonaLower   = zona.toLowerCase();
  const yaIncluyeCiudad = ciudadLower && zonaLower.includes(ciudadLower.split(' ')[0]);
  const query = yaIncluyeCiudad || !ciudad
    ? `${zona}, Argentina`
    : `${zona}, ${ciudad}, Argentina`;

  // Viewbox solo cuando NO hay ciudad en la query Y el center no es el default de Buenos Aires
  const DEFAULT_BA = { lat: -34.6, lng: -58.44 };
  const centerEsDefault = !centerHint ||
    (Math.abs(centerHint.lat - DEFAULT_BA.lat) < 0.1 && Math.abs(centerHint.lng - DEFAULT_BA.lng) < 0.1);
  const viewboxParam = (!ciudad && centerHint && !centerEsDefault)
    ? `&viewbox=${centerHint.lng - 0.5},${centerHint.lat + 0.5},${centerHint.lng + 0.5},${centerHint.lat - 0.5}&bounded=1`
    : '';

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1${viewboxParam}`,
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

/** Quita número de calle al final: "Quintana 4768" → "Quintana" */
function sanitizarZona(zona: string): string {
  return zona.replace(/\s+\d+[\w\s]*$/i, '').trim() || zona;
}

/* ──────────────────── Props ──────────────────── */

interface MapViewProps {
  center:     LatLng;
  posts:      Post[];
  comercios?: Ad[];
  userLoc:    LatLng | null;
  cargando:   boolean;
  ciudad?:    string;
}

/* ──────────────────── Componente ──────────────────── */

export default function MapView({ center, posts, comercios = [], userLoc, cargando, ciudad }: MapViewProps) {
  const containerRef      = useRef<HTMLDivElement>(null);
  const mapRef            = useRef<L.Map | null>(null);
  const userMarkerRef     = useRef<L.Marker | null>(null);
  const postMarkersRef    = useRef<L.Marker[]>([]);
  const comercioMarkersRef = useRef<L.Marker[]>([]);
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

    // Limpiar markers previos para re-dibujar con ciudad/center actualizado
    postMarkersRef.current.forEach((m) => m.remove());
    postMarkersRef.current = [];

    async function colocarMarcadores() {
      setGeocodificando(true);
      let count = 0;
      const conCoords = posts.filter((p) => p.lat != null && p.lng != null);
      const sinCoords = posts.filter((p) => p.lat == null || p.lng == null);

      for (const p of conCoords) {
        if (cancelled) return;
        const m = agregarMarcadorPost(map, p, jitter(p.lat!), jitter(p.lng!));
        postMarkersRef.current.push(m);
        setColocados(++count);
      }

      const zonas = [...new Set(sinCoords.map((p) => p.zona.toLowerCase().trim()))];
      for (const zona of zonas) {
        if (cancelled) return;
        const coords = await geocodificarZona(zona, cache, ciudad, center);
        if (coords) {
          sinCoords
            .filter((p) => p.zona.toLowerCase().trim() === zona)
            .forEach((p) => {
              const m = agregarMarcadorPost(map, p, jitter(coords.lat), jitter(coords.lng));
              postMarkersRef.current.push(m);
              setColocados(++count);
            });
        }
        await delay(1300);
      }
      if (!cancelled) setGeocodificando(false);
    }

    colocarMarcadores();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts, cargando, ciudad]);

  /* ── 5. Comercios registrados en Red Vecindog ── */
  useEffect(() => {
    if (!mapRef.current || comercios.length === 0) return;
    const map = mapRef.current;
    comercioMarkersRef.current.forEach((m) => m.remove());
    comercioMarkersRef.current = [];
    comercios.forEach((c) => {
      if (c.lat == null || c.lng == null) return;
      const m = agregarMarcadorComercio(map, c);
      comercioMarkersRef.current.push(m);
    });
  }, [comercios]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}

/* ──────────────────── Helpers de marcadores ──────────────────── */

function agregarMarcadorPost(map: L.Map, post: Post, lat: number, lng: number): L.Marker {
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
      <div style="font-size:11px;color:#6b6258;margin-bottom:6px">${sanitizarZona(post.zona)} · ${post.fecha}</div>
      <a href="/publicaciones/${post.id}" style="display:block;background:${color};color:white;text-align:center;border-radius:8px;padding:6px;font-size:12px;font-weight:700;text-decoration:none">Ver aviso →</a>
    </div>`;
  return L.marker([lat, lng], { icon: createPinIcon(post.categoria) })
    .bindPopup(html, { maxWidth: 210 })
    .addTo(map);
}

/* Días OSM → índice JS (0=Dom, 1=Lun … 6=Sáb) */
const OSM_DAY: Record<string, number> = { Su:0, Mo:1, Tu:2, We:3, Th:4, Fr:5, Sa:6 };
const DAY_ES = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

function parseHour(h: string): number {
  const [hh, mm] = h.split(':').map(Number);
  return hh * 60 + (mm ?? 0);
}

/** Devuelve true si el horario OSM indica que ahora está abierto */
function estaAbierto(oh: string): boolean {
  if (oh.trim() === '24/7') return true;
  const now   = new Date();
  const dow   = now.getDay();   // 0=Dom
  const mins  = now.getHours() * 60 + now.getMinutes();

  for (const rule of oh.split(';')) {
    const m = rule.trim().match(/^([A-Za-z,\-]+)\s+(\d{2}:\d{2})-(\d{2}:\d{2})$/);
    if (!m) continue;
    const [, days, from, to] = m;
    const open  = parseHour(from);
    const close = parseHour(to);

    // Expandir rango de días "Mo-Fr" o lista "Mo,We,Fr"
    let activeDays: number[] = [];
    if (days.includes('-')) {
      const [s, e] = days.split('-');
      const si = OSM_DAY[s], ei = OSM_DAY[e];
      if (si != null && ei != null) {
        for (let d = si; d <= ei; d++) activeDays.push(d);
      }
    } else {
      activeDays = days.split(',').map((d) => OSM_DAY[d.trim()]).filter((d) => d != null);
    }

    if (activeDays.includes(dow) && mins >= open && mins < close) return true;
  }
  return false;
}

/** Convierte "Mo-Fr 09:00-18:00; Sa 09:00-13:00" en líneas legibles */
function formatHorario(oh: string): string {
  if (oh.trim() === '24/7') return '24 hs todos los días';
  return oh
    .split(';')
    .map((rule) => {
      const m = rule.trim().match(/^([A-Za-z,\-]+)\s+(\d{2}:\d{2})-(\d{2}:\d{2})$/);
      if (!m) return rule.trim();
      const [, days, from, to] = m;
      // Traducir días
      const daysEs = days
        .replace(/Mo/g,'Lun').replace(/Tu/g,'Mar').replace(/We/g,'Mié')
        .replace(/Th/g,'Jue').replace(/Fr/g,'Vie').replace(/Sa/g,'Sáb').replace(/Su/g,'Dom');
      return `${daysEs} ${from}–${to}`;
    })
    .join('<br>');
}

function agregarMarcadorComercio(map: L.Map, comercio: Ad): L.Marker {
  const telefono  = comercio.telefono_comercio
    ? `<div style="margin-top:3px;font-size:11px;color:#4b5563">📞 ${comercio.telefono_comercio}</div>`
    : '';
  const direccion = comercio.direccion_comercio
    ? `<div style="margin-top:3px;font-size:11px;color:#4b5563">📍 ${comercio.direccion_comercio}</div>`
    : '';
  const horario   = (comercio.horario_apertura && comercio.horario_cierre)
    ? `<div style="margin-top:3px;font-size:11px;color:#4b5563">🕐 ${comercio.horario_apertura} – ${comercio.horario_cierre}</div>`
    : '';
  const categoria = comercio.categoria_local
    ? `<span style="display:inline-block;background:#0d9488;color:white;border-radius:20px;padding:2px 8px;font-size:10px;font-weight:800;margin-bottom:4px">${comercio.categoria_local}</span>`
    : '';

  const tooltipHtml = `
    <div style="min-width:170px;max-width:230px;padding:3px 0">
      ${categoria}
      <div style="font-weight:800;font-size:13px;color:#0d9488;line-height:1.3">${comercio.titulo}</div>
      ${direccion}${telefono}${horario}
      <a href="/red-vecindog/${encodeURIComponent(comercio.categoria_local ?? '')}" style="display:inline-block;margin-top:6px;font-size:11px;font-weight:700;color:#0d9488">Ver en Red Vecindog →</a>
    </div>`;

  return L.marker([comercio.lat!, comercio.lng!], { icon: vetIcon })
    .bindTooltip(tooltipHtml, { direction: 'top', offset: [0, -44], opacity: 1 })
    .addTo(map);
}
