import { useEffect } from 'react';
import { View, ActivityIndicator, Linking } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';

/**
 * Variante solo-iOS: el perfil de un comercio es contenido pago (Red
 * Vecindog) comprado fuera de la app. Guideline 3.1.1 — no se muestra
 * dentro de la app en iOS, solo redirige a la web.
 */
export default function ComercioRedirectIOS() {
  const { id } = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    Linking.openURL(`https://www.mivecindog.com.ar/comercio/${id}`);
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }, [id]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={Colors.primary} />
    </View>
  );
}
