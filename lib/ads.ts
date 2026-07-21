/**
 * Modelo de datos de la tabla `ads` — misma tabla que usa patitas-app/lib/ads.ts
 * para publicidad (leaderboard/card/sidebar) y comercios de Red Vecindog.
 */
import { supabase } from './supabase';
import { File } from 'expo-file-system';

export type AdVariant = 'leaderboard' | 'card' | 'sidebar' | 'comercio';

export interface Ad {
  id: string;
  variant: AdVariant;
  titulo: string;
  subtitulo: string | null;
  imagen_url: string | null;
  imagen_logo_url?: string | null;
  href: string;
  cta: string | null;
  anunciante: string | null;
  plan: 'basico' | 'estandar' | 'premium' | 'comercio';
  activo: boolean;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  created_at: string;
  lat?: number | null;
  lng?: number | null;
  telefono_comercio?: string | null;
  horario_apertura?: string | null;
  horario_cierre?: string | null;
  dias_atencion?: string | null;
  direccion_comercio?: string | null;
  categoria_local?: string | null;
  descripcion_comercio?: string | null;
  localidad_comercio?: string | null;
}

const AD_FIELDS = 'id,variant,titulo,subtitulo,imagen_url,imagen_logo_url,href,cta,anunciante,plan,activo,fecha_inicio,fecha_fin,created_at,lat,lng,telefono_comercio,horario_apertura,horario_cierre,dias_atencion,direccion_comercio,categoria_local,descripcion_comercio,localidad_comercio';

/** Trae un ad activo y no vencido para un slot, elegido al azar entre los candidatos (misma lógica que la web). */
export async function getAdForSlot(variant: AdVariant): Promise<Ad | null> {
  const hoy = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from('ads')
    .select(AD_FIELDS)
    .eq('variant', variant)
    .eq('activo', true)
    .or(`fecha_fin.is.null,fecha_fin.gte.${hoy}`);
  const candidatos = (data ?? []) as Ad[];
  if (!candidatos.length) return null;
  return candidatos[Math.floor(Math.random() * candidatos.length)];
}

export async function crearAd(input: Omit<Ad, 'id' | 'created_at'>): Promise<Ad> {
  const { data, error } = await supabase.from('ads').insert(input).select(AD_FIELDS).single();
  if (error) throw new Error(error.message);
  return data as Ad;
}

async function subirArchivo(uri: string, prefix: string): Promise<string> {
  const path = `ads/${prefix}${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
  const bytes = new Uint8Array(await new File(uri).arrayBuffer());
  const { error } = await supabase.storage.from('posts').upload(path, bytes, { contentType: 'image/jpeg' });
  if (error) throw new Error(error.message);
  return supabase.storage.from('posts').getPublicUrl(path).data.publicUrl;
}

export async function subirImagenAd(uri: string): Promise<string> {
  return subirArchivo(uri, '');
}

export async function subirLogoAd(uri: string): Promise<string> {
  return subirArchivo(uri, 'logo-');
}
