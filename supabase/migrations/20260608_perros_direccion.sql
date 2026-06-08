-- Agrega columna direccion a la tabla perros
alter table public.perros
  add column if not exists direccion text;
