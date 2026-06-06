-- Descripción larga del comercio (no almacenada anteriormente)
ALTER TABLE ads ADD COLUMN IF NOT EXISTS descripcion_comercio text;
