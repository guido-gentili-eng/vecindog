'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface NominatimAddress {
  road?: string;
  pedestrian?: string;
  house_number?: string;
  suburb?: string;
  neighbourhood?: string;
  quarter?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  state?: string;
  county?: string;
}

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
  address: NominatimAddress;
}

interface Props {
  value:        string;
  onChange:     (value: string) => void;
  placeholder?: string;
  className?:   string;
  required?:    boolean;
  ciudad?:      string | null;
}

/** Extrae calle + número de la respuesta Nominatim */
function extractStreet(a: NominatimAddress): string {
  const road = a.road ?? a.pedestrian ?? '';
  const num  = a.house_number ?? '';
  return [road, num].filter(Boolean).join(' ');
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
  placeholder = 'Calle y número',
  className = '',
  required,
  ciudad,
}: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [open,        setOpen]        = useState(false);
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
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const query = ciudad ? `${val}, ${ciudad}, Argentina` : `${val}, Argentina`;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1&countrycodes=ar`,
          { headers: { 'User-Agent': 'Vecindog/1.0 (noreply@mivecindog.com.ar)' } }
        );
        const data: Suggestion[] = await res.json();
        // Filtrar resultados que tengan al menos calle
        setSuggestions(data.filter((s) => s.address?.road || s.address?.pedestrian));
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 380);
  }

  function handleSelect(s: Suggestion) {
    const calle = extractStreet(s.address);
    onChange(calle || value);
    setSuggestions([]);
    setOpen(false);
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

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full rounded-2xl border border-black/10 bg-white shadow-xl overflow-hidden">
          {suggestions.map((s, i) => {
            const calle    = extractStreet(s.address);
            const location = extractLocation(s.address);
            return (
              <li key={i} className="border-b border-black/5 last:border-0">
                <button
                  type="button"
                  onMouseDown={() => handleSelect(s)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-brand-cream transition"
                >
                  <MapPin className="h-4 w-4 shrink-0 text-ink-muted/50" />
                  <div className="min-w-0">
                    <p className="font-bold text-ink text-sm truncate">{calle}</p>
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
