-- Suscripciones de Red Vecindog compradas via Apple In-App Purchase (iOS).
-- El pago vive del lado de Apple, no de MercadoPago -- necesitamos poder
-- encontrar a que fila de `ads` corresponde una suscripcion de Apple cuando
-- llega una notificacion de renovacion/cancelacion (solo trae el
-- originalTransactionId, no el ad_id).
CREATE TABLE IF NOT EXISTS apple_iap_red_vecindog (
  original_transaction_id text        PRIMARY KEY,
  ad_id                    uuid        NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
  user_id                  uuid        REFERENCES auth.users ON DELETE SET NULL,
  created_at               timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS apple_iap_red_vecindog_ad_idx ON apple_iap_red_vecindog(ad_id);

-- Solo el service role puede leer/escribir esta tabla
ALTER TABLE apple_iap_red_vecindog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_only" ON apple_iap_red_vecindog USING (false);
