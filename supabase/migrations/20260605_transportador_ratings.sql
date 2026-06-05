-- Tabla de calificaciones de transportadores de perros
create table if not exists public.transportador_ratings (
  id                    uuid primary key default gen_random_uuid(),
  transportador_post_id uuid not null references public.posts(id) on delete cascade,
  user_id               uuid not null references auth.users(id) on delete cascade,
  estrellas             integer not null check (estrellas between 1 and 5),
  cuidado_animal        text check (cuidado_animal in ('excelente', 'bueno', 'regular')),
  fue_puntual           boolean,
  buena_comunicacion    boolean,
  lo_recomendaria       boolean,
  comentario            text,
  created_at            timestamptz default now(),
  unique (transportador_post_id, user_id)   -- un usuario, una calificación por transportador
);

-- RLS
alter table public.transportador_ratings enable row level security;

create policy "Cualquiera puede leer calificaciones de transportadores"
  on public.transportador_ratings for select using (true);

create policy "Usuario autenticado puede insertar su propia calificación de transportador"
  on public.transportador_ratings for insert
  with check (auth.uid() = user_id);

create policy "Usuario puede actualizar su propia calificación de transportador"
  on public.transportador_ratings for update
  using (auth.uid() = user_id);
