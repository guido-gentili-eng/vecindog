-- BAJO: cotizacion-laboratorio y ai-help usaban un Map en memoria de proceso
-- para el rate limit. En serverless (Vercel) cada instancia tiene su propio
-- estado y se recicla constantemente, asi que el limite era mucho mas debil
-- de lo que aparentaba. Se reemplaza por una tabla + funcion atomica en
-- Postgres (mismo patron que checar_limite_posts/perros).

CREATE TABLE IF NOT EXISTS public.rate_limits (
  key      text PRIMARY KEY,
  count    int  NOT NULL DEFAULT 1,
  reset_at timestamptz NOT NULL
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_only" ON public.rate_limits USING (false);

CREATE OR REPLACE FUNCTION public.check_rate_limit(p_key text, p_max int, p_window_seconds int)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count int;
BEGIN
  INSERT INTO public.rate_limits (key, count, reset_at)
  VALUES (p_key, 1, now() + (p_window_seconds || ' seconds')::interval)
  ON CONFLICT (key) DO UPDATE
    SET count    = CASE WHEN rate_limits.reset_at < now() THEN 1 ELSE rate_limits.count + 1 END,
        reset_at = CASE WHEN rate_limits.reset_at < now() THEN now() + (p_window_seconds || ' seconds')::interval ELSE rate_limits.reset_at END
  RETURNING count INTO v_count;

  RETURN v_count <= p_max;
END;
$$;
