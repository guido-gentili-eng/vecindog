import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image,
  TouchableOpacity, ActivityIndicator, Linking, Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';

const MOTIVOS = [
  'Información falsa o engañosa',
  'Contenido inapropiado u ofensivo',
  'Spam o publicidad',
  'Sospecha de maltrato animal',
  'Otro',
];

export default function PostDetailScreen() {
  const { id }    = useLocalSearchParams<{ id: string }>();
  const { user }  = useAuth();
  const [post,          setPost]          = useState<any | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [reportado,     setReportado]     = useState(false);
  const [solicitando,   setSolicitando]   = useState(false);
  const [solicitado,    setSolicitado]    = useState(false);

  function confirmarReporte() {
    if (!user) {
      Alert.alert('Iniciá sesión', 'Necesitás una cuenta para reportar un aviso.');
      return;
    }
    Alert.alert(
      '¿Por qué querés reportar este aviso?',
      undefined,
      [
        ...MOTIVOS.map((motivo) => ({
          text: motivo,
          onPress: () => enviarReporte(motivo),
        })),
        { text: 'Cancelar', style: 'cancel' as const },
      ],
    );
  }

  async function enviarReporte(motivo: string) {
    const { error } = await supabase.from('reports').insert({
      post_id:    id,
      user_id:    user!.id,
      motivo,
      created_at: new Date().toISOString(),
    });
    if (error) {
      Alert.alert('Error', 'No se pudo enviar el reporte. Intentá de nuevo.');
    } else {
      setReportado(true);
      Alert.alert('Reporte enviado', 'Gracias. Nuestro equipo revisará este aviso.');
    }
  }

  async function solicitarContacto() {
    if (!user) {
      Alert.alert('Iniciá sesión', 'Necesitás una cuenta para solicitar el contacto.');
      return;
    }
    setSolicitando(true);
    try {
      // Obtener el push token del dueño del aviso y los datos del solicitante
      const [ownerRes, myProfileRes] = await Promise.all([
        supabase.from('profiles').select('push_token').eq('id', post.user_id).single(),
        supabase.from('profiles').select('nombre, apellido, telefono').eq('id', user.id).single(),
      ]);

      const pushToken  = ownerRes.data?.push_token;
      const myProfile  = myProfileRes.data;
      const miNombre   = myProfile?.nombre
        ? `${myProfile.nombre} ${myProfile.apellido ?? ''}`.trim()
        : user.email;
      const miContacto = myProfile?.telefono || user.email;

      if (pushToken) {
        await fetch('https://exp.host/--/api/v2/push/send', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to:    pushToken,
            title: `📩 Solicitud de contacto — ${post.nombre || 'tu aviso'}`,
            body:  `${miNombre} quiere contactarte. Sus datos: ${miContacto}`,
            data:  { post_id: id },
          }),
        });
      }

      setSolicitado(true);
      Alert.alert(
        '✅ Solicitud enviada',
        'El publicador recibirá una notificación con tus datos de contacto.',
      );
    } catch {
      Alert.alert('Error', 'No se pudo enviar la solicitud. Intentá de nuevo.');
    } finally {
      setSolicitando(false);
    }
  }

  useEffect(() => {
    supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => { setPost(data); setLoading(false); });
  }, [id]);

  if (loading) {
    return <ActivityIndicator color={Colors.primary} style={{ flex: 1, marginTop: 60 }} size="large" />;
  }
  if (!post) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Aviso no encontrado</Text>
      </View>
    );
  }

  const waNumero = post.contacto?.replace(/[^0-9]/g, '');
  const waLink   = `https://wa.me/${waNumero}?text=${encodeURIComponent('Hola, te escribo por el aviso de Vecindog.')}`;

  const CAT_COLOR: Record<string, string> = {
    perdido: '#fef2f2', encontrado: '#f0fdf4', adopcion: '#fef3c7',
  };

  return (
    <ScrollView style={styles.container}>

      {/* Fotos */}
      {post.images?.length > 0 ? (
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          {post.images.map((uri: string, i: number) => (
            <Image key={i} source={{ uri }} style={styles.img} />
          ))}
        </ScrollView>
      ) : (
        <View style={[styles.img, styles.imgPlaceholder]}>
          <Text style={{ fontSize: 60 }}>🐶</Text>
        </View>
      )}

      <View style={styles.content}>

        {/* Categoría + nombre */}
        <View style={[styles.catBadge, { backgroundColor: CAT_COLOR[post.categoria] ?? '#f3f4f6' }]}>
          <Text style={styles.catText}>{post.categoria?.toUpperCase()}</Text>
        </View>
        <Text style={styles.nombre}>{post.nombre || 'Sin nombre'}</Text>

        {/* Datos */}
        <View style={styles.datos}>
          {[
            ['Especie',  post.especie],
            ['Raza',     post.raza],
            ['Color',    post.color],
            ['Tamaño',   post.tamano],
            ['Zona',     post.zona],
            ['Ciudad',   post.ciudad],
            ['Fecha',    post.fecha],
          ].filter(([, v]) => v).map(([label, value]) => (
            <View key={label as string} style={styles.dato}>
              <Text style={styles.datoLabel}>{label}</Text>
              <Text style={styles.datoValue}>{value}</Text>
            </View>
          ))}
        </View>

        {/* Descripción */}
        {post.descripcion && (
          <View style={styles.descBox}>
            <Text style={styles.descTitle}>Descripción</Text>
            <Text style={styles.descText}>{post.descripcion}</Text>
          </View>
        )}

        {/* CTA Contacto */}
        {!user ? (
          <View style={styles.loginPrompt}>
            <Text style={styles.loginText}>
              Iniciá sesión para ver el contacto de este aviso.
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.loginLink}>Iniciar sesión →</Text>
            </TouchableOpacity>
          </View>
        ) : post.contacto_publico === false && post.user_id !== user?.id ? (
          /* Contacto privado — enviar solicitud al dueño */
          solicitado ? (
            <View style={styles.solicitadoBox}>
              <Text style={styles.solicitadoText}>
                ✅  Solicitud enviada. El publicador te contactará.
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.waBtn, styles.waBtnPrivado, solicitando && { opacity: 0.6 }]}
              onPress={solicitarContacto}
              disabled={solicitando}
            >
              {solicitando
                ? <ActivityIndicator color={Colors.primary} />
                : <Text style={styles.waBtnPrivadoText}>📩  Solicitar contacto</Text>
              }
            </TouchableOpacity>
          )
        ) : (
          /* Contacto público — ir directo a WhatsApp */
          <TouchableOpacity
            style={styles.waBtn}
            onPress={() => Linking.openURL(waLink)}
          >
            <Text style={styles.waBtnText}>💬  Escribir por WhatsApp</Text>
          </TouchableOpacity>
        )}

        {/* Reporte */}
        {user && (
          <TouchableOpacity
            style={[styles.reportBtn, reportado && styles.reportBtnDone]}
            onPress={confirmarReporte}
            disabled={reportado}
          >
            <Text style={[styles.reportText, reportado && styles.reportTextDone]}>
              {reportado ? '⚑  Aviso reportado' : '⚑  Reportar este aviso'}
            </Text>
          </TouchableOpacity>
        )}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.bg },
  img:          { width: '100%', aspectRatio: 4 / 3 },
  imgPlaceholder: { backgroundColor: Colors.cream, alignItems: 'center', justifyContent: 'center' },
  content:      { padding: 20 },
  catBadge:     { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, marginBottom: 8 },
  catText:      { fontSize: 11, fontWeight: '800', color: Colors.ink, letterSpacing: 1 },
  nombre:       { fontSize: 28, fontWeight: '900', color: Colors.ink, marginBottom: 16 },
  datos:        { backgroundColor: Colors.white, borderRadius: 18, padding: 16, gap: 10, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  dato:         { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  datoLabel:    { fontSize: 13, color: Colors.inkMuted },
  datoValue:    { fontSize: 13, fontWeight: '600', color: Colors.ink, textTransform: 'capitalize' },
  descBox:      { backgroundColor: Colors.white, borderRadius: 18, padding: 16, marginBottom: 16 },
  descTitle:    { fontSize: 12, fontWeight: '700', color: Colors.inkMuted, marginBottom: 8, textTransform: 'uppercase' },
  descText:     { fontSize: 14, color: Colors.ink, lineHeight: 22 },
  waBtn:        { backgroundColor: '#25D366', borderRadius: 18, paddingVertical: 16, alignItems: 'center' },
  waBtnText:    { color: Colors.white, fontWeight: '800', fontSize: 16 },
  loginPrompt:  { backgroundColor: Colors.white, borderRadius: 18, padding: 20, alignItems: 'center', gap: 10 },
  loginText:      { fontSize: 14, color: Colors.inkMuted, textAlign: 'center' },
  loginLink:      { fontSize: 14, fontWeight: '700', color: Colors.primary },
  waBtnPrivado:     { backgroundColor: Colors.white, borderWidth: 2, borderColor: Colors.primary },
  waBtnPrivadoText: { color: Colors.primary, fontWeight: '800', fontSize: 16 },
  solicitadoBox:    { backgroundColor: '#f0fdf4', borderRadius: 18, paddingVertical: 16, alignItems: 'center' },
  solicitadoText:   { color: Colors.good, fontWeight: '700', fontSize: 14 },
  reportBtn:      { marginTop: 16, paddingVertical: 12, alignItems: 'center', borderRadius: 14, borderWidth: 1, borderColor: Colors.border },
  reportBtnDone:  { borderColor: 'transparent', backgroundColor: Colors.cream },
  reportText:     { fontSize: 13, fontWeight: '600', color: Colors.inkMuted },
  reportTextDone: { color: Colors.inkMuted, opacity: 0.6 },
});
