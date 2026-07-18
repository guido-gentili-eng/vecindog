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
    .select('id, perro_id, fecha, valor_kg, notas, created_at')
    .eq('perro_id', perroId)
    .order('fecha', { ascending: false });
  return (data ?? []) as Peso[];
}

export async function agregarPeso(perroId: string, input: PesoInput): Promise<Peso> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autorizado');
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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autorizado');
  const { error } = await supabase.from('pesos').delete().eq('id', id);
  if (error) throw error;
}
