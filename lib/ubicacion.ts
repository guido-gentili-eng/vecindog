import * as Location from 'expo-location';

const NOMINATIM_HEADERS = { 'User-Agent': 'Vecindog/1.0 (noreply@mivecindog.com.ar)' };

export type DireccionSugerencia = { label: string; sub: string; lat: number; lng: number };

/** Pide permiso de ubicación, toma el GPS y devuelve la dirección por reverse-geocode (Nominatim). */
export async function capturarUbicacionGPS(): Promise<{ lat: number; lng: number; direccion: string | null } | null> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return null;

  const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  const { latitude: lat, longitude: lng } = loc.coords;

  let direccion: string | null = null;
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      { headers: NOMINATIM_HEADERS }
    );
    const data = await res.json();
    if (data?.address) {
      const a = data.address;
      const calle = a.road ?? a.pedestrian ?? a.footway ?? '';
      const numero = a.house_number ?? '';
      const barrio = a.suburb ?? a.neighbourhood ?? a.quarter ?? '';
      const texto = [calle && numero ? `${calle} ${numero}` : calle, barrio].filter(Boolean).join(', ');
      if (texto) direccion = texto;
    }
  } catch { /* sin reverse geocode, el usuario puede escribir la dirección a mano */ }

  return { lat, lng, direccion };
}

/** Autocompletado de direcciones en Argentina via Nominatim, opcionalmente acotado a una ciudad. */
export async function buscarDirecciones(query: string, ciudad?: string): Promise<DireccionSugerencia[]> {
  const full = ciudad ? `${query}, ${ciudad}, Argentina` : `${query}, Argentina`;
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(full)}&format=json&limit=6&addressdetails=1&countrycodes=ar`,
    { headers: NOMINATIM_HEADERS }
  );
  const data = await res.json();
  return (Array.isArray(data) ? data : []).map((s: any) => {
    const a = s.address ?? {};
    const road = a.road ?? a.pedestrian ?? a.footway ?? a.residential ?? '';
    const num = a.house_number ?? '';
    const calle = [road, num].filter(Boolean).join(' ') || String(s.display_name ?? '').split(',')[0].trim();
    const ciudadSug = a.city ?? a.town ?? a.village ?? a.suburb ?? '';
    return { label: calle, sub: ciudadSug, lat: parseFloat(s.lat), lng: parseFloat(s.lon) };
  }).filter((s: DireccionSugerencia) => s.label);
}
