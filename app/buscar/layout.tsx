import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Buscar perro por características | Vecindog',
  description: 'Buscá perros perdidos por color, tamaño, raza, collar y zona. Comparamos con los avisos publicados.',
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
