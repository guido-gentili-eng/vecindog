/**
 * Logo Vecindog — SVG inline.
 * Diseño oficial: pin coral (borde + relleno) con círculo interior crema,
 * silueta de perro Labrador mirando a la izquierda, oreja floppy prominente
 * y correa fina colgando hacia abajo.
 */

type Tone = 'color' | 'mono';

interface LogoProps {
  className?: string;
  tone?: Tone;
}

/* ─────────────────── LogoMark ─────────────────── */

export function LogoMark({ className = 'h-10 w-10', tone = 'color' }: LogoProps) {
  const pinColor = tone === 'color' ? '#EE5A3B' : '#1A1A1A';
  const dogColor = tone === 'color' ? '#1A1A1A' : '#1A1A1A';
  const bg       = '#F5EFE6';

  return (
    <svg
      viewBox="0 0 100 124"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Logo Vecindog"
      role="img"
    >
      {/* ── Pin shape (relleno coral) ── */}
      <path
        d="M50 4
           C26 4 7 23 7 46
           C7 69 50 120 50 120
           C50 120 93 69 93 46
           C93 23 74 4 50 4 Z"
        fill={pinColor}
      />

      {/* ── Círculo interior crema ── */}
      <circle cx="50" cy="46" r="31" fill={bg} />

      {/* ── Silueta del perro ── */}
      <g fill={dogColor}>

        {/* Cabeza principal — oval centrado */}
        <ellipse cx="50" cy="43" rx="17" ry="15" />

        {/* Hocico — se extiende hacia la IZQUIERDA */}
        <path d="M34 38 Q22 41 23 49 Q24 55 32 54 Q40 53 40 46 Q40 40 34 38 Z" />

        {/* Nariz al final del hocico */}
        <ellipse cx="23" cy="49" rx="3" ry="2.5" />

        {/* Oreja floppy — grande, cae hacia abajo-derecha */}
        <path d="M60 30 Q74 28 76 40 Q78 52 68 58 Q62 61 58 55 Q54 49 56 40 Q57 33 60 30 Z" />

        {/* Cuello / cuerpo superior */}
        <ellipse cx="50" cy="61" rx="11" ry="7" />
        <rect x="41" y="54" width="18" height="12" rx="3" />

      </g>

      {/* Ojo — punto crema */}
      <circle cx="48" cy="39" r="2.5" fill={bg} />

      {/* Pupila */}
      <circle cx="48" cy="39" r="1.2" fill={dogColor} />

      {/* ── Correa — cuelga del cuello, sale por debajo del pin ── */}
      {/* Argolla del collar */}
      <circle cx="42" cy="65" r="3.5"
        fill="none" stroke={dogColor} strokeWidth="2.5" />

      {/* Correa fina que baja */}
      <path
        d="M42 68 Q38 80 40 92 Q41 100 38 106"
        fill="none"
        stroke={dogColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

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

/* ─────────────────── BrandBadge ─────────────────── */

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
