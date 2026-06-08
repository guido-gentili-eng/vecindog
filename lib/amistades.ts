import { supabase } from './supabase';

export type EstadoAmistad = 'pendiente' | 'aceptada' | 'rechazada';

export interface Amistad {
  id:             string;
  solicitante_id: string;
  receptor_id:    string;
  estado:         EstadoAmistad;
  created_at:     string;
}

export interface AmigoConPerfil {
  amistad_id:  string;
  user_id:     string;
  nombre:      string | null;
  apellido:    string | null;
  foto_url:    string | null;
  ciudad:      string | null;
}

export interface ResultadoBusquedaPerro {
  perro_id:       string;
  nombre:         string;
  raza:           string | null;
  foto_url:       string | null;
  owner_id:       string;
  owner_nombre:   string | null;
  owner_apellido: string | null;
  owner_ciudad:   string | null;
}

/**
 * Busca perros por nombre en AMBAS fuentes:
 * 1. Tabla `perros` (perfiles registrados)
 * 2. Tabla `posts` (avisos publicados — perdido / encontrado / adopción)
 * Devuelve resultados únicos por owner_id + nombre, sin duplicados.
 */
export async function buscarPerrosPorNombre(nombre: string): Promise<ResultadoBusquedaPerro[]> {
  if (!nombre.trim()) return [];

  // Buscar en paralelo en perros y posts
  const [perrosRes, postsRes] = await Promise.all([
    supabase
      .from('perros')
      .select('id, nombre, raza, foto_url, user_id, profiles:user_id(nombre, apellido, ciudad)')
      .ilike('nombre', `%${nombre}%`)
      .limit(10),
    supabase
      .from('posts')
      .select('id, nombre, raza, images, user_id, profiles:user_id(nombre, apellido, ciudad)')
      .ilike('nombre', `%${nombre}%`)
      .not('user_id', 'is', null)
      .neq('estado', 'resuelto')
      .limit(10),
  ]);

  const resultados: ResultadoBusquedaPerro[] = [];
  const vistos = new Set<string>(); // key: owner_id|nombre_lower

  // De la tabla perros
  for (const d of (perrosRes.data ?? []) as Record<string, unknown>[]) {
    const profile = (d.profiles as Record<string, unknown> | null) ?? {};
    const key = `${d.user_id}|${(d.nombre as string).toLowerCase()}`;
    if (vistos.has(key)) continue;
    vistos.add(key);
    resultados.push({
      perro_id:       d.id as string,
      nombre:         d.nombre as string,
      raza:           (d.raza as string | null) ?? null,
      foto_url:       (d.foto_url as string | null) ?? null,
      owner_id:       d.user_id as string,
      owner_nombre:   (profile.nombre as string | null) ?? null,
      owner_apellido: (profile.apellido as string | null) ?? null,
      owner_ciudad:   (profile.ciudad as string | null) ?? null,
    });
  }

  // De la tabla posts (avisos)
  for (const d of (postsRes.data ?? []) as Record<string, unknown>[]) {
    if (!d.nombre) continue;
    const profile = (d.profiles as Record<string, unknown> | null) ?? {};
    const key = `${d.user_id}|${(d.nombre as string).toLowerCase()}`;
    if (vistos.has(key)) continue;
    vistos.add(key);
    const images = (d.images as string[] | null) ?? [];
    resultados.push({
      perro_id:       d.id as string,
      nombre:         d.nombre as string,
      raza:           (d.raza as string | null) ?? null,
      foto_url:       images[0] ?? null,
      owner_id:       d.user_id as string,
      owner_nombre:   (profile.nombre as string | null) ?? null,
      owner_apellido: (profile.apellido as string | null) ?? null,
      owner_ciudad:   (profile.ciudad as string | null) ?? null,
    });
  }

  return resultados;
}

/** Devuelve todas las amistades del usuario actual (aceptadas, pendientes enviadas y recibidas) */
export async function listarMisAmistades(userId: string): Promise<Amistad[]> {
  const { data } = await supabase
    .from('amistades')
    .select('id, solicitante_id, receptor_id, estado, created_at')
    .or(`solicitante_id.eq.${userId},receptor_id.eq.${userId}`)
    .neq('estado', 'rechazada')
    .order('created_at', { ascending: false });
  return (data ?? []) as Amistad[];
}

/** Devuelve los IDs de usuarios que son amigos confirmados de userId */
export async function obtenerAmigosIds(userId: string): Promise<string[]> {
  const { data } = await supabase
    .from('amistades')
    .select('solicitante_id, receptor_id')
    .or(`solicitante_id.eq.${userId},receptor_id.eq.${userId}`)
    .eq('estado', 'aceptada');
  return (data ?? []).map((a) =>
    a.solicitante_id === userId ? a.receptor_id : a.solicitante_id,
  );
}

/** Envía una solicitud de amistad y crea la notificación para el receptor */
export async function enviarSolicitud(
  solicitanteId: string,
  receptorId:    string,
  solicitanteNombre: string,
): Promise<void> {
  // Crear amistad pendiente
  const { data: amistad, error } = await supabase
    .from('amistades')
    .insert({ solicitante_id: solicitanteId, receptor_id: receptorId })
    .select('id')
    .single();
  if (error) throw error;

  // Notificar al receptor
  await supabase.from('notifications').insert({
    user_id: receptorId,
    post_id: null,
    tipo:    'solicitud_amistad',
    mensaje: `${solicitanteNombre || 'Alguien'} quiere ser tu amigo en Vecindog 🐾`,
    leida:   false,
    meta:    JSON.stringify({ amistad_id: amistad.id, solicitante_id: solicitanteId }),
  });
}

/** Acepta una solicitud de amistad */
export async function aceptarSolicitud(amistadId: string): Promise<void> {
  const { error } = await supabase
    .from('amistades')
    .update({ estado: 'aceptada' })
    .eq('id', amistadId);
  if (error) throw error;
}

/**
 * Notifica a todos los amigos del dueño que su perro se perdió.
 * Se llama desde el publicar flow cuando categoria === 'perdido'.
 */
export async function notificarAmigosPerroPerdido(params: {
  ownerId:     string;
  postId:      string;
  nombrePerro: string | null;
  zona:        string;
}): Promise<void> {
  const { ownerId, postId, nombrePerro, zona } = params;
  const amigosIds = await obtenerAmigosIds(ownerId);
  if (!amigosIds.length) return;

  const nombreStr = nombrePerro ? `${nombrePerro}` : 'Un perro';
  const rows = amigosIds.map((id) => ({
    user_id: id,
    post_id: postId,
    tipo:    'amigo_perdido',
    mensaje: `🚨 ${nombreStr}, el perro de tu amigo, se perdió en ${zona}. ¡Ayudá a encontrarlo!`,
    leida:   false,
  }));

  await supabase.from('notifications').insert(rows);
}

/** Rechaza o elimina una amistad */
export async function rechazarEliminarAmistad(amistadId: string): Promise<void> {
  const { error } = await supabase
    .from('amistades')
    .delete()
    .eq('id', amistadId);
  if (error) throw error;
}
