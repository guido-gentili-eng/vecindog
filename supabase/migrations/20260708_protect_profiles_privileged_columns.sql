-- CRITICO: las policies de UPDATE en profiles solo exigen auth.uid() = id
-- (podes editar tu propia fila) pero RLS no restringe columnas, asi que
-- cualquier usuario logueado podia hacer:
--   update profiles set is_admin=true, plan='pro' where id = auth.uid()
-- y auto-otorgarse admin o plan Pro gratis. Se agrega un trigger que revierte
-- los cambios a las columnas privilegiadas salvo que la operacion venga del
-- service role (panel admin, endpoints de pago) o de un admin ya existente.

CREATE OR REPLACE FUNCTION public.protect_profiles_privileged_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() <> 'service_role' AND COALESCE(OLD.is_admin, false) IS NOT TRUE THEN
    NEW.is_admin          := OLD.is_admin;
    NEW.plan              := OLD.plan;
    NEW.plan_vencimiento  := OLD.plan_vencimiento;
    NEW.suspendido        := OLD.suspendido;
    NEW.plan_trial_usado  := OLD.plan_trial_usado;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profiles_columns ON public.profiles;

CREATE TRIGGER trg_protect_profiles_columns
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profiles_privileged_columns();
