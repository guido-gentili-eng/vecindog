-- ══════════════════════════════════════════════════════════════
-- Migration 004 — alergias, veterinario, desparasitaciones, pesos
-- Ejecutar en el SQL Editor de Supabase
-- ══════════════════════════════════════════════════════════════

-- 1. Nuevas columnas en la tabla perros
ALTER TABLE perros
  ADD COLUMN IF NOT EXISTS alergias     text,
  ADD COLUMN IF NOT EXISTS vet_nombre   text,
  ADD COLUMN IF NOT EXISTS vet_telefono text;

-- 2. Tabla desparasitaciones
CREATE TABLE IF NOT EXISTS desparasitaciones (
  id           uuid         DEFAULT gen_random_uuid() PRIMARY KEY,
  perro_id     uuid         REFERENCES perros(id) ON DELETE CASCADE NOT NULL,
  producto     text         NOT NULL,
  tipo         text         NOT NULL DEFAULT 'ambas',  -- 'interna' | 'externa' | 'ambas'
  fecha        date         NOT NULL,
  proxima      date,
  veterinario  text,
  notas        text,
  created_at   timestamptz  DEFAULT now() NOT NULL
);

ALTER TABLE desparasitaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "desparasitaciones_own" ON desparasitaciones
  FOR ALL USING (
    perro_id IN (SELECT id FROM perros WHERE user_id = auth.uid())
  );

-- 3. Tabla pesos
CREATE TABLE IF NOT EXISTS pesos (
  id         uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  perro_id   uuid          REFERENCES perros(id) ON DELETE CASCADE NOT NULL,
  fecha      date          NOT NULL,
  valor_kg   numeric(5,2)  NOT NULL,
  notas      text,
  created_at timestamptz   DEFAULT now() NOT NULL
);

ALTER TABLE pesos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pesos_own" ON pesos
  FOR ALL USING (
    perro_id IN (SELECT id FROM perros WHERE user_id = auth.uid())
  );
