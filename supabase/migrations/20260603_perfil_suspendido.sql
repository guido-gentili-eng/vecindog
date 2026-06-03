-- Agrega campo suspendido a profiles para pausar cuentas
alter table public.profiles
  add column if not exists suspendido boolean not null default false;
