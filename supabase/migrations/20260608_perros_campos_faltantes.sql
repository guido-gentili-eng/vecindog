-- Agrega columnas faltantes a la tabla perros
alter table public.perros
  add column if not exists alergias     text,
  add column if not exists vet_nombre   text,
  add column if not exists vet_telefono text;
