-- CRÍTICO: "ver perros publicamente" (SELECT, using(true), sin restricción de rol)
-- dejaba que cualquiera -- ni siquiera logueado, con la key anon publica --
-- leyera TODAS las columnas de TODOS los perros via REST directo (select=*),
-- incluyendo direccion (domicilio real del dueño), chip, vet_nombre,
-- vet_telefono, estado_salud, alergias y dieta_*. Mismo patron de bug que ya
-- se arreglo para profiles el 2026-07-08 (ver 20260708_restrict_profiles_
-- public_select.sql), pero nunca se aplico a perros.
--
-- Al borrar esta policy queda vigente la policy original "ver mis perros"
-- (auth.uid() = user_id, de supabase/migration.sql) que restringe la tabla
-- base a la fila propia. Los pocos usos legitimos de lectura publica
-- (busqueda de amigos por nombre de perro, ranking "mas escapistas") se
-- repuntan a una vista nueva con solo columnas no sensibles.
--
-- La pagina publica de historia clinica (/historia/[perroId]) usa el cliente
-- de service_role del lado del servidor, que bypasea RLS por completo, asi
-- que no depende de esta policy y sigue funcionando igual.

DROP POLICY IF EXISTS "ver perros publicamente" ON public.perros;

CREATE OR REPLACE VIEW public.perros_public AS
SELECT id, nombre, raza, color, tamano, foto_url, user_id
FROM public.perros;

GRANT SELECT ON public.perros_public TO authenticated;
GRANT SELECT ON public.perros_public TO anon;
