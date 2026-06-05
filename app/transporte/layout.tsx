import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Transporte de perros | Vecindog',
  description: 'Encontrá transportadores de perros de confianza en tu vecindario o ofrecé tus servicios.',
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
