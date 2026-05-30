'use client';

import {
  createContext, useContext, useEffect, useState, type ReactNode
} from 'react';
import { type User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

const GUEST_KEY  = 'vecindog_guest';
const CITY_KEY   = 'vecindog_ciudad';

interface AuthCtx {
  user:            User | null;
  isGuest:         boolean;
  loading:         boolean;
  isAuthenticated: boolean;   // tiene cuenta + sesión activa
  hasChosen:       boolean;   // eligió algo (cuenta o invitado)
  ciudad:          string | null; // ciudad seleccionada
  hasCity:         boolean;       // ya eligió ciudad
  setCiudad:       (c: string) => void;
  clearCiudad:     () => void;
  signIn:          (email: string, pw: string) => Promise<string | null>;
  signUp:          (email: string, pw: string) => Promise<{ error: string | null; needsConfirm: boolean }>;
  verifyOtp:       (email: string, token: string) => Promise<string | null>;
  resendConfirm:   (email: string) => Promise<void>;
  signOut:         () => Promise<void>;
  enterAsGuest:    () => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ciudad,  setCiudadState] = useState<string | null>(null);

  useEffect(() => {
    // Restore ciudad from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CITY_KEY);
      if (saved) setCiudadState(saved);
    }

    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u);
      if (!u && typeof window !== 'undefined') {
        setIsGuest(localStorage.getItem(GUEST_KEY) === 'true');
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        setIsGuest(false);
        if (typeof window !== 'undefined') localStorage.removeItem(GUEST_KEY);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const setCiudad = (c: string) => {
    if (typeof window !== 'undefined') localStorage.setItem(CITY_KEY, c);
    setCiudadState(c);
  };

  const clearCiudad = () => {
    if (typeof window !== 'undefined') localStorage.removeItem(CITY_KEY);
    setCiudadState(null);
  };

  const signIn = async (email: string, pw: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    return error?.message ?? null;
  };

  const signUp = async (email: string, pw: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password: pw });
    if (error) return { error: error.message, needsConfirm: false };
    const needsConfirm = !data.session; // sin sesión → confirmar email
    return { error: null, needsConfirm };
  };

  const verifyOtp = async (email: string, token: string): Promise<string | null> => {
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'signup' });
    return error?.message ?? null;
  };

  const resendConfirm = async (email: string) => {
    await supabase.auth.resend({ type: 'signup', email });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(GUEST_KEY);
      // Mantener la ciudad al cerrar sesión
    }
    setIsGuest(false);
  };

  const enterAsGuest = () => {
    if (typeof window !== 'undefined') localStorage.setItem(GUEST_KEY, 'true');
    setIsGuest(true);
  };

  return (
    <AuthContext.Provider value={{
      user, isGuest, loading,
      isAuthenticated: !!user,
      hasChosen:       !!user || isGuest,
      ciudad,
      hasCity:         !!ciudad,
      setCiudad,
      clearCiudad,
      signIn, signUp, verifyOtp, resendConfirm, signOut, enterAsGuest,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
