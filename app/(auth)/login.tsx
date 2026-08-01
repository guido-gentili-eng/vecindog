import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert, Linking,
} from 'react-native';
import { router } from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/colors';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function LoginScreen() {
  const { signIn, signUp, signInWithGoogle, signInWithApple, resetPassword, enterAsGuest } = useAuth();
  const { t } = useLanguage();
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [loading,    setLoading]    = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading,  setAppleLoading]  = useState(false);
  const [mode,          setMode]          = useState<'login' | 'register'>('login');
  const [recovering,    setRecovering]    = useState(false);
  const [confirm,       setConfirm]       = useState('');
  const [pendingEmail,  setPendingEmail]  = useState<string | null>(null);
  const [resending,     setResending]     = useState(false);
  const [aceptoTerminos, setAceptoTerminos] = useState(false);
  const [esMayorEdad,    setEsMayorEdad]    = useState(false);

  async function handleRecovery() {
    if (!email.trim()) {
      Alert.alert(t.loginErrEnterEmail, t.loginErrEnterEmailSub);
      return;
    }
    setRecovering(true);
    const err = await resetPassword(email.trim());
    setRecovering(false);
    if (err) {
      Alert.alert('Error', tradError(err, t));
    } else {
      Alert.alert(t.loginRecoverySuccessTitle, t.loginRecoverySuccessSub);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      const err = await signInWithGoogle();
      if (err) Alert.alert('Error', err);
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleApple() {
    setAppleLoading(true);
    try {
      const err = await signInWithApple();
      if (err) Alert.alert('Error', err);
    } finally {
      setAppleLoading(false);
    }
  }

  function handleGuest() {
    enterAsGuest();
    router.replace('/(tabs)');
  }

  async function handleSubmit() {
    if (!email || !password) { Alert.alert(t.loginErrFields); return; }
    if (mode === 'register' && password !== confirm) {
      Alert.alert(t.loginErrPasswordMismatch, t.loginErrPasswordMismatchSub);
      return;
    }
    setLoading(true);
    try {
      if (mode === 'login') {
        const err = await signIn(email.trim(), password);
        if (err) Alert.alert('Error', tradError(err, t));
      } else {
        const { error, needsConfirm } = await signUp(email.trim(), password);
        if (error) Alert.alert('Error', tradError(error, t));
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
      Alert.alert('Error', tradError(error.message, t));
    } else {
      Alert.alert(t.loginResendSuccessTitle, `${pendingEmail}`);
    }
  }

  if (pendingEmail) {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.pendingWrap}>
          <Text style={styles.pendingIcon}>📬</Text>
          <Text style={styles.pendingTitle}>{t.loginPendingTitle}</Text>
          <Text style={styles.pendingBody}>
            {t.loginPendingBodyPrefix}{'\n'}
            <Text style={styles.pendingEmail}>{pendingEmail}</Text>
            {'\n\n'}{t.loginPendingBodySuffix}
          </Text>

          <TouchableOpacity
            style={[styles.btn, resending && styles.btnDisabled]}
            onPress={handleResend}
            disabled={resending}
          >
            {resending
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>{t.loginResend}</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.forgotBtn}
            onPress={() => { setPendingEmail(null); setMode('login'); setPassword(''); setConfirm(''); }}
          >
            <Text style={styles.forgotText}>{t.loginAlreadyConfirmed}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">

        <View style={styles.langSwitcherWrap}>
          <LanguageSwitcher />
        </View>

        {/* Logo */}
        <View style={styles.logoArea}>
          <Text style={styles.paw}>🐾</Text>
          <Text style={styles.brand}>Vecindog</Text>
          <Text style={styles.tagline}>{t.loginTagline}</Text>
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
                {m === 'login' ? t.loginTabLogin : t.loginTabRegister}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder={t.loginEmailPh}
            placeholderTextColor={Colors.inkMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            placeholder={t.loginPasswordPh}
            placeholderTextColor={Colors.inkMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {mode === 'register' && (
            <TextInput
              style={styles.input}
              placeholder={t.loginConfirmPasswordPh}
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
                  {mode === 'login' ? t.loginBtnLogin : t.loginBtnRegister}
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
                : <Text style={styles.forgotText}>{t.loginForgot}</Text>
              }
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>{t.loginOr}</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={[styles.googleBtn, googleLoading && styles.btnDisabled]}
          onPress={handleGoogle}
          disabled={googleLoading}
        >
          {googleLoading
            ? <ActivityIndicator color={Colors.ink} />
            : (
              <View style={styles.googleBtnContent}>
                <View style={styles.googleDot} />
                <Text style={styles.googleBtnText}>{t.loginGoogle}</Text>
              </View>
            )
          }
        </TouchableOpacity>

        {Platform.OS === 'ios' && (
          appleLoading ? (
            <View style={[styles.appleBtn, { alignItems: 'center', justifyContent: 'center' }]}>
              <ActivityIndicator color={Colors.white} />
            </View>
          ) : (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={16}
              style={styles.appleBtn}
              onPress={handleApple}
            />
          )
        )}

        <TouchableOpacity style={styles.guestBtn} onPress={handleGuest}>
          <Text style={styles.guestBtnText}>{t.loginGuest}</Text>
        </TouchableOpacity>
        <Text style={styles.guestNote}>{t.loginGuestNote}</Text>

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
              {t.loginTermsPrefix}
              <Text
                style={styles.legalLink}
                onPress={() => Linking.openURL('https://www.mivecindog.com.ar/terminos')}
              >
                {t.loginTermsLink}
              </Text>
              {t.loginTermsMiddle}
              <Text
                style={styles.legalLink}
                onPress={() => Linking.openURL('https://www.mivecindog.com.ar/privacidad')}
              >
                {t.loginPrivacyLink}
              </Text>
              {t.loginTermsSuffix}
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
              {t.loginAgeConsent}
            </Text>
          </TouchableOpacity>
          </>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function tradError(msg: string, t: import('@/lib/translations').Translations): string {
  if (msg.includes('Invalid login credentials')) return t.loginErrInvalidCredentials;
  if (msg.includes('Email not confirmed'))        return t.loginErrEmailNotConfirmed;
  if (msg.includes('User already registered'))    return t.loginErrAlreadyRegistered;
  if (msg.includes('Password should be'))         return t.loginErrWeakPassword;
  if (msg.includes('rate limit'))                 return t.loginErrRateLimit;
  return msg;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  inner: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  langSwitcherWrap: { alignItems: 'flex-end', marginBottom: 4 },
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
  dividerRow:   { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 20, marginBottom: 16 },
  dividerLine:  { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText:  { fontSize: 12, color: Colors.inkMuted, fontWeight: '600' },
  googleBtn:    { backgroundColor: Colors.white, borderRadius: 16, paddingVertical: 15, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  appleBtn:     { width: '100%', height: 50, marginTop: 12 },
  googleBtnContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  googleDot:    { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4285F4' },
  googleBtnText: { fontSize: 15, fontWeight: '700', color: Colors.ink },
  guestBtn:     { alignItems: 'center', paddingVertical: 14, marginTop: 8 },
  guestBtnText: { fontSize: 14, fontWeight: '700', color: Colors.inkMuted, textDecorationLine: 'underline' },
  guestNote:    { fontSize: 11, color: Colors.inkMuted, textAlign: 'center', marginTop: -4, paddingHorizontal: 12, lineHeight: 16 },
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
