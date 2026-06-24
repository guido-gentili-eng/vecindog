-- Migration: las policies posts_update/posts_delete seguían comparando
-- auth.email() contra un email hardcodeado en vez de usar la columna
-- is_admin (agregada en migration-005-is-admin.sql). Esto generaba doble
-- fuente de verdad: el frontend muestra el panel de gestión a cualquier
-- cuenta con is_admin=true, pero la base solo dejaba pasar el update/delete
-- al email original. Se corrige para que ambas fuentes coincidan.

drop policy if exists "posts_update" on public.posts;
create policy "posts_update" on public.posts
  for update using (
    auth.uid() = user_id
    or exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

drop policy if exists "posts_delete" on public.posts;
create policy "posts_delete" on public.posts
  for delete using (
    auth.uid() = user_id
    or exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

-- ALTA: "storage_posts_delete" (migration.sql:135) permitía borrar CUALQUIER
-- archivo del bucket "posts" a cualquier usuario, sin chequear ownership.
-- Se restringe a: el usuario que subió el archivo (storage.objects.owner)
-- o un admin (is_admin=true en profiles).
drop policy if exists "storage_posts_delete" on storage.objects;
create policy "storage_posts_delete" on storage.objects
  for delete using (
    bucket_id = 'posts'
    and (
      owner = auth.uid()
      or exists (
        select 1 from public.profiles
        where profiles.id = auth.uid() and profiles.is_admin = true
      )
    )
  );
