-- La policy de UPDATE en amistades permitía que el SOLICITANTE también
-- actualizara la fila (incluyendo poner estado='aceptada'), lo que le permite
-- auto-aceptar su propia solicitud sin que el receptor haga nada. Solo el
-- receptor acepta/rechaza vía UPDATE; cancelar una solicitud propia se hace
-- por DELETE (ver rechazarEliminarAmistad en lib/amistades.ts), que sí sigue
-- permitido para ambas partes.
DROP POLICY IF EXISTS "Receptor puede aceptar/rechazar" ON amistades;
CREATE POLICY "Receptor puede aceptar/rechazar" ON amistades
  FOR UPDATE USING (auth.uid() = receptor_id);
