import { supabase } from './supabase';
import { File } from 'expo-file-system';

export type TipoEstudio =
  | 'laboratorio'
  | 'radiografia'
  | 'ecografia'
  | 'certificado_chip'
  | 'certificado_cvi'
  | 'certificado_antiparasitario'
  | 'vacuna_antirrabica'
  | 'airtag';

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
    .select('*')
    .eq('perro_id', perroId)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function subirArchivoEstudio(uri: string, nombre: string): Promise<string> {
  const ext  = nombre.split('.').pop() ?? 'bin';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  // Determinar mime type
  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    jpg: 'image/jpeg', jpeg: 'image/jpeg',
    png: 'image/png', heic: 'image/heic',
    mp4: 'video/mp4', mov: 'video/quicktime',
  };
  const mime = mimeTypes[ext.toLowerCase()] ?? 'application/octet-stream';

  // API nueva de expo-file-system (SDK 56): leer el archivo directo a ArrayBuffer,
  // sin pasar por base64 como antes.
  const bytes = new Uint8Array(await new File(uri).arrayBuffer());

  const { error } = await supabase.storage
    .from('estudios')
    .upload(path, bytes, { contentType: mime });
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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autorizado');
  const { data: estudio } = await supabase
    .from('estudios')
    .select('archivo_url, perros!inner(user_id)')
    .eq('id', id)
    .single();
  const perrosData = estudio?.perros as { user_id: string } | { user_id: string }[] | null | undefined;
  const ownerId = Array.isArray(perrosData) ? perrosData[0]?.user_id : perrosData?.user_id;
  if (!ownerId || ownerId !== user.id) throw new Error('No autorizado');
  const { error } = await supabase.from('estudios').delete().eq('id', id);
  if (error) throw error;
  // Borrar también el archivo del bucket para no acumular huérfanos en Storage.
  const path = estudio?.archivo_url?.match(/\/storage\/v1\/object\/public\/estudios\/(.+)$/)?.[1];
  if (path) await supabase.storage.from('estudios').remove([path]);
}
