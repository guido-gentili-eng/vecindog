import { supabase } from './supabase';

export type EstadoSalud = 'saludable' | 'en_tratamiento' | 'en_recuperacion';

export interface PerroExtraInput {
  nombre?:            string;
  raza?:              string;
  color?:              string;
  sexo?:               string;
  tamano?:             string;
  fecha_nac?:          string;
  chip?:               string;
  descripcion?:        string;
  foto_url?:           string;
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
  if (input.nombre           !== undefined) patch.nombre           = input.nombre           || null;
  if (input.raza             !== undefined) patch.raza             = input.raza             || null;
  if (input.color            !== undefined) patch.color            = input.color            || null;
  if (input.sexo             !== undefined) patch.sexo             = input.sexo             || null;
  if (input.tamano           !== undefined) patch.tamano           = input.tamano           || null;
  if (input.fecha_nac        !== undefined) patch.fecha_nac        = input.fecha_nac        || null;
  if (input.chip             !== undefined) patch.chip             = input.chip             || null;
  if (input.descripcion      !== undefined) patch.descripcion      = input.descripcion      || null;
  if (input.foto_url         !== undefined) patch.foto_url         = input.foto_url         || null;
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
