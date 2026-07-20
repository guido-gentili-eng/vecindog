/**
 * Funciones de gestión sobre la tabla `posts`, misma lógica que patitas-app/lib/posts.ts.
 */
import { supabase } from './supabase';

export interface Post {
  id: string;
  created_at: string;
  user_id: string | null;
  perro_id: string | null;
  categoria: string;
  especie: string;
  nombre: string | null;
  raza: string | null;
  color: string | null;
  tamano: string | null;
  descripcion: string | null;
  zona: string;
  fecha: string;
  horario: string | null;
  contacto: string | null;
  images: string[] | null;
  estado: 'activo' | 'resuelto';
  lat: number | null;
  lng: number | null;
}

const POSTS_FIELDS = 'id,created_at,user_id,perro_id,categoria,especie,nombre,raza,color,tamano,descripcion,zona,fecha,horario,contacto,images,estado,lat,lng';

export async function obtenerPost(id: string): Promise<Post | null> {
  const { data, error } = await supabase.from('posts').select(POSTS_FIELDS).eq('id', id).single();
  if (error) return null;
  return data as Post;
}

/** Lista los posts de una categoría de cuidado/transporte específica. */
export async function listarPostsCuidado(categoria: 'busco_cuidador' | 'cuidador_disponible' | 'transportador_disponible'): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select(POSTS_FIELDS)
    .eq('categoria', categoria)
    .neq('estado', 'resuelto')
    .order('created_at', { ascending: false })
    .limit(300);
  if (error) throw error;
  return (data ?? []) as Post[];
}

/** Marca el aviso como resuelto (dueño reclamó / adoptado / volvió a casa). */
export async function resolverPost(id: string): Promise<void> {
  const { error } = await supabase.from('posts').update({ estado: 'resuelto' }).eq('id', id);
  if (error) throw error;
}

/** Sube el aviso al tope de la lista actualizando created_at. */
export async function renovarPost(id: string): Promise<void> {
  const { error } = await supabase.from('posts').update({ created_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}

/** Actualiza la zona (y opcionalmente horario/coords/fecha) con la última ubicación vista. */
export async function actualizarZonaPost(
  id: string,
  zona: string,
  horario?: string,
  lat?: number | null,
  lng?: number | null,
  fecha?: string,
): Promise<void> {
  const payload: Record<string, unknown> = { zona };
  if (horario) payload.horario = horario;
  if (lat != null) payload.lat = lat;
  if (lng != null) payload.lng = lng;
  if (fecha) payload.fecha = fecha;
  const { error } = await supabase.from('posts').update(payload).eq('id', id);
  if (error) throw error;
}

export async function eliminarPost(id: string, images: string[]): Promise<void> {
  const paths = images
    .map((url) => {
      const m = url.match(/\/storage\/v1\/object\/public\/posts\/(.+)$/);
      return m ? m[1] : null;
    })
    .filter(Boolean) as string[];
  if (paths.length) {
    const { error: storageError } = await supabase.storage.from('posts').remove(paths);
    if (storageError) console.error('[eliminarPost] error borrando fotos del bucket:', storageError.message, paths);
  }
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;
}
