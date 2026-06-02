import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, RefreshControl, Image,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';
import { useFocusEffect } from 'expo-router';

const CATEGORIAS = [
  { key: 'perdido',    label: '🔴 Perdidos',    color: '#fef2f2', border: '#fca5a5' },
  { key: 'encontrado', label: '🟢 Encontrados', color: '#f0fdf4', border: '#86efac' },
  { key: 'adopcion',   label: '🟤 Adopción',    color: '#fef3c7', border: '#fcd34d' },
];

export default function HomeScreen() {
  const { user, profile } = useAuth();
  const [posts,      setPosts]      = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [catFilter,  setCatFilter]  = useState<string | null>(null);
  const [noLeidas,   setNoLeidas]   = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      if (!user) return;
      supabase.from('notifications').select('id', { count: 'exact' })
        .eq('user_id', user.id).eq('leida', false)
        .then(({ count }) => setNoLeidas(count ?? 0));
    }, [user])
  );

  async function cargar() {
    let q = supabase
      .from('posts')
      .select('id, categoria, nombre, raza, zona, ciudad, images, created_at')
      .eq('estado', 'activo')
      .order('created_at', { ascending: false })
      .limit(30);

    if (catFilter) q = q.eq('categoria', catFilter);
    const { data } = await q;
    setPosts(data ?? []);
    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => { cargar(); }, [catFilter]);

  const onRefresh = () => { setRefreshing(true); cargar(); };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hola{profile?.nombre ? `, ${profile.nombre}` : ''} 👋
          </Text>
          <Text style={styles.subGreeting}>Red vecinal de mascotas</Text>
        </View>
        <TouchableOpacity style={styles.bellBtn} onPress={() => router.push('/notificaciones')}>
          <Text style={{ fontSize: 22 }}>🔔</Text>
          {noLeidas > 0 && (
            <View style={styles.bellBadge}>
              <Text style={styles.bellBadgeText}>{noLeidas > 9 ? '9+' : noLeidas}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
        <TouchableOpacity
          style={[styles.chip, !catFilter && styles.chipActive]}
          onPress={() => setCatFilter(null)}
        >
          <Text style={[styles.chipText, !catFilter && styles.chipTextActive]}>Todos</Text>
        </TouchableOpacity>
        {CATEGORIAS.map((c) => (
          <TouchableOpacity
            key={c.key}
            style={[styles.chip, catFilter === c.key && styles.chipActive]}
            onPress={() => setCatFilter(c.key)}
          >
            <Text style={[styles.chipText, catFilter === c.key && styles.chipTextActive]}>
              {c.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista */}
      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} size="large" />
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        >
          {posts.length === 0 ? (
            <Text style={styles.empty}>No hay avisos en esta categoría.</Text>
          ) : (
            posts.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={styles.card}
                onPress={() => router.push(`/publicaciones/${p.id}`)}
                activeOpacity={0.85}
              >
                {p.images?.[0] ? (
                  <Image source={{ uri: p.images[0] }} style={styles.cardImg} />
                ) : (
                  <View style={[styles.cardImg, styles.cardImgPlaceholder]}>
                    <Text style={{ fontSize: 36 }}>🐶</Text>
                  </View>
                )}
                <View style={styles.cardBody}>
                  <View style={[styles.catBadge, { backgroundColor: CATEGORIAS.find(c => c.key === p.categoria)?.color }]}>
                    <Text style={styles.catBadgeText}>{p.categoria}</Text>
                  </View>
                  <Text style={styles.cardNombre}>{p.nombre || 'Sin nombre'}</Text>
                  {p.raza && <Text style={styles.cardSub}>{p.raza}</Text>}
                  <Text style={styles.cardZona}>📍 {p.zona || p.ciudad || '—'}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: Colors.bg },
  header:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16, backgroundColor: Colors.white },
  greeting:       { fontSize: 20, fontWeight: '800', color: Colors.ink },
  subGreeting:    { fontSize: 13, color: Colors.inkMuted, marginTop: 2 },
  bellBtn:        { position: 'relative', padding: 4 },
  bellBadge:      { position: 'absolute', top: 0, right: 0, backgroundColor: Colors.bad, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  bellBadgeText:  { color: Colors.white, fontSize: 9, fontWeight: '900' },
  filters:        { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.white, maxHeight: 56 },
  chip:           { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: Colors.cream, marginRight: 8, borderWidth: 1, borderColor: Colors.border },
  chipActive:     { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText:       { fontSize: 13, fontWeight: '600', color: Colors.inkMuted },
  chipTextActive: { color: Colors.white },
  list:           { padding: 16, gap: 12 },
  empty:          { textAlign: 'center', color: Colors.inkMuted, marginTop: 32 },
  card:           { backgroundColor: Colors.white, borderRadius: 20, overflow: 'hidden', flexDirection: 'row', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  cardImg:        { width: 100, height: 110 },
  cardImgPlaceholder: { backgroundColor: Colors.cream, alignItems: 'center', justifyContent: 'center' },
  cardBody:       { flex: 1, padding: 12, justifyContent: 'center', gap: 4 },
  catBadge:       { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginBottom: 2 },
  catBadgeText:   { fontSize: 11, fontWeight: '700', color: Colors.ink, textTransform: 'capitalize' },
  cardNombre:     { fontSize: 16, fontWeight: '800', color: Colors.ink },
  cardSub:        { fontSize: 12, color: Colors.inkMuted },
  cardZona:       { fontSize: 12, color: Colors.inkMuted, marginTop: 2 },
});
