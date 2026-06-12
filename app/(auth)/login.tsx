import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert, Linking,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/colors';

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [loading,    setLoading]    = useState(false);
  const [mode,          setMode]          = useState<'login' | 'register'>('login');
  const [recovering,    setRecovering]    = useState(false);
  const [confirm,       setConfirm]       = useState('');
  const [pendingEmail,  setPendingEmail]  = useState<string | null>(null);
  const [resending,     setResending]     = useState(false);
  const [aceptoTerminos, setAceptoTerminos] = useState(false);
  const [esMayorEdad,    setEsMayorEdad]    = useState(false);

  async function handleRecovery() {
    if (!email.trim()) {
      Alert.alert('Ingresá tu email', 'Escribí tu email arriba y luego tocá "Olvidé mi contraseña".');
      return;
    }
    setRecovering(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    setRecovering(false);
    if (error) {
      Alert.alert('Error', tradError(error.message));
    } else {
      Alert.alert('¡Revisá tu email!', 'Te enviamos un link para restablecer tu contraseña.');
    }
  }

  async function handleSubmit() {
    if (!email || !password) { Alert.alert('Completá todos los campos'); return; }
    if (mode === 'register' && password !== confirm) {
      Alert.alert('Las contraseñas no coinciden', 'Verificá que ambas contraseñas sean iguales.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'login') {
        const err = await signIn(email.trim(), password);
        if (err) Alert.alert('Error', tradError(err));
      } else {
        const { error, needsConfirm } = await signUp(email.trim(), password);
        if (error) Alert.alert('Error', tradError(error));
        else if (needsConfirm) {
          setPendingEmail(email.trim());
        }
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!pendingEmail) return;
    setResending(true);
    const { error } = await supabase.auth.resend({ type: 'signup', email: pendingEmail });
    setResending(false);
    if (error) {
      Alert.alert('Error', tradError(error.message));
    } else {
      Alert.alert('Email reenviado', `Revisá ${pendingEmail} (incluso la carpeta de spam).`);
    }
  }

  if (pendingEmail) {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.pendingWrap}>
          <Text style={styles.pendingIcon}>📬</Text>
          <Text style={styles.pendingTitle}>Confirmá tu cuenta</Text>
          <Text style={styles.pendingBody}>
            Te enviamos un link a{'\n'}
            <Text style={styles.pendingEmail}>{pendingEmail}</Text>
            {'\n\n'}Tocá el link del email para activar tu cuenta. Si no lo ves, revisá la carpeta de spam.
          </Text>

          <TouchableOpacity
            style={[styles.btn, resending && styles.btnDisabled]}
            onPress={handleResend}
            disabled={resending}
          >
            {resending
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>Reenviar email de confirmación</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.forgotBtn}
            onPress={() => { setPendingEmail(null); setMode('login'); setPassword(''); setConfirm(''); }}
          >
            <Text style={styles.forgotText}>Ya confirmé → Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
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
              onPress={() => { setMode(m); setConfirm(''); setAceptoTerminos(false); setEsMayorEdad(false); }}
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
          {mode === 'register' && (
            <TextInput
              style={styles.input}
              placeholder="Repetir contraseña"
              placeholderTextColor={Colors.inkMuted}
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
            />
          )}

          <TouchableOpacity
            style={[styles.btn, (loading || (mode === 'register' && (!aceptoTerminos || !esMayorEdad))) && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={loading || (mode === 'register' && (!aceptoTerminos || !esMayorEdad))}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>
                  {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta gratis'}
                </Text>
            }
          </TouchableOpacity>

          {mode === 'login' && (
            <TouchableOpacity
              onPress={handleRecovery}
              disabled={recovering}
              style={styles.forgotBtn}
            >
              {recovering
                ? <ActivityIndicator color={Colors.primary} size="small" />
                : <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
              }
            </TouchableOpacity>
          )}
        </View>

        {mode === 'register' && (
          <>
          <TouchableOpacity
            style={styles.consentRow}
            onPress={() => setAceptoTerminos((v) => !v)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, aceptoTerminos && styles.checkboxChecked]}>
              {aceptoTerminos && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.consentText}>
              Leí y acepto los{' '}
              <Text
                style={styles.legalLink}
                onPress={() => Linking.openURL('https://www.mivecindog.com.ar/terminos')}
              >
                Términos y Condiciones
              </Text>
              {' '}y la{' '}
              <Text
                style={styles.legalLink}
                onPress={() => Linking.openURL('https://www.mivecindog.com.ar/privacidad')}
              >
                Política de Privacidad
              </Text>
              {', '}incluyendo el tratamiento de mis datos personales conforme a la Ley 25.326.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.consentRow}
            onPress={() => setEsMayorEdad((v) => !v)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, esMayorEdad && styles.checkboxChecked]}>
              {esMayorEdad && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.consentText}>
              Confirmo que tengo 13 años o más. Las personas menores de 13 años no pueden registrarse en Vecindog.
            </Text>
          </TouchableOpacity>
          </>
        )}

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
  btnDisabled:  { opacity: 0.6 },
  btnText:      { color: Colors.white, fontWeight: '800', fontSize: 16 },
  forgotBtn:    { alignItems: 'center', paddingVertical: 10 },
  forgotText:   { fontSize: 13, fontWeight: '600', color: Colors.primary },
  legal:           { marginTop: 20, textAlign: 'center', fontSize: 11, color: Colors.inkMuted, lineHeight: 16 },
  legalLink:       { color: Colors.primary, fontWeight: '700', textDecorationLine: 'underline' },
  consentRow:      { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 16 },
  checkbox:        { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: Colors.border, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', marginTop: 1, flexShrink: 0 },
  checkboxChecked: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  checkmark:       { color: Colors.white, fontSize: 13, fontWeight: '900' },
  consentText:     { flex: 1, fontSize: 12, color: Colors.inkMuted, lineHeight: 18 },
  pendingWrap:  { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 16 },
  pendingIcon:  { fontSize: 64, marginBottom: 8 },
  pendingTitle: { fontSize: 24, fontWeight: '900', color: Colors.ink, textAlign: 'center' },
  pendingBody:  { fontSize: 15, color: Colors.inkMuted, textAlign: 'center', lineHeight: 22 },
  pendingEmail: { fontWeight: '700', color: Colors.ink },
});
