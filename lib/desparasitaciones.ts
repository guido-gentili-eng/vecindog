import { supabase } from './supabase';

export type TipoDesparasitacion = 'interna' | 'externa' | 'ambas';

export interface DesparasitacionInput {
  producto:    string;
  tipo:        TipoDesparasitacion;
  fecha:       string; // YYYY-MM-DD
  proxima:     string; // YYYY-MM-DD — vacío si no hay
  veterinario: string;
  notas:       string;
}

export interface Desparasitacion extends DesparasitacionInput {
  id:         string;
  perro_id:   string;
  created_at: string;
}

export const PRODUCTOS_COMUNES = [
  'NexGard', 'NexGard Spectra', 'Bravecto', 'Frontline Plus', 'Frontline Tri-Act',
  'Advantix', 'Revolution', 'Simparica', 'Simparica Trio', 'Seresto',
  'Milbemax', 'Panacur', 'Drontal Plus', 'Endogard', 'Caniverm',
];

export const DESPARASITACION_VACIA: DesparasitacionInput = {
  producto: '', tipo: 'ambas', fecha: '', proxima: '', veterinario: '', notas: '',
};

export async function listarDesparasitaciones(perroId: string): Promise<Desparasitacion[]> {
  const { data } = await supabase
    .from('desparasitaciones')
    .select('id, perro_id, producto, tipo, fecha, proxima, veterinario, notas, created_at')
    .eq('perro_id', perroId)
    .order('fecha', { ascending: false });
  return (data ?? []) as Desparasitacion[];
}

export async function agregarDesparasitacion(
  perroId: string,
  input: DesparasitacionInput,
): Promise<Desparasitacion> {
  const { data, error } = await supabase
    .from('desparasitaciones')
    .insert({
      perro_id:    perroId,
      producto:    input.producto,
      tipo:        input.tipo,
      fecha:       input.fecha,
      proxima:     input.proxima     || null,
      veterinario: input.veterinario || null,
      notas:       input.notas       || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Desparasitacion;
}

export async function actualizarDesparasitacion(
  id: string,
  input: DesparasitacionInput,
): Promise<void> {
  const { error } = await supabase
    .from('desparasitaciones')
    .update({
      producto:    input.producto,
      tipo:        input.tipo,
      fecha:       input.fecha,
      proxima:     input.proxima     || null,
      veterinario: input.veterinario || null,
      notas:       input.notas       || null,
    })
    .eq('id', id);
  if (error) throw error;
}

export async function eliminarDesparasitacion(id: string): Promise<void> {
  await supabase.from('desparasitaciones').delete().eq('id', id);
}
