type Tone = 'color' | 'mono';

interface LogoProps {
  className?: string;
  tone?: Tone;
}

/* ─── Solo el ícono (pin con huella) ─── */
export function LogoMark({ className = 'h-10', tone = 'color' }: LogoProps) {
  const pinColor = tone === 'color' ? '#d31323' : '#1a1a1a';
  const pinDark  = tone === 'color' ? '#ba0022' : '#1a1a1a';
  const pawColor = tone === 'color' ? '#413f3f' : '#1a1a1a';

  return (
    <svg
      viewBox="0 0 59.57 89.72"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Vecindog"
      role="img"
    >
      <path fill={pinColor} d="M29.79,0C13.34,0,0,13.34,0,29.79,0,53.16,21.13,65.1,29.79,89.72c8.66-24.62,29.79-36.56,29.79-59.93C59.57,13.34,46.24,0,29.79,0ZM35.22,51.3c-.29.07-.58.14-.87.2-.57,3.35-.69,7.15-.66,7.26,0,0,0,0,0,0-.07.04-3.33-2.52-5.14-5.57-.14-.23-.26-.45-.38-.67-8.91-.35-16.29-6.5-18.57-15.58-2.77-11.04,3.93-22.24,14.97-25.01s22.24,3.93,25.01,14.97c2.77,11.04-3.32,21.63-14.36,24.4Z"/>
      <g fill={pawColor}>
        <path d="M23.05,33.88c-1.24.15-2.39-.95-2.57-2.46-.24-1.96.54-3.89,1.77-4.04,1.24-.15,2.48,1.67,2.7,3.49.19,1.51-.66,2.86-1.9,3.01Z"/>
        <path d="M32.78,40.28c-1.76-.04-2.43-.82-3.56-.84-1.13-.02-1.83.73-3.59.7-2.3-.05-3.96-2.94-1.83-4.79,2.65-2.3,3.45-5.24,5.61-5.19,2.17.04,2.84,3.02,5.39,5.42,2.05,1.94.28,4.76-2.02,4.71Z"/>
        <path d="M30.05,26.32c.19-1.82,1.41-3.67,2.64-3.53,1.24.13,2.05,2.05,1.84,4.01-.16,1.51-1.3,2.63-2.53,2.5-1.24-.13-2.11-1.47-1.95-2.98Z"/>
        <path d="M24.42,26.59c-.13-1.97.76-3.85,2-3.93,1.24-.08,2.38,1.81,2.49,3.64.1,1.52-.83,2.82-2.07,2.9-1.24.08-2.33-1.09-2.43-2.61Z"/>
        <path d="M35.61,34.14c-1.23-.2-2.02-1.59-1.77-3.09.3-1.81,1.62-3.58,2.84-3.37,1.23.2,1.93,2.16,1.6,4.11-.25,1.5-1.45,2.56-2.67,2.35Z"/>
      </g>
      <path fill={pinDark} d="M28.55,53.2c-.14-.23-.26-.45-.38-.67-8.91-.35-16.29-6.5-18.57-15.58-2.77-11.04,3.93-22.24,14.97-25.01,1.75-.44,3.49-.61,5.21-.6V0C13.34,0,0,13.34,0,29.79c0,23.37,21.13,35.31,29.79,59.93v-34.77c-.44-.56-.87-1.14-1.24-1.75Z"/>
    </svg>
  );
}

/* ─── Solo el wordmark ─── */
export function Wordmark({
  className = 'text-2xl',
  tone = 'color',
}: {
  className?: string;
  tone?: 'color' | 'mono';
  highlight?: boolean;
}) {
  const dark = tone === 'color' ? '#413f3f' : '#1a1a1a';
  const red  = tone === 'color' ? '#ba0022' : '#1a1a1a';
  return (
    <span className={`font-display font-extrabold tracking-tight ${className}`}>
      <span style={{ color: dark }}>Vecin</span>
      <span style={{ color: red }}>dog</span>
    </span>
  );
}

/* ─── Ícono + texto ─── */
export function BrandBadge({
  className = '',
  size = 'md',
  tone = 'color',
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'color' | 'mono';
  highlight?: boolean;
}) {
  const sizes = {
    sm: { mark: 'h-6',  word: 'text-lg'  },
    md: { mark: 'h-8',  word: 'text-xl'  },
    lg: { mark: 'h-12', word: 'text-3xl' },
  };
  const s = sizes[size];
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className={s.mark} tone={tone} />
      <Wordmark className={s.word} tone={tone} />
    </span>
  );
}

export default BrandBadge;
