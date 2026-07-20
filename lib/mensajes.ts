/**
 * Mensajería privada por aviso — habla con la API de patitas-app (/api/mensajes)
 * porque vecindog-mobile no tiene backend propio.
 */
import { supabase } from './supabase';

const API_BASE = 'https://www.mivecindog.com.ar/api/mensajes';

export interface MensajePerfil {
  nombre: string | null;
  apellido: string | null;
  foto_url: string | null;
}

export interface Mensaje {
  id: string;
  texto: string;
  created_at: string;
  sender_id: string;
  profiles: MensajePerfil | null;
}

export interface Conversacion {
  user_id: string;
  nombre: MensajePerfil | null;
  ultimo_texto: string;
  ultimo_at: string;
}

async function authHeader(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Tu sesión expiró. Volvé a iniciar sesión.');
  return { Authorization: `Bearer ${session.access_token}` };
}

/** Sin `withUserId`: si sos el dueño trae la lista de conversaciones; si no, tu único hilo. */
export async function obtenerMensajes(
  postId: string,
  withUserId?: string,
): Promise<{ conversaciones: Conversacion[] | null; mensajes: Mensaje[] }> {
  const headers = await authHeader();
  const params = new URLSearchParams({ post_id: postId });
  if (withUserId) params.set('with', withUserId);
  const res = await fetch(`${API_BASE}?${params.toString()}`, { headers });
  if (!res.ok) throw new Error('No se pudieron cargar los mensajes.');
  const json = await res.json();
  return { conversaciones: json.conversaciones ?? null, mensajes: json.mensajes ?? [] };
}

export async function enviarMensaje(postId: string, texto: string, recipientId?: string): Promise<void> {
  const headers = await authHeader();
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ post_id: postId, texto, recipient_id: recipientId }),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error ?? 'No se pudo enviar el mensaje.');
  }
}
