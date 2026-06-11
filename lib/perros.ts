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

export type EstadoSalud = 'saludable' | 'en_tratamiento' | 'en_recuperacion';

export interface PerroInput {
  nombre:           string;
  raza:             string;
  color:            string;
  tamano:           Tamano | '';
  sexo:             Sexo   | '';
  fecha_nac:        string;  // YYYY-MM-DD
  chip:             string;
  esterilizado:     boolean;
  descripcion:      string;
  alergias:         string;
  vet_nombre:       string;
  vet_telefono:     string;
  direccion:        string;
  foto_url:         string;
  estado_salud:     EstadoSalud | '';
  dieta_marca:      string;
  dieta_cantidad:   string;
  dieta_frecuencia: string;
  dieta_notas:      string;
}

export interface Perro extends Omit<PerroInput, 'tamano' | 'sexo' | 'alergias' | 'vet_nombre' | 'vet_telefono' | 'estado_salud' | 'dieta_marca' | 'dieta_cantidad' | 'dieta_frecuencia' | 'dieta_notas'> {
  id:               string;
  user_id:          string;
  tamano:           Tamano | null;
  sexo:             Sexo   | null;
  alergias:         string | null;
  vet_nombre:       string | null;
  vet_telefono:     string | null;
  estado_salud:     EstadoSalud | null;
  dieta_marca:      string | null;
  dieta_cantidad:   string | null;
  dieta_frecuencia: string | null;
  dieta_notas:      string | null;
  cartoon_url:       string | null;
  foto_carnet_url:   string | null;
  cartoon_generado_at?: string | null;
  numero_registro:   number | null;
  created_at:        string;
  vacunas?:          Vacuna[];
}

/* ─────────────────── Consultas ─────────────────── */

export async function listarMisPerros(): Promise<Perro[]> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) return [];
  const { data, error } = await supabase
    .from('perros')
    .select('*, vacunas(*)')
    .eq('user_id', user.id)
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
  const { data: authData, error: authErr } = await supabase.auth.getUser();
  const user = authData?.user;
  if (authErr || !user) throw new Error('Tenés que estar registrado para guardar un perro.');

  const { data, error } = await supabase
    .from('perros')
    .insert({
      user_id:      user.id,
      nombre:       input.nombre,
      raza:         input.raza         || null,
      color:        input.color        || null,
      tamano:       input.tamano       || null,
      sexo:         input.sexo         || null,
      fecha_nac:    input.fecha_nac    || null,
      chip:         input.chip         || null,
      esterilizado: input.esterilizado,
      descripcion:  input.descripcion  || null,
      alergias:     input.alergias     || null,
      vet_nombre:   input.vet_nombre   || null,
      vet_telefono: input.vet_telefono || null,
      direccion:    input.direccion    || null,
      foto_url:     input.foto_url     || null,
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

export async function actualizarPerro(
  id: string,
  input: Partial<PerroInput>,
): Promise<void> {
  const { data: authData, error: authErr } = await supabase.auth.getUser();
  const user = authData?.user;
  if (authErr || !user) throw new Error('No autorizado');

  const patch: Record<string, unknown> = {};
  if (input.nombre       !== undefined) patch.nombre       = input.nombre       || null;
  if (input.raza         !== undefined) patch.raza         = input.raza         || null;
  if (input.color        !== undefined) patch.color        = input.color        || null;
  if (input.tamano       !== undefined) patch.tamano       = input.tamano       || null;
  if (input.sexo         !== undefined) patch.sexo         = input.sexo         || null;
  if (input.fecha_nac    !== undefined) patch.fecha_nac    = input.fecha_nac    || null;
  if (input.chip         !== undefined) patch.chip         = input.chip         || null;
  if (input.esterilizado !== undefined) patch.esterilizado = input.esterilizado;
  if (input.descripcion  !== undefined) patch.descripcion  = input.descripcion  || null;
  if (input.alergias     !== undefined) patch.alergias     = input.alergias     || null;
  if (input.vet_nombre       !== undefined) patch.vet_nombre       = input.vet_nombre       || null;
  if (input.vet_telefono     !== undefined) patch.vet_telefono     = input.vet_telefono     || null;
  if (input.direccion        !== undefined) patch.direccion        = input.direccion        || null;
  if (input.foto_url         !== undefined) patch.foto_url         = input.foto_url         || null;
  if (input.estado_salud     !== undefined) patch.estado_salud     = input.estado_salud     || null;
  if (input.dieta_marca      !== undefined) patch.dieta_marca      = input.dieta_marca      || null;
  if (input.dieta_cantidad   !== undefined) patch.dieta_cantidad   = input.dieta_cantidad   || null;
  if (input.dieta_frecuencia !== undefined) patch.dieta_frecuencia = input.dieta_frecuencia || null;
  if (input.dieta_notas      !== undefined) patch.dieta_notas      = input.dieta_notas      || null;

  const { error } = await supabase.from('perros').update(patch).eq('id', id).eq('user_id', user.id);
  if (error) throw error;
}

export async function guardarCartoonUrl(id: string, cartoon_url: string): Promise<void> {
  const { data: authData, error: authErr } = await supabase.auth.getUser();
  const user = authData?.user;
  if (authErr || !user) throw new Error('No autorizado');
  const { error } = await supabase.from('perros').update({ cartoon_url }).eq('id', id).eq('user_id', user.id);
  if (error) throw error;
}

export async function guardarFotoCarnet(id: string, foto_carnet_url: string | null): Promise<void> {
  const { data: authData, error: authErr } = await supabase.auth.getUser();
  const user = authData?.user;
  if (authErr || !user) throw new Error('No autorizado');
  const { error } = await supabase.from('perros').update({ foto_carnet_url }).eq('id', id).eq('user_id', user.id);
  if (error) throw error;
}

export async function eliminarPerro(id: string): Promise<void> {
  const { data: authData, error: authErr } = await supabase.auth.getUser();
  const user = authData?.user;
  if (authErr || !user) throw new Error('No autorizado');
  const { error } = await supabase.from('perros').delete().eq('id', id).eq('user_id', user.id);
  if (error) throw error;
}

/* ─────────────────── CRUD vacunas ─────────────────── */

export async function agregarVacuna(perroId: string, input: VacunaInput): Promise<Vacuna> {
  const { data: authData, error: authErr } = await supabase.auth.getUser();
  const user = authData?.user;
  if (authErr || !user) throw new Error('No autorizado');
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

export async function actualizarVacuna(id: string, input: VacunaInput): Promise<void> {
  const { data: authData, error: authErr } = await supabase.auth.getUser();
  const user = authData?.user;
  if (authErr || !user) throw new Error('No autorizado');
  const { error } = await supabase.from('vacunas').update({
    nombre:      input.nombre,
    fecha:       input.fecha,
    veterinario: input.veterinario || null,
    proxima:     input.proxima     || null,
    notas:       input.notas       || null,
  }).eq('id', id);
  if (error) throw error;
}

export async function eliminarVacuna(id: string): Promise<void> {
  const { data: authData, error: authErr } = await supabase.auth.getUser();
  const user = authData?.user;
  if (authErr || !user) throw new Error('No autorizado');
  const { error } = await supabase.from('vacunas').delete().eq('id', id);
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

/** Devuelve todas las vacunas con fecha próxima de los perros del usuario, ordenadas por fecha. */
export async function listarMisVacunasProximas(): Promise<Array<Vacuna & { perro_nombre: string }>> {
  const perros = await listarMisPerros();
  if (perros.length === 0) return [];
  const perroIds = perros.map((p) => p.id);
  const { data } = await supabase
    .from('vacunas')
    .select('id, perro_id, nombre, fecha, veterinario, proxima, notas, created_at')
    .in('perro_id', perroIds)
    .not('proxima', 'is', null)
    .neq('proxima', '')
    .order('proxima', { ascending: true });
  if (!data) return [];
  const perroMap = Object.fromEntries(perros.map((p) => [p.id, p.nombre]));
  return (data as Vacuna[]).map((v) => ({ ...v, perro_nombre: perroMap[v.perro_id] ?? '?' }));
}

/** Sube foto de avatar del usuario al storage. */
export async function subirFotoPerfil(file: File, userId: string): Promise<string> {
  const ext  = file.name.split('.').pop() ?? 'jpg';
  const path = `avatars/${userId}.${ext}`;
  const { error } = await supabase.storage.from('posts').upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from('posts').getPublicUrl(path);
  return `${data.publicUrl}?t=${Date.now()}`;
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
