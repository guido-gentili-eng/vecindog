-- Política UPDATE faltante en vacunas
create policy "actualizar vacunas"
  on public.vacunas for update
  using (
    exists (select 1 from public.perros where id = vacunas.perro_id and user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.perros where id = vacunas.perro_id and user_id = auth.uid())
  );

-- Tabla pesos del perro (con RLS completa)
create table if not exists public.pesos (
  id         uuid default gen_random_uuid() primary key,
  perro_id   uuid references public.perros(id) on delete cascade not null,
  fecha      date not null,
  valor_kg   numeric(6,2) not null,
  notas      text,
  created_at timestamptz default now() not null
);

alter table public.pesos enable row level security;

create policy "owner select pesos"
  on public.pesos for select
  using (
    exists (select 1 from public.perros where id = pesos.perro_id and user_id = auth.uid())
  );

create policy "owner insert pesos"
  on public.pesos for insert
  with check (
    exists (select 1 from public.perros where id = pesos.perro_id and user_id = auth.uid())
  );

create policy "owner update pesos"
  on public.pesos for update
  using (
    exists (select 1 from public.perros where id = pesos.perro_id and user_id = auth.uid())
  );

create policy "owner delete pesos"
  on public.pesos for delete
  using (
    exists (select 1 from public.perros where id = pesos.perro_id and user_id = auth.uid())
  );
