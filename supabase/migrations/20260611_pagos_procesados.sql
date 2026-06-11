-- Tabla de idempotencia para pagos procesados.
-- Garantiza que el mismo payment_id de MercadoPago no active beneficios múltiples veces.
CREATE TABLE IF NOT EXISTS pagos_procesados (
  payment_id  text        PRIMARY KEY,
  user_id     uuid        REFERENCES auth.users ON DELETE SET NULL,
  tipo        text        NOT NULL DEFAULT 'pro',
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Solo el service role puede leer/escribir esta tabla
ALTER TABLE pagos_procesados ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_only" ON pagos_procesados USING (false);
