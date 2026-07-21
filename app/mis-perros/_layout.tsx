import { Stack, router } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';
import { Colors } from '@/constants/colors';

// Esta pantalla vive en un Stack anidado propio, separado del Stack de las
// tabs. Cuando se entra acá con router.push() desde la lista de "Mis perros"
// (que es OTRO Stack), este Stack anidado arranca sin historial propio, así
// que React Navigation nunca muestra la flecha de "volver" automática —
// aunque router.back() sí sabe volver bien (delega al Stack padre). Por eso
// se fuerza un botón de volver explícito en vez de confiar en el header nativo.
function BackButton() {
  return (
    <TouchableOpacity
      onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/mis-perros'))}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      style={{ paddingRight: 12 }}
    >
      <Text style={{ color: Colors.primary, fontSize: 16, fontWeight: '600' }}>‹ Volver</Text>
    </TouchableOpacity>
  );
}

export default function MisPerrosLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle:       { backgroundColor: Colors.white },
        headerTintColor:   Colors.primary,
        headerShadowVisible: false,
        headerLeft:        () => <BackButton />,
      }}
    >
      <Stack.Screen name="[id]"  options={{ title: 'Perfil del perro' }} />
      <Stack.Screen name="nuevo" options={{ title: 'Nuevo perro' }} />
    </Stack>
  );
}
