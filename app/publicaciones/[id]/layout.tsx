import { createClient } from '@supabase/supabase-js';
import type { Metadata } from 'next';

interface Props { params: { id: string }; children: React.ReactNode }

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data: post } = await admin
    .from('posts')
    .select('nombre, descripcion, categoria, zona, images')
    .eq('id', params.id)
    .single();

  if (!post) return { title: 'Aviso | Vecindog' };

  const cat =
    post.categoria === 'perdido'    ? 'Perdido' :
    post.categoria === 'encontrado' ? 'Visto'   :
    post.categoria === 'adopcion'   ? 'En adopción' : 'Aviso';

  const nombre = post.nombre ?? 'Perro sin nombre';
  const title  = `${nombre} — ${cat} en ${post.zona} | Vecindog`;
  const description = post.descripcion?.slice(0, 160) ?? `${cat}: ${nombre} en ${post.zona}`;
  const image  = post.images?.[0];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image, width: 800, height: 600 }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default function Layout({ children }: Props) {
  return <>{children}</>;
}
