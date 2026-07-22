import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView,
  ActivityIndicator, KeyboardAvoidingView, Platform, Modal,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';

type Msg = { role: 'user' | 'assistant'; content: string };

export default function AiHelpButton() {
  const { t } = useLanguage();
  const SALUDO: Msg = { role: 'assistant', content: t.aiHelpSaludo };
  const { session, isAuthenticated } = useAuth();
  const [abierto,  setAbierto]  = useState(false);
  const [msgs,     setMsgs]     = useState<Msg[]>([]);
  const [texto,    setTexto]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  function abrir() {
    setAbierto(true);
    if (msgs.length === 0) setMsgs([SALUDO]);
  }

  async function enviar() {
    const contenido = texto.trim();
    if (!contenido || loading) return;

    if (!isAuthenticated || !session?.access_token) {
      setMsgs((m) => [...m, { role: 'user', content: contenido }, {
        role: 'assistant', content: t.aiHelpNecesitasLogin,
      }]);
      setTexto('');
      return;
    }

    const nuevos: Msg[] = [...msgs, { role: 'user', content: contenido }];
    setMsgs(nuevos);
    setTexto('');
    setLoading(true);
    try {
      const res = await fetch('https://www.mivecindog.com.ar/api/ai-help', {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ messages: nuevos }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Error');
      setMsgs((m) => [...m, { role: 'assistant', content: data.reply || t.aiHelpNoPudeGenerar }]);
    } catch {
      setMsgs((m) => [...m, { role: 'assistant', content: t.aiHelpErrConexion }]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }

  if (!isAuthenticated) return null;

  return (
    <>
      <TouchableOpacity style={styles.fab} onPress={abrir} activeOpacity={0.85}>
        <Text style={styles.fabIcon}>🐾</Text>
      </TouchableOpacity>

      <Modal visible={abierto} animationType="slide" transparent onRequestClose={() => setAbierto(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.overlay}
        >
          <View style={styles.panel}>
            <View style={styles.header}>
              <View>
                <Text style={styles.headerTitle}>{t.aiHelpTitle}</Text>
                <Text style={styles.headerSub}>{t.aiHelpSub}</Text>
              </View>
              <TouchableOpacity onPress={() => setAbierto(false)}>
                <Text style={styles.cerrar}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              ref={scrollRef}
              style={styles.mensajes}
              contentContainerStyle={{ padding: 14, gap: 10 }}
              onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
            >
              {msgs.map((m, i) => (
                <View key={i} style={[styles.bubble, m.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant]}>
                  <Text style={[styles.bubbleText, m.role === 'user' && styles.bubbleTextUser]}>{m.content}</Text>
                </View>
              ))}
              {loading && (
                <View style={[styles.bubble, styles.bubbleAssistant]}>
                  <ActivityIndicator color={Colors.primary} size="small" />
                </View>
              )}
            </ScrollView>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder={t.aiHelpInputPh}
                placeholderTextColor={Colors.inkMuted}
                value={texto}
                onChangeText={setTexto}
                multiline
                onSubmitEditing={enviar}
              />
              <TouchableOpacity style={styles.sendBtn} onPress={enviar} disabled={loading}>
                <Text style={styles.sendBtnText}>➤</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab:            { position: 'absolute', bottom: 96, right: 20, width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 8, elevation: 6, zIndex: 50 },
  fabIcon:        { fontSize: 24 },
  overlay:        { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' },
  panel:          { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '75%', overflow: 'hidden' },
  header:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.cream },
  headerTitle:    { fontSize: 15, fontWeight: '800', color: Colors.ink },
  headerSub:      { fontSize: 11, color: Colors.inkMuted, marginTop: 1 },
  cerrar:         { fontSize: 18, color: Colors.inkMuted, padding: 4 },
  mensajes:       { flex: 1 },
  bubble:         { maxWidth: '82%', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleUser:     { alignSelf: 'flex-end', backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  bubbleAssistant: { alignSelf: 'flex-start', backgroundColor: Colors.cream, borderBottomLeftRadius: 4 },
  bubbleText:     { fontSize: 14, color: Colors.ink, lineHeight: 19 },
  bubbleTextUser: { color: Colors.white },
  inputRow:       { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: Colors.border },
  input:          { flex: 1, backgroundColor: Colors.cream, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: Colors.ink, maxHeight: 100 },
  sendBtn:        { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  sendBtnText:    { color: Colors.white, fontSize: 17, fontWeight: '800' },
});
