import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Planes y precios | Vecindog',
  description: 'Accedé a la red vecinal completa con Vecindog Premium. Contactos ilimitados, alertas y más funciones para encontrar o dar en adopción.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
