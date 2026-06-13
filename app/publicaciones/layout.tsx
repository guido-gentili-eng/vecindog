import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Avisos de mascotas | Vecindog',
  description: 'Todos los avisos de perros perdidos, encontrados y en adopción cerca tuyo. Buscá por zona, color o raza.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
