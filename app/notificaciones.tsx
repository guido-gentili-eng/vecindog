import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';
import CategoriaDot, { CATEGORIA_COLOR } from '@/components/CategoriaDot';
import { aceptarSolicitud, rechazarEliminarAmistad } from '@/lib/amistades';

interface Notif {
  id: string; tipo: string; mensaje: string;
  leida: boolean; post_id: string | null; created_at: string;
  meta: string | null;
}

const TIPO_EMOJI: Record<string, string> = {
  expiracion:       '⏰',
  visita:           '👁️',
  solicitud_amistad: '🤝',
  amistad_aceptada:  '👥',
  vacuna:           '💉',
  desparasitacion:  '🐛',
  medicamento:      '💊',
  turno:            '📅',
  peso:             '⚖️',
};

export default function NotificacionesScreen() {
  const { user, profile } = useAuth();
  const [notifs,     setNotifs]     = useState<Notif[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [procesando, setProcesando] = useState<string | null>(null);
  const [procesadas, setProcesadas] = useState<Set<string>>(new Set());

  async function cargar() {
    if (!user) { setLoading(false); setRefreshing(false); return; }
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

  // Realtime: antes había que refrescar a mano para ver notificaciones nuevas.
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        (payload) => {
          const nueva = payload.new as Notif;
          setNotifs((prev) => (prev.some((n) => n.id === nueva.id) ? prev : [nueva, ...prev]));
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  function metaAmistad(n: Notif): { amistad_id: string; solicitante_id: string } | null {
    if (n.tipo !== 'solicitud_amistad' || !n.meta) return null;
    try { return JSON.parse(n.meta); } catch { return null; }
  }

  async function handleAceptarAmistad(n: Notif) {
    const meta = metaAmistad(n);
    if (!meta) return;
    setProcesando(n.id);
    try {
      await aceptarSolicitud(meta.amistad_id);
      await supabase.from('notifications').insert({
        user_id: meta.solicitante_id, post_id: null, tipo: 'amistad_aceptada',
        mensaje: `${profile?.nombre ?? 'Tu vecino'} aceptó tu solicitud de amistad 🐾`,
        leida: false,
      });
      marcarLeida(n.id);
      setProcesadas((prev) => new Set(prev).add(n.id));
    } finally {
      setProcesando(null);
    }
  }

  async function handleRechazarAmistad(n: Notif) {
    const meta = metaAmistad(n);
    if (!meta) return;
    setProcesando(n.id);
    try {
      await rechazarEliminarAmistad(meta.amistad_id);
      marcarLeida(n.id);
      setProcesadas((prev) => new Set(prev).add(n.id));
    } finally {
      setProcesando(null);
    }
  }

  const noLeidas = notifs.filter((n) => !n.leida).length;

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
          renderItem={({ item: n }) => {
            const meta = metaAmistad(n);
            const mostrarAcciones = !!meta && !procesadas.has(n.id);
            return (
            <TouchableOpacity
              style={[styles.card, !n.leida && styles.cardUnread]}
              onPress={() => {
                marcarLeida(n.id);
                if (n.post_id) router.push(`/publicaciones/${n.post_id}`);
              }}
              activeOpacity={0.8}
              disabled={mostrarAcciones}
            >
              <View style={styles.cardLeft}>
                {CATEGORIA_COLOR[n.tipo]
                  ? <CategoriaDot categoria={n.tipo} size={16} />
                  : <Text style={styles.emoji}>{TIPO_EMOJI[n.tipo] ?? '🐾'}</Text>
                }
              </View>
              <View style={styles.cardBody}>
                <Text style={[styles.mensaje, !n.leida && { fontWeight: '700', color: Colors.ink }]}>
                  {n.mensaje}
                </Text>
                {mostrarAcciones && (
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                    <TouchableOpacity
                      style={styles.aceptarBtn}
                      disabled={procesando === n.id}
                      onPress={() => handleAceptarAmistad(n)}
                    >
                      {procesando === n.id
                        ? <ActivityIndicator size="small" color={Colors.good} />
                        : <Text style={styles.aceptarBtnText}>✓ Aceptar</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rechazarBtn}
                      disabled={procesando === n.id}
                      onPress={() => handleRechazarAmistad(n)}
                    >
                      <Text style={styles.rechazarBtnText}>✕ Rechazar</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <Text style={styles.tiempo}>{formatTiempo(n.created_at)}</Text>
              </View>
              {!n.leida && <View style={styles.dot} />}
            </TouchableOpacity>
            );
          }}
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
  aceptarBtn:  { backgroundColor: Colors.good + '1a', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 7 },
  aceptarBtnText: { fontSize: 12, fontWeight: '800', color: Colors.good },
  rechazarBtn: { backgroundColor: Colors.cream, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 7 },
  rechazarBtnText: { fontSize: 12, fontWeight: '800', color: Colors.inkMuted },
  emoji:       { fontSize: 22 },
  cardBody:    { flex: 1 },
  mensaje:     { fontSize: 13, color: Colors.inkMuted, lineHeight: 18 },
  tiempo:      { fontSize: 11, color: Colors.inkMuted + '80', marginTop: 4 },
  dot:         { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
});
