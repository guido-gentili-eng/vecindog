-- Patitas App — Migración inicial
-- Ejecutar en: https://supabase.com/dashboard/project/ptjyvhiimvmknzpcbzih/sql/new

-- ══════════════════════════════════════════════════════
-- MIGRACIÓN 2: Mis Perros (perros + vacunas)
-- ══════════════════════════════════════════════════════

create table if not exists public.perros (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade not null,
  nombre       text not null,
  raza         text,
  color        text,
  tamano       text check (tamano in ('pequeño', 'mediano', 'grande')),
  sexo         text check (sexo in ('macho', 'hembra')),
  fecha_nac    date,
  chip         text,
  esterilizado boolean default false,
  descripcion  text,
  direccion    text,
  foto_url     text,
  created_at   timestamptz default now()
);

-- Si la tabla ya existía, agregar la columna direccion:
alter table public.perros add column if not exists direccion text;

alter table public.perros enable row level security;
create policy "ver mis perros"        on public.perros for select using (auth.uid() = user_id);
create policy "crear mis perros"      on public.perros for insert with check (auth.uid() = user_id);
create policy "actualizar mis perros" on public.perros for update using (auth.uid() = user_id);
create policy "borrar mis perros"     on public.perros for delete using (auth.uid() = user_id);

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
create policy "ver mis vacunas"    on public.vacunas for select using (
  exists (select 1 from public.perros where id = vacunas.perro_id and user_id = auth.uid())
);
create policy "agregar vacunas"    on public.vacunas for insert with check (
  exists (select 1 from public.perros where id = vacunas.perro_id and user_id = auth.uid())
);
create policy "borrar vacunas"     on public.vacunas for delete using (
  exists (select 1 from public.perros where id = vacunas.perro_id and user_id = auth.uid())
);

-- ══════════════════════════════════════════════════════

create table if not exists public.posts (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  categoria   text not null check (categoria in ('perdido','encontrado','adopcion')),
  especie     text not null default 'perro',
  nombre      text,
  raza        text,
  color       text,
  tamano      text check (tamano in ('pequeño','mediano','grande')),
  collar      boolean,
  chapita     boolean,
  descripcion text not null,
  zona        text not null,
  fecha       date not null,
  horario     time,
  contacto    text not null,
  images      text[] not null default '{}'
);

-- Si la tabla ya existía, agregar las columnas nuevas:
alter table public.posts add column if not exists raza    text;
alter table public.posts add column if not exists color   text;
alter table public.posts add column if not exists tamano  text check (tamano in ('pequeño','mediano','grande'));
alter table public.posts add column if not exists collar  boolean;
alter table public.posts add column if not exists chapita boolean;

create table if not exists public.adoption_requests (
  id                   uuid primary key default gen_random_uuid(),
  created_at           timestamptz not null default now(),
  nombre               text not null,
  dni                  text not null,
  edad                 int  not null,
  telefono             text not null,
  email                text not null,
  direccion            text not null,
  zona                 text not null,
  tipo_vivienda        text not null,
  tenencia             text not null,
  propietario_permite  text,
  tiene_patio          text not null,
  patio_fechado        text,
  cant_personas        int  not null,
  hay_ninos            text not null,
  edades_ninos         text,
  todos_de_acuerdo     text not null,
  alergias             text not null,
  mascotas_actuales    text not null,
  detalle_mascotas     text,
  mascotas_vacunadas   text,
  mascotas_anteriores  text not null,
  que_paso_con_ellas   text,
  horas_solo           text not null,
  tamano_preferido     text not null,
  edad_preferida       text not null,
  perro_en_mente       text,
  motivacion           text not null
);

-- Row Level Security
alter table public.posts enable row level security;
alter table public.adoption_requests enable row level security;

create policy "posts_select"    on public.posts for select using (true);
create policy "posts_insert"    on public.posts for insert with check (true);
create policy "adoption_insert" on public.adoption_requests for insert with check (true);

-- Storage bucket para fotos
insert into storage.buckets (id, name, public)
  values ('posts', 'posts', true)
  on conflict (id) do nothing;

create policy "storage_posts_select" on storage.objects
  for select using (bucket_id = 'posts');

create policy "storage_posts_insert" on storage.objects
  for insert with check (bucket_id = 'posts');

create policy "storage_posts_delete" on storage.objects
  for delete using (bucket_id = 'posts');

-- ══════════════════════════════════════════════════════
-- MIGRACIÓN 3: Ownership y estado de posts
-- ══════════════════════════════════════════════════════

-- Quién publicó el aviso (nullable → invitados sin cuenta)
alter table public.posts
  add column if not exists user_id uuid references auth.users(id) on delete set null;

-- Estado del aviso: activo (visible) o resuelto (oculto de la lista)
alter table public.posts
  add column if not exists estado text default 'activo'
    check (estado in ('activo', 'resuelto'));

-- Política update: solo el dueño o el admin
create policy "posts_update" on public.posts
  for update using (
    auth.uid() = user_id
    or auth.email() = 'guido-gentili@live.com.ar'
  );

-- Política delete: solo el dueño o el admin
create policy "posts_delete" on public.posts
  for delete using (
    auth.uid() = user_id
    or auth.email() = 'guido-gentili@live.com.ar'
  );

-- ══════════════════════════════════════════════════════
-- MIGRACIÓN 4: Coordenadas GPS para el mapa
-- ══════════════════════════════════════════════════════

-- Coordenadas opcionales para mostrar el aviso en el mapa interactivo
alter table public.posts
  add column if not exists lat float8;

alter table public.posts
  add column if not exists lng float8;
