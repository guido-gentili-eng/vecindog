-- Agrega 'transportador_disponible' al check constraint de categoría
alter table public.posts
  drop constraint if exists posts_categoria_check;

alter table public.posts
  add constraint posts_categoria_check
  check (categoria in (
    'perdido',
    'encontrado',
    'adopcion',
    'transito',
    'busco_cuidador',
    'cuidador_disponible',
    'transportador_disponible'
  ));
