-- Vincular ads con el usuario autenticado que los creó
ALTER TABLE public.ads
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
