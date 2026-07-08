-- CRITICO: la policy de SELECT en mensajes solo exigia "auth.uid() IS NOT NULL",
-- es decir cualquier usuario autenticado podia leer TODOS los mensajes privados
-- de TODOS los avisos (via REST directo con la anon key, sin pasar por la app).
-- Se reemplaza por: solo puede leer mensajes de un hilo el remitente o el dueño del aviso.

DROP POLICY IF EXISTS "Leer mensajes de aviso" ON mensajes;

CREATE POLICY "Leer mensajes propios o de mi aviso" ON mensajes
  FOR SELECT
  USING (
    auth.uid() = sender_id
    OR auth.uid() = (SELECT user_id FROM posts WHERE posts.id = mensajes.post_id)
  );
