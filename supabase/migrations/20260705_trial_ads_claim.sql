-- Reclamo atómico de trials de publicidad/Red Vecindog por email.
-- Evita que dos requests concurrentes (doble click, doble tab) pasen ambas
-- el chequeo "SELECT ... ya usó el trial" antes de que cualquiera inserte el
-- ad de trial, otorgando dos trials gratis para el mismo email.
CREATE TABLE IF NOT EXISTS trial_ads_usado_por_email (
  email      text        NOT NULL,
  tipo       text        NOT NULL, -- 'publicidad' | 'red_vecindog'
  user_id    uuid        REFERENCES auth.users ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (email, tipo)
);

ALTER TABLE trial_ads_usado_por_email ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_only" ON trial_ads_usado_por_email USING (false);
