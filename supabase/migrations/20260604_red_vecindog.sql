-- Red Vecindog: asegura que plan acepta 'comercio' como valor válido
alter table public.ads drop constraint if exists ads_plan_check;
alter table public.ads add constraint ads_plan_check
  check (plan in ('basico', 'estandar', 'premium', 'comercio'));
