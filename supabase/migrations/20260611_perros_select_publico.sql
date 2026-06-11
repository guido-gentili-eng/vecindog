-- Permite que cualquier usuario (autenticado o no) pueda leer perros de otros
-- usuarios. Necesario para la búsqueda de amigos (AmigosPanel) y para el
-- escaneo de QR / página pública de historia del perro.
-- Las políticas de INSERT/UPDATE/DELETE siguen restringidas al dueño.
drop policy if exists "ver perros publicamente" on public.perros;
create policy "ver perros publicamente"
  on public.perros for select
  using (true);
