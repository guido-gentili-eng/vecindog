import { supabase } from './supabase';

export const TIPOS_PROCEDIMIENTO = [
  'Cirugía',
  'Limpieza dental',
  'Castración/Esterilización',
  'Tratamiento dermatológico',
  'Ortopedia',
  'Otro',
] as const;

export interface ProcedimientoInput {
  fecha:       string; // YYYY-MM-DD
  tipo:        string;
  descripcion: string;
  vet_nombre:  string;
  notas:       string;
}

export interface Procedimiento {
  id:          string;
  perro_id:    string;
  fecha:       string;
  tipo:        string;
  descripcion: string;
  vet_nombre:  string | null;
  notas:       string | null;
  created_at:  string;
}

export async function listarProcedimientos(perroId: string): Promise<Procedimiento[]> {
  const { data } = await supabase
    .from('procedimientos')
    .select('id, perro_id, fecha, tipo, descripcion, vet_nombre, notas, created_at')
    .eq('perro_id', perroId)
    .order('fecha', { ascending: false });
  return (data ?? []) as Procedimiento[];
}

export async function agregarProcedimiento(
  perroId: string,
  input: ProcedimientoInput
): Promise<Procedimiento> {
  const { data, error } = await supabase
    .from('procedimientos')
    .insert({
      perro_id:    perroId,
      fecha:       input.fecha,
      tipo:        input.tipo,
      descripcion: input.descripcion,
      vet_nombre:  input.vet_nombre || null,
      notas:       input.notas      || null,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Procedimiento;
}

export async function eliminarProcedimiento(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autorizado');
  const { data: procedimiento } = await supabase
    .from('procedimientos')
    .select('id, perros!inner(user_id)')
    .eq('id', id)
    .single();
  const perrosData = procedimiento?.perros as { user_id: string } | { user_id: string }[] | null | undefined;
  const ownerId = Array.isArray(perrosData) ? perrosData[0]?.user_id : perrosData?.user_id;
  if (!ownerId || ownerId !== user.id) throw new Error('No autorizado');
  const { error } = await supabase.from('procedimientos').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
