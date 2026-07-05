import { createClient } from '@supabase/supabase-js';

export function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/** Verifica el token y que el usuario tenga profiles.is_admin = true. */
export async function getAdminUser(token: string | null | undefined) {
  if (!token) return null;
  const admin = getAdminClient();
  const { data: { user } } = await admin.auth.getUser(token);
  if (!user) return null;
  const { data: profile } = await admin.from('profiles').select('is_admin').eq('id', user.id).single();
  return profile?.is_admin ? user : null;
}
