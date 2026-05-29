/**
 * Tipos y funciones Supabase para el módulo "Mis perros".
 *
 * Tablas requeridas:
 *   - public.perros    (ver SQL en /docs/sql-perros.sql o README)
 *   - public.vacunas
 */
import { supabase } from './supabase';

/* ─────────────────── Tipos ─────────────────── */

export type Tamano = 'pequeño' | 'mediano' | 'grande';
export type Sexo   = 'macho'   | 'hembra';

export interface VacunaInput {
  nombre:      string;   // Séxtuple, Antirrábica, etc.
  fecha:       string;   // YYYY-MM-DD
  veterinario: string;
  proxima:     string;   // YYYY-MM-DD, puede estar vacío
  notas:       string;
}

export interface Vacuna extends VacunaInput {
  id:         string;
  perro_id:   string;
  created_at: string;
}

export interface PerroInput {
  nombre:       string;
  raza:         string;
  color:        string;
  tamano:       Tamano | '';
  sexo:         Sexo   | '';
  fecha_nac:    string;  // YYYY-MM-DD
  chip:         string;
  esterilizado: boolean;
  descripcion:  string;
  direccion:    string;  // Dirección del hogar (para avisos de pérdida)
  foto_url:     string;
}

export interface Perro extends Omit<PerroInput, 'tamano' | 'sexo'> {
  id:         string;
  user_id:    string;
  tamano:     Tamano | null;
  sexo:       Sexo   | null;
  created_at: string;
  vacunas?:   Vacuna[];
}

/* ─────────────────── Consultas ─────────────────── */

export async function listarMisPerros(): Promise<Perro[]> {
  const { data, error } = await supabase
    .from('perros')
    .select('*, vacunas(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Perro[];
}

export async function obtenerPerro(id: string): Promise<Perro | null> {
  const { data, error } = await supabase
    .from('perros')
    .select('*, vacunas(*)')
    .eq('id', id)
    .single();
  if (error) return null;
  return data as Perro;
}

export async function crearPerro(
  input: PerroInput,
  vacunas: VacunaInput[]
): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Tenés que estar registrado para guardar un perro.');

  const { data, error } = await supabase
    .from('perros')
    .insert({
      user_id:      user.id,
      nombre:       input.nombre,
      raza:         input.raza        || null,
      color:        input.color       || null,
      tamano:       input.tamano      || null,
      sexo:         input.sexo        || null,
      fecha_nac:    input.fecha_nac   || null,
      chip:         input.chip        || null,
      esterilizado: input.esterilizado,
      descripcion:  input.descripcion || null,
      direccion:    input.direccion   || null,
      foto_url:     input.foto_url    || null,
    })
    .select('id')
    .single();
  if (error) throw error;

  const perroId = data.id as string;

  if (vacunas.length > 0) {
    const rows = vacunas
      .filter((v) => v.nombre && v.fecha)
      .map((v) => ({
        perro_id:    perroId,
        nombre:      v.nombre,
        fecha:       v.fecha,
        veterinario: v.veterinario || null,
        proxima:     v.proxima     || null,
        notas:       v.notas       || null,
      }));
    if (rows.length > 0) {
      const { error: vErr } = await supabase.from('vacunas').insert(rows);
      if (vErr) throw vErr;
    }
  }

  return perroId;
}

export async function eliminarPerro(id: string): Promise<void> {
  const { error } = await supabase.from('perros').delete().eq('id', id);
  if (error) throw error;
}

/* ─────────────────── Storage helpers ─────────────────── */

export async function subirFotoPerro(file: File): Promise<string> {
  const ext  = file.name.split('.').pop() ?? 'jpg';
  const path = `perros/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage
    .from('posts')
    .upload(path, file, { upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from('posts').getPublicUrl(path);
  return data.publicUrl;
}

/* ─────────────────── Constantes helpers ─────────────────── */

export const VACUNAS_COMUNES = [
  'Séxtuple',
  'Antirrábica',
  'Leptospirosis',
  'Bordetella',
  'Leishmaniasis',
  'Coronavirus',
  'Garrapatas (antiparasitario)',
];

export const VACUNA_VACIA: VacunaInput = {
  nombre: '', fecha: '', veterinario: '', proxima: '', notas: '',
};
