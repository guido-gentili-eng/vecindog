-- Tabla de amistades entre usuarios de Vecindog
CREATE TABLE IF NOT EXISTS amistades (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitante_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receptor_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  estado         TEXT NOT NULL DEFAULT 'pendiente',  -- 'pendiente' | 'aceptada' | 'rechazada'
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (solicitante_id, receptor_id)
);

-- Index para buscar amistades de un usuario rápido
CREATE INDEX IF NOT EXISTS amistades_solicitante_idx ON amistades(solicitante_id);
CREATE INDEX IF NOT EXISTS amistades_receptor_idx    ON amistades(receptor_id);

-- RLS
ALTER TABLE amistades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios ven sus amistades" ON amistades
  FOR SELECT USING (auth.uid() = solicitante_id OR auth.uid() = receptor_id);

CREATE POLICY "Usuarios crean solicitudes" ON amistades
  FOR INSERT WITH CHECK (auth.uid() = solicitante_id);

CREATE POLICY "Receptor puede aceptar/rechazar" ON amistades
  FOR UPDATE USING (auth.uid() = receptor_id OR auth.uid() = solicitante_id);

CREATE POLICY "Usuarios pueden borrar sus amistades" ON amistades
  FOR DELETE USING (auth.uid() = solicitante_id OR auth.uid() = receptor_id);
