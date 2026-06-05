-- 1. Campos de salud y dieta en perros
alter table public.perros
  add column if not exists estado_salud    text check (estado_salud in ('saludable','en_tratamiento','en_recuperacion')),
  add column if not exists dieta_marca     text,
  add column if not exists dieta_cantidad  text,
  add column if not exists dieta_frecuencia text,
  add column if not exists dieta_notas     text;

-- 2. Visitas al veterinario
create table if not exists public.visitas_vet (
  id          uuid default gen_random_uuid() primary key,
  perro_id    uuid references public.perros(id) on delete cascade not null,
  fecha       date not null,
  motivo      text not null,
  diagnostico text,
  tratamiento text,
  vet_nombre  text,
  notas       text,
  created_at  timestamptz default now() not null
);
alter table public.visitas_vet enable row level security;
create policy "Dueño gestiona sus visitas" on public.visitas_vet for all
  using (perro_id in (select id from public.perros where user_id = auth.uid()));

-- 3. Procedimientos / cirugías
create table if not exists public.procedimientos (
  id          uuid default gen_random_uuid() primary key,
  perro_id    uuid references public.perros(id) on delete cascade not null,
  fecha       date not null,
  tipo        text not null,
  descripcion text not null,
  vet_nombre  text,
  notas       text,
  created_at  timestamptz default now() not null
);
alter table public.procedimientos enable row level security;
create policy "Dueño gestiona sus procedimientos" on public.procedimientos for all
  using (perro_id in (select id from public.perros where user_id = auth.uid()));

-- 4. Galería de fotos del perro
create table if not exists public.fotos_perro (
  id          uuid default gen_random_uuid() primary key,
  perro_id    uuid references public.perros(id) on delete cascade not null,
  url         text not null,
  descripcion text,
  created_at  timestamptz default now() not null
);
alter table public.fotos_perro enable row level security;
create policy "Dueño gestiona sus fotos" on public.fotos_perro for all
  using (perro_id in (select id from public.perros where user_id = auth.uid()));

-- 5. Contactos de emergencia
create table if not exists public.contactos_emergencia (
  id        uuid default gen_random_uuid() primary key,
  perro_id  uuid references public.perros(id) on delete cascade not null,
  nombre    text not null,
  relacion  text,
  telefono  text not null,
  notas     text,
  created_at timestamptz default now() not null
);
alter table public.contactos_emergencia enable row level security;
create policy "Dueño gestiona sus contactos" on public.contactos_emergencia for all
  using (perro_id in (select id from public.perros where user_id = auth.uid()));

-- 6. Grooming (baño / peluquería)
create table if not exists public.grooming (
  id              uuid default gen_random_uuid() primary key,
  perro_id        uuid references public.perros(id) on delete cascade not null,
  ultima_fecha    date not null,
  frecuencia_dias integer not null default 30,
  tipo            text default 'ambos',
  notas           text,
  created_at      timestamptz default now() not null
);
alter table public.grooming enable row level security;
create policy "Dueño gestiona grooming" on public.grooming for all
  using (perro_id in (select id from public.perros where user_id = auth.uid()));
