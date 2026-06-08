'use client';

import { useRouter } from 'next/navigation';
import { X, ArrowRight } from 'lucide-react';

export interface HowItWorksData {
  titulo: string;
  subtitulo: string;
  pasos: { emoji: string; titulo: string; desc: string }[];
  ctaLabel: string;
  href: string;
}

export const HOW_IT_WORKS: Record<string, HowItWorksData> = {
  perdido: {
    titulo: 'Buscar a mi perro',
    subtitulo: 'Publicá el aviso y la comunidad de tu ciudad te ayuda a encontrarlo.',
    pasos: [
      { emoji: '📸', titulo: 'Subí una foto y datos', desc: 'Nombre, color, barrio donde se perdió y tu WhatsApp.' },
      { emoji: '🏙️', titulo: 'La comunidad lo ve al instante', desc: 'Vecinos de tu ciudad reciben el aviso en tiempo real.' },
      { emoji: '📲', titulo: 'Te contactan directo', desc: 'Si alguien lo ve, te escribe por WhatsApp sin intermediarios.' },
    ],
    ctaLabel: 'Publicar aviso',
    href: '/publicar?cat=perdido',
  },
  encontrado: {
    titulo: 'Vi un perro perdido',
    subtitulo: 'Avisá a la comunidad para que el dueño lo encuentre lo antes posible.',
    pasos: [
      { emoji: '📷', titulo: 'Sacá una foto donde lo encontraste', desc: 'Cuantos más datos, más fácil que el dueño lo reconozca.' },
      { emoji: '📍', titulo: 'Publicá en tu zona', desc: 'El aviso llega a los vecinos del barrio correcto.' },
      { emoji: '🤝', titulo: 'El dueño te contacta', desc: 'Te escribe directamente por WhatsApp para coordinar.' },
    ],
    ctaLabel: 'Publicar aviso',
    href: '/publicar?cat=encontrado',
  },
  adopcion: {
    titulo: 'Dar en adopción',
    subtitulo: 'Encontrá una familia responsable para el perro, cerca tuyo.',
    pasos: [
      { emoji: '🐶', titulo: 'Creá el perfil del perro', desc: 'Fotos, descripción, edad y lo que necesita en su nueva familia.' },
      { emoji: '❤️', titulo: 'Familias de tu ciudad lo conocen', desc: 'Solo personas de tu zona ven el aviso.' },
      { emoji: '✅', titulo: 'Vos elegís', desc: 'Te contactan por WhatsApp y decidís a quién se lo entregás.' },
    ],
    ctaLabel: 'Publicar adopción',
    href: '/publicar?cat=adopcion',
  },
  transito: {
    titulo: 'Alojar en tránsito',
    subtitulo: 'Ofrecé un hogar temporal a un perro que lo necesita.',
    pasos: [
      { emoji: '🏠', titulo: 'Publicá que tenés lugar', desc: 'Avisá que podés alojar un perro de forma temporaria.' },
      { emoji: '🔔', titulo: 'Rescatistas te encuentran', desc: 'Vecinos y organizaciones de tu zona te ven al instante.' },
      { emoji: '💬', titulo: 'Coordinás por WhatsApp', desc: 'Todo el acuerdo es directo, sin intermediarios.' },
    ],
    ctaLabel: 'Ofrecer tránsito',
    href: '/publicar?cat=transito',
  },
  cuidado: {
    titulo: 'Cuidar perros',
    subtitulo: 'Ofrecé tu servicio de cuidado a dueños de tu ciudad.',
    pasos: [
      { emoji: '🐾', titulo: 'Publicá que podés cuidar', desc: 'Días disponibles, tipo de servicio y tu ubicación.' },
      { emoji: '🏘️', titulo: 'Dueños de tu zona te encuentran', desc: 'Apareceés en los resultados de búsqueda de tu ciudad.' },
      { emoji: '📞', titulo: 'Acordás todo directamente', desc: 'El dueño te contacta por WhatsApp y coordinan los detalles.' },
    ],
    ctaLabel: 'Ofrecer cuidado',
    href: '/cuidado',
  },
  transporte: {
    titulo: 'Transportar mascotas',
    subtitulo: 'Encontrá o publicá un traslado de mascotas en Argentina.',
    pasos: [
      { emoji: '🚗', titulo: 'Publicá el traslado', desc: 'Origen, destino, fecha y datos de la mascota.' },
      { emoji: '🇦🇷', titulo: 'Transportistas te ven', desc: 'Personas con experiencia en traslado de mascotas te contactan.' },
      { emoji: '🤙', titulo: 'Elegís y coordinás', desc: 'Hablás directo por WhatsApp y cerrás el acuerdo.' },
    ],
    ctaLabel: 'Publicar traslado',
    href: '/transporte',
  },
  mapa: {
    titulo: 'Ver el mapa',
    subtitulo: 'Explorá los avisos activos cerca tuyo en tiempo real.',
    pasos: [
      { emoji: '🗺️', titulo: 'Buscá por zona', desc: 'El mapa muestra todos los avisos activos en tu ciudad.' },
      { emoji: '📌', titulo: 'Tocá un pin', desc: 'Ves la foto, descripción y datos del aviso al instante.' },
      { emoji: '📲', titulo: 'Contactá directo', desc: 'Escribís al dueño o publicante por WhatsApp desde el aviso.' },
    ],
    ctaLabel: 'Abrir mapa',
    href: '/mapa',
  },
};

interface Props {
  featureKey: string;
  onClose: () => void;
  onDismiss?: () => void;
}

export default function HowItWorksSheet({ featureKey, onClose, onDismiss }: Props) {
  const router = useRouter();
  const data = HOW_IT_WORKS[featureKey];
  if (!data) return null;

  function handleCta() {
    onClose();
    router.push(data.href);
  }

  function handleDismiss() {
    onDismiss?.();
    handleCta();
  }

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative rounded-t-3xl bg-white shadow-2xl max-h-[85vh] overflow-y-auto">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-black/10" />
        </div>

        <div className="px-6 pb-8 pt-2">
          {/* Header */}
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-black text-ink">{data.titulo}</h2>
              <p className="mt-1 text-sm text-ink-muted leading-snug">{data.subtitulo}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-0.5 shrink-0 rounded-xl p-1.5 text-ink-muted hover:bg-brand-cream"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Pasos */}
          <div className="space-y-3 mb-6">
            {data.pasos.map((paso, i) => (
              <div key={i} className="flex items-start gap-4 rounded-2xl bg-brand-cream/60 px-4 py-3.5">
                <div className="relative shrink-0">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl shadow-soft">
                    {paso.emoji}
                  </span>
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-[10px] font-black text-white">
                    {i + 1}
                  </span>
                </div>
                <div>
                  <p className="font-display font-bold text-ink text-sm">{paso.titulo}</p>
                  <p className="mt-0.5 text-xs text-ink-muted leading-snug">{paso.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={handleCta}
            className="btn-primary w-full justify-center text-base"
          >
            {data.ctaLabel} <ArrowRight className="h-5 w-5" />
          </button>

          {/* No volver a mostrar */}
          {onDismiss && (
            <button
              type="button"
              onClick={handleDismiss}
              className="mt-3 w-full text-center text-xs text-ink-muted hover:text-ink transition"
            >
              No volver a mostrar este mensaje
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
