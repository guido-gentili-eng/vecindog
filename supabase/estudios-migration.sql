-- Tabla estudios médicos del perro
create table if not exists public.estudios (
  id          uuid default gen_random_uuid() primary key,
  perro_id    uuid references public.perros(id) on delete cascade not null,
  tipo        text not null check (tipo in ('laboratorio', 'radiografia', 'ecografia')),
  nombre      text not null,
  archivo_url text not null,
  fecha       date,
  notas       text,
  created_at  timestamptz default now() not null
);

-- RLS
alter table public.estudios enable row level security;

create policy "Dueño gestiona sus estudios"
  on public.estudios for all
  using (
    perro_id in (select id from public.perros where user_id = auth.uid())
  );

-- Storage bucket (ejecutar en Storage > New bucket)
-- Nombre: estudios  |  Public: true
