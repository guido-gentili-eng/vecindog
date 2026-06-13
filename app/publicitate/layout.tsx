import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Publicitate en Vecindog | Llegá a dueños de mascotas en Argentina',
  description: 'Anunciá tu veterinaria, petshop o servicio para mascotas en Vecindog. Publicidad geolocalizada para dueños de perros y gatos cerca de tu local.',
  keywords: [
    'publicidad mascotas Argentina',
    'anunciar veterinaria',
    'publicitar petshop',
    'marketing mascotas',
    'publicidad app perros',
    'anuncios dueños mascotas',
  ],
  openGraph: {
    title: 'Publicitate en Vecindog — Llegá a miles de dueños de mascotas',
    description: 'Anunciá tu veterinaria, petshop o servicio en la red vecinal de mascotas más grande de Argentina.',
    url: 'https://www.mivecindog.com.ar/publicitate',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
