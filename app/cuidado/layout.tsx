import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Cuidado de perros | Vecindog',
  description: 'Encontrá cuidadores de perros de confianza en tu vecindario o ofrecé tus servicios.',
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
