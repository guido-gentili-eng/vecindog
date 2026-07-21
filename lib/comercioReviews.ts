/**
 * Reseñas de comercios de Red Vecindog — habla con la API de patitas-app
 * (/api/comercio-reviews) porque vecindog-mobile no tiene backend propio.
 */
import { supabase } from './supabase';

const API_BASE = 'https://www.mivecindog.com.ar/api/comercio-reviews';

export interface ComercioReview {
  id: string;
  ad_id: string;
  user_id: string;
  estrellas: number;
  comentario: string | null;
  created_at: string;
  profiles: { nombre: string | null; apellido: string | null; foto_url: string | null } | null;
}

export interface ResumenReviews {
  total: number;
  promedio: number;
  miReview: ComercioReview | null;
}

export async function getComercioReviews(adId: string): Promise<{ reviews: ComercioReview[]; resumen: ResumenReviews }> {
  const { data: { session } } = await supabase.auth.getSession();
  const headers: Record<string, string> = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};
  const res = await fetch(`${API_BASE}?ad_id=${adId}`, { headers });
  if (!res.ok) throw new Error('No se pudieron cargar las reseñas.');
  const json = await res.json();
  return {
    reviews: json.reviews ?? [],
    resumen: { total: json.total ?? 0, promedio: json.promedio ?? 0, miReview: json.miReview ?? null },
  };
}

export async function calificarComercio(adId: string, estrellas: number, comentario: string): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Tenés que iniciar sesión para calificar.');
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
    body: JSON.stringify({ ad_id: adId, estrellas, comentario }),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error ?? 'No se pudo guardar la reseña.');
  }
}
