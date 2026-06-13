import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Casos resueltos — Perros que volvieron a casa | Vecindog',
  description: 'Historias reales de perros perdidos que fueron encontrados gracias a la comunidad de Vecindog.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
