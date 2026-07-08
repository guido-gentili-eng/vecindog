-- BAJO: el bloqueo de "no podes calificar tu propia publicacion" solo existia
-- en el cliente (lib/cuidadorRatings.ts, lib/transportadorRatings.ts).
-- Via curl con la anon key, el dueño de un post de cuidado/transporte podia
-- auto-calificarse para inflar su propio rating. Se agrega la restriccion
-- directamente en el WITH CHECK del INSERT.

DROP POLICY IF EXISTS "Usuario autenticado puede insertar su propia calificación" ON public.cuidador_ratings;
CREATE POLICY "Usuario autenticado puede insertar su propia calificación"
  ON public.cuidador_ratings FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (
      SELECT 1 FROM public.posts p
      WHERE p.id = cuidador_post_id AND p.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Usuario autenticado puede insertar su propia calificación de transportador" ON public.transportador_ratings;
CREATE POLICY "Usuario autenticado puede insertar su propia calificación de transportador"
  ON public.transportador_ratings FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (
      SELECT 1 FROM public.posts p
      WHERE p.id = transportador_post_id AND p.user_id = auth.uid()
    )
  );
