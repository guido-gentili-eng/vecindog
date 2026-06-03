-- Agrega columna para el logo cuadrado (sidebar/leaderboard)
-- La imagen principal (imagen_url) se usa para card (4:3 horizontal)
-- imagen_logo_url se usa para sidebar y leaderboard (1:1 cuadrado)
ALTER TABLE ads ADD COLUMN IF NOT EXISTS imagen_logo_url TEXT;
