-- La tabla `mensajes` solo tenía post_id + sender_id, sin destinatario.
-- Si dos visitantes distintos escribían sobre el mismo aviso, las
-- respuestas del dueño (mismo sender_id = dueño) se mezclaban en el
-- hilo de los dos, porque no había forma de saber para cuál era cada una.
--
-- Se agrega recipient_id. Semántica hacia adelante (la aplica la API en
-- app/api/mensajes/route.ts, no hay WITH CHECK de recipient_id en RLS
-- porque la tabla se escribe siempre vía service role desde esa ruta):
--   - Mensaje de un visitante -> recipient_id = dueño del aviso (siempre).
--   - Mensaje del dueño       -> recipient_id = el visitante puntual al
--     que le está respondiendo (lo decide el cliente, la API valida que
--     ese visitante ya haya escrito antes en este aviso).
--
-- Los mensajes viejos de visitantes se pueden backfillear sin ambigüedad
-- (el destinatario siempre fue el dueño). Los mensajes viejos ENVIADOS
-- POR el dueño quedan con recipient_id NULL porque no hay forma de saber
-- a cuál visitante le contestaba cada uno — la API los sigue mostrando
-- en todos los hilos de ese aviso para no ocultar historial real, y de
-- acá en adelante los mensajes nuevos quedan correctamente separados.

alter table public.mensajes
  add column if not exists recipient_id uuid references auth.users(id) on delete cascade;

create index if not exists mensajes_recipient_idx on public.mensajes(post_id, recipient_id);

update public.mensajes m
set recipient_id = p.user_id
from public.posts p
where m.post_id = p.id
  and m.sender_id <> p.user_id
  and m.recipient_id is null;
