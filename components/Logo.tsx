/**
 * Logo Vecindog — SVG inline.
 *
 * Inspiración: pin coral con silueta de perro tipo Labrador y correa colgando.
 * Variantes:
 *   - <LogoMark />     pin solo (cuadrado, para iconos)
 *   - <Wordmark />     texto "Vecindog"
 *   - <BrandBadge />   pin + wordmark (default)
 *
 * Todos los SVG son inline para que tomen el color/tamaño desde CSS.
 */

type Tone = 'color' | 'mono';

interface LogoProps {
  className?: string;
  tone?: Tone;        // 'color' (coral) | 'mono' (charcoal)
}

/* ------------------------------ LogoMark (pin) ------------------------------ */

export function LogoMark({ className = 'h-10 w-10', tone = 'color' }: LogoProps) {
  // Coral principal de marca (= var --brand-coral). Hardcodeado porque es un SVG fill.
  const pinFill = tone === 'color' ? '#B85C4A' : '#1A1A1A';
  const dogFill = '#1A1A1A';
  const eyeFill = '#F5EFE6';

  return (
    <svg
      viewBox="0 0 100 120"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Logo Vecindog"
      role="img"
    >
      {/* Pin (teardrop) */}
      <path
        d="M50 4
           C72 4 90 22 90 44
           C90 66 50 116 50 116
           C50 116 10 66 10 44
           C10 22 28 4 50 4 Z"
        fill={pinFill}
      />
      {/* Inner cream circle (negative space) */}
      <circle cx="50" cy="44" r="30" fill="#F5EFE6" />

      {/* Dog head silhouette (side profile, snout a la derecha) */}
      <g transform="translate(50 44)" fill={dogFill}>
        {/* Ear (floppy, top-left) */}
        <ellipse cx="-13" cy="-8" rx="7" ry="13" transform="rotate(-22 -13 -8)" />
        {/* Head main shape */}
        <ellipse cx="-2" cy="0" rx="18" ry="14" />
        {/* Snout extension (a la derecha) */}
        <ellipse cx="14" cy="3" rx="10" ry="7.5" />
        {/* Nose tip */}
        <ellipse cx="22" cy="2" rx="2.5" ry="2" />
      </g>

      {/* Eye (white dot sobre la cabeza) */}
      <circle cx="46" cy="40" r="1.8" fill={eyeFill} />

      {/* Leash colgando de la boca */}
      <path
        d="M72 49
           Q78 55 78 62
           Q78 68 74 68
           Q70 68 70 62
           Q70 56 72 52"
        fill="none"
        stroke={dogFill}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ------------------------------ Wordmark ------------------------------ */

export function Wordmark({
  className = 'text-2xl',
  highlight = false
}: {
  className?: string;
  highlight?: boolean;   // pinta "dog" en coral
}) {
  return (
    <span className={`font-display font-extrabold tracking-tight text-ink ${className}`}>
      Vecin
      <span className={highlight ? 'text-brand-primary' : ''}>dog</span>
    </span>
  );
}

/* ------------------------------ BrandBadge (logo completo) ------------------------------ */

export function BrandBadge({
  className = '',
  size = 'md',
  highlight = false
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  highlight?: boolean;
}) {
  const sizes = {
    sm: { mark: 'h-7 w-7',  word: 'text-lg'  },
    md: { mark: 'h-9 w-9',  word: 'text-xl'  },
    lg: { mark: 'h-14 w-14', word: 'text-3xl' }
  };
  const s = sizes[size];
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className={s.mark} />
      <Wordmark className={s.word} highlight={highlight} />
    </span>
  );
}

export default BrandBadge;
