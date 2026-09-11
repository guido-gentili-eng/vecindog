-- Agrega lat/lng a perros para poder confirmar el pin en el mapa de la
-- dirección de "tu casa", igual que ya se hace al publicar un perro
-- perdido/encontrado. Antes solo se guardaba el texto de la dirección,
-- así que ajustar el pin en el mapa no tenía dónde persistirse.
--
-- No se agregan a la vista pública perros_public (ver
-- 20260714_restrict_perros_public_select.sql) — lat/lng son al menos tan
-- sensibles como direccion (domicilio real del dueño), que esa migración
-- ya dejó afuera de la vista pública a propósito.

alter table public.perros add column if not exists lat double precision;
alter table public.perros add column if not exists lng double precision;
