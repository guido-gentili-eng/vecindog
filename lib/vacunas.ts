import { supabase } from './supabase';

export interface VacunaInput {
  nombre:      string;
  fecha:       string; // YYYY-MM-DD
  veterinario: string;
  proxima:     string; // YYYY-MM-DD, puede estar vacío
  notas:       string;
}

export interface Vacuna extends VacunaInput {
  id:         string;
  perro_id:   string;
  created_at: string;
}

export const VACUNAS_COMUNES = [
  'Séxtuple',
  'Antirrábica',
  'Leptospirosis',
  'Bordetella',
  'Leishmaniasis',
  'Coronavirus',
  'Garrapatas (antiparasitario)',
];

export async function agregarVacuna(perroId: string, input: VacunaInput): Promise<Vacuna> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autorizado');
  const { data, error } = await supabase.from('vacunas').insert({
    perro_id:    perroId,
    nombre:      input.nombre,
    fecha:       input.fecha,
    veterinario: input.veterinario || null,
    proxima:     input.proxima     || null,
    notas:       input.notas       || null,
  }).select().single();
  if (error) throw error;
  return data as Vacuna;
}

export async function eliminarVacuna(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autorizado');
  const { data: vacuna } = await supabase
    .from('vacunas')
    .select('perro_id, perros!inner(user_id)')
    .eq('id', id)
    .single();
  const perrosData = vacuna?.perros as { user_id: string } | { user_id: string }[] | null | undefined;
  const vacunaOwner = Array.isArray(perrosData) ? perrosData[0]?.user_id : perrosData?.user_id;
  if (!vacunaOwner || vacunaOwner !== user.id) throw new Error('No autorizado');
  const { error } = await supabase.from('vacunas').delete().eq('id', id);
  if (error) throw error;
}
