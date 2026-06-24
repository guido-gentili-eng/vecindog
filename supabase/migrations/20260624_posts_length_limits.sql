-- MEDIO: no había límite de longitud server-side en posts.nombre/descripcion/zona,
-- solo el cliente podía validarlo (y se puede saltear). Se agregan check
-- constraints como defensa real contra inputs abusivos.

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'posts_nombre_len') then
    alter table public.posts add constraint posts_nombre_len check (char_length(nombre) <= 100);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'posts_descripcion_len') then
    alter table public.posts add constraint posts_descripcion_len check (char_length(descripcion) <= 2000);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'posts_zona_len') then
    alter table public.posts add constraint posts_zona_len check (char_length(zona) <= 200);
  end if;
end $$;
