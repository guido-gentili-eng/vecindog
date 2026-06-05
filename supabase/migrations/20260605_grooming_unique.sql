-- Unique constraint en grooming para evitar race conditions con upsert
alter table public.grooming
  add constraint if not exists grooming_perro_id_unique unique (perro_id);
