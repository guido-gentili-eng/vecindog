'use client';

import { type ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import AuthModal from '@/components/AuthModal';
import CityModal from '@/components/CityModal';
import ProfileModal from '@/components/ProfileModal';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AuthModal />
        <ProfileModal />
        <CityModal />
        {children}
      </AuthProvider>
    </LanguageProvider>
  );
}
