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

export async function eliminarGrooming(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autorizado');
  const { data: grooming } = await supabase
    .from('grooming')
    .select('perro_id, perros!inner(user_id)')
    .eq('id', id)
    .single();
  const perrosData = grooming?.perros as { user_id: string } | { user_id: string }[] | null | undefined;
  const ownerId = Array.isArray(perrosData) ? perrosData[0]?.user_id : perrosData?.user_id;
  if (!ownerId || ownerId !== user.id) throw new Error('No autorizado');
  const { error } = await supabase.from('grooming').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function guardarGrooming(
  perroId: string,
  grooming: Omit<Grooming, 'id' | 'created_at' | 'perro_id'>
): Promise<Grooming> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autorizado');
  const { data: perro } = await supabase
    .from('perros').select('id').eq('id', perroId).eq('user_id', user.id).single();
  if (!perro) throw new Error('No autorizado');

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
    const { data, error } = await supabase
      .from('grooming')
      .upsert({ perro_id: perroId, ...grooming }, { onConflict: 'perro_id', ignoreDuplicates: false })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Grooming;
  }
}
