-- La pagina /publicitate (publica, sin login) muestra un contador de
-- "usuarios totales" contando filas de profiles desde el cliente. Al cerrar
-- el select publico de la tabla base, ese conteo tambien quedo bloqueado
-- para visitantes anonimos. La vista profiles_public solo expone columnas
-- no sensibles (nombre, apellido, foto, ciudad), asi que es segura de
-- exponer tambien a "anon".

GRANT SELECT ON public.profiles_public TO anon;
