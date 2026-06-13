import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Adoptar mascotas | Vecindog',
  description: 'Adoptá perros y gatos de vecinos cerca tuyo. Todos los animales en adopción están verificados por la comunidad.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
