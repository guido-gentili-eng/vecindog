-- Tabla de calificaciones de cuidadores de perros
create table if not exists public.cuidador_ratings (
  id                uuid primary key default gen_random_uuid(),
  cuidador_post_id  uuid not null references public.posts(id) on delete cascade,
  user_id           uuid not null references auth.users(id) on delete cascade,
  estrellas         integer not null check (estrellas between 1 and 5),
  cuidado_animal    text check (cuidado_animal in ('excelente', 'bueno', 'regular')),
  fue_puntual       boolean,
  buena_comunicacion boolean,
  lo_recomendaria   boolean,
  comentario        text,
  created_at        timestamptz default now(),
  unique (cuidador_post_id, user_id)   -- un usuario, una calificación por cuidador
);

-- RLS
alter table public.cuidador_ratings enable row level security;

create policy "Cualquiera puede leer calificaciones"
  on public.cuidador_ratings for select using (true);

create policy "Usuario autenticado puede insertar su propia calificación"
  on public.cuidador_ratings for insert
  with check (auth.uid() = user_id);

create policy "Usuario puede actualizar su propia calificación"
  on public.cuidador_ratings for update
  using (auth.uid() = user_id);
