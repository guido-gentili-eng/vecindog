import { Stack, router } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';
import { Colors } from '@/constants/colors';

// Mismo motivo que mis-perros/_layout.tsx: este Stack anidado no tiene
// historial propio cuando se entra vía router.push() desde otro Stack, así
// que el botón de volver nativo no aparece solo.
function BackButton() {
  return (
    <TouchableOpacity
      onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/perfil'))}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      style={{ paddingRight: 12 }}
    >
      <Text style={{ color: Colors.primary, fontSize: 16, fontWeight: '600' }}>‹ Volver</Text>
    </TouchableOpacity>
  );
}

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle:        { backgroundColor: Colors.white },
        headerTintColor:    Colors.primary,
        headerShadowVisible: false,
        headerLeft:         () => <BackButton />,
      }}
    />
  );
}
