/**
 * Tipos y funciones Supabase para calificaciones de veterinarias.
 * Los datos de la vet (nombre, dirección, etc.) vienen de Overpass/OSM.
 * Solo la calificación se persiste en Supabase.
 */
import { supabase } from './supabase';

/* ── Tipo compartido para una veterinaria (datos de OSM) ── */
export interface Vet {
  id:         number;   // OSM node/way ID
  lat:        number;
  lng:        number;
  nombre:     string;
  telefono?:  string;
  direccion?: string;
  website?:   string;
  horario?:   string;
}

/* ── Resumen de calificaciones de una vet ── */
export interface RatingResumen {
  promedio:  number;       // 0-5
  total:     number;       // cantidad de calificaciones
  miRating:  number | null; // calificación del usuario actual (null si no calificó)
}

/** Trae el promedio, total y la calificación del usuario actual para una vet. */
export async function getRatings(vetId: number): Promise<RatingResumen> {
  const [{ data: rows }, { data: { user } }] = await Promise.all([
    supabase.from('vet_ratings').select('rating, user_id').eq('vet_id', vetId),
    supabase.auth.getUser(),
  ]);

  if (!rows || rows.length === 0) return { promedio: 0, total: 0, miRating: null };

  const promedio  = rows.reduce((s, r) => s + r.rating, 0) / rows.length;
  const miRating  = rows.find((r) => r.user_id === user?.id)?.rating ?? null;

  return { promedio, total: rows.length, miRating };
}

/** Guarda o actualiza la calificación del usuario para una vet. */
export async function setRating(
  vetId: number,
  vetNombre: string,
  rating: number,
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');

  const { error } = await supabase.from('vet_ratings').upsert(
    { vet_id: vetId, vet_nombre: vetNombre, user_id: user.id, rating },
    { onConflict: 'vet_id,user_id' },
  );
  if (error) throw error;
}
