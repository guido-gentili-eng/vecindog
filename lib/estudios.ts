import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';

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

  // Leer el archivo como base64
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Determinar mime type
  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    jpg: 'image/jpeg', jpeg: 'image/jpeg',
    png: 'image/png', heic: 'image/heic',
    mp4: 'video/mp4', mov: 'video/quicktime',
  };
  const mime = mimeTypes[ext.toLowerCase()] ?? 'application/octet-stream';

  // Convertir base64 a Uint8Array
  const binary = atob(base64);
  const bytes  = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

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
  await supabase.from('estudios').delete().eq('id', id);
}
