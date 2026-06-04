import { supabase } from './supabase';

export interface PesoInput {
  fecha:    string;  // YYYY-MM-DD
  valor_kg: number;
  notas:    string;
}

export interface Peso extends PesoInput {
  id:         string;
  perro_id:   string;
  created_at: string;
}

export async function listarPesos(perroId: string): Promise<Peso[]> {
  const { data } = await supabase
    .from('pesos')
    .select('*')
    .eq('perro_id', perroId)
    .order('fecha', { ascending: false });
  return (data ?? []) as Peso[];
}

export async function agregarPeso(perroId: string, input: PesoInput): Promise<Peso> {
  const { data, error } = await supabase
    .from('pesos')
    .insert({
      perro_id: perroId,
      fecha:    input.fecha,
      valor_kg: input.valor_kg,
      notas:    input.notas || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Peso;
}

export async function eliminarPeso(id: string): Promise<void> {
  await supabase.from('pesos').delete().eq('id', id);
}
