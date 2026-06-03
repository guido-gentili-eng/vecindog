-- Agrega plan y fecha de vencimiento al perfil del usuario
alter table public.profiles
  add column if not exists plan             text not null default 'free'
    check (plan in ('free', 'pro')),
  add column if not exists plan_vencimiento date;
