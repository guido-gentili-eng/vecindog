'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { Post } from '@/lib/posts';
import type { Ad } from '@/lib/ads';

/* ──────────────────── Tipos ──────────────────── */

interface LatLng { lat: number; lng: number }

/** Escapa caracteres HTML para prevenir XSS en popups de Leaflet */
function esc(s: string | null | undefined): string {
  if (!s) return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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

/** Pin Vecindog con color de categoría (SVG oficial) */
function createPinIcon(categoria: string) {
  const pinColor = CAT_COLOR[categoria] ?? '#6b7280';
  const pinDark  = shadeHex(pinColor, -0.25);
  const pawColor = '#413f3f';
  const html = `
    <div style="width:32px;height:48px;cursor:pointer;filter:drop-shadow(0 2px 5px rgba(0,0,0,0.40))">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 59.57 89.72" width="32" height="48">
        <path fill="${pinColor}" d="M29.79,0C13.34,0,0,13.34,0,29.79,0,53.16,21.13,65.1,29.79,89.72c8.66-24.62,29.79-36.56,29.79-59.93C59.57,13.34,46.24,0,29.79,0ZM35.22,51.3c-.29.07-.58.14-.87.2-.57,3.35-.69,7.15-.66,7.26,0,0,0,0,0,0-.07.04-3.33-2.52-5.14-5.57-.14-.23-.26-.45-.38-.67-8.91-.35-16.29-6.5-18.57-15.58-2.77-11.04,3.93-22.24,14.97-25.01s22.24,3.93,25.01,14.97c2.77,11.04-3.32,21.63-14.36,24.4Z"/>
        <g fill="${pawColor}">
          <path d="M23.05,33.88c-1.24.15-2.39-.95-2.57-2.46-.24-1.96.54-3.89,1.77-4.04,1.24-.15,2.48,1.67,2.7,3.49.19,1.51-.66,2.86-1.9,3.01Z"/>
          <path d="M32.78,40.28c-1.76-.04-2.43-.82-3.56-.84-1.13-.02-1.83.73-3.59.7-2.3-.05-3.96-2.94-1.83-4.79,2.65-2.3,3.45-5.24,5.61-5.19,2.17.04,2.84,3.02,5.39,5.42,2.05,1.94.28,4.76-2.02,4.71Z"/>
          <path d="M30.05,26.32c.19-1.82,1.41-3.67,2.64-3.53,1.24.13,2.05,2.05,1.84,4.01-.16,1.51-1.3,2.63-2.53,2.5-1.24-.13-2.11-1.47-1.95-2.98Z"/>
          <path d="M24.42,26.59c-.13-1.97.76-3.85,2-3.93,1.24-.08,2.38,1.81,2.49,3.64.1,1.52-.83,2.82-2.07,2.9-1.24.08-2.33-1.09-2.43-2.61Z"/>
          <path d="M35.61,34.14c-1.23-.2-2.02-1.59-1.77-3.09.3-1.81,1.62-3.58,2.84-3.37,1.23.2,1.93,2.16,1.6,4.11-.25,1.5-1.45,2.56-2.67,2.35Z"/>
        </g>
        <path fill="${pinDark}" d="M28.55,53.2c-.14-.23-.26-.45-.38-.67-8.91-.35-16.29-6.5-18.57-15.58-2.77-11.04,3.93-22.24,14.97-25.01,1.75-.44,3.49-.61,5.21-.6V0C13.34,0,0,13.34,0,29.79c0,23.37,21.13,35.31,29.79,59.93v-34.77c-.44-.56-.87-1.14-1.24-1.75Z"/>
      </svg>
    </div>`;
  return L.divIcon({ className: '', html, iconSize: [32, 48], iconAnchor: [16, 48], popupAnchor: [0, -50] });
}

/** Oscurece un color hex en un factor (negativo = más oscuro) */
function shadeHex(hex: string, factor: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, Math.round(((n >> 16) & 0xff) * (1 + factor))));
  const g = Math.max(0, Math.min(255, Math.round(((n >> 8)  & 0xff) * (1 + factor))));
  const b = Math.max(0, Math.min(255, Math.round(((n)       & 0xff) * (1 + factor))));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
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
    ? `<img src="${esc(post.images[0])}" style="width:100%;height:96px;object-fit:cover;border-radius:8px;margin-bottom:6px">`
    : '';
  const html = `
    <div style="width:190px;padding:4px 0">
      ${imgHtml}
      <span style="display:inline-block;background:${color};color:white;border-radius:20px;padding:2px 8px;font-size:10px;font-weight:800;margin-bottom:4px">${esc(label)}</span>
      <div style="font-weight:700;font-size:13px;color:#1a1a1a;margin-bottom:2px">${esc(post.nombre ?? 'Sin nombre')}</div>
      <div style="font-size:11px;color:#6b6258;margin-bottom:6px">${esc(sanitizarZona(post.zona))} · ${esc(post.fecha)}</div>
      <a href="/publicaciones/${esc(post.id)}" style="display:block;background:${color};color:white;text-align:center;border-radius:8px;padding:6px;font-size:12px;font-weight:700;text-decoration:none">Ver aviso →</a>
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
    ? `<div style="margin-top:3px;font-size:11px;color:#4b5563">📞 ${esc(comercio.telefono_comercio)}</div>`
    : '';
  const direccion = comercio.direccion_comercio
    ? `<div style="margin-top:3px;font-size:11px;color:#4b5563">📍 ${esc(comercio.direccion_comercio)}</div>`
    : '';
  const horario   = (comercio.horario_apertura && comercio.horario_cierre)
    ? `<div style="margin-top:3px;font-size:11px;color:#4b5563">🕐 ${esc(comercio.horario_apertura)} – ${esc(comercio.horario_cierre)}</div>`
    : '';
  const categoria = comercio.categoria_local
    ? `<span style="display:inline-block;background:#0d9488;color:white;border-radius:20px;padding:2px 8px;font-size:10px;font-weight:800;margin-bottom:4px">${esc(comercio.categoria_local)}</span>`
    : '';

  const tooltipHtml = `
    <div style="min-width:170px;max-width:230px;padding:3px 0">
      ${categoria}
      <div style="font-weight:800;font-size:13px;color:#0d9488;line-height:1.3">${esc(comercio.titulo)}</div>
      ${direccion}${telefono}${horario}
      <a href="/comercio/${encodeURIComponent(comercio.id)}" style="display:inline-block;margin-top:6px;font-size:11px;font-weight:700;color:#0d9488">Ver comercio →</a>
    </div>`;

  return L.marker([comercio.lat!, comercio.lng!], { icon: vetIcon })
    .bindPopup(tooltipHtml, { maxWidth: 240 })
    .addTo(map);
}
