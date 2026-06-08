-- Primer mes gratis para usuarios Pro
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS plan_trial_usado BOOLEAN NOT NULL DEFAULT FALSE;

-- Primer mes gratis para publicidad y Red Vecindog
ALTER TABLE ads
  ADD COLUMN IF NOT EXISTS es_trial BOOLEAN NOT NULL DEFAULT FALSE;
