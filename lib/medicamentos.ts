import { supabase } from './supabase';

export interface MedicamentoInput {
  nombre:       string;
  dosis:        string;
  frecuencia:   string;
  fecha_inicio: string; // YYYY-MM-DD
  fecha_fin:    string | null; // YYYY-MM-DD or null
  notas:        string;
}

export interface Medicamento extends MedicamentoInput {
  id:         string;
  perro_id:   string;
  activo:     boolean;
  created_at: string;
}

export async function listarMedicamentos(perroId: string): Promise<Medicamento[]> {
  const { data } = await supabase
    .from('medicamentos')
    .select('id, perro_id, nombre, dosis, frecuencia, fecha_inicio, fecha_fin, notas, activo, created_at')
    .eq('perro_id', perroId)
    .order('activo', { ascending: false })
    .order('created_at', { ascending: false });
  return (data ?? []) as Medicamento[];
}

export async function agregarMedicamento(
  perroId: string,
  input: MedicamentoInput,
): Promise<Medicamento> {
  const { data, error } = await supabase
    .from('medicamentos')
    .insert({
      perro_id:     perroId,
      nombre:       input.nombre,
      dosis:        input.dosis       || null,
      frecuencia:   input.frecuencia  || null,
      fecha_inicio: input.fecha_inicio,
      fecha_fin:    input.fecha_fin   || null,
      notas:        input.notas       || null,
      activo:       true,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Medicamento;
}

export async function eliminarMedicamento(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autorizado');
  const { data: medicamento } = await supabase
    .from('medicamentos')
    .select('id, perros!inner(user_id)')
    .eq('id', id)
    .single();
  const perrosData = medicamento?.perros as { user_id: string } | { user_id: string }[] | null | undefined;
  const ownerId = Array.isArray(perrosData) ? perrosData[0]?.user_id : perrosData?.user_id;
  if (!ownerId || ownerId !== user.id) throw new Error('No autorizado');
  const { error } = await supabase.from('medicamentos').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
