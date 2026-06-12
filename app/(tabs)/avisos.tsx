import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator, TextInput, Image, RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { thumbUrl } from '@/lib/imageUtils';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/colors';

const PAGE_SIZE = 30;

type PostSummary = {
  id: string; categoria: string; nombre: string | null; estado: string;
  raza: string | null; zona: string | null; ciudad: string | null;
  images: string[] | null; created_at: string;
};

async function fetchAvisosPage({
  pageParam,
  search,
  verResueltos,
}: {
  pageParam: string | null;
  search: string;
  verResueltos: boolean;
}): Promise<PostSummary[]> {
  let q = supabase
    .from('posts')
    .select('id, categoria, nombre, raza, zona, ciudad, images, created_at, estado')
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE);

  if (!verResueltos) q = q.eq('estado', 'activo');
  if (pageParam)     q = q.lt('created_at', pageParam);

  if (search.trim()) {
    q = q.or(
      `nombre.ilike.%${search}%,raza.ilike.%${search}%,zona.ilike.%${search}%,ciudad.ilike.%${search}%`,
    );
  }

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as PostSummary[];
}

const CAT_COLOR: Record<string, string> = {
  perdido: '#fca5a5', encontrado: '#86efac', adopcion: '#fcd34d',
};

export default function AvisosScreen() {
  const [search,         setSearch]         = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [verResueltos,   setVerResueltos]   = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce: actualiza debouncedSearch 400ms después del último keystroke
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search]);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey:         ['avisos', debouncedSearch, verResueltos],
    queryFn:          ({ pageParam }) =>
      fetchAvisosPage({ pageParam: pageParam as string | null, search: debouncedSearch, verResueltos }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage: PostSummary[]) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return lastPage[lastPage.length - 1].created_at;
    },
  });

  const posts = data?.pages.flat() ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Avisos</Text>
          <TouchableOpacity
            style={[styles.toggleBtn, verResueltos && styles.toggleBtnActive]}
            onPress={() => setVerResueltos((v) => !v)}
          >
            <Text style={[styles.toggleText, verResueltos && styles.toggleTextActive]}>
              {verResueltos ? '✅ Incluye resueltos' : 'Ver resueltos'}
            </Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.search}
          placeholder="🔍  Buscar por nombre, raza, zona…"
          placeholderTextColor={Colors.inkMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} size="large" />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching && !isFetchingNextPage}
              onRefresh={() => refetch()}
              tintColor={Colors.primary}
            />
          }
          ListEmptyComponent={<Text style={styles.empty}>No se encontraron avisos.</Text>}
          onEndReached={() => { if (hasNextPage && !isFetchingNextPage) fetchNextPage(); }}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            isFetchingNextPage
              ? <ActivityIndicator color={Colors.primary} style={{ marginVertical: 16 }} />
              : null
          }
          renderItem={({ item: p }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/publicaciones/${p.id}`)}
              activeOpacity={0.85}
            >
              {p.images?.[0]
                ? <Image source={{ uri: thumbUrl(p.images[0]) }} style={styles.img} />
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
  container:       { flex: 1, backgroundColor: Colors.bg },
  header:          { backgroundColor: Colors.white, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12 },
  titleRow:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title:           { fontSize: 24, fontWeight: '900', color: Colors.ink },
  toggleBtn:       { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white },
  toggleBtnActive: { borderColor: Colors.good, backgroundColor: '#f0fdf4' },
  toggleText:      { fontSize: 12, fontWeight: '600', color: Colors.inkMuted },
  toggleTextActive: { color: Colors.good },
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
