import { useEffect } from 'react';
import { View, ActivityIndicator, Linking } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';

/**
 * Variante solo-iOS (Metro la resuelve en vez de index.tsx en builds de iOS,
 * asi que la pantalla nativa con precios/"Activar" ni siquiera queda en el
 * bundle de iOS). Apple Guideline 2.1(b): esto no es un checkout de
 * suscripcion nativo, redirige a la version web.
 */
export default function RedVecindogRedirectIOS() {
  useEffect(() => {
    Linking.openURL('https://www.mivecindog.com.ar/red-vecindog');
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={Colors.primary} />
    </View>
  );
}
