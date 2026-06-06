-- Reportes de avisos como spam o contenido inapropiado
CREATE TABLE IF NOT EXISTS reportes (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id     uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  reporter_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  motivo      text NOT NULL,
  revisado    boolean DEFAULT false NOT NULL,
  created_at  timestamptz DEFAULT now() NOT NULL,
  UNIQUE (post_id, reporter_id)  -- 1 reporte por usuario por aviso
);

CREATE INDEX IF NOT EXISTS reportes_post_id_idx ON reportes(post_id);
CREATE INDEX IF NOT EXISTS reportes_revisado_idx ON reportes(revisado) WHERE revisado = false;

ALTER TABLE reportes ENABLE ROW LEVEL SECURITY;

-- Solo el admin puede leer reportes (via service_role en API)
-- Insertar propio reporte
CREATE POLICY "Insertar reporte propio" ON reportes
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);
