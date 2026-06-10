-- Tabla de desparasitaciones por perro
create table if not exists public.desparasitaciones (
  id           uuid primary key default gen_random_uuid(),
  perro_id     uuid not null references public.perros(id) on delete cascade,
  producto     text not null,
  tipo         text not null default 'ambas' check (tipo in ('interna', 'externa', 'ambas')),
  fecha        date not null,
  proxima      date,
  veterinario  text,
  notas        text,
  created_at   timestamptz not null default now()
);

-- Índice para listar rápido por perro
create index if not exists desparasitaciones_perro_idx on public.desparasitaciones(perro_id);

-- RLS: solo el dueño del perro puede ver/gestionar sus desparasitaciones
alter table public.desparasitaciones enable row level security;

create policy "owner select desparasitaciones"
  on public.desparasitaciones for select
  using (
    exists (
      select 1 from public.perros
      where perros.id = desparasitaciones.perro_id
        and perros.user_id = auth.uid()
    )
  );

create policy "owner insert desparasitaciones"
  on public.desparasitaciones for insert
  with check (
    exists (
      select 1 from public.perros
      where perros.id = desparasitaciones.perro_id
        and perros.user_id = auth.uid()
    )
  );

create policy "owner update desparasitaciones"
  on public.desparasitaciones for update
  using (
    exists (
      select 1 from public.perros
      where perros.id = desparasitaciones.perro_id
        and perros.user_id = auth.uid()
    )
  );

create policy "owner delete desparasitaciones"
  on public.desparasitaciones for delete
  using (
    exists (
      select 1 from public.perros
      where perros.id = desparasitaciones.perro_id
        and perros.user_id = auth.uid()
    )
  );
