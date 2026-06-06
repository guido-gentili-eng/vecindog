import Link from 'next/link';
import { Search, MapPin, Heart, Home, ArrowRight, Footprints, HandHeart, Car } from 'lucide-react';

type IconType = React.ComponentType<{ className?: string }>;

interface Accion {
  href: string;
  icon: IconType;
  titulo: string;
  texto: string;
  chip?: string;
  /** clase Tailwind para fondo de la card */
  bg: string;
  /** clase Tailwind para texto principal sobre la card */
  text: string;
  /** clase Tailwind para el "puck" del ícono */
  iconBg: string;
  /** clase Tailwind para el accent strip a la izquierda */
  accent: string;
}

/* Paleta de 4 colores diferenciables pero en la misma familia cálida.
 * Cada card usa tokens del sistema Vecindog (definidos en tailwind.config.js):
 *   - coral-bright  → buscando (urgencia)
 *   - sage          → encontrado (calma, ayuda)
 *   - gold          → adoptar (hogar, oportunidad)
 *   - coral         → dar en adopción (marca, responsabilidad)
 *
 * Mismo tamaño, sombra, opacidad de huellitas y saturación visual. */
const ACCIONES: Accion[] = [
  {
    href: '/publicar?cat=perdido',
    icon: Search,
    titulo: 'Estoy buscando',
    texto: 'Publicá un aviso para que la comunidad te ayude a encontrarlo.',
    chip: 'Perdidos',
    bg:     'bg-brand-coral-bright',
    text:   'text-white',
    iconBg: 'bg-white/22',
    accent: 'bg-brand-coral-dark',
  },
  {
    href: '/publicar?cat=encontrado',
    icon: MapPin,
    titulo: 'Vi uno perdido',
    texto: 'Avisá a la comunidad para ayudarlo a volver a casa.',
    chip: 'Tarda 1 minuto',
    bg:     'bg-brand-sage',
    text:   'text-white',
    iconBg: 'bg-white/22',
    accent: 'bg-brand-sage-dark'
  },
  {
    href: '/publicar?cat=adopcion',
    icon: Home,
    titulo: 'Doy en adopción',
    texto: 'Publicá un perro que necesita un nuevo hogar.',
    chip: 'Comunidad cuidada',
    bg:     'bg-brand-coral',
    text:   'text-white',
    iconBg: 'bg-white/22',
    accent: 'bg-brand-coral-dark'
  },
  {
    href: '/publicar?cat=transito',
    icon: Footprints,
    titulo: 'En tránsito',
    texto: 'Lo tenés temporalmente o lo viste en la calle. La comunidad puede ayudar.',
    chip: 'Comunidad',
    bg:     'bg-[#5b21b6]',
    text:   'text-white',
    iconBg: 'bg-white/22',
    accent: 'bg-[#4c1d95]'
  },
];

/**
 * Bloque central de la home: 4 cards grandes + 1 card ancha de cuidado.
 * Layout:
 *   - Mobile: 1 columna.
 *   - Desktop (sm+): 2x2 + 1 full-width.
 */
export default function ActionCards() {
  return (
    <section aria-label="Acciones principales">
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
        {ACCIONES.map((a) => (
          <Card key={a.href} {...a} />
        ))}
      </div>
      {/* Cards de servicios: cuidado + transporte */}
      <div className="mt-2.5 sm:mt-4 grid grid-cols-2 gap-2.5 sm:gap-4">
        <a
          href="/cuidado"
          className="group relative flex overflow-hidden rounded-[22px] bg-teal-600 text-white shadow-soft ring-1 ring-black/5 transition duration-200 hover:-translate-y-0.5 hover:shadow-card active:scale-[0.99]"
        >
          <div className="w-1.5 shrink-0 bg-teal-800" />
          <div className="relative flex flex-1 flex-col gap-2 p-3 sm:flex-row sm:items-start sm:gap-4 sm:p-5">
            <PawPrintBg className="pointer-events-none absolute -bottom-3 -right-3 h-16 w-16 rotate-12 opacity-15" />
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl shadow-inner backdrop-blur-sm sm:h-14 sm:w-14 sm:rounded-2xl">
              <span className="grid h-full w-full place-items-center rounded-xl sm:rounded-2xl bg-white/22">
                <HandHeart className="h-5 w-5 sm:h-7 sm:w-7" />
              </span>
            </div>
            <div>
              <span className="inline-flex items-center rounded-full bg-white/25 px-1.5 py-0.5 text-[9px] font-bold backdrop-blur-sm sm:px-2 sm:text-[10px]">
                Nuevo
              </span>
              <h3 className="mt-0.5 font-display text-sm font-extrabold leading-tight sm:text-xl">
                Cuidado
              </h3>
              <p className="mt-0.5 hidden text-xs leading-snug opacity-90 sm:block sm:text-sm">
                Buscá un cuidador o anotate para cuidar perros de otros vecinos.
              </p>
              <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold opacity-80 transition group-hover:gap-2 group-hover:opacity-100 sm:text-xs">
                Empezar <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </a>

        <a
          href="/transporte"
          className="group relative flex overflow-hidden rounded-[22px] bg-blue-600 text-white shadow-soft ring-1 ring-black/5 transition duration-200 hover:-translate-y-0.5 hover:shadow-card active:scale-[0.99]"
        >
          <div className="w-1.5 shrink-0 bg-blue-800" />
          <div className="relative flex flex-1 flex-col gap-2 p-3 sm:flex-row sm:items-start sm:gap-4 sm:p-5">
            <PawPrintBg className="pointer-events-none absolute -bottom-3 -right-3 h-16 w-16 rotate-12 opacity-15" />
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl shadow-inner backdrop-blur-sm sm:h-14 sm:w-14 sm:rounded-2xl">
              <span className="grid h-full w-full place-items-center rounded-xl sm:rounded-2xl bg-white/22">
                <Car className="h-5 w-5 sm:h-7 sm:w-7" />
              </span>
            </div>
            <div>
              <span className="inline-flex items-center rounded-full bg-white/25 px-1.5 py-0.5 text-[9px] font-bold backdrop-blur-sm sm:px-2 sm:text-[10px]">
                Nuevo
              </span>
              <h3 className="mt-0.5 font-display text-sm font-extrabold leading-tight sm:text-xl">
                Transporte
              </h3>
              <p className="mt-0.5 hidden text-xs leading-snug opacity-90 sm:block sm:text-sm">
                Encontrá quien lleve a tu perro o anotate para transportar perros de vecinos.
              </p>
              <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold opacity-80 transition group-hover:gap-2 group-hover:opacity-100 sm:text-xs">
                Empezar <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}

function Card({ href, icon: Icon, titulo, texto, chip, bg, text, iconBg, accent }: Accion) {
  return (
    <Link
      href={href}
      className={`group relative flex overflow-hidden rounded-[22px] shadow-soft ring-1 ring-black/5 transition duration-200 hover:-translate-y-0.5 hover:shadow-card active:scale-[0.99] ${bg} ${text}`}
    >
      {/* Strip lateral de color (accent) */}
      <div className={`w-1.5 shrink-0 ${accent}`} />

      <div className="relative flex flex-1 flex-col gap-2 p-3 sm:gap-4 sm:p-5">
        {/* Paw decorativo grande */}
        <PawPrintBg className="pointer-events-none absolute -bottom-3 -right-3 h-16 w-16 rotate-12 opacity-15" />

        {/* Ícono */}
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl shadow-inner backdrop-blur-sm sm:h-14 sm:w-14 sm:rounded-2xl">
          <span className={`grid h-full w-full place-items-center rounded-xl sm:rounded-2xl ${iconBg}`}>
            <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
          </span>
        </div>

        <div className="flex-1">
          {chip && (
            <span className="inline-flex items-center rounded-full bg-white/25 px-1.5 py-0.5 text-[9px] font-bold backdrop-blur-sm sm:px-2 sm:text-[10px]">
              {chip}
            </span>
          )}
          <h3 className="mt-0.5 font-display text-sm font-extrabold leading-tight sm:text-xl">
            {titulo}
          </h3>
          <p className="mt-0.5 hidden text-xs leading-snug opacity-90 sm:block sm:text-sm">{texto}</p>
          <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold opacity-80 transition group-hover:gap-2 group-hover:opacity-100 sm:text-xs">
            Empezar <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function PawPrintBg({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <ellipse cx="7" cy="11" rx="3" ry="4" />
      <ellipse cx="14" cy="6" rx="3" ry="4" />
      <ellipse cx="22" cy="6" rx="3" ry="4" />
      <ellipse cx="29" cy="11" rx="3" ry="4" />
      <path d="M18 14c-6 0-10 5-10 9 0 4 4 6 10 6s10-2 10-6c0-4-4-9-10-9z" />
    </svg>
  );
}
