import { supabase } from './supabase';

export type TipoEstudio = 'laboratorio' | 'radiografia' | 'ecografia' | 'certificado_chip' | 'certificado_cvi' | 'certificado_antiparasitario' | 'vacuna_antirrabica' | 'airtag';

export interface Estudio {
  id:          string;
  perro_id:    string;
  tipo:        TipoEstudio;
  nombre:      string;
  archivo_url: string | null;
  fecha:       string | null;
  notas:       string | null;
  created_at:  string;
}

export async function listarEstudios(perroId: string): Promise<Estudio[]> {
  const { data } = await supabase
    .from('estudios')
    .select('id, perro_id, tipo, nombre, archivo_url, fecha, notas, created_at')
    .eq('perro_id', perroId)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function subirArchivoEstudio(file: File): Promise<string> {
  const ext  = file.name.split('.').pop() ?? 'bin';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('estudios').upload(path, file);
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('estudios').getPublicUrl(path);
  return data.publicUrl;
}

export async function agregarEstudio(
  estudio: Omit<Estudio, 'id' | 'created_at'>
): Promise<Estudio> {
  const { data, error } = await supabase
    .from('estudios')
    .insert(estudio)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function eliminarEstudio(id: string): Promise<void> {
  await supabase.from('estudios').delete().eq('id', id);
}
