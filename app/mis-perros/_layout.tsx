import { Stack } from 'expo-router';
import { Colors } from '@/constants/colors';

export default function MisPerrosLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle:       { backgroundColor: Colors.white },
        headerTintColor:   Colors.primary,
        headerBackTitle:   'Volver',
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="[id]"  options={{ title: 'Perfil del perro' }} />
      <Stack.Screen name="nuevo" options={{ title: 'Nuevo perro' }} />
    </Stack>
  );
}
