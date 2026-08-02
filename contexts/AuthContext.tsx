import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { supabase } from '@/lib/supabase';

WebBrowser.maybeCompleteAuthSession();

const GUEST_KEY = 'vecindog_guest';

export interface Profile {
  id:        string;
  nombre:    string;
  apellido:  string;
  telefono:  string;
  ciudad:    string;
  provincia: string;
  pais:      string;
  direccion: string;
  foto_url?:         string | null;
  plan?:             string | null;
  plan_vencimiento?: string | null;
  is_admin?:         boolean | null;
}

interface AuthCtx {
  user:            User | null;
  session:         Session | null;
  profile:         Profile | null;
  loading:         boolean;
  isAuthenticated: boolean;
  isGuest:         boolean;
  hasChosen:       boolean;
  isPro:           boolean;
  signIn:          (email: string, pw: string) => Promise<string | null>;
  signUp:          (email: string, pw: string) => Promise<{ error: string | null; needsConfirm: boolean }>;
  signInWithGoogle: () => Promise<string | null>;
  signInWithApple:  () => Promise<string | null>;
  resetPassword:   (email: string) => Promise<string | null>;
  signOut:         () => Promise<void>;
  deleteAccount:   () => Promise<string | null>;
  saveProfile:     (data: Omit<Profile, 'id'>) => Promise<string | null>;
  enterAsGuest:    () => void;
  exitGuest:       () => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

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
      if (s?.user) {
        fetchProfile(s.user.id);
      } else {
        AsyncStorage.getItem(GUEST_KEY).then((v) => setIsGuest(v === 'true'));
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setIsGuest(false);
        AsyncStorage.removeItem(GUEST_KEY);
        fetchProfile(s.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => { subscription.unsubscribe(); };
  }, []);

  const enterAsGuest = () => {
    AsyncStorage.setItem(GUEST_KEY, 'true');
    setIsGuest(true);
  };

  const exitGuest = () => {
    AsyncStorage.removeItem(GUEST_KEY);
    setIsGuest(false);
  };

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

  const signInWithGoogle = async (): Promise<string | null> => {
    const redirectTo = Linking.createURL('auth-callback');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo, skipBrowserRedirect: true },
    });
    if (error) return error.message;
    if (!data?.url) return 'No se pudo iniciar el ingreso con Google.';

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type !== 'success' || !('url' in result)) return null; // cancelado por el usuario

    const fragment = result.url.split('#')[1] ?? result.url.split('?')[1] ?? '';
    const params = new URLSearchParams(fragment);
    const access_token  = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    if (!access_token || !refresh_token) return 'No se pudo completar el ingreso con Google.';

    const { error: sessErr } = await supabase.auth.setSession({ access_token, refresh_token });
    if (sessErr) return sessErr.message;
    exitGuest();
    return null;
  };

  const signInWithApple = async (): Promise<string | null> => {
    try {
      const rawNonce = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, rawNonce);
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });
      if (!credential.identityToken) return 'No se pudo completar el ingreso con Apple.';

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
        nonce: rawNonce,
      });
      if (error) return error.message;
      exitGuest();

      // Apple solo manda el nombre completo la primera vez que el usuario autoriza la app.
      if (credential.fullName?.givenName && data.user) {
        const { data: existente } = await supabase.from('profiles').select('id').eq('id', data.user.id).maybeSingle();
        if (!existente) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            nombre: credential.fullName.givenName ?? '',
            apellido: credential.fullName.familyName ?? '',
          });
        }
      }
      return null;
    } catch (e: any) {
      if (e?.code === 'ERR_REQUEST_CANCELED') return null; // el usuario canceló, no es un error real
      return 'No se pudo completar el ingreso con Apple.';
    }
  };

  const resetPassword = async (email: string): Promise<string | null> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: Linking.createURL('reset-password'),
    });
    return error?.message ?? null;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    exitGuest();
  };

  const deleteAccount = async (): Promise<string | null> => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    if (!currentSession) return 'No hay sesión activa.';
    try {
      const res = await fetch('https://www.mivecindog.com.ar/api/account/delete', {
        method: 'POST',
        headers: { Authorization: `Bearer ${currentSession.access_token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.ok) return data.error ?? 'No se pudo eliminar la cuenta.';
      await supabase.auth.signOut();
      setProfile(null);
      exitGuest();
      return null;
    } catch {
      return 'Hubo un problema de conexión. Probá de nuevo.';
    }
  };

  const saveProfile = async (data: Omit<Profile, 'id'>): Promise<string | null> => {
    if (!user) return 'No hay sesión activa.';
    const { error } = await supabase.from('profiles').upsert({ id: user.id, ...data });
    if (error) return error.message;
    setProfile({ id: user.id, ...data });
    return null;
  };

  // Pro se volvió gratis para todos (decisión de negocio, jul/2026) — se deja el cálculo
  // original comentado en vez de borrarlo por si se retoma el cobro más adelante.
  const isPro = true;
  // const isPro = useMemo(() => {
  //   if (profile?.is_admin === true) return true;
  //   if (profile?.plan !== 'pro') return false;
  //   if (!profile.plan_vencimiento) return true;
  //   const exp = new Date(profile.plan_vencimiento);
  //   return !isNaN(exp.getTime()) && exp > new Date();
  // }, [profile?.plan, profile?.plan_vencimiento, profile?.is_admin]);

  return (
    <AuthContext.Provider value={{
      user, session, profile, loading,
      isAuthenticated: !!user,
      isGuest,
      hasChosen: !!user || isGuest,
      isPro,
      signIn, signUp, signInWithGoogle, signInWithApple, resetPassword, signOut, deleteAccount, saveProfile,
      enterAsGuest, exitGuest,
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
