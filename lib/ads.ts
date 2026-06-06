import { createClient } from '@supabase/supabase-js';
import { supabase } from './supabase';

export type AdVariant = 'leaderboard' | 'card' | 'sidebar' | 'comercio';

export interface Ad {
  id:                string;
  variant:           AdVariant;
  titulo:            string;
  subtitulo:         string | null;
  /** Imagen principal: horizontal 4:3 para Card. */
  imagen_url:        string | null;
  /** Logo cuadrado 1:1 para Sidebar y Leaderboard (si no hay, usa imagen_url). */
  imagen_logo_url?:  string | null;
  href:              string;
  cta:               string | null;
  anunciante:        string | null;
  plan:              'basico' | 'estandar' | 'premium' | 'comercio';
  activo:            boolean;
  fecha_inicio:      string | null;
  fecha_fin:         string | null;
  created_at:        string;
  // Campos exclusivos de comercios adheridos
  lat?:                 number | null;
  lng?:                 number | null;
  telefono_comercio?:   string | null;
  horario_apertura?:    string | null;
  horario_cierre?:      string | null;
  dias_atencion?:       string | null;
  direccion_comercio?:  string | null;
  categoria_local?:     string | null;
}

export type AdInput = Omit<Ad, 'id' | 'created_at'>;

export async function getAdForSlot(variant: AdVariant): Promise<Ad | null> {
  const hoy = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from('ads')
    .select('*')
    .eq('variant', variant)
    .eq('activo', true)
    .or(`fecha_fin.is.null,fecha_fin.gte.${hoy}`);
  if (!data || data.length === 0) return null;
  // Rotar aleatoriamente entre todos los anuncios activos del slot
  return data[Math.floor(Math.random() * data.length)];
}

/** Devuelve comercios adheridos activos que tienen coordenadas (para el mapa). */
export async function listarComerciosConUbicacion(): Promise<Ad[]> {
  const hoy = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from('ads')
    .select('*')
    .eq('variant', 'comercio')
    .eq('activo', true)
    .not('lat', 'is', null)
    .not('lng', 'is', null)
    .or(`fecha_fin.is.null,fecha_fin.gte.${hoy}`);
  return data ?? [];
}

export async function listarAds(): Promise<Ad[]> {
  const { data, error } = await supabase
    .from('ads')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function crearAd(input: AdInput): Promise<void> {
  const { error } = await supabase.from('ads').insert(input);
  if (error) throw error;
}

export async function actualizarAd(id: string, input: Partial<AdInput>): Promise<void> {
  const { error } = await supabase.from('ads').update(input).eq('id', id);
  if (error) throw error;
}

export async function eliminarAd(id: string): Promise<void> {
  const { error } = await supabase.from('ads').delete().eq('id', id);
  if (error) throw error;
}

/** Activa ads en Supabase (requiere service role — solo server-side). */
export async function activarAds(adIds: string[]): Promise<void> {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const hoy = new Date().toISOString().slice(0, 10);
  const fin = new Date();
  fin.setMonth(fin.getMonth() + 1);
  const finStr = fin.toISOString().slice(0, 10);
  const results = await Promise.all(
    adIds.map((id) =>
      admin.from('ads').update({
        activo:       true,
        fecha_inicio: hoy,
        fecha_fin:    finStr,
      }).eq('id', id)
    )
  );
  const failed = results.filter((r) => r.error);
  if (failed.length > 0) throw new Error(`activarAds: ${failed.length} ad(s) no se pudieron activar`);
}

export async function subirLogoAd(file: File): Promise<string> {
  const ext  = file.name.split('.').pop() ?? 'jpg';
  const path = `ads/logo-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('posts').upload(path, file, { upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from('posts').getPublicUrl(path);
  return data.publicUrl;
}

export async function subirImagenAd(file: File): Promise<string> {
  const ext  = file.name.split('.').pop() ?? 'jpg';
  const path = `ads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('posts').upload(path, file, { upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from('posts').getPublicUrl(path);
  return data.publicUrl;
}
