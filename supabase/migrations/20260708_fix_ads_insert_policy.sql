-- CRITICO: "ads_insert_service" permitia INSERT a rol "public" (cualquiera,
-- ni siquiera logueado) con with_check = true, sin ninguna restriccion.
-- Cualquiera podia crear un anuncio con activo=true, plan='premium' y
-- fecha_fin lejana, saltando por completo el pago. La activacion real de
-- pauta ya se hace via service role (lib/ads.ts activarAds) y la creacion
-- de anuncios desde el panel admin ya esta cubierta por la policy
-- "Admin write" (auth.email() = admin). Esta policy publica era redundante
-- y peligrosa, se elimina.

DROP POLICY IF EXISTS "ads_insert_service" ON public.ads;

-- Se agrega ademas un trigger que protege las columnas que definen si un
-- anuncio esta activo/pago, para que ni siquiera el dueño de un ad (via
-- ads_update_owner) pueda auto-activarse o extenderse gratis.
CREATE OR REPLACE FUNCTION public.protect_ads_privileged_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() <> 'service_role'
     AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin) THEN
    NEW.activo        := OLD.activo;
    NEW.fecha_inicio  := OLD.fecha_inicio;
    NEW.fecha_fin     := OLD.fecha_fin;
    NEW.plan          := OLD.plan;
    NEW.es_trial      := OLD.es_trial;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_ads_columns ON public.ads;

CREATE TRIGGER trg_protect_ads_columns
BEFORE UPDATE ON public.ads
FOR EACH ROW
EXECUTE FUNCTION public.protect_ads_privileged_columns();
