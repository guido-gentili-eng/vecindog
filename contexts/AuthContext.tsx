'use client';

import {
  createContext, useContext, useEffect, useState, type ReactNode
} from 'react';
import { type User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

const GUEST_KEY  = 'vecindog_guest';
const CITY_KEY   = 'vecindog_ciudad';

export interface Profile {
  id:        string;
  nombre:    string;
  apellido:  string;
  telefono:  string;
  direccion: string;
  ciudad:    string;
}

interface AuthCtx {
  user:            User | null;
  profile:         Profile | null;
  isGuest:         boolean;
  loading:         boolean;
  isAuthenticated: boolean;
  hasChosen:       boolean;
  hasProfile:      boolean;
  ciudad:          string | null;
  hasCity:         boolean;
  setCiudad:       (c: string) => void;
  clearCiudad:     () => void;
  signIn:          (email: string, pw: string) => Promise<string | null>;
  signUp:          (email: string, pw: string) => Promise<{ error: string | null; needsConfirm: boolean }>;
  signInWithGoogle: () => Promise<void>;
  verifyOtp:       (email: string, token: string) => Promise<string | null>;
  resendConfirm:   (email: string) => Promise<void>;
  saveProfile:     (data: Omit<Profile, 'id'>) => Promise<string | null>;
  signOut:         () => Promise<void>;
  enterAsGuest:    () => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ciudad,  setCiudadState] = useState<string | null>(null);

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    setProfile(data ?? null);
  }

  useEffect(() => {
    // Restore ciudad from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CITY_KEY);
      if (saved) setCiudadState(saved);
    }

    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null;
      const confirmedUser = u?.email_confirmed_at ? u : null;
      setUser(confirmedUser);
      if (confirmedUser) {
        fetchProfile(confirmedUser.id);
      } else if (typeof window !== 'undefined') {
        setIsGuest(localStorage.getItem(GUEST_KEY) === 'true');
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      const u = session?.user ?? null;
      const confirmedUser = u?.email_confirmed_at ? u : null;
      setUser(confirmedUser);
      if (confirmedUser) {
        setIsGuest(false);
        if (typeof window !== 'undefined') localStorage.removeItem(GUEST_KEY);
        fetchProfile(confirmedUser.id);
      } else {
        setProfile(null);
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
    // Siempre cerrar la sesión inmediata para forzar confirmación por email
    if (data.session) await supabase.auth.signOut();
    return { error: null, needsConfirm: true };
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    });
  };

  const verifyOtp = async (email: string, token: string): Promise<string | null> => {
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'signup' });
    return error?.message ?? null;
  };

  const resendConfirm = async (email: string) => {
    await supabase.auth.resend({ type: 'signup', email });
  };

  const saveProfile = async (data: Omit<Profile, 'id'>): Promise<string | null> => {
    if (!user) return 'No hay sesión activa.';

    // Geocodificar dirección para notificaciones por proximidad
    let lat: number | null = null;
    let lng: number | null = null;
    try {
      const q = encodeURIComponent(`${data.direccion}, ${data.ciudad}, Argentina`);
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`,
        { headers: { 'User-Agent': 'Vecindog/1.0 (noreply@mivecindog.com.ar)' } }
      );
      const geoData = await geoRes.json();
      if (geoData?.[0]) {
        lat = parseFloat(geoData[0].lat);
        lng = parseFloat(geoData[0].lon);
      }
    } catch { /* sin coords, ok igual */ }

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      ...data,
      ...(lat !== null && lng !== null ? { lat, lng } : {}),
    });
    if (error) return error.message;
    setProfile({ id: user.id, ...data });
    return null;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(GUEST_KEY);
    }
    setIsGuest(false);
    setProfile(null);
  };

  const enterAsGuest = () => {
    if (typeof window !== 'undefined') localStorage.setItem(GUEST_KEY, 'true');
    setIsGuest(true);
  };

  return (
    <AuthContext.Provider value={{
      user, profile, isGuest, loading,
      isAuthenticated: !!user,
      hasChosen:       !!user || isGuest,
      hasProfile:      !!profile,
      ciudad,
      hasCity:         !!ciudad,
      setCiudad,
      clearCiudad,
      signIn, signUp, signInWithGoogle, verifyOtp, resendConfirm, saveProfile, signOut, enterAsGuest,
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
