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
    .insert({ perro_id: perroId, ...input })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Procedimiento;
}

export async function eliminarProcedimiento(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autorizado');
  const { error } = await supabase.from('procedimientos').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
