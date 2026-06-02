'use client';

import { useEffect, useRef, useState } from 'react';
import { Dog } from 'lucide-react';

/* ─────────────── Lista de razas (nombre canónico) ─────────────── */

const RAZAS_BASE = [
  // Populares en Argentina
  'Mestizo',
  'Labrador Retriever',
  'Golden Retriever',
  'Pastor Alemán',
  'Caniche',
  'Caniche Toy',
  'Caniche Miniatura',
  'Bulldog Francés',
  'Beagle',
  'Poodle',
  'Rottweiler',
  'Yorkshire Terrier',
  'Dálmata',
  'Boxer',
  'Husky Siberiano',
  'Chihuahua',
  'Dachshund',
  'Dobermann',
  'Border Collie',
  'Cocker Spaniel',
  'Cocker Spaniel Inglés',
  'Cocker Spaniel Americano',
  'Shih Tzu',
  'Maltés',
  'Bichón Frisé',
  'Schnauzer',
  'Schnauzer Miniatura',
  'Schnauzer Gigante',
  'Pit Bull Terrier',
  'American Staffordshire Terrier',
  'Bull Terrier',
  'Shar Pei',
  'Samoyedo',
  'Akita',
  'Akita Americano',
  'Chow Chow',
  'Pomerania',
  'Spitz Alemán',
  'Gran Danés',
  'San Bernardo',
  'Terranova',
  'Setter Irlandés',
  'Pointer',
  'Weimaraner',
  'Vizsla',
  'Braco Alemán',
  'Pastor Belga Malinois',
  'Pastor Belga',
  'Pastor Australiano',
  'Border Terrier',
  'Jack Russell Terrier',
  'West Highland White Terrier',
  'Fox Terrier',
  'Pug',
  'Bulldog Inglés',
  'Boston Terrier',
  'Bullmastiff',
  'Mastín',
  'Mastín Napolitano',
  'Mastín Inglés',
  'Mastín Español',
  'Mastín del Pirineo',
  'Mastín del Tibet',
  'Fila Brasileño',
  'Dogo Argentino',
  'Dogo de Burdeos',
  'Dogo Canario',
  'Basset Hound',
  'Bloodhound',
  'Galgo',
  'Galgo Español',
  'Greyhound',
  'Whippet',
  'Borzoi',
  'Afghan Hound',
  'Saluki',
  'Malamute de Alaska',
  'Perro de Groenlandia',
  'Pekinés',
  'Lhasa Apso',
  'Rhodesian Ridgeback',
  'Basenji',
  'Cane Corso',
  'Boerboel',
  'Lagotto Romagnolo',
  'Spinone Italiano',
  'Airedale Terrier',
  'Bedlington Terrier',
  'Cavalier King Charles Spaniel',
  'King Charles Spaniel',
  'Collie',
  'Collie de Pelo Corto',
  'Shetland Sheepdog',
  'Old English Sheepdog',
  'Welsh Corgi Pembroke',
  'Welsh Corgi Cardigan',
  'Bouvier des Flandres',
  'Briard',
  'Leonberger',
  'Kuvasz',
  'Komondor',
  'Puli',
  'Nova Scotia Duck Tolling Retriever',
  'Flat-Coated Retriever',
  'Curly-Coated Retriever',
  'Perro de Agua Español',
  'Perro de Agua Portugués',
  'Presa Canario',
  'Tosa Inu',
  'Shiba Inu',
  'Spitz Japonés',
  'Hokkaido',
  'American Bully',
  'Staffordshire Bull Terrier',
  'Irish Terrier',
  'Kerry Blue Terrier',
  'Soft Coated Wheaten Terrier',
  'Dandie Dinmont Terrier',
  'Cairn Terrier',
  'Skye Terrier',
  'Norwich Terrier',
  'Norfolk Terrier',
  'Miniature Pinscher',
  'Affenpinscher',
  'Papillon',
  'Phalène',
  'Bichón Habanero',
  'Bolonka',
  'Coton de Tuléar',
  'Löwchen',
  'Xoloitzcuintle',
  'Cirneco dell\'Etna',
  'Pharaoh Hound',
  'Ibizan Hound',
  'Azawakh',
  'Sloughi',
  'Chart Polski',
  'Hungarian Vizsla',
  'Irish Water Spaniel',
  'American Foxhound',
  'English Foxhound',
  'Harrier',
  'Otterhound',
  'Plott Hound',
  'Treeing Walker Coonhound',
  'Anatolian Shepherd',
  'Kangal',
  'Caucasian Shepherd',
  'Central Asian Shepherd',
  'Perro de Montaña de los Pirineos',
  'Perro de Montaña de Berna',
  'Appenzeller',
  'Entlebucher',
  'Hovawart',
  'Eurasier',
  'Finnish Spitz',
  'Laika Siberiano',
  'Saarlooswolfdog',
  'Czechoslovakian Wolfdog',
];

/* ─────────────── Alias argentinos / variantes coloquiales ─────────────── */
// Clave: término de búsqueda normalizado (minúsculas, sin acento)
// Valor: nombre canónico que aparece en RAZAS_BASE

const ALIAS: Record<string, string> = {
  // Mastín Napolitano
  'mastin napolitano':   'Mastín Napolitano',
  'mastin napolitan':    'Mastín Napolitano',
  'napolitano':          'Mastín Napolitano',
  'napolitan':           'Mastín Napolitano',
  'mastino':             'Mastín Napolitano',
  'mastino napoletano':  'Mastín Napolitano',

  // Pastor Alemán
  'ovejero':             'Pastor Alemán',
  'ovejero aleman':      'Pastor Alemán',
  'pastor aleman':       'Pastor Alemán',
  'perro policia':       'Pastor Alemán',

  // Dachshund / Salchicha
  'salchicha':           'Dachshund',
  'perro salchicha':     'Dachshund',
  'teckel':              'Dachshund',
  'basset aleman':       'Dachshund',

  // Caniche / Poodle
  'french poodle':       'Caniche',
  'caniche toy':         'Caniche Toy',
  'caniche enano':       'Caniche Miniatura',
  'caniche mini':        'Caniche Miniatura',

  // Pit Bull
  'pitbull':             'Pit Bull Terrier',
  'pit':                 'Pit Bull Terrier',
  'pit bull':            'Pit Bull Terrier',
  'amstaff':             'American Staffordshire Terrier',
  'american staffordshire': 'American Staffordshire Terrier',

  // Labrador
  'labrador':            'Labrador Retriever',
  'labrador negro':      'Labrador Retriever',
  'labrador chocolate':  'Labrador Retriever',

  // Golden
  'golden':              'Golden Retriever',

  // Dogo Argentino
  'dogo':                'Dogo Argentino',
  'dogo arg':            'Dogo Argentino',

  // Fila
  'fila':                'Fila Brasileño',
  'fila brasilero':      'Fila Brasileño',

  // Boxer
  'boxer':               'Boxer',
  'boxear':              'Boxer',

  // Chihuahua
  'chihuahueño':         'Chihuahua',
  'chihuahena':          'Chihuahua',

  // Bulldog
  'bulldog':             'Bulldog Inglés',
  'bulldog ingles':      'Bulldog Inglés',
  'bulldog frances':     'Bulldog Francés',
  'francés':             'Bulldog Francés',
  'frances':             'Bulldog Francés',

  // Husky
  'husky':               'Husky Siberiano',

  // Pomerania
  'pomeranian':          'Pomerania',
  'pom':                 'Pomerania',
  'perro ardilla':       'Pomerania',

  // Cocker
  'coker':               'Cocker Spaniel',
  'cocker':              'Cocker Spaniel',

  // Schnauzer
  'schnauzer mini':      'Schnauzer Miniatura',
  'schnauzer enano':     'Schnauzer Miniatura',
  'schnauzer gigante':   'Schnauzer Gigante',

  // Yorkshire
  'yorki':               'Yorkshire Terrier',
  'yorkie':              'Yorkshire Terrier',
  'yorkshire':           'Yorkshire Terrier',

  // Maltes
  'maltes':              'Maltés',

  // Shar Pei
  'shar-pei':            'Shar Pei',
  'charpei':             'Shar Pei',

  // Pug
  'carlino':             'Pug',

  // Dobermann
  'doberman':            'Dobermann',
  'dóberman':            'Dobermann',

  // Rottweiler
  'rott':                'Rottweiler',
  'rotti':               'Rottweiler',

  // Beagle
  'bigle':               'Beagle',

  // Bichon
  'bichon':              'Bichón Frisé',
  'bichon frise':        'Bichón Frisé',

  // Presa Canario / Dogo Canario
  'presa':               'Presa Canario',
  'dogo canario':        'Presa Canario',

  // Cane Corso
  'cane corso':          'Cane Corso',
  'corso':               'Cane Corso',

  // American Bully
  'bully':               'American Bully',
  'am bully':            'American Bully',

  // Gran Danés
  'danes':               'Gran Danés',
  'gran danes':          'Gran Danés',
  'great dane':          'Gran Danés',

  // Malamute
  'malamute':            'Malamute de Alaska',

  // Collie
  'lassie':              'Collie',

  // Shiba
  'shiba':               'Shiba Inu',

  // Jack Russell
  'jack':                'Jack Russell Terrier',
  'jack russell':        'Jack Russell Terrier',

  // West Highland
  'westie':              'West Highland White Terrier',
  'west highland':       'West Highland White Terrier',

  // Weimaraner
  'braco weimar':        'Weimaraner',

  // Mastín Inglés
  'mastin ingles':       'Mastín Inglés',

  // Pastor Belga
  'malinois':            'Pastor Belga Malinois',
  'mali':                'Pastor Belga Malinois',

  // Pastor Australiano
  'aussie':              'Pastor Australiano',

  // Border Collie
  'border':              'Border Collie',

  // Samoyedo
  'samoyed':             'Samoyedo',

  // Perro de Agua
  'perro de agua':       'Perro de Agua Español',
  'water dog':           'Perro de Agua Español',

  // Bloodhound
  'san huberto':         'Bloodhound',

  // Old English
  'bobtail':             'Old English Sheepdog',

  // Afghan Hound
  'galgo afgano':        'Afghan Hound',

  // Galgo
  'galgo español':       'Galgo Español',
};

/* ─────────────── Búsqueda combinada ─────────────── */

function norm(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function buscarRazas(query: string): string[] {
  if (!query.trim()) return RAZAS_BASE;

  const q = norm(query);
  const resultados = new Set<string>();

  // 1. Match directo en lista base
  for (const r of RAZAS_BASE) {
    if (norm(r).includes(q)) resultados.add(r);
  }

  // 2. Match en aliases
  for (const [alias, canonica] of Object.entries(ALIAS)) {
    if (norm(alias).includes(q) || q.includes(norm(alias))) {
      resultados.add(canonica);
    }
  }

  // 3. Si no hay resultados, búsqueda más amplia (por palabras individuales)
  if (resultados.size === 0) {
    for (const r of RAZAS_BASE) {
      const palabras = q.split(/\s+/).filter(p => p.length > 2);
      if (palabras.some(p => norm(r).includes(p))) resultados.add(r);
    }
  }

  return [...resultados].sort();
}

/* ─────────────── Componente ─────────────── */

interface Props {
  value:     string;
  onChange:  (value: string) => void;
  className?: string;
  required?:  boolean;
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
    const found = buscarRazas(val);
    setSuggestions(found);
    setOpen(found.length > 0);
  }

  function handleFocus() {
    const found = buscarRazas(value);
    setSuggestions(found);
    setOpen(found.length > 0);
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
        placeholder="Ej: Labrador, Ovejero, Mastín Napolitano…"
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
