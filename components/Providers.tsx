'use client';

import { type ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthModal from '@/components/AuthModal';
import CityModal from '@/components/CityModal';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AuthModal />
      <CityModal />
      {children}
    </AuthProvider>
  );
}
