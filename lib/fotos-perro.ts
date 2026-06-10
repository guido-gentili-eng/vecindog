import { supabase } from './supabase';

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

export async function subirFotoPerro(file: File): Promise<string> {
  const ext  = file.name.split('.').pop() ?? 'jpg';
  const path = `fotos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('estudios').upload(path, file);
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('estudios').getPublicUrl(path);
  return data.publicUrl;
}

export async function agregarFoto(
  perroId: string, url: string, descripcion?: string
): Promise<FotoPerro> {
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
  const { error } = await supabase.from('fotos_perro').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
