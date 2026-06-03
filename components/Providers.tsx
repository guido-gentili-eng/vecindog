'use client';

import { type ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import AuthModal from '@/components/AuthModal';
import CityModal from '@/components/CityModal';
import ProfileModal from '@/components/ProfileModal';
import CuentaPausadaModal from '@/components/CuentaPausadaModal';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CuentaPausadaModal />
        <AuthModal />
        <ProfileModal />
        <CityModal />
        {children}
      </AuthProvider>
    </LanguageProvider>
  );
}
