-- El cron de avisos-vencidos podía reenviar el email de "último aviso" (día 6
-- de la ventana corta, día 29 de la larga) más de una vez si Vercel reintenta
-- la invocación o el cron corre dos veces el mismo día, porque no había
-- ninguna marca que distinguiera "ya se envió el aviso final" de "ya se
-- envió el primer aviso" (ambos comparten notified_expiration=true).
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS notified_final_warning boolean NOT NULL DEFAULT false;
