import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Vecindog — Buscá. Encontrá. Adoptá.',
  description:
    'La red vecinal para encontrar y adoptar perros cerca de vos. Disponible en todo Argentina.',
  themeColor: '#EE5A3B'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <body className="min-h-screen bg-brand-cream">
        <Providers>
          <Header />
          <main className="mx-auto max-w-6xl px-4 pb-16">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
