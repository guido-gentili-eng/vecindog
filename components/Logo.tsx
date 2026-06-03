/**
 * Logo Vecindog — SVG inline.
 *
 * Rediseñado para coincidir con el logo oficial:
 *   - Pin coral con borde redondeado
 *   - Círculo interior blanco/crema
 *   - Silueta de perro (perfil izquierdo) con oreja floppy a la derecha,
 *     cuerpo/pecho visible y correa colgando hacia abajo
 *
 * Variantes:
 *   - <LogoMark />     pin solo (para favicon e iconos)
 *   - <Wordmark />     texto "Vecindog"
 *   - <BrandBadge />   pin + wordmark (default)
 */

type Tone = 'color' | 'mono';

interface LogoProps {
  className?: string;
  tone?: Tone;
}

/* ─────────────────── LogoMark (pin con perro) ─────────────────── */

export function LogoMark({ className = 'h-10 w-10', tone = 'color' }: LogoProps) {
  const pinFill = tone === 'color' ? '#EE5A3B' : '#1A1A1A';
  const dogFill = '#1A1A1A';
  const innerBg = '#F5EFE6';

  return (
    <svg
      viewBox="0 0 100 122"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Logo Vecindog"
      role="img"
    >
      {/* Pin shape — redondeado arriba, punta abajo */}
      <path
        d="M50 3
           C25 3 8 20 8 42
           C8 64 50 119 50 119
           C50 119 92 64 92 42
           C92 20 75 3 50 3 Z"
        fill={pinFill}
      />

      {/* Círculo interior blanco */}
      <circle cx="50" cy="42" r="32" fill={innerBg} />

      {/* ── Silueta del perro (perfil izquierdo, snout → izquierda) ── */}
      <g fill={dogFill}>
        {/* Cabeza principal */}
        <ellipse cx="50" cy="37" rx="17" ry="14" />

        {/* Hocico (snout) apuntando a la izquierda */}
        <ellipse cx="35" cy="41" rx="11" ry="8" />

        {/* Nariz */}
        <ellipse cx="26" cy="40" rx="3" ry="2.5" />

        {/* Oreja floppy — cae hacia la derecha/abajo */}
        <ellipse cx="63" cy="34" rx="7" ry="13"
          transform="rotate(15 63 34)" />

        {/* Cuerpo/pecho — visible en la parte baja del círculo */}
        <ellipse cx="52" cy="57" rx="16" ry="10" />

        {/* Cuello que une cabeza con cuerpo */}
        <rect x="44" y="47" width="14" height="12" rx="4" />
      </g>

      {/* Ojo — punto blanco */}
      <circle cx="52" cy="33" r="2.2" fill={innerBg} />

      {/* Correa — cuelga desde el cuello hacia abajo */}
      <path
        d="M56 64 Q58 72 56 80 Q54 86 58 88"
        fill="none"
        stroke={dogFill}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Argolla de la correa */}
      <circle cx="56" cy="64" r="3" fill="none"
        stroke={dogFill} strokeWidth="2.5" />
    </svg>
  );
}

/* ─────────────────── Wordmark ─────────────────── */

export function Wordmark({
  className = 'text-2xl',
  highlight = false,
}: {
  className?: string;
  highlight?: boolean;
}) {
  return (
    <span className={`font-display font-extrabold tracking-tight text-ink ${className}`}>
      Vecin
      <span className={highlight ? 'text-brand-primary' : ''}>dog</span>
    </span>
  );
}

/* ─────────────────── BrandBadge (pin + wordmark) ─────────────────── */

export function BrandBadge({
  className = '',
  size = 'md',
  highlight = false,
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  highlight?: boolean;
}) {
  const sizes = {
    sm: { mark: 'h-7 w-7',   word: 'text-lg'  },
    md: { mark: 'h-9 w-9',   word: 'text-xl'  },
    lg: { mark: 'h-14 w-14', word: 'text-3xl' },
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
