import { supabase } from './supabase';

export type EstadoSalud = 'saludable' | 'en_tratamiento' | 'en_recuperacion';

export interface PerroExtraInput {
  alergias?:         string;
  vet_nombre?:       string;
  vet_telefono?:     string;
  direccion?:        string;
  estado_salud?:     EstadoSalud | '';
  dieta_marca?:       string;
  dieta_cantidad?:    string;
  dieta_frecuencia?:  string;
  dieta_notas?:       string;
}

export async function actualizarPerro(id: string, input: PerroExtraInput): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autorizado');

  const patch: Record<string, unknown> = {};
  if (input.alergias         !== undefined) patch.alergias         = input.alergias         || null;
  if (input.vet_nombre       !== undefined) patch.vet_nombre       = input.vet_nombre       || null;
  if (input.vet_telefono     !== undefined) patch.vet_telefono     = input.vet_telefono     || null;
  if (input.direccion        !== undefined) patch.direccion        = input.direccion        || null;
  if (input.estado_salud     !== undefined) patch.estado_salud     = input.estado_salud     || null;
  if (input.dieta_marca      !== undefined) patch.dieta_marca      = input.dieta_marca      || null;
  if (input.dieta_cantidad   !== undefined) patch.dieta_cantidad   = input.dieta_cantidad   || null;
  if (input.dieta_frecuencia !== undefined) patch.dieta_frecuencia = input.dieta_frecuencia || null;
  if (input.dieta_notas      !== undefined) patch.dieta_notas      = input.dieta_notas      || null;

  const { error } = await supabase.from('perros').update(patch).eq('id', id).eq('user_id', user.id);
  if (error) throw error;
}

export async function guardarCartoonUrl(id: string, cartoon_url: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autorizado');
  const { error } = await supabase.from('perros').update({ cartoon_url }).eq('id', id).eq('user_id', user.id);
  if (error) throw error;
}

export async function guardarFotoPerfil(id: string, foto_url: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autorizado');
  const { error } = await supabase.from('perros').update({ foto_url }).eq('id', id).eq('user_id', user.id);
  if (error) throw error;
}
