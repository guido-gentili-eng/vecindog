-- Cierra una condición de carrera (TOCTOU): el límite de avisos activos y de
-- perros por cuenta free se chequeaba solo del lado del cliente antes del
-- insert, así que dos pestañas/requests en paralelo del mismo usuario podían
-- saltarse el límite. Estos triggers lo hacen atómico a nivel de base de datos.

create or replace function public.es_usuario_pro(p_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (
      select is_admin = true
        or (plan = 'pro' and (plan_vencimiento is null or plan_vencimiento::date >= current_date))
      from public.profiles
      where id = p_user_id
    ),
    false
  );
$$;

-- ── Límite de avisos activos (5 para cuentas free) ──

create or replace function public.checar_limite_posts()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  activos int;
begin
  if new.user_id is null then
    return new;
  end if;

  if public.es_usuario_pro(new.user_id) then
    return new;
  end if;

  select count(*) into activos
  from public.posts
  where user_id = new.user_id
    and estado <> 'resuelto'
    and categoria in ('perdido', 'encontrado', 'adopcion', 'transito');

  if activos >= 5 then
    raise exception 'Límite de 5 avisos activos alcanzado para cuentas free'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_limite_posts on public.posts;
create trigger trg_limite_posts
  before insert on public.posts
  for each row
  execute function public.checar_limite_posts();

-- ── Límite de perros (1 para cuentas free) ──

create or replace function public.checar_limite_perros()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  total int;
begin
  if new.user_id is null then
    return new;
  end if;

  if public.es_usuario_pro(new.user_id) then
    return new;
  end if;

  select count(*) into total
  from public.perros
  where user_id = new.user_id;

  if total >= 1 then
    raise exception 'Límite de 1 perro alcanzado para cuentas free'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_limite_perros on public.perros;
create trigger trg_limite_perros
  before insert on public.perros
  for each row
  execute function public.checar_limite_perros();
