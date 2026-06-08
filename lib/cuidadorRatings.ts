import { supabase } from './supabase';

export interface CuidadorRating {
  id:                string;
  cuidador_post_id:  string;
  user_id:           string;
  estrellas:         number;          // 1-5
  cuidado_animal:    'excelente' | 'bueno' | 'regular' | null;
  fue_puntual:       boolean | null;
  buena_comunicacion: boolean | null;
  lo_recomendaria:   boolean | null;
  comentario:        string | null;
  created_at:        string;
}

export interface ResumenRating {
  promedio:        number;   // 0-5
  total:           number;
  miRating:        CuidadorRating | null;
  recomendaciones: number;  // % que lo recomendaría
}

/** Trae todos los ratings de un cuidador + resumen. */
export async function getRatingsCuidador(cuidadorPostId: string): Promise<{
  ratings: CuidadorRating[];
  resumen: ResumenRating;
}> {
  const [{ data: rows }, { data: { user } }] = await Promise.all([
    supabase
      .from('cuidador_ratings')
      .select('id, cuidador_post_id, user_id, estrellas, cuidado_animal, fue_puntual, buena_comunicacion, lo_recomendaria, comentario, created_at')
      .eq('cuidador_post_id', cuidadorPostId)
      .order('created_at', { ascending: false }),
    supabase.auth.getUser(),
  ]);

  const ratings = (rows ?? []) as CuidadorRating[];
  if (ratings.length === 0) {
    return { ratings: [], resumen: { promedio: 0, total: 0, miRating: null, recomendaciones: 0 } };
  }

  const promedio   = ratings.reduce((s, r) => s + r.estrellas, 0) / ratings.length;
  const recCount   = ratings.filter((r) => r.lo_recomendaria === true).length;
  const miRating   = ratings.find((r) => r.user_id === user?.id) ?? null;

  return {
    ratings,
    resumen: {
      promedio:        Math.round(promedio * 10) / 10,
      total:           ratings.length,
      miRating,
      recomendaciones: Math.round((recCount / ratings.length) * 100),
    },
  };
}

/** Guarda o actualiza la calificación del usuario para un cuidador. */
export async function calificarCuidador(input: {
  cuidadorPostId:   string;
  estrellas:        number;
  cuidado_animal:   'excelente' | 'bueno' | 'regular' | null;
  fue_puntual:      boolean | null;
  buena_comunicacion: boolean | null;
  lo_recomendaria:  boolean | null;
  comentario:       string;
}): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Tenés que iniciar sesión para calificar.');

  const { error } = await supabase.from('cuidador_ratings').upsert(
    {
      cuidador_post_id:   input.cuidadorPostId,
      user_id:            user.id,
      estrellas:          input.estrellas,
      cuidado_animal:     input.cuidado_animal,
      fue_puntual:        input.fue_puntual,
      buena_comunicacion: input.buena_comunicacion,
      lo_recomendaria:    input.lo_recomendaria,
      comentario:         input.comentario.trim() || null,
    },
    { onConflict: 'cuidador_post_id,user_id' },
  );
  if (error) throw error;
}
