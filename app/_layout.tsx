import { useEffect, useRef } from 'react';
import { Platform, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';
import { useRouter, useSegments } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';
import { registrarPushToken } from '@/lib/notifications';
import { supabase } from '@/lib/supabase';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AiHelpButton from '@/components/AiHelpButton';

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
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)"            options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)"            options={{ headerShown: false }} />
      <Stack.Screen name="mis-perros"        options={{ headerShown: false }} />
      <Stack.Screen name="notificaciones"
        options={{ headerShown: true, title: 'Notificaciones', headerTintColor: Colors.primary, headerStyle: { backgroundColor: Colors.white }, headerShadowVisible: false }}
      />
      <Stack.Screen name="publicaciones/[id]"
        options={{ headerShown: true, title: 'Aviso', headerTintColor: Colors.primary, headerStyle: { backgroundColor: Colors.white }, headerShadowVisible: false }}
      />
      <Stack.Screen name="admin/reportes"
        options={{ headerShown: true, title: 'Reportes', headerTintColor: Colors.primary, headerStyle: { backgroundColor: Colors.white }, headerShadowVisible: false }}
      />
      <Stack.Screen name="buscar-por-foto"
        options={{ headerShown: true, title: 'Buscar por foto', headerTintColor: Colors.primary, headerStyle: { backgroundColor: Colors.white }, headerShadowVisible: false }}
      />
      <Stack.Screen name="reset-password"
        options={{ headerShown: true, title: 'Nueva contraseña', headerTintColor: Colors.primary, headerStyle: { backgroundColor: Colors.white }, headerShadowVisible: false }}
      />
    </Stack>
    <AiHelpButton />
    </View>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StatusBar style="dark" />
        <RootLayoutNav />
      </AuthProvider>
    </QueryClientProvider>
  );
}
