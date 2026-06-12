import { Stack } from 'expo-router';
import { Colors } from '@/constants/colors';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle:        { backgroundColor: Colors.white },
        headerTintColor:    Colors.primary,
        headerShadowVisible: false,
      }}
    />
  );
}
