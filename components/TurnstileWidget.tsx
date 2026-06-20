'use client';

import { useEffect, useId, useRef } from 'react';
import Script from 'next/script';

interface Props {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  reset?: number;
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function TurnstileWidget({ onVerify, onExpire, reset }: Props) {
  const containerId = useId();
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!SITE_KEY) return;

    function render() {
      const el = document.getElementById(containerId);
      if (!el || !window.turnstile || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(el, {
        sitekey: SITE_KEY,
        callback: onVerify,
        'expired-callback': onExpire,
      });
    }

    if (window.turnstile) render();
    else {
      const interval = setInterval(() => {
        if (window.turnstile) { clearInterval(interval); render(); }
      }, 200);
      return () => clearInterval(interval);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reset === undefined || !widgetIdRef.current || !window.turnstile) return;
    window.turnstile.reset(widgetIdRef.current);
  }, [reset]);

  if (!SITE_KEY) return null;

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      <div id={containerId} />
    </>
  );
}
