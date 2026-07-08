-- CRITICO: "Service role inserta notificaciones" permitia INSERT a rol
-- "public" (cualquiera) con with_check = true, sin validar user_id.
-- Cualquiera podia insertar una notificacion con el user_id de otra persona
-- y contenido arbitrario (vector de spam/phishing en la campana de otro
-- usuario). El service role bypasea RLS por diseño de Supabase, asi que
-- los cron jobs (cumpleanos, vacunas, etc.) que insertan notificaciones via
-- service role siguen funcionando igual sin necesitar esta policy.

DROP POLICY IF EXISTS "Service role inserta notificaciones" ON public.notifications;
