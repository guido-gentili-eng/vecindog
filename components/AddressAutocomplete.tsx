'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface NominatimAddress {
  road?:         string;
  pedestrian?:   string;
  path?:         string;
  footway?:      string;
  cycleway?:     string;
  track?:        string;
  residential?:  string;
  house_number?: string;
  suburb?:       string;
  neighbourhood?:string;
  quarter?:      string;
  city?:         string;
  town?:         string;
  village?:      string;
  municipality?: string;
  state?:        string;
  county?:       string;
}

/** Devuelve el nombre de la calle independientemente del tipo en OSM */
function extractRoadName(a: NominatimAddress): string {
  return a.road ?? a.pedestrian ?? a.path ?? a.footway ??
         a.cycleway ?? a.track ?? a.residential ?? '';
}

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
  address: NominatimAddress;
}

interface Props {
  value:             string;
  onChange:          (value: string) => void;
  onSelectCoords?:   (lat: number, lng: number) => void;
  onClearCoords?:    () => void;
  placeholder?:      string;
  className?:        string;
  required?:         boolean;
  ciudad?:           string | null;
}

/** Extrae calle + número de la respuesta Nominatim, usando el número del query si Nominatim no lo devuelve */
function extractStreet(a: NominatimAddress, fallbackNum?: string): string {
  const road = extractRoadName(a);
  const num  = a.house_number ?? fallbackNum ?? '';
  return [road, num].filter(Boolean).join(' ');
}

/** Extrae el primer número encontrado en el texto escrito por el usuario */
function extractTypedNumber(query: string): string {
  const match = query.match(/\d+/);
  return match ? match[0] : '';
}

/** Extrae ciudad + provincia de forma legible */
function extractLocation(a: NominatimAddress): string {
  const ciudad   = a.city ?? a.town ?? a.village ?? a.municipality ?? '';
  const provincia = a.state ?? a.county ?? '';
  return [ciudad, provincia].filter(Boolean).join(', ');
}

export default function AddressAutocomplete({
  value,
  onChange,
  onSelectCoords,
  onClearCoords,
  placeholder = 'Calle y número',
  className = '',
  required,
  ciudad,
}: Props) {
  const [suggestions,    setSuggestions]    = useState<Suggestion[]>([]);
  const [loading,        setLoading]        = useState(false);
  const [open,           setOpen]           = useState(false);
  const [pinConfirmado,  setPinConfirmado]  = useState<string | null>(null);
  const debounceRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    onChange(val);
    setOpen(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (val.trim().length < 3) {
      setSuggestions([]);
      setPinConfirmado(null);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const query = ciudad ? `${val}, ${ciudad}, Argentina` : `${val}, Argentina`;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=8&addressdetails=1&countrycodes=ar`,
          { headers: { 'User-Agent': 'Vecindog/1.0 (noreply@mivecindog.com.ar)' } }
        );
        const data: Suggestion[] = await res.json();
        // Aceptar cualquier resultado con nombre de calle O con barrio/ciudad
        let resultados = data.filter((s) =>
          extractRoadName(s.address) ||
          s.address?.suburb ||
          s.address?.neighbourhood ||
          s.address?.quarter ||
          s.address?.city ||
          s.address?.town
        );

        // Si hay ciudad configurada, priorizar resultados de esa ciudad al tope
        if (ciudad) {
          const ciudadNorm = ciudad.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(' ')[0];
          const locales = resultados.filter((s) => {
            const loc = [s.address?.city, s.address?.town, s.address?.village, s.address?.municipality]
              .filter(Boolean).join(' ').toLowerCase()
              .normalize('NFD').replace(/[̀-ͯ]/g, '');
            return loc.includes(ciudadNorm);
          });
          const otros = resultados.filter((s) => !locales.includes(s));
          resultados = [...locales, ...otros];
        }

        setSuggestions(resultados.slice(0, 5));
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 380);
  }

  function handleSelect(s: Suggestion) {
    const calle = extractStreet(s.address, extractTypedNumber(value));
    const calleLabel = calle || s.display_name.split(',')[0].trim();
    onChange(calleLabel || value);
    if (onSelectCoords && s.lat && s.lon) {
      onSelectCoords(parseFloat(s.lat), parseFloat(s.lon));
      const location = extractLocation(s.address);
      setPinConfirmado(location || 'Ubicación seleccionada');
    }
    setSuggestions([]);
    setOpen(false);
  }

  function handleClearPin() {
    setPinConfirmado(null);
    if (onClearCoords) onClearCoords();
  }

  return (
    <div ref={containerRef} className="relative">
      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted pointer-events-none z-10" />
      <input
        type="text"
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        className={`field pl-9 pr-8 ${className}`}
        autoComplete="off"
      />
      {loading && (
        <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-ink-muted" />
      )}

      {/* Badge de confirmación del pin seleccionado */}
      {pinConfirmado && !open && (
        <div className="mt-1.5 flex items-center gap-2 rounded-xl bg-good/10 px-3 py-1.5 text-xs font-bold text-good ring-1 ring-good/20">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1">Pin en: {pinConfirmado}</span>
          <button
            type="button"
            onClick={handleClearPin}
            className="ml-auto shrink-0 rounded-full text-good/60 hover:text-bad transition"
            title="Quitar pin"
          >
            ✕
          </button>
        </div>
      )}

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full rounded-2xl border border-black/10 bg-white shadow-xl overflow-hidden">
          {suggestions.map((s, i) => {
            const calleExtraida = extractStreet(s.address, extractTypedNumber(value));
            const location      = extractLocation(s.address);
            // Si los campos de address no tienen calle, usar la primera parte del display_name
            const calleLabel = calleExtraida || s.display_name.split(',')[0].trim();
            return (
              <li key={i} className="border-b border-black/5 last:border-0">
                <button
                  type="button"
                  onMouseDown={() => handleSelect(s)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-brand-cream transition"
                >
                  <MapPin className="h-4 w-4 shrink-0 text-ink-muted/50" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-ink truncate">{calleLabel}</p>
                    {location && (
                      <p className="text-xs text-ink-muted truncate">{location}</p>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
