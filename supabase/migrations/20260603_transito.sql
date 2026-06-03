-- Agrega soporte para la categoría "en tránsito"
alter table public.posts
  add column if not exists situacion_transito    text check (situacion_transito in ('tengo', 'calle')),
  add column if not exists fecha_limite_transito date;

-- Actualiza el check constraint de categoría para incluir 'transito'
alter table public.posts drop constraint if exists posts_categoria_check;
alter table public.posts
  add constraint posts_categoria_check
  check (categoria in ('perdido','encontrado','adopcion','transito'));
