-- Migration 005: agrega columna is_admin a profiles
-- Reemplaza el chequeo de email en el cliente por un campo en la tabla.
-- Ejecutar en Supabase SQL Editor.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

-- Marcar al admin actual como is_admin = true
-- (reemplazar el email si cambia)
UPDATE profiles
SET is_admin = true
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'guido-gentili@live.com.ar'
);
