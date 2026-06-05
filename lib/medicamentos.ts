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
    .select('*')
    .eq('perro_id', perroId)
    .order('activo', { ascending: false })
    .order('created_at', { ascending: false });
  return (data ?? []) as Medicamento[];
}

export async function agregarMedicamento(
  med: Omit<Medicamento, 'id' | 'created_at'>
): Promise<Medicamento> {
  const { data, error } = await supabase
    .from('medicamentos')
    .insert(med)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Medicamento;
}

export async function eliminarMedicamento(id: string): Promise<void> {
  const { error } = await supabase.from('medicamentos').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
