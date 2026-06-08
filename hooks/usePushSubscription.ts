'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type State = 'loading' | 'unsupported' | 'denied' | 'subscribed' | 'unsubscribed';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function usePushSubscription() {
  const [state, setState] = useState<State>('loading');

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setState('unsupported');
      return;
    }
    if (Notification.permission === 'denied') {
      setState('denied');
      return;
    }
    navigator.serviceWorker.ready.then((reg) =>
      reg.pushManager.getSubscription()
    ).then((sub) => {
      setState(sub ? 'subscribed' : 'unsubscribed');
    }).catch(() => setState('unsubscribed'));
  }, []);

  async function subscribe() {
    if (!('serviceWorker' in navigator)) return;
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();

    if (!sub) {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') { setState('denied'); return; }

      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
      });
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const json = sub.toJSON();
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ endpoint: json.endpoint, keys: json.keys }),
    });
    setState('subscribed');
  }

  async function unsubscribe() {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (!sub) { setState('unsubscribed'); return; }

    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await fetch('/api/push/subscribe', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ endpoint: sub.endpoint }),
      });
    }
    await sub.unsubscribe();
    setState('unsubscribed');
  }

  return { state, subscribe, unsubscribe };
}
