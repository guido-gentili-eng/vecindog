import { createClient } from '@supabase/supabase-js';

/**
 * Rate limit atómico respaldado por Postgres (función check_rate_limit).
 * A diferencia de un Map en memoria, persiste entre invocaciones serverless.
 * Fail-open: si falla la consulta, no bloquea el flujo.
 */
export async function checkRateLimit(key: string, max: number, windowSeconds: number): Promise<boolean> {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data, error } = await admin.rpc('check_rate_limit', {
    p_key: key,
    p_max: max,
    p_window_seconds: windowSeconds,
  });
  if (error) {
    console.error('[rateLimit]', error);
    return true;
  }
  return data as boolean;
}
