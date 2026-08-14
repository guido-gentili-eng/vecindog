-- El constraint pagos_procesados_user_id_fkey quedó como NO ACTION en producción en vez
-- del ON DELETE SET NULL que dice la migración original (20260611_pagos_procesados.sql) --
-- verificado contra pg_constraint. Bloqueaba /api/account/delete para cualquier usuario
-- que hubiera pagado algo alguna vez (trial, Pro, publicidad, Red Vecindog).
alter table pagos_procesados drop constraint if exists pagos_procesados_user_id_fkey;
alter table pagos_procesados
  add constraint pagos_procesados_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete set null;
