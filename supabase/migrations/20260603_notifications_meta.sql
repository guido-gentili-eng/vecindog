-- Columna meta para guardar datos extra en notificaciones (ej: amistad_id)
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS meta TEXT;
