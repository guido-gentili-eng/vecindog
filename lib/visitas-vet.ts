import { supabase } from './supabase';

export interface VisitaVetInput {
  fecha:        string; // YYYY-MM-DD
  motivo:       string;
  diagnostico:  string;
  tratamiento:  string;
  vet_nombre:   string;
  notas:        string;
}

export interface VisitaVet {
  id:           string;
  perro_id:     string;
  fecha:        string; // YYYY-MM-DD
  motivo:       string;
  diagnostico:  string | null;
  tratamiento:  string | null;
  vet_nombre:   string | null;
  notas:        string | null;
  created_at:   string;
}

export async function listarVisitasVet(perroId: string): Promise<VisitaVet[]> {
  const { data } = await supabase
    .from('visitas_vet')
    .select('id, perro_id, fecha, motivo, diagnostico, tratamiento, vet_nombre, notas, created_at')
    .eq('perro_id', perroId)
    .order('fecha', { ascending: false });
  return (data ?? []) as VisitaVet[];
}

export async function agregarVisitaVet(
  perroId: string,
  input: VisitaVetInput
): Promise<VisitaVet> {
  const { data, error } = await supabase
    .from('visitas_vet')
    .insert({ perro_id: perroId, ...input })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as VisitaVet;
}

export async function eliminarVisitaVet(id: string): Promise<void> {
  const { error } = await supabase.from('visitas_vet').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
