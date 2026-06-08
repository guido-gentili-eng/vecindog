import './globals.css';
import type { Metadata, Viewport } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';
import InstallBanner from '@/components/InstallBanner';
import AiHelpButton from '@/components/AiHelpButton';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

export const viewport: Viewport = {
  themeColor: '#B85C4A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Vecindog — Buscá. Encontrá. Adoptá.',
  description:
    'La red vecinal para encontrar y adoptar mascotas cerca de vos. Disponible en todo Argentina.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Vecindog',
    startupImage: '/apple-touch-icon.png',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: 'website',
    title: 'Vecindog',
    description: 'Buscá, encontrá y adoptá mascotas cerca de vos.',
    siteName: 'Vecindog',
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <body className="min-h-screen bg-brand-cream">
        <Providers>
          <Header />
          <main className="mx-auto max-w-6xl px-4 pb-16">{children}</main>
          <Footer />
          <InstallBanner />
          <AiHelpButton />
          <ServiceWorkerRegister />
        </Providers>
      </body>
    </html>
  );
}
