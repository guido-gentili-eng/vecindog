import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calculadora de edad de perros | Vecindog',
  description: 'Convertí la edad de tu perro a años humanos. Calculadora gratuita con tablas por tamaño de raza.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
