-- ALTO: "profiles_select_public" (SELECT, rol authenticated, qual=true)
-- dejaba que cualquier usuario logueado leyera TODAS las columnas de
-- CUALQUIER perfil via REST directo (select=*), incluyendo is_admin, plan,
-- suspendido, plan_trial_usado. La app solo necesita nombre/apellido/foto/
-- ciudad de otros usuarios (feature de amigos), asi que se restringe la
-- tabla a la fila propia y se crea una vista publica con solo esas columnas.

DROP POLICY IF EXISTS "profiles_select_public" ON public.profiles;

CREATE OR REPLACE VIEW public.profiles_public AS
SELECT id, nombre, apellido, foto_url, ciudad
FROM public.profiles;

GRANT SELECT ON public.profiles_public TO authenticated;
