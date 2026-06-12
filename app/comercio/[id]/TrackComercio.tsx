'use client';

import { useEffect } from 'react';
import { Phone, MapPin, ExternalLink, MessageCircle } from 'lucide-react';

interface Props {
  adId: string;
  telefono?: string | null;
  direccion?: string | null;
  href?: string | null;
}

async function track(adId: string, event_type: string) {
  try {
    await fetch('/api/comercio-stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ad_id: adId, event_type }),
    });
  } catch { /* silencioso */ }
}

export default function TrackComercio({ adId, telefono, direccion, href }: Props) {
  useEffect(() => {
    track(adId, 'view');
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('ref') === 'mapa') {
      track(adId, 'click_mapa');
    }
  }, [adId]);

  return (
    <div className="mt-4 space-y-2">
      {telefono && (
        <div className="flex gap-2">
          <a
            href={`tel:${telefono}`}
            onClick={() => track(adId, 'click_telefono')}
            className="flex flex-1 items-center gap-3 rounded-2xl bg-[#f5f0eb] px-4 py-3 text-sm font-semibold text-ink transition hover:bg-brand-primary/10"
          >
            <Phone className="h-4 w-4 shrink-0 text-brand-primary" />
            {telefono}
          </a>
          <a
            href={`https://wa.me/549${telefono.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track(adId, 'click_telefono')}
            className="flex items-center gap-2 rounded-2xl bg-[#25d366]/10 px-4 py-3 text-sm font-semibold text-[#25d366] transition hover:bg-[#25d366]/20"
          >
            <MessageCircle className="h-4 w-4 shrink-0" />
            WA
          </a>
        </div>
      )}

      {direccion && (
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(direccion)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track(adId, 'click_mapa')}
          className="flex items-center gap-3 rounded-2xl bg-[#f5f0eb] px-4 py-3 text-sm font-semibold text-ink transition hover:bg-brand-primary/10"
        >
          <MapPin className="h-4 w-4 shrink-0 text-brand-primary" />
          {direccion}
        </a>
      )}

      {href && !href.startsWith('tel:') && href !== 'https://www.mivecindog.com.ar' && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track(adId, 'click_link')}
          className="flex items-center gap-3 rounded-2xl bg-[#f5f0eb] px-4 py-3 text-sm font-semibold text-brand-primary transition hover:bg-brand-primary/10"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          Visitar sitio / perfil
        </a>
      )}
    </div>
  );
}
