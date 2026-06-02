import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';

interface Notif {
  id: string; tipo: string; mensaje: string;
  leida: boolean; post_id: string | null; created_at: string;
}

export default function NotificacionesScreen() {
  const { user } = useAuth();
  const [notifs,     setNotifs]     = useState<Notif[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function cargar() {
    if (!user) return;
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    setNotifs(data ?? []);
    setLoading(false);
    setRefreshing(false);
  }

  async function marcarLeida(id: string) {
    await supabase.from('notifications').update({ leida: true }).eq('id', id);
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, leida: true } : n));
  }

  async function marcarTodasLeidas() {
    if (!user) return;
    await supabase.from('notifications').update({ leida: true }).eq('user_id', user.id);
    setNotifs((prev) => prev.map((n) => ({ ...n, leida: true })));
  }

  useEffect(() => { cargar(); }, [user]);

  const noLeidas = notifs.filter((n) => !n.leida).length;

  const TIPO_EMOJI: Record<string, string> = {
    perdido: '🔴', encontrado: '🟢', adopcion: '🟤',
  };

  function formatTiempo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const min  = Math.floor(diff / 60000);
    if (min < 60)  return `Hace ${min} min`;
    const hs = Math.floor(min / 60);
    if (hs < 24)   return `Hace ${hs} h`;
    return `Hace ${Math.floor(hs / 24)} días`;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Notificaciones</Text>
          {noLeidas > 0 && (
            <Text style={styles.badge}>{noLeidas} nueva{noLeidas > 1 ? 's' : ''}</Text>
          )}
        </View>
        {noLeidas > 0 && (
          <TouchableOpacity onPress={marcarTodasLeidas}>
            <Text style={styles.markAll}>Marcar todas leídas</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} size="large" />
      ) : (
        <FlatList
          data={notifs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); cargar(); }} tintColor={Colors.primary} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ fontSize: 48, textAlign: 'center' }}>🔔</Text>
              <Text style={styles.emptyText}>No tenés notificaciones</Text>
              <Text style={styles.emptySub}>Te avisaremos cuando haya avisos cerca de tu casa.</Text>
            </View>
          }
          renderItem={({ item: n }) => (
            <TouchableOpacity
              style={[styles.card, !n.leida && styles.cardUnread]}
              onPress={() => {
                marcarLeida(n.id);
                if (n.post_id) router.push(`/publicaciones/${n.post_id}`);
              }}
              activeOpacity={0.8}
            >
              <View style={styles.cardLeft}>
                <Text style={styles.emoji}>{TIPO_EMOJI[n.tipo] ?? '🐾'}</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={[styles.mensaje, !n.leida && { fontWeight: '700', color: Colors.ink }]}>
                  {n.mensaje}
                </Text>
                <Text style={styles.tiempo}>{formatTiempo(n.created_at)}</Text>
              </View>
              {!n.leida && <View style={styles.dot} />}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: Colors.bg },
  header:      { backgroundColor: Colors.white, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  title:       { fontSize: 24, fontWeight: '900', color: Colors.ink },
  badge:       { fontSize: 12, fontWeight: '700', color: Colors.primary, marginTop: 2 },
  markAll:     { fontSize: 12, fontWeight: '700', color: Colors.primary },
  list:        { padding: 16, gap: 8 },
  empty:       { alignItems: 'center', marginTop: 48, gap: 10, paddingHorizontal: 32 },
  emptyText:   { fontSize: 16, fontWeight: '700', color: Colors.ink, textAlign: 'center' },
  emptySub:    { fontSize: 13, color: Colors.inkMuted, textAlign: 'center', lineHeight: 20 },
  card:        { backgroundColor: Colors.white, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  cardUnread:  { backgroundColor: '#fff8f5', borderLeftWidth: 3, borderLeftColor: Colors.primary },
  cardLeft:    { width: 36, alignItems: 'center' },
  emoji:       { fontSize: 22 },
  cardBody:    { flex: 1 },
  mensaje:     { fontSize: 13, color: Colors.inkMuted, lineHeight: 18 },
  tiempo:      { fontSize: 11, color: Colors.inkMuted + '80', marginTop: 4 },
  dot:         { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
});
