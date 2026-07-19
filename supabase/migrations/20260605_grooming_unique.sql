-- Unique constraint en grooming para evitar race conditions con upsert
-- (ADD CONSTRAINT no soporta IF NOT EXISTS en Postgres; se envuelve en un
-- bloque que ignora el error si el constraint ya existe, para que sea
-- re-ejecutable de forma segura).
do $$
begin
  alter table public.grooming
    add constraint grooming_perro_id_unique unique (perro_id);
exception
  when duplicate_object then null;
  when duplicate_table  then null;
end $$;
