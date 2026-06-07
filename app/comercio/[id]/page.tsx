import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import ReviewsComercio from './ReviewsComercio';
import NovedadesComercio from './NovedadesComercio';
import TrackComercio from './TrackComercio';

interface Props { params: { id: string } }

const CATEGORIA_LABEL: Record<string, string> = {
  'veterinaria':        'Veterinaria',
  'pet-shop':           'Pet Shop',
  'peluqueria-canina':  'Peluquería Canina',
  'adiestrador':        'Adiestrador',
  'paseador':           'Paseador',
  'guarderia-hotel':    'Guardería / Hotel',
  'refugio-rescate':    'Refugio / Rescate',
  'tienda-mascotas':    'Tienda de Mascotas',
  'farmacia-veterinaria': 'Farmacia Veterinaria',
};

export async function generateMetadata({ params }: Props) {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data } = await admin.from('ads').select('titulo, categoria_local, imagen_url').eq('id', params.id).single();
  const nombre = data?.titulo ?? 'Comercio';
  const cat = CATEGORIA_LABEL[data?.categoria_local ?? ''] ?? '';
  return {
    title: `${nombre}${cat ? ` — ${cat}` : ''} | Vecindog`,
    description: `${nombre} en la Red Vecindog. Encontrá sus datos de contacto, horarios y reviews.`,
    openGraph: {
      title: nombre,
      images: data?.imagen_url ? [{ url: data.imagen_url }] : [],
    },
  };
}

export default async function PerfilComercioPage({ params }: Props) {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: comercio } = await admin
    .from('ads')
    .select('*')
    .eq('id', params.id)
    .eq('variant', 'comercio')
    .single();

  if (!comercio) notFound();

  const categoria = CATEGORIA_LABEL[comercio.categoria_local ?? ''] ?? comercio.categoria_local ?? '';

  return (
    <div className="min-h-screen bg-[#f5f0eb] py-8 px-4">
      <div className="mx-auto max-w-xl">

        <Link
          href="/red-vecindog"
          className="mb-4 inline-flex items-center gap-1 text-sm font-bold text-brand-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Red Vecindog
        </Link>

        {/* Header */}
        <div className="mb-5 overflow-hidden rounded-[24px] bg-white shadow-sm border border-black/5">
          {/* Foto de portada */}
          {comercio.imagen_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={comercio.imagen_url}
              alt={comercio.titulo}
              className="h-44 w-full object-cover"
            />
          ) : (
            <div className="h-32 w-full bg-gradient-to-br from-brand-primary/20 to-brand-primary/5 flex items-center justify-center text-5xl">
              🐾
            </div>
          )}

          <div className="px-5 pb-5 pt-4">
            {categoria && (
              <span className="mb-2 inline-block rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary">
                {categoria}
              </span>
            )}
            <h1 className="font-display text-2xl font-black text-ink">{comercio.titulo}</h1>
            {comercio.subtitulo && (
              <p className="mt-0.5 text-sm text-ink-muted">{comercio.subtitulo}</p>
            )}

            {/* Descripción */}
            {comercio.descripcion_comercio && (
              <p className="mt-3 text-sm text-ink leading-relaxed">{comercio.descripcion_comercio}</p>
            )}

            {/* Horario (estático, sin tracking) */}
            {(comercio.horario_apertura || comercio.horario_cierre) && (
              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#f5f0eb] px-4 py-3 text-sm text-ink">
                <Clock className="h-4 w-4 shrink-0 text-brand-primary" />
                <span>
                  {comercio.dias_atencion && <span className="font-semibold">{comercio.dias_atencion} · </span>}
                  {comercio.horario_apertura} – {comercio.horario_cierre}
                </span>
              </div>
            )}

            {/* Contacto + tracking */}
            <TrackComercio
              adId={params.id}
              telefono={comercio.telefono_comercio}
              direccion={comercio.direccion_comercio}
              href={comercio.href}
            />
          </div>
        </div>

        {/* Novedades */}
        <NovedadesComercio adId={params.id} />

        {/* Reviews */}
        <ReviewsComercio adId={params.id} nombreComercio={comercio.titulo} />

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-ink-muted/60">
            Miembro de la Red Vecindog · mivecindog.com.ar
          </p>
        </div>

      </div>
    </div>
  );
}
