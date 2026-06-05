-- Tabla turnos médicos del perro (ecografía / radiografía)
create table if not exists public.turnos (
  id          uuid default gen_random_uuid() primary key,
  perro_id    uuid references public.perros(id) on delete cascade not null,
  tipo        text not null check (tipo in ('radiografia', 'ecografia')),
  fecha       date not null,
  nota        text,
  created_at  timestamptz default now() not null
);

-- RLS
alter table public.turnos enable row level security;

create policy "Dueño gestiona sus turnos"
  on public.turnos for all
  using (
    perro_id in (select id from public.perros where user_id = auth.uid())
  );
