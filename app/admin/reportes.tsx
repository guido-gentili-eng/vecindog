import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, Alert, RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';

// Email del admin — sólo este usuario ve esta pantalla
const ADMIN_EMAIL = process.env.EXPO_PUBLIC_ADMIN_EMAIL ?? '';

type Reporte = {
  id:         string;
  motivo:     string;
  created_at: string;
  revisado:   boolean;
  post_id:    string;
  posts: {
    nombre:    string | null;
    categoria: string;
    estado:    string;
    zona:      string | null;
  } | null;
};

export default function AdminReportesScreen() {
  const { user } = useAuth();
  const [reportes,    setReportes]    = useState<Reporte[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [soloNuevos,  setSoloNuevos]  = useState(true);

  // Bloquear acceso a no-admins
  if (user?.email !== ADMIN_EMAIL) {
    return (
      <View style={styles.bloqueado}>
        <Text style={styles.bloqueadoText}>⛔  Acceso restringido</Text>
      </View>
    );
  }

  async function cargar() {
    let q = supabase
      .from('reports')
      .select('id, motivo, created_at, revisado, post_id, posts(nombre, categoria, estado, zona)')
      .order('created_at', { ascending: false })
      .limit(100);

    if (soloNuevos) q = q.eq('revisado', false);

    const { data, error } = await q;
    if (!error) setReportes((data as unknown as Reporte[]) ?? []);
    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => { cargar(); }, [soloNuevos]);

  const onRefresh = () => { setRefreshing(true); cargar(); };

  async function marcarRevisado(reporteId: string) {
    await supabase.from('reports').update({ revisado: true }).eq('id', reporteId);
    setReportes((prev) => prev.filter((r) => r.id !== reporteId || !soloNuevos));
  }

  async function eliminarPost(postId: string, reporteId: string) {
    Alert.alert(
      'Eliminar aviso',
      '¿Estás seguro? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar', style: 'destructive',
          onPress: async () => {
            await supabase.from('posts').update({ estado: 'eliminado' }).eq('id', postId);
            await supabase.from('reports').update({ revisado: true }).eq('post_id', postId);
            setReportes((prev) => prev.filter((r) => r.post_id !== postId));
          },
        },
      ],
    );
  }

  if (loading) {
    return <ActivityIndicator color={Colors.primary} style={{ flex: 1, marginTop: 60 }} size="large" />;
  }

  return (
    <View style={styles.container}>

      {/* Toggle nuevos / todos */}
      <View style={styles.toolbar}>
        <Text style={styles.toolbarCount}>
          {reportes.length} {soloNuevos ? 'sin revisar' : 'reportes'}
        </Text>
        <TouchableOpacity
          style={[styles.toggleBtn, !soloNuevos && styles.toggleBtnActive]}
          onPress={() => setSoloNuevos((v) => !v)}
        >
          <Text style={[styles.toggleText, !soloNuevos && styles.toggleTextActive]}>
            {soloNuevos ? 'Ver todos' : 'Solo nuevos'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={reportes}
        keyExtractor={(r) => r.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {soloNuevos ? '✅ Sin reportes pendientes.' : 'No hay reportes aún.'}
          </Text>
        }
        renderItem={({ item: r }) => (
          <View style={[styles.card, r.revisado && styles.cardRevisada]}>

            {/* Cabecera */}
            <View style={styles.cardHeader}>
              <View style={[styles.catBadge, { backgroundColor: CAT_BG[r.posts?.categoria ?? ''] ?? '#f3f4f6' }]}>
                <Text style={styles.catText}>{r.posts?.categoria?.toUpperCase() ?? '—'}</Text>
              </View>
              {r.revisado && <Text style={styles.revisadoBadge}>Revisado</Text>}
            </View>

            {/* Datos del post */}
            <Text style={styles.postNombre}>{r.posts?.nombre || 'Sin nombre'}</Text>
            {r.posts?.zona ? <Text style={styles.postZona}>📍 {r.posts.zona}</Text> : null}

            {/* Motivo del reporte */}
            <View style={styles.motivoBox}>
              <Text style={styles.motivoLabel}>Motivo</Text>
              <Text style={styles.motivoText}>{r.motivo}</Text>
            </View>

            <Text style={styles.fecha}>{new Date(r.created_at).toLocaleDateString('es-AR')}</Text>

            {/* Acciones */}
            {!r.revisado && (
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.btnVer}
                  onPress={() => router.push(`/publicaciones/${r.post_id}`)}
                >
                  <Text style={styles.btnVerText}>Ver aviso</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnOk}
                  onPress={() => marcarRevisado(r.id)}
                >
                  <Text style={styles.btnOkText}>✓ Desestimar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnEliminar}
                  onPress={() => eliminarPost(r.post_id, r.id)}
                >
                  <Text style={styles.btnEliminarText}>✕ Eliminar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const CAT_BG: Record<string, string> = {
  perdido: '#fef2f2', encontrado: '#f0fdf4', adopcion: '#fef3c7',
};

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: Colors.bg },
  bloqueado:       { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bloqueadoText:   { fontSize: 16, fontWeight: '700', color: Colors.inkMuted },
  toolbar:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  toolbarCount:    { fontSize: 14, fontWeight: '700', color: Colors.ink },
  toggleBtn:       { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: Colors.border },
  toggleBtnActive: { borderColor: Colors.primary, backgroundColor: '#fef0ec' },
  toggleText:      { fontSize: 12, fontWeight: '600', color: Colors.inkMuted },
  toggleTextActive: { color: Colors.primary },
  list:            { padding: 16, gap: 12 },
  empty:           { textAlign: 'center', color: Colors.inkMuted, marginTop: 40 },
  card:            { backgroundColor: Colors.white, borderRadius: 18, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  cardRevisada:    { opacity: 0.6 },
  cardHeader:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  catBadge:        { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  catText:         { fontSize: 10, fontWeight: '800', color: Colors.ink, letterSpacing: 0.5 },
  revisadoBadge:   { fontSize: 11, fontWeight: '700', color: Colors.good },
  postNombre:      { fontSize: 16, fontWeight: '800', color: Colors.ink, marginBottom: 2 },
  postZona:        { fontSize: 12, color: Colors.inkMuted, marginBottom: 10 },
  motivoBox:       { backgroundColor: Colors.cream, borderRadius: 10, padding: 10, marginBottom: 8 },
  motivoLabel:     { fontSize: 10, fontWeight: '700', color: Colors.inkMuted, textTransform: 'uppercase', marginBottom: 2 },
  motivoText:      { fontSize: 13, color: Colors.ink },
  fecha:           { fontSize: 11, color: Colors.inkMuted, marginBottom: 12 },
  actions:         { flexDirection: 'row', gap: 8 },
  btnVer:          { flex: 1, paddingVertical: 9, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  btnVerText:      { fontSize: 12, fontWeight: '600', color: Colors.ink },
  btnOk:           { flex: 1, paddingVertical: 9, borderRadius: 12, backgroundColor: Colors.good, alignItems: 'center' },
  btnOkText:       { fontSize: 12, fontWeight: '700', color: Colors.white },
  btnEliminar:     { flex: 1, paddingVertical: 9, borderRadius: 12, backgroundColor: Colors.bad, alignItems: 'center' },
  btnEliminarText: { fontSize: 12, fontWeight: '700', color: Colors.white },
});
