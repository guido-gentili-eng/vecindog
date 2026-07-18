import { supabase } from './supabase';
import { subirArchivoEstudio } from './estudios';

export interface FotoPerro {
  id:          string;
  perro_id:    string;
  url:         string;
  descripcion: string | null;
  created_at:  string;
}

export async function listarFotos(perroId: string): Promise<FotoPerro[]> {
  const { data } = await supabase
    .from('fotos_perro')
    .select('id, perro_id, url, descripcion, created_at')
    .eq('perro_id', perroId)
    .order('created_at', { ascending: false });
  return (data ?? []) as FotoPerro[];
}

export async function subirFotoGaleria(uri: string, nombre: string): Promise<string> {
  return subirArchivoEstudio(uri, nombre);
}

export async function agregarFoto(
  perroId: string, url: string, descripcion?: string
): Promise<FotoPerro> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autorizado');
  const { data: perro } = await supabase
    .from('perros').select('id').eq('id', perroId).eq('user_id', user.id).single();
  if (!perro) throw new Error('No autorizado');
  const { data, error } = await supabase
    .from('fotos_perro')
    .insert({ perro_id: perroId, url, descripcion: descripcion || null })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as FotoPerro;
}

export async function eliminarFoto(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autorizado');
  const { data: foto } = await supabase
    .from('fotos_perro')
    .select('id, url, perros!inner(user_id)')
    .eq('id', id)
    .single();
  const perrosData = foto?.perros as { user_id: string } | { user_id: string }[] | null | undefined;
  const ownerId = Array.isArray(perrosData) ? perrosData[0]?.user_id : perrosData?.user_id;
  if (!ownerId || ownerId !== user.id) throw new Error('No autorizado');
  const { error } = await supabase.from('fotos_perro').delete().eq('id', id);
  if (error) throw new Error(error.message);
  const path = foto?.url?.match(/\/storage\/v1\/object\/public\/estudios\/(.+)$/)?.[1];
  if (path) await supabase.storage.from('estudios').remove([path]);
}
