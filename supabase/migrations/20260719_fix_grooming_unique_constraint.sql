-- supabase/migrations/20260605_grooming_unique.sql tenía SQL inválido:
-- "add constraint if not exists" no existe en Postgres (ese modificador
-- solo aplica a DROP CONSTRAINT). Si se corrió tal cual contra producción,
-- tiró error de sintaxis y el constraint nunca quedó creado. Sin él,
-- lib/grooming.ts hace `.upsert(grooming, { onConflict: 'perro_id' })`,
-- que requiere justamente este unique/exclusion constraint — el primer
-- guardado de grooming para cada perro falla con "there is no unique or
-- exclusion constraint matching the ON CONFLICT specification".
--
-- Esta migración es idempotente: si el constraint ya existe (por ejemplo,
-- si alguien lo creó a mano) no hace nada.
do $$
begin
  alter table public.grooming
    add constraint grooming_perro_id_unique unique (perro_id);
exception
  when duplicate_object then null;  -- el constraint ya existe
  when duplicate_table  then null;  -- el índice que respalda el constraint ya existe
end $$;
