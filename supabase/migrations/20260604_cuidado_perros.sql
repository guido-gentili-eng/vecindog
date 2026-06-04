-- Agrega soporte para las categorías de cuidado de perros
-- Ejecutar en Supabase SQL Editor

-- Actualiza el check constraint de categoría para incluir las nuevas categorías
alter table public.posts
  drop constraint if exists posts_categoria_check;

alter table public.posts
  add constraint posts_categoria_check
  check (categoria in ('perdido', 'encontrado', 'adopcion', 'transito', 'busco_cuidador', 'cuidador_disponible'));
