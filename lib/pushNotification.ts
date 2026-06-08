import webpush from 'web-push';

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
}

// Memoize VAPID config — only call setVapidDetails once per process
let vapidConfigured = false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sendPushToUser(userId: string, payload: PushPayload, adminClient: any) {
  // Configurar VAPID en runtime, no en tiempo de build
  if (!process.env.VAPID_SUBJECT || !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return;
  }
  if (!vapidConfigured) {
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT,
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY,
    );
    vapidConfigured = true;
  }
  const { data: subs } = await adminClient
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth')
    .eq('user_id', userId);

  if (!subs?.length) return;

  const results = await Promise.allSettled(
    subs.map((sub: { endpoint: string; p256dh: string; auth: string }) =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify({ ...payload, icon: payload.icon ?? '/icons/icon-192x192.png', badge: '/icons/icon-96x96.png' }),
        { TTL: 86400 }
      )
    )
  );

  // Limpiar subscripciones expiradas (410 Gone)
  const expired = subs.filter((_: unknown, i: number) => {
    const r = results[i];
    return r.status === 'rejected' && (r.reason as { statusCode?: number })?.statusCode === 410;
  });
  if (expired.length) {
    await Promise.all(
      expired.map((sub: { endpoint: string }) =>
        adminClient.from('push_subscriptions').delete().eq('endpoint', sub.endpoint)
      )
    );
  }
}
