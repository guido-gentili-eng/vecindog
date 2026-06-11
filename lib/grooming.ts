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
    .select('id, perro_id, ultima_fecha, frecuencia_dias, tipo, notas, created_at')
    .eq('perro_id', perroId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data ?? null) as Grooming | null;
}

export async function eliminarGrooming(perroId: string): Promise<void> {
  const { error } = await supabase
    .from('grooming')
    .delete()
    .eq('perro_id', perroId);
  if (error) throw new Error(error.message);
}

export async function guardarGrooming(
  perroId: string,
  grooming: Omit<Grooming, 'id' | 'created_at'>
): Promise<Grooming> {
  // Buscar registro existente para hacer update seguro (sin delete previo que pueda borrar datos)
  const { data: existing } = await supabase
    .from('grooming')
    .select('id')
    .eq('perro_id', perroId)
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    const { data, error } = await supabase
      .from('grooming')
      .update({ ultima_fecha: grooming.ultima_fecha, frecuencia_dias: grooming.frecuencia_dias, tipo: grooming.tipo, notas: grooming.notas })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Grooming;
  } else {
    // upsert con ignoreDuplicates:false para que, en caso de race condition
    // donde dos inserts concurrentes colisionan, el segundo simplemente actualice
    const { data, error } = await supabase
      .from('grooming')
      .upsert(grooming, { onConflict: 'perro_id', ignoreDuplicates: false })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Grooming;
  }
}
