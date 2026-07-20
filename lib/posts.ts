/**
 * Funciones de gestión sobre la tabla `posts`, misma lógica que patitas-app/lib/posts.ts.
 */
import { supabase } from './supabase';

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
