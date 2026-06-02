import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';
import { useRouter, useSegments } from 'expo-router';

function RootLayoutNav() {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router   = useRouter();

  useEffect(() => {
    if (loading) return;
    const inAuth = segments[0] === '(auth)';
    if (!isAuthenticated && !inAuth) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuth) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, loading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)"            options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)"            options={{ headerShown: false }} />
      <Stack.Screen name="mis-perros"        options={{ headerShown: false }} />
      <Stack.Screen name="publicaciones/[id]"
        options={{ headerShown: true, title: 'Aviso', headerTintColor: Colors.primary, headerStyle: { backgroundColor: Colors.white }, headerShadowVisible: false }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <RootLayoutNav />
    </AuthProvider>
  );
}
