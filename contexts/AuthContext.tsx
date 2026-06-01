import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export interface Profile {
  id:        string;
  nombre:    string;
  apellido:  string;
  telefono:  string;
  ciudad:    string;
  provincia: string;
  pais:      string;
  direccion: string;
}

interface AuthCtx {
  user:            User | null;
  session:         Session | null;
  profile:         Profile | null;
  loading:         boolean;
  isAuthenticated: boolean;
  signIn:          (email: string, pw: string) => Promise<string | null>;
  signUp:          (email: string, pw: string) => Promise<{ error: string | null; needsConfirm: boolean }>;
  signOut:         () => Promise<void>;
  saveProfile:     (data: Omit<Profile, 'id'>) => Promise<string | null>;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    setProfile(data ?? null);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const s = data.session;
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) fetchProfile(s.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) fetchProfile(s.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, pw: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    return error?.message ?? null;
  };

  const signUp = async (email: string, pw: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password: pw });
    if (error) return { error: error.message, needsConfirm: false };
    if (data.session) await supabase.auth.signOut();
    return { error: null, needsConfirm: true };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const saveProfile = async (data: Omit<Profile, 'id'>): Promise<string | null> => {
    if (!user) return 'No hay sesión activa.';
    const { error } = await supabase.from('profiles').upsert({ id: user.id, ...data });
    if (error) return error.message;
    setProfile({ id: user.id, ...data });
    return null;
  };

  return (
    <AuthContext.Provider value={{
      user, session, profile, loading,
      isAuthenticated: !!user,
      signIn, signUp, signOut, saveProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth fuera de AuthProvider');
  return ctx;
}
