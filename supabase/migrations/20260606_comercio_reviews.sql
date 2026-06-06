-- Reviews de comercios adheridos a Red Vecindog
CREATE TABLE IF NOT EXISTS comercio_reviews (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ad_id      uuid REFERENCES ads(id) ON DELETE CASCADE NOT NULL,
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  estrellas  smallint NOT NULL CHECK (estrellas BETWEEN 1 AND 5),
  comentario text,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE (ad_id, user_id)  -- 1 review por usuario por comercio
);

CREATE INDEX IF NOT EXISTS comercio_reviews_ad_id_idx ON comercio_reviews(ad_id);

ALTER TABLE comercio_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leer reviews de comercios" ON comercio_reviews
  FOR SELECT USING (true);

CREATE POLICY "Insertar review propia" ON comercio_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Actualizar review propia" ON comercio_reviews
  FOR UPDATE USING (auth.uid() = user_id);
