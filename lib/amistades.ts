/** Sistema de amigos — mismo modelo que patitas-app/lib/amistades.ts. */
import { supabase } from './supabase';

export type EstadoAmistad = 'pendiente' | 'aceptada' | 'rechazada';

export interface Amistad {
  id: string;
  solicitante_id: string;
  receptor_id: string;
  estado: EstadoAmistad;
  created_at: string;
}

export interface ResultadoBusquedaPerro {
  perro_id: string;
  nombre: string;
  raza: string | null;
  foto_url: string | null;
  owner_id: string;
  owner_nombre: string | null;
  owner_apellido: string | null;
  owner_ciudad: string | null;
}

/** Busca perros por nombre en `perros` (perfiles registrados) y `posts` (avisos activos). */
export async function buscarPerrosPorNombre(nombre: string): Promise<ResultadoBusquedaPerro[]> {
  if (!nombre.trim()) return [];

  const { data: profilesMatch } = await supabase
    .from('profiles_public')
    .select('id, nombre, apellido, ciudad')
    .or(`nombre.ilike.%${nombre}%,apellido.ilike.%${nombre}%`)
    .limit(20);
  const ownerIds = (profilesMatch ?? []).map((p: any) => p.id as string);

  const [r0, r1, r2, r3] = await Promise.all([
    supabase.from('perros_public').select('id, nombre, raza, foto_url, user_id').ilike('nombre', `%${nombre}%`).limit(15),
    supabase.from('posts').select('id, nombre, raza, images, user_id').ilike('nombre', `%${nombre}%`).not('user_id', 'is', null).neq('estado', 'resuelto').limit(15),
    ownerIds.length > 0
      ? supabase.from('perros_public').select('id, nombre, raza, foto_url, user_id').in('user_id', ownerIds).limit(15)
      : Promise.resolve({ data: [] as any[] }),
    ownerIds.length > 0
      ? supabase.from('posts').select('id, nombre, raza, images, user_id').in('user_id', ownerIds).not('user_id', 'is', null).neq('estado', 'resuelto').limit(15)
      : Promise.resolve({ data: [] as any[] }),
  ]);

  if ((r0 as any).error) throw (r0 as any).error;
  if ((r1 as any).error) throw (r1 as any).error;
  const perrosData = [...((r0.data ?? []) as any[]), ...((r2.data ?? []) as any[])];
  const postsData  = [...((r1.data ?? []) as any[]), ...((r3.data ?? []) as any[])];

  const allOwnerIds = [...new Set([
    ...perrosData.map((d) => d.user_id as string),
    ...postsData.map((d) => d.user_id as string),
  ])].filter(Boolean);

  let profilesMap: Record<string, any> = {};
  if (allOwnerIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles_public')
      .select('id, nombre, apellido, ciudad')
      .in('id', allOwnerIds);
    for (const p of (profiles ?? []) as any[]) profilesMap[p.id] = p;
  }
  for (const p of (profilesMatch ?? []) as any[]) profilesMap[p.id] = p;

  const resultados: ResultadoBusquedaPerro[] = [];
  const vistos = new Set<string>();

  for (const d of perrosData) {
    if (!d.nombre) continue;
    const key = `${d.user_id}|${(d.nombre as string).toLowerCase()}`;
    if (vistos.has(key)) continue;
    vistos.add(key);
    const profile = profilesMap[d.user_id] ?? {};
    resultados.push({
      perro_id: d.id, nombre: d.nombre, raza: d.raza ?? null,
      foto_url: d.foto_url ?? null, owner_id: d.user_id,
      owner_nombre: profile.nombre ?? null, owner_apellido: profile.apellido ?? null, owner_ciudad: profile.ciudad ?? null,
    });
  }
  for (const d of postsData) {
    if (!d.nombre) continue;
    const key = `${d.user_id}|${(d.nombre as string).toLowerCase()}`;
    if (vistos.has(key)) continue;
    vistos.add(key);
    const images = (d.images as string[] | null) ?? [];
    const profile = profilesMap[d.user_id] ?? {};
    resultados.push({
      perro_id: d.id, nombre: d.nombre, raza: d.raza ?? null,
      foto_url: images[0] ?? null, owner_id: d.user_id,
      owner_nombre: profile.nombre ?? null, owner_apellido: profile.apellido ?? null, owner_ciudad: profile.ciudad ?? null,
    });
  }

  return resultados;
}

/** Todas las amistades del usuario (aceptadas, pendientes enviadas y recibidas). */
export async function listarMisAmistades(userId: string): Promise<Amistad[]> {
  const { data } = await supabase
    .from('amistades')
    .select('id, solicitante_id, receptor_id, estado, created_at')
    .or(`solicitante_id.eq.${userId},receptor_id.eq.${userId}`)
    .neq('estado', 'rechazada')
    .order('created_at', { ascending: false });
  return (data ?? []) as Amistad[];
}

/** IDs de amigos confirmados de userId. */
export async function obtenerAmigosIds(userId: string): Promise<string[]> {
  const { data } = await supabase
    .from('amistades')
    .select('solicitante_id, receptor_id')
    .or(`solicitante_id.eq.${userId},receptor_id.eq.${userId}`)
    .eq('estado', 'aceptada');
  return (data ?? []).map((a: any) => (a.solicitante_id === userId ? a.receptor_id : a.solicitante_id));
}

/** Envía una solicitud de amistad y notifica al receptor. */
export async function enviarSolicitud(solicitanteId: string, receptorId: string, solicitanteNombre: string): Promise<void> {
  const { data: amistad, error } = await supabase
    .from('amistades')
    .insert({ solicitante_id: solicitanteId, receptor_id: receptorId })
    .select('id')
    .single();
  if (error) throw error;

  await supabase.from('notifications').insert({
    user_id: receptorId,
    post_id: null,
    tipo: 'solicitud_amistad',
    mensaje: `${solicitanteNombre || 'Alguien'} quiere ser tu amigo en Vecindog 🐾`,
    leida: false,
    meta: JSON.stringify({ amistad_id: amistad.id, solicitante_id: solicitanteId }),
  });
}

/** Acepta una solicitud — solo el receptor puede aceptarla. */
export async function aceptarSolicitud(amistadId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autorizado');
  const { error, count } = await supabase
    .from('amistades')
    .update({ estado: 'aceptada' }, { count: 'exact' })
    .eq('id', amistadId)
    .eq('receptor_id', user.id);
  if (error) throw error;
  if (count === 0) throw new Error('Solicitud no encontrada');
}

/** Rechaza o elimina una amistad (reject / cancel enviada / unfriend). */
export async function rechazarEliminarAmistad(amistadId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autorizado');
  const { error, count } = await supabase
    .from('amistades')
    .delete({ count: 'exact' })
    .eq('id', amistadId)
    .or(`solicitante_id.eq.${user.id},receptor_id.eq.${user.id}`);
  if (error) throw error;
  if (count === 0) throw new Error('Amistad no encontrada');
}

/** Notifica a los amigos del dueño que su perro se perdió (se llama al publicar un aviso 'perdido'). */
export async function notificarAmigosPerroPerdido(params: {
  ownerId: string; postId: string; nombrePerro: string | null; zona: string;
}): Promise<void> {
  const { ownerId, postId, nombrePerro, zona } = params;
  const amigosIds = await obtenerAmigosIds(ownerId);
  if (!amigosIds.length) return;

  const nombreStr = nombrePerro ? `${nombrePerro}` : 'Un perro';
  const rows = amigosIds.map((id) => ({
    user_id: id, post_id: postId, tipo: 'amigo_perdido',
    mensaje: `🚨 ${nombreStr}, el perro de tu amigo, se perdió en ${zona}. ¡Ayudá a encontrarlo!`,
    leida: false,
  }));
  await supabase.from('notifications').insert(rows);
}
