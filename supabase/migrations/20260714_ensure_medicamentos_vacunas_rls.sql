-- El esquema y las políticas de `medicamentos` (supabase/medicamentos-migration.sql)
-- y buena parte de las de `vacunas` (supabase/migration.sql) viven en archivos
-- SUELTOS fuera de supabase/migrations/, que es la única carpeta que el CLI
-- de Supabase aplica de forma versionada. No hay manera de confirmar desde el
-- repo si esos archivos sueltos se corrieron alguna vez contra la base real.
-- Esta migración es puramente idempotente (create/drop if exists) y garantiza
-- que ambas tablas y sus políticas de ownership queden aplicadas y versionadas,
-- sin importar el historial.

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

alter table public.medicamentos enable row level security;

drop policy if exists "Dueño gestiona sus medicamentos" on public.medicamentos;
create policy "Dueño gestiona sus medicamentos"
  on public.medicamentos for all
  using (
    perro_id in (select id from public.perros where user_id = auth.uid())
  );

create table if not exists public.vacunas (
  id          uuid primary key default gen_random_uuid(),
  perro_id    uuid references public.perros(id) on delete cascade not null,
  nombre      text not null,
  fecha       date not null,
  veterinario text,
  proxima     date,
  notas       text,
  created_at  timestamptz default now()
);

alter table public.vacunas enable row level security;

drop policy if exists "ver mis vacunas" on public.vacunas;
create policy "ver mis vacunas" on public.vacunas for select using (
  exists (select 1 from public.perros where id = vacunas.perro_id and user_id = auth.uid())
);

drop policy if exists "agregar vacunas" on public.vacunas;
create policy "agregar vacunas" on public.vacunas for insert with check (
  exists (select 1 from public.perros where id = vacunas.perro_id and user_id = auth.uid())
);

drop policy if exists "borrar vacunas" on public.vacunas;
create policy "borrar vacunas" on public.vacunas for delete using (
  exists (select 1 from public.perros where id = vacunas.perro_id and user_id = auth.uid())
);

-- La policy de UPDATE de vacunas ya está versionada en
-- 20260611_vacunas_update_policy_pesos.sql, no se repite acá.
