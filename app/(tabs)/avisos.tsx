import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator, TextInput, Image, RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/colors';

export default function AvisosScreen() {
  const [posts,      setPosts]      = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search,     setSearch]     = useState('');

  async function cargar() {
    const { data } = await supabase
      .from('posts')
      .select('id, categoria, nombre, raza, zona, ciudad, images, created_at, estado')
      .order('created_at', { ascending: false })
      .limit(50);
    setPosts(data ?? []);
    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => { cargar(); }, []);

  const onRefresh = () => { setRefreshing(true); cargar(); };

  const filtrados = posts.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.nombre?.toLowerCase().includes(q) ||
      p.raza?.toLowerCase().includes(q) ||
      p.zona?.toLowerCase().includes(q) ||
      p.ciudad?.toLowerCase().includes(q)
    );
  });

  const CAT_COLOR: Record<string, string> = {
    perdido:    '#fca5a5',
    encontrado: '#86efac',
    adopcion:   '#fcd34d',
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Avisos</Text>
        <TextInput
          style={styles.search}
          placeholder="🔍  Buscar por nombre, raza, zona…"
          placeholderTextColor={Colors.inkMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} size="large" />
      ) : (
        <FlatList
          data={filtrados}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
          ListEmptyComponent={<Text style={styles.empty}>No se encontraron avisos.</Text>}
          renderItem={({ item: p }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/publicaciones/${p.id}`)}
              activeOpacity={0.85}
            >
              {p.images?.[0]
                ? <Image source={{ uri: p.images[0] }} style={styles.img} />
                : <View style={[styles.img, { backgroundColor: Colors.cream, alignItems: 'center', justifyContent: 'center' }]}>
                    <Text style={{ fontSize: 30 }}>🐶</Text>
                  </View>
              }
              <View style={styles.body}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <View style={[styles.badge, { backgroundColor: CAT_COLOR[p.categoria] ?? '#e5e7eb' }]}>
                    <Text style={styles.badgeText}>{p.categoria}</Text>
                  </View>
                  {p.estado === 'resuelto' && (
                    <View style={[styles.badge, { backgroundColor: '#d1fae5' }]}>
                      <Text style={[styles.badgeText, { color: Colors.good }]}>Resuelto</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.nombre}>{p.nombre || 'Sin nombre'}</Text>
                {p.raza ? <Text style={styles.sub}>{p.raza}</Text> : null}
                <Text style={styles.zona}>📍 {p.zona || p.ciudad || '—'}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header:    { backgroundColor: Colors.white, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12 },
  title:     { fontSize: 24, fontWeight: '900', color: Colors.ink, marginBottom: 12 },
  search:    { backgroundColor: Colors.cream, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: Colors.ink },
  list:      { padding: 16, gap: 10 },
  empty:     { textAlign: 'center', color: Colors.inkMuted, marginTop: 32 },
  card:      { backgroundColor: Colors.white, borderRadius: 18, overflow: 'hidden', flexDirection: 'row', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  img:       { width: 96, height: 104 },
  body:      { flex: 1, padding: 12, justifyContent: 'center' },
  badge:     { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: '700', textTransform: 'capitalize', color: Colors.ink },
  nombre:    { fontSize: 15, fontWeight: '800', color: Colors.ink },
  sub:       { fontSize: 12, color: Colors.inkMuted },
  zona:      { fontSize: 12, color: Colors.inkMuted, marginTop: 2 },
});
