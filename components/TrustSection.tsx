import { MapPin, MessageCircle, Ban, Heart, Users2, BadgeCheck, Shield } from 'lucide-react';

type IconType = React.ComponentType<{ className?: string }>;

const ITEMS: { icon: IconType; titulo: string; texto: string }[] = [
  { icon: MapPin,         titulo: 'Publicaciones por ciudad', texto: 'Los avisos se filtran por tu barrio y ciudad.' },
  { icon: MessageCircle,  titulo: 'Contacto rápido',           texto: 'Directo por WhatsApp, sin intermediarios.' },
  { icon: Ban,            titulo: 'No venta de animales',      texto: 'Vecindog es solo para reunir y adoptar.' },
  { icon: Heart,          titulo: 'Adopción responsable',      texto: 'Recomendaciones claras para nuevas familias.' },
  { icon: Users2,         titulo: 'Comunidad vecinal',         texto: 'Hecho entre vecinos que se ayudan.' },
  { icon: BadgeCheck,     titulo: 'Avisos claros',             texto: 'Foto, barrio y datos verificables siempre.' }
];

export default function TrustSection() {
  return (
    <section className="relative overflow-hidden rounded-[28px] bg-white p-6 shadow-soft ring-1 ring-black/5 md:p-10">
      {/* fondo */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-brand-primary/5" />
      <div className="pointer-events-none absolute -bottom-16 -left-12 h-56 w-56 rounded-full bg-good/5" />

      <div className="relative">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-brand-primary/10 text-brand-primary">
            <Shield className="h-5 w-5" />
          </span>
          <h2 className="font-display text-xl font-extrabold text-ink md:text-2xl">
            Una comunidad cuidada
          </h2>
        </div>
        <p className="mt-1 text-sm text-ink-muted">
          Reglas claras para que ayudar sea seguro para todos.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((it) => (
            <ItemCard key={it.titulo} {...it} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ItemCard({ icon: Icon, titulo, texto }: { icon: IconType; titulo: string; texto: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-brand-cream/70 p-4 transition hover:bg-brand-cream">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-brand-primary shadow-sm">
        <Icon className="h-5 w-5" />
      </div>
      <div className="leading-snug">
        <p className="text-sm font-extrabold text-ink">{titulo}</p>
        <p className="mt-0.5 text-xs text-ink-muted">{texto}</p>
      </div>
    </div>
  );
}
