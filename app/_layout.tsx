import { useEffect, useRef, useState } from 'react';
import { Platform, View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Colors } from '@/constants/colors';
import { useRouter, useSegments } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';
import { registrarPushToken } from '@/lib/notifications';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AiHelpButton from '@/components/AiHelpButton';
import { isBiometricEnabled, authenticateWithBiometrics } from '@/lib/biometrics';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // datos frescos por 5 min → sin refetch al cambiar de tab
      gcTime:    10 * 60 * 1000,   // caché vive 10 min en memoria
      retry: 1,
    },
  },
});

function RootLayoutNav() {
  const { t } = useLanguage();
  const { isAuthenticated, hasChosen, loading, user } = useAuth();
  const segments = useSegments();
  const router   = useRouter();

  // Buffer para post_id pendiente de navegación
  const pendingPostId = useRef<string | null>(null);
  // Refs espejo — evitan stale closures en callbacks async y listeners registrados una sola vez
  const isAuthRef  = useRef(isAuthenticated);
  const loadingRef = useRef(loading);
  useEffect(() => { isAuthRef.current  = isAuthenticated; }, [isAuthenticated]);
  useEffect(() => { loadingRef.current = loading; },         [loading]);

  // ── 1. Guardia de navegación auth ──────────────────────────────────────────
  useEffect(() => {
    if (loading) return;
    const inAuth = segments[0] === '(auth)';
    if (!hasChosen && !inAuth) {
      router.replace('/(auth)/login');
    } else if (hasChosen && inAuth) {
      router.replace('/(tabs)');
    }
    // Consumir deep link pendiente una vez que auth resolvió y el stack está listo
    if (isAuthenticated && pendingPostId.current) {
      const postId = pendingPostId.current;
      pendingPostId.current = null;
      // setTimeout 0 garantiza que el router ya procesó el replace anterior
      setTimeout(() => router.push(`/publicaciones/${postId}`), 0);
    }
  }, [isAuthenticated, hasChosen, loading]);

  // ── 1b. Deep link de recuperación de contraseña (el de Google OAuth se
  // resuelve directo en signInWithGoogle vía openAuthSessionAsync) ───────────
  useEffect(() => {
    function handleUrl(url: string) {
      if (!url.includes('reset-password')) return;
      const fragment = url.split('#')[1] ?? url.split('?')[1];
      if (!fragment) return;
      const params = new URLSearchParams(fragment);
      const access_token  = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      if (access_token && refresh_token) {
        supabase.auth.setSession({ access_token, refresh_token }).then(() => {
          router.push('/reset-password');
        });
      }
    }
    Linking.getInitialURL().then((url) => { if (url) handleUrl(url); });
    const sub = Linking.addEventListener('url', ({ url }) => handleUrl(url));
    return () => sub.remove();
  }, []);

  // ── 2. Cold start: notificación que abrió la app desde cerrada ─────────────
  useEffect(() => {
    if (Platform.OS === 'web') return;
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response) return;
      const postId = response.notification.request.content.data?.post_id as string | undefined;
      if (!postId) return;
      // Si auth ya resolvió cuando el .then() vuelve, navegar directo (evita race condition)
      if (!loadingRef.current && isAuthRef.current) {
        setTimeout(() => router.push(`/publicaciones/${postId}`), 0);
      } else {
        // Auth todavía pendiente — buffer para consumir en el efecto guard
        pendingPostId.current = postId;
      }
    });
  }, []); // una sola vez al montar

  // ── 3. Live listener: notificaciones mientras la app está abierta ──────────
  useEffect(() => {
    if (Platform.OS === 'web') return;
    const receivedSub = Notifications.addNotificationReceivedListener(() => {});

    const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
      const postId = response.notification.request.content.data?.post_id as string | undefined;
      if (!postId) { router.push('/notificaciones'); return; }
      // Usa ref para leer el estado de auth sin stale closure
      if (isAuthRef.current) {
        router.push(`/publicaciones/${postId}`);
      } else {
        pendingPostId.current = postId;
      }
    });

    return () => {
      receivedSub.remove();
      responseSub.remove();
    };
  }, []); // registrado una sola vez, isAuthRef se mantiene actualizado

  // ── 4. Registro de push token ──────────────────────────────────────────────
  useEffect(() => {
    if (Platform.OS === 'web') return;
    if (!user) return;
    registrarPushToken(user.id).catch(() => {});
  }, [user]);

  return (
    <View style={{ flex: 1 }}>
    <BiometricGate>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)"            options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)"            options={{ headerShown: false }} />
      <Stack.Screen name="mis-perros"        options={{ headerShown: false }} />
      <Stack.Screen name="notificaciones"
        options={{ headerShown: true, title: t.notifTitle, headerTintColor: Colors.primary, headerStyle: { backgroundColor: Colors.white }, headerShadowVisible: false }}
      />
      <Stack.Screen name="publicaciones/[id]"
        options={{ headerShown: true, title: t.headerAviso, headerTintColor: Colors.primary, headerStyle: { backgroundColor: Colors.white }, headerShadowVisible: false }}
      />
      <Stack.Screen name="buscar-por-foto"
        options={{ headerShown: true, title: t.headerBuscarPorFoto, headerTintColor: Colors.primary, headerStyle: { backgroundColor: Colors.white }, headerShadowVisible: false }}
      />
      <Stack.Screen name="reset-password"
        options={{ headerShown: true, title: t.headerNuevaContrasena, headerTintColor: Colors.primary, headerStyle: { backgroundColor: Colors.white }, headerShadowVisible: false }}
      />
    </Stack>
    <AiHelpButton />
    </BiometricGate>
    </View>
  );
}

function BiometricGate({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const { isAuthenticated, loading, signOut } = useAuth();
  const [ready, setReady] = useState(false);
  const [locked, setLocked] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  // Guarda si ya hay una autenticación en curso — expo-local-authentication
  // no es reentrante: llamarlo dos veces en paralelo puede dejar la promesa
  // colgada para siempre.
  const inFlight = useRef(false);
  // El chequeo de bloqueo corre UNA sola vez, al arrancar la app (cold start).
  // Antes también se repetía cada vez que la app volvía de segundo plano,
  // pero el propio diálogo nativo de Face ID dispara transiciones de
  // AppState (inactive→active) mientras está en pantalla, lo que terminaba
  // re-disparando el chequeo en paralelo y dejando la sesión en un estado
  // inconsistente (llegó a cerrar sesión sola). Bloquear solo en cold start
  // es menos estricto pero mucho más estable.
  const checkedOnce = useRef(false);

  useEffect(() => {
    if (loading || checkedOnce.current) return;
    checkedOnce.current = true;
    (async () => {
      if (isAuthenticated) {
        const enabled = await isBiometricEnabled();
        setLocked(enabled);
      }
      setReady(true);
    })();
  }, [loading, isAuthenticated]);

  async function tryUnlock() {
    if (inFlight.current) return;
    inFlight.current = true;
    setAuthenticating(true);
    try {
      const ok = await authenticateWithBiometrics(t.lockScreenSub);
      if (ok) setLocked(false);
    } finally {
      inFlight.current = false;
      setAuthenticating(false);
    }
  }

  useEffect(() => {
    if (!ready || !locked) return;
    // Pequeño delay: si se dispara el prompt nativo apenas la pantalla de
    // bloqueo se monta (cold start), el módulo puede quedarse colgado sin
    // resolver nunca — dar tiempo a que la app esté totalmente activa.
    const timer = setTimeout(() => { tryUnlock(); }, 400);
    return () => clearTimeout(timer);
  }, [ready, locked]);

  if (!ready) return null;

  if (locked) {
    return (
      <View style={lockStyles.container}>
        <Text style={lockStyles.paw}>🐾</Text>
        <Text style={lockStyles.title}>{t.lockScreenTitle}</Text>
        <Text style={lockStyles.sub}>{t.lockScreenSub}</Text>
        <TouchableOpacity style={lockStyles.btn} onPress={tryUnlock} disabled={authenticating}>
          {authenticating
            ? <ActivityIndicator color={Colors.white} />
            : <Text style={lockStyles.btnText}>{t.lockScreenBtn}</Text>
          }
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 18 }} onPress={signOut}>
          <Text style={lockStyles.logout}>{t.lockScreenSalir}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <>{children}</>;
}

const lockStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center', padding: 32 },
  paw:       { fontSize: 56, marginBottom: 8 },
  title:     { fontSize: 26, fontWeight: '900', color: Colors.primary, marginBottom: 8 },
  sub:       { fontSize: 14, color: Colors.inkMuted, textAlign: 'center', marginBottom: 28 },
  btn:       { backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 15, paddingHorizontal: 32, alignItems: 'center' },
  btnText:   { color: Colors.white, fontWeight: '800', fontSize: 15 },
  logout:    { fontSize: 13, fontWeight: '700', color: Colors.inkMuted, textDecorationLine: 'underline' },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <StatusBar style="dark" />
          <RootLayoutNav />
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
