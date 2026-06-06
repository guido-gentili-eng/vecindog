-- Novedades / ofertas publicadas por comercios
CREATE TABLE IF NOT EXISTS novedades (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ad_id       uuid REFERENCES ads(id) ON DELETE CASCADE NOT NULL,
  titulo      text NOT NULL,
  texto       text,
  imagen_url  text,
  activa      boolean DEFAULT true NOT NULL,
  created_at  timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS novedades_ad_id_idx ON novedades(ad_id, created_at DESC);

ALTER TABLE novedades ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede leer novedades activas
CREATE POLICY "Leer novedades activas" ON novedades
  FOR SELECT USING (activa = true);

-- Insertar/actualizar/eliminar solo via service role (API server-side)
