-- Los comprobantes de Apple en ambiente Sandbox (gratis, cualquiera con una cuenta de
-- test de Apple puede generarlos, y Apple los usa para probar la compra en App Review)
-- se verifican igual que los de producción, pero conviene poder distinguirlos despues
-- para no confundirlos con una compra real al analizar altas de Red Vecindog.
alter table apple_iap_red_vecindog
  add column if not exists is_sandbox boolean not null default false;
