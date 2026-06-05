import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Buscar perro por foto | Vecindog',
  description: 'Subí una foto y comparamos los colores con los perros perdidos publicados.',
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
