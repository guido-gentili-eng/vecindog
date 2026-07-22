import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ResetPasswordScreen() {
  const { t } = useLanguage();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [listo, setListo] = useState(false);

  async function handleSubmit() {
    if (password.length < 6) { setError(t.resetErrPasswordCorta); return; }
    if (password !== confirm) { setError(t.resetErrPasswordMismatch); return; }
    setEnviando(true);
    setError('');
    const { error: err } = await supabase.auth.updateUser({ password });
    setEnviando(false);
    if (err) {
      setError(err.message.includes('session') ? t.resetErrLinkInvalido : err.message);
      return;
    }
    setListo(true);
  }

  if (listo) {
    return (
      <View style={styles.centerScreen}>
        <Text style={{ fontSize: 48 }}>✅</Text>
        <Text style={styles.title}>{t.resetListoTitle}</Text>
        <Text style={styles.sub}>{t.resetListoSub}</Text>
        <TouchableOpacity style={styles.submitBtn} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.submitBtnText}>{t.resetContinuar}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={{ padding: 24, paddingTop: 40 }}>
        <Text style={styles.title}>{t.resetTitle}</Text>
        <Text style={styles.sub}>{t.resetSub}</Text>

        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder={t.resetPasswordPh}
          placeholderTextColor={Colors.inkMuted}
        />
        <TextInput
          style={styles.input}
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
          placeholder={t.resetConfirmPh}
          placeholderTextColor={Colors.inkMuted}
        />

        {!!error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity style={[styles.submitBtn, enviando && { opacity: 0.6 }]} onPress={handleSubmit} disabled={enviando}>
          {enviando ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.submitBtnText}>{t.resetGuardarBtn}</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: Colors.bg },
  centerScreen: { flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 8 },
  title:      { fontSize: 22, fontWeight: '900', color: Colors.ink, textAlign: 'center' },
  sub:        { fontSize: 13, color: Colors.inkMuted, marginTop: 6, marginBottom: 20, textAlign: 'center' },
  input:      { backgroundColor: Colors.white, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: Colors.ink, borderWidth: 1, borderColor: Colors.border, marginBottom: 12 },
  error:      { fontSize: 12, fontWeight: '700', color: Colors.bad, marginBottom: 8, textAlign: 'center' },
  submitBtn:  { backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: Colors.white, fontWeight: '800', fontSize: 16 },
});
