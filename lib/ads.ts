import { createClient } from '@supabase/supabase-js';
import { supabase } from './supabase';

export type AdVariant = 'leaderboard' | 'card' | 'sidebar';

export interface Ad {
  id:          string;
  variant:     AdVariant;
  titulo:      string;
  subtitulo:   string | null;
  imagen_url:  string | null;
  href:        string;
  cta:         string | null;
  anunciante:  string | null;
  plan:        'basico' | 'estandar' | 'premium';
  activo:      boolean;
  fecha_inicio: string | null;
  fecha_fin:   string | null;
  created_at:  string;
}

export type AdInput = Omit<Ad, 'id' | 'created_at'>;

export async function getAdForSlot(variant: AdVariant): Promise<Ad | null> {
  const hoy = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from('ads')
    .select('*')
    .eq('variant', variant)
    .eq('activo', true)
    .or(`fecha_fin.is.null,fecha_fin.gte.${hoy}`)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  return data ?? null;
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
  await Promise.all(
    adIds.map((id) =>
      admin.from('ads').update({
        activo:       true,
        fecha_inicio: hoy,
        fecha_fin:    finStr,
      }).eq('id', id)
    )
  );
}

export async function subirImagenAd(file: File): Promise<string> {
  const ext  = file.name.split('.').pop() ?? 'jpg';
  const path = `ads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('posts').upload(path, file, { upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from('posts').getPublicUrl(path);
  return data.publicUrl;
}
