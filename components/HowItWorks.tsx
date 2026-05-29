import { Camera, Users2, MessageCircle, Heart, ArrowRight } from 'lucide-react';

type IconType = React.ComponentType<{ className?: string }>;

const PASOS: { n: number; icon: IconType; titulo: string; texto: string }[] = [
  { n: 1, icon: Camera,         titulo: 'Publicás',        texto: 'Subís fotos y los datos clave en menos de un minuto.' },
  { n: 2, icon: Users2,         titulo: 'Vecinos lo ven',  texto: 'Tu aviso aparece en el tablón de tu ciudad.' },
  { n: 3, icon: MessageCircle,  titulo: 'Te contactan',    texto: 'Cuando alguien tiene una pista, te escribe por WhatsApp.' },
  { n: 4, icon: Heart,          titulo: 'Reencuentro',     texto: 'O la familia ideal aparece para adoptar.' }
];

export default function HowItWorks() {
  return (
    <section>
      <header className="mb-8 text-center md:mb-10">
        <span className="inline-flex items-center rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary">
          En 4 pasos
        </span>
        <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-ink md:text-4xl">
          ¿Cómo funciona Vecindog?
        </h2>
        <p className="mt-2 text-ink-muted">Tarda menos de un minuto.</p>
      </header>

      <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PASOS.map((p, i) => (
          <PasoCard key={p.n} {...p} ultimo={i === PASOS.length - 1} />
        ))}
      </div>
    </section>
  );
}

function PasoCard({
  n, icon: Icon, titulo, texto, ultimo
}: {
  n: number;
  icon: IconType;
  titulo: string;
  texto: string;
  ultimo: boolean;
}) {
  return (
    <div className="group relative">
      <div className="card relative h-full p-6 pt-9 transition hover:-translate-y-0.5 hover:shadow-card">
        {/* Número flotante */}
        <div className="absolute -top-4 left-6 grid h-10 w-10 place-items-center rounded-2xl bg-brand-primary font-black text-white shadow-soft ring-4 ring-brand-cream">
          {n}
        </div>
        {/* Ícono */}
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-cream text-brand-primary">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-display text-lg font-extrabold text-ink">{titulo}</h3>
        <p className="mt-1 text-sm text-ink-muted">{texto}</p>
      </div>

      {/* Flecha conectora (solo entre cards en desktop) */}
      {!ultimo && (
        <ArrowRight
          aria-hidden="true"
          className="pointer-events-none absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-brand-primary/40 lg:block"
        />
      )}
    </div>
  );
}
