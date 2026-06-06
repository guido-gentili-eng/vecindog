-- Tabla de mensajes privados por aviso
CREATE TABLE IF NOT EXISTS mensajes (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id    uuid REFERENCES posts(id)       ON DELETE CASCADE NOT NULL,
  sender_id  uuid REFERENCES auth.users(id)  ON DELETE CASCADE NOT NULL,
  texto      text                             NOT NULL,
  created_at timestamptz DEFAULT now()        NOT NULL
);

-- Índice para buscar mensajes por aviso eficientemente
CREATE INDEX IF NOT EXISTS mensajes_post_id_idx ON mensajes(post_id, created_at);

-- RLS
ALTER TABLE mensajes ENABLE ROW LEVEL SECURITY;

-- Solo usuarios autenticados pueden leer mensajes de un aviso
CREATE POLICY "Leer mensajes de aviso" ON mensajes
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Solo usuarios autenticados pueden insertar sus propios mensajes
CREATE POLICY "Insertar mensajes propios" ON mensajes
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id);
