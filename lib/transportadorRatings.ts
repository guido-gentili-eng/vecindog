import { supabase } from './supabase';

export interface TransportadorRating {
  id:                     string;
  transportador_post_id:  string;
  user_id:                string;
  estrellas:              number;
  cuidado_animal:         'excelente' | 'bueno' | 'regular' | null;
  fue_puntual:            boolean | null;
  buena_comunicacion:     boolean | null;
  lo_recomendaria:        boolean | null;
  comentario:             string | null;
  created_at:             string;
}

export interface ResumenRatingTransportador {
  promedio:        number;
  total:           number;
  miRating:        TransportadorRating | null;
  recomendaciones: number;
}

export async function getRatingsTransportador(transportadorPostId: string): Promise<{
  ratings: TransportadorRating[];
  resumen: ResumenRatingTransportador;
}> {
  const [{ data: rows }, { data: { user } }] = await Promise.all([
    supabase
      .from('transportador_ratings')
      .select('*')
      .eq('transportador_post_id', transportadorPostId)
      .order('created_at', { ascending: false }),
    supabase.auth.getUser(),
  ]);

  const ratings = (rows ?? []) as TransportadorRating[];
  if (ratings.length === 0) {
    return { ratings: [], resumen: { promedio: 0, total: 0, miRating: null, recomendaciones: 0 } };
  }

  const promedio = ratings.reduce((s, r) => s + r.estrellas, 0) / ratings.length;
  const recCount = ratings.filter((r) => r.lo_recomendaria === true).length;
  const miRating = ratings.find((r) => r.user_id === user?.id) ?? null;

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

export async function calificarTransportador(input: {
  transportadorPostId: string;
  estrellas:           number;
  cuidado_animal:      'excelente' | 'bueno' | 'regular' | null;
  fue_puntual:         boolean | null;
  buena_comunicacion:  boolean | null;
  lo_recomendaria:     boolean | null;
  comentario:          string;
}): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Tenés que iniciar sesión para calificar.');

  const { error } = await supabase.from('transportador_ratings').upsert(
    {
      transportador_post_id: input.transportadorPostId,
      user_id:               user.id,
      estrellas:             input.estrellas,
      cuidado_animal:        input.cuidado_animal,
      fue_puntual:           input.fue_puntual,
      buena_comunicacion:    input.buena_comunicacion,
      lo_recomendaria:       input.lo_recomendaria,
      comentario:            input.comentario.trim() || null,
    },
    { onConflict: 'transportador_post_id,user_id' },
  );
  if (error) throw error;
}
