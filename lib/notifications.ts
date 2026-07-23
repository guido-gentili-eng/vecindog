import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase } from './supabase';

// Configurar cómo se muestran las notificaciones cuando la app está abierta
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert:  true,
    shouldShowBanner: true,
    shouldShowList:   true,
    shouldPlaySound:  true,
    shouldSetBadge:   true,
  }),
});

/** Registra el dispositivo y guarda el push token en Supabase */
export async function registrarPushToken(userId: string): Promise<string | null> {
  if (!Device.isDevice) return null; // Solo funciona en dispositivo real

  // Pedir permiso
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  // Configuración específica de Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name:       'Vecindog',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#B85C4A',
    });
  }

  // Obtener token
  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId) return null;
  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

  // Guardar en Supabase para poder enviar notificaciones desde el servidor
  if (token) {
    await supabase.from('profiles').upsert({
      id:         userId,
      push_token: token,
    });
  }

  return token;
}

/** Enviar notificación local (para pruebas) */
export async function notificacionLocal(titulo: string, cuerpo: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body:  cuerpo,
      data:  {},
    },
    trigger: null, // inmediata
  });
}
