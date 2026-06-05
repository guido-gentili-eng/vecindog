-- Agrega columna localidad_comercio a ads para poder contar cupos por ciudad
alter table public.ads
  add column if not exists localidad_comercio text;
