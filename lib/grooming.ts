import { supabase } from './supabase';

export type TipoGrooming = 'baño' | 'peluquería' | 'ambos';

export interface Grooming {
  id:              string;
  perro_id:        string;
  ultima_fecha:    string; // YYYY-MM-DD
  frecuencia_dias: number;
  tipo:            TipoGrooming;
  notas:           string | null;
  created_at:      string;
}

export async function obtenerGrooming(perroId: string): Promise<Grooming | null> {
  const { data } = await supabase
    .from('grooming')
    .select('*')
    .eq('perro_id', perroId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  return (data ?? null) as Grooming | null;
}

export async function guardarGrooming(
  perroId: string,
  grooming: Omit<Grooming, 'id' | 'created_at'>
): Promise<Grooming> {
  // Delete existing and insert new (upsert pattern)
  await supabase.from('grooming').delete().eq('perro_id', perroId);
  const { data, error } = await supabase
    .from('grooming')
    .insert(grooming)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Grooming;
}
