import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnon) {
  throw new Error('Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL y/o NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl!, supabaseAnon!, {
  auth: {
    storage:           typeof window !== 'undefined' ? window.localStorage : undefined,
    autoRefreshToken:  typeof window !== 'undefined',
    detectSessionInUrl: typeof window !== 'undefined',
    persistSession:    typeof window !== 'undefined',
  },
});

/* ---- tipos que reflejan las tablas ---- */

export interface PostRow {
  id?: string;
  created_at?: string;
  categoria: 'perdido' | 'encontrado' | 'adopcion';
  especie: string;
  nombre?: string;
  descripcion: string;
  zona: string;
  fecha: string;    // ISO date  'YYYY-MM-DD'
  horario?: string; // 'HH:MM'
  contacto: string;
  images: string[];
}

export interface AdoptionRequestRow {
  id?: string;
  created_at?: string;
  nombre: string;
  dni: string;
  edad: number;
  telefono: string;
  email: string;
  direccion: string;
  zona: string;
  tipo_vivienda: string;
  tenencia: string;
  propietario_permite?: string;
  tiene_patio: string;
  patio_fechado?: string;
  cant_personas: number;
  hay_ninos: string;
  edades_ninos?: string;
  todos_de_acuerdo: string;
  alergias: string;
  mascotas_actuales: string;
  detalle_mascotas?: string;
  mascotas_vacunadas?: string;
  mascotas_anteriores: string;
  que_paso_con_ellas?: string;
  horas_solo: string;
  tamano_preferido: string;
  edad_preferida: string;
  perro_en_mente?: string;
  motivacion: string;
}
