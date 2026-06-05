-- Tabla medicamentos del perro
create table if not exists public.medicamentos (
  id           uuid default gen_random_uuid() primary key,
  perro_id     uuid references public.perros(id) on delete cascade not null,
  nombre       text not null,
  dosis        text,
  frecuencia   text,
  fecha_inicio date not null,
  fecha_fin    date,
  activo       boolean default true not null,
  notas        text,
  created_at   timestamptz default now() not null
);

-- RLS
alter table public.medicamentos enable row level security;

create policy "Dueño gestiona sus medicamentos"
  on public.medicamentos for all
  using (
    perro_id in (select id from public.perros where user_id = auth.uid())
  );
