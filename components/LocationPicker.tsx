'use client';

import { useState } from 'react';
import dynamicImport from 'next/dynamic';
import { CheckCheck, Loader2, Navigation } from 'lucide-react';
import AddressAutocomplete from './AddressAutocomplete';

const MapPinPicker = dynamicImport(() => import('./MapPinPicker'), { ssr: false });

export interface LocationPickerLabels {
  gpsOk:         string;
  gpsCambiar:    string;
  gpsCargando:   string;
  gpsUsar:       string;
  gpsError:      string;
  gpsManual:     string;
  gpsVolver:     string;
  confirmDir:    string;
  direccionZona: string;
}

const DEFAULT_LABELS: LocationPickerLabels = {
  gpsOk:         'Ubicación GPS capturada',
  gpsCambiar:    'Cambiar',
  gpsCargando:   'Obteniendo ubicación…',
  gpsUsar:       'Usar mi ubicación GPS',
  gpsError:      'No se pudo obtener el GPS — reintentar',
  gpsManual:     'No tengo GPS / prefiero escribir la dirección',
  gpsVolver:     '← Volver a usar GPS',
  confirmDir:    'Confirmá o ajustá la dirección',
  direccionZona: 'Dirección o zona',
};

interface Props {
  value:           string;
  onChange:        (value: string) => void;
  lat:             number | null;
  lng:             number | null;
  onCoordsChange:  (lat: number | null, lng: number | null) => void;
  ciudad?:         string | null;
  placeholder?:    string;
  required?:       boolean;
  labels?:         Partial<LocationPickerLabels>;
}

/**
 * Flujo unificado para pedir una ubicación: GPS -> autocompletado -> confirmar pin en el mapa.
 * Usado en todos los lugares de la app donde se pide una dirección, para que la experiencia
 * sea siempre la misma (web, iOS y Android cargan el mismo build de esta pantalla).
 */
export default function LocationPicker({
  value, onChange, lat, lng, onCoordsChange, ciudad, placeholder, required, labels: labelsOverride,
}: Props) {
  const labels = { ...DEFAULT_LABELS, ...labelsOverride };
  const [gpsEstado,  setGpsEstado]  = useState<'idle' | 'cargando' | 'ok' | 'error'>(value ? 'ok' : 'idle');
  const [zonaManual, setZonaManual] = useState(!!value);
  const [showMap,    setShowMap]    = useState(false);

  async function capturarGPS() {
    if (!navigator.geolocation) { setGpsEstado('error'); setZonaManual(true); return; }
    setGpsEstado('cargando');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const dentroDeArgentina = latitude >= -55 && latitude <= -21 && longitude >= -73 && longitude <= -53;
        if (!dentroDeArgentina) { setGpsEstado('error'); setZonaManual(true); return; }
        onCoordsChange(latitude, longitude);
        setGpsEstado('ok');
        setShowMap(true);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
            { headers: { 'User-Agent': 'Vecindog/1.0 (noreply@mivecindog.com.ar)' } }
          );
          const data = await res.json();
          if (data?.address) {
            const a = data.address;
            const calle  = a.road ?? a.pedestrian ?? a.footway ?? '';
            const numero = a.house_number ?? '';
            const barrio = a.suburb ?? a.neighbourhood ?? a.quarter ?? '';
            const zona = [calle && numero ? `${calle} ${numero}` : calle, barrio].filter(Boolean).join(', ');
            if (zona) onChange(zona);
          }
        } catch { /* sin reverse geocode */ }
      },
      () => { setGpsEstado('error'); setZonaManual(true); },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }

  return (
    <div className="space-y-3">
      {gpsEstado === 'ok' ? (
        <div className="flex items-center justify-between rounded-2xl bg-good/10 px-4 py-3 ring-1 ring-good/20">
          <div className="flex items-center gap-2 text-sm font-bold text-good">
            <CheckCheck className="h-4 w-4 shrink-0" />
            <span>{labels.gpsOk}</span>
          </div>
          <button
            type="button"
            onClick={() => { setGpsEstado('idle'); setZonaManual(true); setShowMap(false); onChange(''); onCoordsChange(null, null); }}
            className="text-xs text-ink-muted hover:text-bad transition"
          >
            {labels.gpsCambiar}
          </button>
        </div>
      ) : gpsEstado === 'cargando' ? (
        <div className="flex items-center gap-3 rounded-2xl border-2 border-brand-primary/30 bg-brand-primary/5 px-4 py-4">
          <Loader2 className="h-5 w-5 animate-spin text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">{labels.gpsCargando}</span>
        </div>
      ) : !zonaManual ? (
        <div className="space-y-2">
          <button
            type="button"
            onClick={capturarGPS}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-brand-primary bg-brand-primary/5 px-4 py-4 text-sm font-bold text-brand-primary transition hover:bg-brand-primary/10 active:scale-[0.99]"
          >
            <Navigation className="h-5 w-5" />
            {gpsEstado === 'error' ? labels.gpsError : labels.gpsUsar}
          </button>
          <button
            type="button"
            onClick={() => setZonaManual(true)}
            className="w-full text-center text-xs text-ink-muted hover:text-brand-primary transition underline"
          >
            {labels.gpsManual}
          </button>
        </div>
      ) : null}

      {(zonaManual || gpsEstado === 'ok') && (
        <div>
          {gpsEstado === 'ok' && (
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">
              {labels.confirmDir}
            </label>
          )}
          <AddressAutocomplete
            value={value}
            onChange={(v) => { onChange(v); setShowMap(false); }}
            onSelectCoords={(la, ln) => { onCoordsChange(la, ln); setShowMap(true); }}
            onClearCoords={() => { onCoordsChange(null, null); setShowMap(false); }}
            placeholder={placeholder ?? labels.direccionZona}
            ciudad={ciudad ?? null}
            required={required}
          />
          {zonaManual && gpsEstado !== 'ok' && (
            <button
              type="button"
              onClick={() => { setZonaManual(false); capturarGPS(); }}
              className="mt-1 text-xs text-brand-primary hover:underline"
            >
              {labels.gpsVolver}
            </button>
          )}
        </div>
      )}

      {showMap && lat != null && lng != null && (
        <MapPinPicker
          lat={lat}
          lng={lng}
          onChange={(la, ln) => onCoordsChange(la, ln)}
          onConfirm={() => setShowMap(false)}
        />
      )}
    </div>
  );
}
