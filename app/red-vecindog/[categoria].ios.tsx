import { useEffect } from 'react';
import { View, ActivityIndicator, Linking } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';

/**
 * Variante solo-iOS: el directorio de comercios por rubro es contenido
 * pago (Red Vecindog) comprado fuera de la app. Guideline 3.1.1 — no se
 * muestra dentro de la app en iOS, solo redirige a la web.
 */
export default function CategoriaRedVecindogRedirectIOS() {
  const { categoria } = useLocalSearchParams<{ categoria: string }>();

  useEffect(() => {
    Linking.openURL(`https://www.mivecindog.com.ar/red-vecindog/${categoria}`);
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }, [categoria]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={Colors.primary} />
    </View>
  );
}
