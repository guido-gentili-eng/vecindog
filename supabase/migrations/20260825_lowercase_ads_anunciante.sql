-- El insert de pago/red-vecindog (y el alta gratuita de comercio en app/red-vecindog/page.tsx)
-- guardaban el email del anunciante tal cual lo tipeaba el usuario, sin normalizar a
-- minúscula -- a diferencia de trial/red-vecindog, trial/publicidad e iap/red-vecindog/verify,
-- que sí lo hacían. Como /mi-comercio, comercio-stats, novedades y comercio-reviews comparan
-- anunciante contra el email de sesión (Supabase Auth normaliza a minúscula) con === exacto,
-- cualquier anunciante que haya tipeado su email con mayúsculas quedó sin poder administrar
-- su propio comercio pago. Se normaliza el histórico acá; el código ya se corrigió para no
-- volver a insertar valores con mayúscula (ver lib/ads.ts, app/api/pago/red-vecindog/route.ts,
-- app/api/pago/publicidad/route.ts).
update ads set anunciante = lower(anunciante) where anunciante is not null and anunciante <> lower(anunciante);
