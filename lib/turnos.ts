import { supabase } from './supabase';

export type TipoTurno = 'radiografia' | 'ecografia';

export interface Turno {
  id:         string;
  perro_id:   string;
  tipo:       TipoTurno;
  fecha:      string;
  nota:       string | null;
  created_at: string;
}

export async function listarTurnos(perroId: string): Promise<Turno[]> {
  const { data } = await supabase
    .from('turnos')
    .select('id, perro_id, tipo, fecha, nota, created_at')
    .eq('perro_id', perroId)
    .order('fecha', { ascending: true });
  return data ?? [];
}

export async function agregarTurno(
  turno: Omit<Turno, 'id' | 'created_at'>
): Promise<Turno> {
  const { data, error } = await supabase
    .from('turnos')
    .insert(turno)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function eliminarTurno(id: string): Promise<void> {
  const { error } = await supabase.from('turnos').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
