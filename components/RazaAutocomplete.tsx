'use client';

import { useEffect, useRef, useState } from 'react';
import { Dog } from 'lucide-react';

const RAZAS = [
  // Populares en Argentina
  'Mestizo', 'Labrador Retriever', 'Golden Retriever', 'Pastor Alemán', 'Caniche',
  'Bulldog Francés', 'Beagle', 'Poodle', 'Rottweiler', 'Yorkshire Terrier',
  'Dálmata', 'Boxer', 'Husky Siberiano', 'Chihuahua', 'Dachshund',
  'Dobermann', 'Border Collie', 'Cocker Spaniel', 'Shih Tzu', 'Maltés',
  'Bichón Frisé', 'Schnauzer', 'Pit Bull Terrier', 'American Staffordshire',
  'Bull Terrier', 'Shar Pei', 'Samoyedo', 'Akita', 'Chow Chow',
  'Pomerania', 'Spitz Alemán', 'Gran Danés', 'San Bernardo', 'Terranova',
  'Setter Irlandés', 'Pointer', 'Weimaraner', 'Vizsla', 'Braco Alemán',
  'Pastor Belga Malinois', 'Pastor Belga', 'Pastor Australiano',
  'Border Terrier', 'Jack Russell Terrier', 'West Highland Terrier', 'Fox Terrier',
  'Pug', 'Bulldog Inglés', 'Boston Terrier', 'Bullmastiff', 'Mastín',
  'Fila Brasileño', 'Dogo Argentino', 'Dogo de Burdeos',
  'Basset Hound', 'Bloodhound', 'Galgo', 'Greyhound', 'Whippet',
  'Borzoi', 'Afghan Hound', 'Saluki',
  'Malamute de Alaska', 'Groenlandia',
  'Pekinés', 'Lhasa Apso', 'Tibetan Mastiff',
  'Rhodesian Ridgeback', 'Basenji',
  'Cane Corso', 'Boerboel',
  'Lagotto Romagnolo', 'Spinone Italiano',
  'Sealyham Terrier', 'Airedale Terrier', 'Bedlington Terrier',
  'Cavalier King Charles Spaniel', 'King Charles Spaniel',
  'Clumber Spaniel', 'Sussex Spaniel', 'Field Spaniel',
  'Nova Scotia Duck Tolling Retriever', 'Flat-Coated Retriever',
  'Curly-Coated Retriever',
  'Collie', 'Shetland Sheepdog', 'Old English Sheepdog',
  'Welsh Corgi Pembroke', 'Welsh Corgi Cardigan',
  'Bouvier des Flandres', 'Briard', 'Beauceron',
  'Leonberger', 'Kuvasz', 'Komondor', 'Puli',
  'Canaan Dog', 'Cirneco dell\'Etna',
].sort();

interface Props {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  required?: boolean;
}

export default function RazaAutocomplete({ value, onChange, className = '', required }: Props) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open,        setOpen]        = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    const filtered = val.length === 0
      ? RAZAS
      : RAZAS.filter((r) => r.toLowerCase().includes(val.toLowerCase()));
    setSuggestions(filtered);
    setOpen(filtered.length > 0);
  }

  function handleFocus() {
    const filtered = value.length === 0
      ? RAZAS
      : RAZAS.filter((r) => r.toLowerCase().includes(value.toLowerCase()));
    setSuggestions(filtered);
    setOpen(filtered.length > 0);
  }

  function handleSelect(raza: string) {
    onChange(raza);
    setSuggestions([]);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <input
        type="text"
        required={required}
        placeholder="Ej: Labrador, mestizo…"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        className="field w-full"
        autoComplete="off"
      />

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full rounded-2xl border border-black/10 bg-white shadow-lg overflow-y-auto max-h-56">
          {suggestions.map((r) => (
            <li key={r}>
              <button
                type="button"
                onMouseDown={() => handleSelect(r)}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-brand-cream transition"
              >
                <Dog className="h-3.5 w-3.5 shrink-0 text-brand-primary" />
                <span className="text-ink">{r}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
