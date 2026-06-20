-- El trial gratis de 3 meses se controlaba solo con profiles.plan_trial_usado,
-- que se borra en cascada si el usuario elimina su cuenta. Eso permitía
-- reclamar el trial de nuevo creando una cuenta nueva con el mismo email.
-- Esta tabla persiste el consumo del trial por email, independiente de la cuenta.

create table if not exists public.trial_usado_por_email (
  email      text primary key,
  used_at    timestamptz not null default now()
);

alter table public.trial_usado_por_email enable row level security;

-- Solo el service role (usado desde el endpoint server-side) puede leer/escribir.
-- No se exponen policies para anon/authenticated.
