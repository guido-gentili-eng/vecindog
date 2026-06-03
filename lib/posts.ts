/**
 * Tipos y funciones Supabase para la tabla `posts`.
 */
import { supabase } from './supabase';
import type { Animal } from './mockData';

/* ─────────────────── Tipo ─────────────────── */

export interface Post {
  id:          string;
  created_at:  string;
  user_id:     string | null;
  perro_id:    string | null;
  categoria:   'perdido' | 'encontrado' | 'adopcion' | 'transito';
  especie:     string;
  nombre:      string | null;
  raza:        string | null;
  color:       string | null;
  tamano:      'pequeño' | 'mediano' | 'grande' | null;
  collar:      boolean | null;
  chapita:     boolean | null;
  descripcion: string;
  zona:        string;
  fecha:       string;
  horario:     string | null;
  contacto:    string;
  images:      string[];
  estado:      'activo' | 'resuelto';
  lat:         number | null;
  lng:         number | null;
  situacion_transito?:    'tengo' | 'calle' | null;
  fecha_limite_transito?: string | null;
}

/* ─────────────────── Adapter ─────────────────── */

/** Convierte un Post de Supabase al tipo Animal que usan los componentes existentes. */
export function postToAnimal(p: Post): Animal {
  return {
    id:          p.id,
    categoria:   p.categoria,
    especie:     p.especie as Animal['especie'],
    nombre:      p.nombre,
    descripcion: p.descripcion,
    zona:        p.zona,
    ciudad:      '',           // sin columna ciudad por ahora
    fecha:       p.fecha,
    imagenes:    p.images,
    contacto:    p.contacto,
    estado:      'vivo',
    recompensa:  null,
    situacion_transito:    p.situacion_transito ?? null,
    fecha_limite_transito: p.fecha_limite_transito ?? null,
  };
}

/* ─────────────────── Consultas ─────────────────── */

export async function listarPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .neq('estado', 'resuelto')   // oculta los resueltos; null (legacy) pasa igual
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Post[];
}

export async function obtenerPost(id: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data as Post;
}

/** Convierte un aviso "perdido" en "encontrado" (activo) para que aparezca en el filtro verde. */
export async function encontrarPost(id: string): Promise<void> {
  const { error } = await supabase
    .from('posts')
    .update({ categoria: 'encontrado', estado: 'activo' })
    .eq('id', id);
  if (error) throw error;
}

/** Marca el aviso como resuelto (dueño reclamó / adoptado / volvió a casa). */
export async function resolverPost(id: string): Promise<void> {
  const { error } = await supabase
    .from('posts')
    .update({ estado: 'resuelto' })
    .eq('id', id);
  if (error) throw error;
}

/** Cuenta los avisos activos (no resueltos) del usuario autenticado. */
export async function contarPostsActivosDelUsuario(): Promise<number> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return 0;
  const { count } = await supabase
    .from('posts')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', session.user.id)
    .neq('estado', 'resuelto');
  return count ?? 0;
}

/** Sube el aviso al tope de la lista actualizando created_at. */
export async function renovarPost(id: string): Promise<void> {
  const { error } = await supabase
    .from('posts')
    .update({ created_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

/** Actualiza la zona (y opcionalmente horario/coords) de un aviso perdido con la última ubicación vista. */
export async function actualizarZonaPost(
  id: string,
  zona: string,
  horario?: string,
  lat?: number | null,
  lng?: number | null,
): Promise<void> {
  const payload: Record<string, unknown> = { zona };
  if (horario) payload.horario = horario;
  if (lat != null) payload.lat = lat;
  if (lng != null) payload.lng = lng;
  const { error } = await supabase.from('posts').update(payload).eq('id', id);
  if (error) throw error;
}

/** Busca si un perro tiene un aviso de tipo 'perdido' activo. */
export async function buscarPostActivoDePerro(perroId: string): Promise<Post | null> {
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('perro_id', perroId)
    .eq('categoria', 'perdido')
    .neq('estado', 'resuelto')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  return data as Post | null;
}

/** Elimina el aviso y sus fotos del storage. */
export async function listarPostsResueltos(limite = 20): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('estado', 'resuelto')
    .order('created_at', { ascending: false })
    .limit(limite);
  if (error) throw error;
  return (data ?? []) as Post[];
}

export async function eliminarPost(id: string, images: string[]): Promise<void> {
  // Borrar fotos del bucket
  const paths = images
    .map((url) => {
      const m = url.match(/\/storage\/v1\/object\/public\/posts\/(.+)$/);
      return m ? m[1] : null;
    })
    .filter(Boolean) as string[];
  if (paths.length) {
    await supabase.storage.from('posts').remove(paths);
  }
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;
}
