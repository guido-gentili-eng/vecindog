import { supabase } from './supabase';

export interface ContactoInput {
  nombre:   string;
  relacion: string;
  telefono: string;
  notas:    string;
}

export interface ContactoEmergencia {
  id:         string;
  perro_id:   string;
  nombre:     string;
  relacion:   string | null;
  telefono:   string;
  notas:      string | null;
  created_at: string;
}

export async function listarContactos(perroId: string): Promise<ContactoEmergencia[]> {
  const { data } = await supabase
    .from('contactos_emergencia')
    .select('id, perro_id, nombre, relacion, telefono, notas, created_at')
    .eq('perro_id', perroId)
    .order('created_at', { ascending: true });
  return (data ?? []) as ContactoEmergencia[];
}

export async function agregarContacto(
  perroId: string,
  input: ContactoInput
): Promise<ContactoEmergencia> {
  const { data, error } = await supabase
    .from('contactos_emergencia')
    .insert({ perro_id: perroId, ...input })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as ContactoEmergencia;
}

export async function eliminarContacto(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autorizado');
  const { error } = await supabase.from('contactos_emergencia').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
