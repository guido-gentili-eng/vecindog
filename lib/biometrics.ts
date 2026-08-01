import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BIOMETRIC_KEY = 'vecindog_biometric_enabled';

export async function isBiometricAvailable(): Promise<boolean> {
  const [hasHardware, isEnrolled] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
  ]);
  return hasHardware && isEnrolled;
}

export async function isBiometricEnabled(): Promise<boolean> {
  return (await AsyncStorage.getItem(BIOMETRIC_KEY)) === 'true';
}

export async function setBiometricEnabled(enabled: boolean): Promise<void> {
  if (enabled) await AsyncStorage.setItem(BIOMETRIC_KEY, 'true');
  else await AsyncStorage.removeItem(BIOMETRIC_KEY);
}

export async function authenticateWithBiometrics(promptMessage: string): Promise<boolean> {
  try {
    // Salvaguarda: si el módulo nativo se cuelga (se vio en pantallas de bloqueo
    // recién abiertas, antes de que la app esté totalmente "activa"), no dejar
    // el spinner girando para siempre — a los 7s se da por fallida la verificación.
    const result = await Promise.race([
      LocalAuthentication.authenticateAsync({
        promptMessage,
        disableDeviceFallback: false,
      }),
      new Promise<{ success: false }>((resolve) =>
        setTimeout(() => resolve({ success: false }), 7000)
      ),
    ]);
    return result.success;
  } catch {
    return false;
  }
}
