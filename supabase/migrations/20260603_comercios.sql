-- Agrega campos para comercios adheridos en la tabla ads
alter table public.ads
  add column if not exists lat               double precision,
  add column if not exists lng               double precision,
  add column if not exists telefono_comercio text,
  add column if not exists horario_apertura  text,
  add column if not exists horario_cierre    text,
  add column if not exists dias_atencion     text,
  add column if not exists direccion_comercio text,
  add column if not exists categoria_local   text;

-- Agrega 'comercio' como variante válida
alter table public.ads drop constraint if exists ads_variant_check;
alter table public.ads add constraint ads_variant_check
  check (variant in ('leaderboard', 'card', 'sidebar', 'comercio'));
