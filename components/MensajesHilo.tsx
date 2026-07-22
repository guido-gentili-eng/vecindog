import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ActivityIndicator, ScrollView, Image, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { obtenerMensajes, enviarMensaje, type Mensaje, type Conversacion } from '@/lib/mensajes';
import { Colors } from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Translations } from '@/lib/translations';

interface Props {
  postId: string;
  isAuthenticated: boolean;
  userId: string | null;
}

function fmtHora(iso: string) {
  return new Date(iso).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}
function nombreDe(p: { nombre: string | null; apellido: string | null } | null, t: Translations) {
  return [p?.nombre, p?.apellido].filter(Boolean).join(' ') || t.amigosUsuarioFallback;
}

export default function MensajesHilo({ postId, isAuthenticated, userId }: Props) {
  const { t } = useLanguage();
  const [abierto,        setAbierto]        = useState(false);
  const [mensajes,       setMensajes]       = useState<Mensaje[]>([]);
  const [conversaciones, setConversaciones]  = useState<Conversacion[] | null>(null);
  const [selectedWith,   setSelectedWith]    = useState<string | null>(null);
  const [texto,          setTexto]           = useState('');
  const [cargando,       setCargando]        = useState(false);
  const [enviando,       setEnviando]        = useState(false);
  const [error,          setError]           = useState('');

  async function cargar() {
    setCargando(true);
    try {
      const { conversaciones: convs, mensajes: msgs } = await obtenerMensajes(postId, selectedWith ?? undefined);
      if (convs) {
        setConversaciones(convs);
        setMensajes([]);
        if (convs.length === 1) setSelectedWith(convs[0].user_id);
      } else {
        setConversaciones(null);
        setMensajes(msgs);
      }
    } catch {
      /* silencioso: no rompe la pantalla si falla la carga de mensajes */
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    if (!abierto || !isAuthenticated) return;
    cargar();

    const channel = supabase
      .channel(`mensajes-${postId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'mensajes', filter: `post_id=eq.${postId}` },
        () => { cargar(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierto, isAuthenticated, selectedWith]);

  async function handleEnviar() {
    if (!texto.trim() || enviando) return;
    setEnviando(true);
    setError('');
    try {
      await enviarMensaje(postId, texto.trim(), selectedWith ?? undefined);
      setTexto('');
      await cargar();
    } catch (e: any) {
      setError(e?.message ?? t.msgErrEnviar);
    } finally {
      setEnviando(false);
    }
  }

  const totalBadge = conversaciones ? conversaciones.length : mensajes.length;
  const mostrandoSelector = conversaciones !== null && conversaciones.length > 1 && !selectedWith;

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.header} onPress={() => setAbierto((v) => !v)} activeOpacity={0.7}>
        <Text style={styles.headerIcon}>💬</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{t.msgTitle}</Text>
          <Text style={styles.headerSub}>{t.msgSub}</Text>
        </View>
        {totalBadge > 0 && (
          <View style={styles.badge}><Text style={styles.badgeText}>{totalBadge}</Text></View>
        )}
        <Text style={styles.chevron}>{abierto ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {abierto && (
        <View style={styles.body}>
          {!isAuthenticated ? (
            <View style={styles.loginBox}>
              <Text style={styles.loginText}>{t.msgLoginText}</Text>
              <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.loginBtnText}>{t.msgIniciarSesion}</Text>
              </TouchableOpacity>
            </View>
          ) : cargando && !mensajes.length && !conversaciones ? (
            <ActivityIndicator color={Colors.primary} style={{ paddingVertical: 20 }} />
          ) : mostrandoSelector ? (
            <View>
              {conversaciones!.map((c) => (
                <TouchableOpacity
                  key={c.user_id}
                  style={styles.convRow}
                  onPress={() => setSelectedWith(c.user_id)}
                >
                  {c.nombre?.foto_url ? (
                    <Image source={{ uri: c.nombre.foto_url }} style={styles.avatar} />
                  ) : (
                    <View style={styles.avatarFallback}>
                      <Text style={styles.avatarFallbackText}>{nombreDe(c.nombre, t).charAt(0).toUpperCase()}</Text>
                    </View>
                  )}
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.convNombre}>{nombreDe(c.nombre, t)}</Text>
                    <Text style={styles.convTexto} numberOfLines={1}>{c.ultimo_texto}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <>
              {conversaciones && conversaciones.length > 1 && selectedWith && (
                <TouchableOpacity style={styles.volverBtn} onPress={() => setSelectedWith(null)}>
                  <Text style={styles.volverBtnText}>{t.msgVolverConversaciones}</Text>
                </TouchableOpacity>
              )}

              <ScrollView style={styles.lista} contentContainerStyle={{ gap: 10 }}>
                {mensajes.length === 0 ? (
                  <Text style={styles.vacio}>{t.msgVacio}</Text>
                ) : (
                  mensajes.map((m) => {
                    const esPropio = m.sender_id === userId;
                    const nombre = nombreDe(m.profiles, t);
                    return (
                      <View key={m.id} style={[styles.msgRow, esPropio && styles.msgRowPropio]}>
                        <View style={[styles.bubble, esPropio ? styles.bubblePropia : styles.bubbleAjena]}>
                          {!esPropio && <Text style={styles.bubbleNombre}>{nombre}</Text>}
                          <Text style={esPropio ? styles.bubbleTextoPropio : styles.bubbleTexto}>{m.texto}</Text>
                          <Text style={[styles.bubbleHora, esPropio && { color: 'rgba(255,255,255,0.7)' }]}>
                            {fmtHora(m.created_at)}
                          </Text>
                        </View>
                      </View>
                    );
                  })
                )}
              </ScrollView>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={texto}
                  onChangeText={setTexto}
                  placeholder={t.msgInputPh}
                  placeholderTextColor={Colors.inkMuted + '80'}
                  multiline
                />
                <TouchableOpacity
                  style={[styles.sendBtn, (!texto.trim() || enviando) && { opacity: 0.4 }]}
                  onPress={handleEnviar}
                  disabled={!texto.trim() || enviando}
                >
                  {enviando ? <ActivityIndicator color={Colors.white} size="small" /> : <Text style={styles.sendBtnText}>➤</Text>}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card:        { backgroundColor: Colors.white, borderRadius: 18, marginBottom: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  header:      { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  headerIcon:  { fontSize: 20 },
  headerTitle: { fontSize: 14, fontWeight: '800', color: Colors.ink },
  headerSub:   { fontSize: 11, color: Colors.inkMuted, marginTop: 2 },
  badge:       { backgroundColor: Colors.primary + '26', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText:   { fontSize: 11, fontWeight: '800', color: Colors.primary },
  chevron:     { fontSize: 11, fontWeight: '800', color: Colors.inkMuted, marginLeft: 8 },
  body:        { borderTopWidth: 1, borderTopColor: Colors.border, padding: 12 },
  loginBox:    { alignItems: 'center', gap: 10, paddingVertical: 16 },
  loginText:   { fontSize: 13, fontWeight: '700', color: Colors.ink },
  loginBtn:    { backgroundColor: Colors.primary, borderRadius: 16, paddingHorizontal: 20, paddingVertical: 10 },
  loginBtnText: { color: Colors.white, fontWeight: '800', fontSize: 13 },
  convRow:     { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  avatar:      { width: 36, height: 36, borderRadius: 18 },
  avatarFallback: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary + '26', alignItems: 'center', justifyContent: 'center' },
  avatarFallbackText: { fontSize: 14, fontWeight: '800', color: Colors.primary },
  convNombre:  { fontSize: 13, fontWeight: '700', color: Colors.ink },
  convTexto:   { fontSize: 12, color: Colors.inkMuted },
  volverBtn:   { paddingBottom: 8 },
  volverBtnText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  lista:       { maxHeight: 260 },
  vacio:       { fontSize: 13, color: Colors.inkMuted, textAlign: 'center', paddingVertical: 16 },
  msgRow:      { flexDirection: 'row' },
  msgRowPropio: { justifyContent: 'flex-end' },
  bubble:      { maxWidth: '78%', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8 },
  bubblePropia: { backgroundColor: Colors.primary, borderTopRightRadius: 4 },
  bubbleAjena:  { backgroundColor: Colors.cream, borderTopLeftRadius: 4 },
  bubbleNombre: { fontSize: 10, fontWeight: '800', color: Colors.inkMuted, marginBottom: 2 },
  bubbleTexto:  { fontSize: 13, color: Colors.ink },
  bubbleTextoPropio: { fontSize: 13, color: Colors.white },
  bubbleHora:   { fontSize: 10, color: Colors.inkMuted + '99', marginTop: 3, alignSelf: 'flex-end' },
  error:       { fontSize: 11, fontWeight: '700', color: Colors.bad, marginTop: 6 },
  inputRow:    { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginTop: 10 },
  input:       { flex: 1, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, fontSize: 13, color: Colors.ink, maxHeight: 90, backgroundColor: Colors.cream },
  sendBtn:     { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  sendBtnText: { color: Colors.white, fontSize: 16, fontWeight: '900' },
});
