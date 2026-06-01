import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [loading,    setLoading]    = useState(false);
  const [mode,       setMode]       = useState<'login' | 'register'>('login');

  const { signUp } = useAuth();

  async function handleSubmit() {
    if (!email || !password) { Alert.alert('Completá todos los campos'); return; }
    setLoading(true);
    try {
      if (mode === 'login') {
        const err = await signIn(email.trim(), password);
        if (err) Alert.alert('Error', tradError(err));
      } else {
        const { error, needsConfirm } = await signUp(email.trim(), password);
        if (error) Alert.alert('Error', tradError(error));
        else if (needsConfirm) {
          Alert.alert('¡Revisá tu email!', 'Te enviamos un código de verificación. Confirmá tu cuenta y volvé a iniciar sesión.');
          setMode('login');
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">

        {/* Logo */}
        <View style={styles.logoArea}>
          <Text style={styles.paw}>🐾</Text>
          <Text style={styles.brand}>Vecindog</Text>
          <Text style={styles.tagline}>La red vecinal para encontrar y adoptar perros</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['login', 'register'] as const).map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.tab, mode === m && styles.tabActive]}
              onPress={() => setMode(m)}
            >
              <Text style={[styles.tabText, mode === m && styles.tabTextActive]}>
                {m === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="tu@email.com"
            placeholderTextColor={Colors.inkMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña (mín. 6 caracteres)"
            placeholderTextColor={Colors.inkMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>
                  {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta gratis'}
                </Text>
            }
          </TouchableOpacity>
        </View>

        <Text style={styles.legal}>
          Al registrarte aceptás los Términos y Condiciones y la Política de Privacidad de Vecindog.
        </Text>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function tradError(msg: string): string {
  if (msg.includes('Invalid login credentials')) return 'Email o contraseña incorrectos.';
  if (msg.includes('Email not confirmed'))        return 'Confirmá tu email antes de iniciar sesión.';
  if (msg.includes('User already registered'))    return 'Ya existe una cuenta con ese email.';
  if (msg.includes('Password should be'))         return 'La contraseña debe tener al menos 6 caracteres.';
  if (msg.includes('rate limit'))                 return 'Demasiados intentos. Esperá unos minutos.';
  return msg;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  inner: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoArea: { alignItems: 'center', marginBottom: 36 },
  paw:  { fontSize: 56, marginBottom: 8 },
  brand: { fontSize: 32, fontWeight: '900', color: Colors.primary, letterSpacing: -1 },
  tagline: { fontSize: 14, color: Colors.inkMuted, marginTop: 4, textAlign: 'center' },
  tabs: { flexDirection: 'row', backgroundColor: '#ede9e4', borderRadius: 16, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  tabActive: { backgroundColor: Colors.white, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 14, fontWeight: '600', color: Colors.inkMuted },
  tabTextActive: { color: Colors.ink, fontWeight: '700' },
  form: { gap: 12 },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.ink,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: Colors.white, fontWeight: '800', fontSize: 16 },
  legal: { marginTop: 20, textAlign: 'center', fontSize: 11, color: Colors.inkMuted, lineHeight: 16 },
});
