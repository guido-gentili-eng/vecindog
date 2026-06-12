import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, FlatList,
  TouchableOpacity, ActivityIndicator, RefreshControl, Image,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { thumbUrl } from '@/lib/imageUtils';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';

const PAGE_SIZE = 30;

const CATEGORIAS = [
  { key: 'perdido',    label: '🔴 Perdidos',    color: '#fef2f2', border: '#fca5a5' },
  { key: 'encontrado', label: '🟢 Encontrados', color: '#f0fdf4', border: '#86efac' },
  { key: 'adopcion',   label: '🟤 Adopción',    color: '#fef3c7', border: '#fcd34d' },
];

type PostSummary = {
  id: string; categoria: string; nombre: string | null;
  raza: string | null; zona: string | null; ciudad: string | null;
  images: string[] | null; created_at: string;
};

async function fetchFeedPage({
  pageParam,
  catFilter,
}: {
  pageParam: string | null;
  catFilter: string | null;
}): Promise<PostSummary[]> {
  let q = supabase
    .from('posts')
    .select('id, categoria, nombre, raza, zona, ciudad, images, created_at')
    .eq('estado', 'activo')
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE);

  // Cursor-based: traer posts más antiguos que el cursor
  if (pageParam) q = q.lt('created_at', pageParam);
  if (catFilter) q = q.eq('categoria', catFilter);

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as PostSummary[];
}

export default function HomeScreen() {
  const { user, profile } = useAuth();
  const [catFilter, setCatFilter] = React.useState<string | null>(null);
  const [noLeidas,  setNoLeidas]  = React.useState(0);

  // Notificaciones no leídas — sólo al ganar foco
  useFocusEffect(
    React.useCallback(() => {
      if (!user) return;
      supabase
        .from('notifications')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('leida', false)
        .then(({ count }) => setNoLeidas(count ?? 0));
    }, [user]),
  );

  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey:        ['feed', catFilter],
    queryFn:         ({ pageParam }) => fetchFeedPage({ pageParam: pageParam as string | null, catFilter }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage: PostSummary[]) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return lastPage[lastPage.length - 1].created_at;
    },
  });

  const posts = data?.pages.flat() ?? [];

  function cambiarFiltro(cat: string | null) {
    setCatFilter(cat);
    // La query se recarga sola al cambiar la queryKey; si ya tenemos caché no se ve spinner
  }

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
          onPress={() => cambiarFiltro(null)}
        >
          <Text style={[styles.chipText, !catFilter && styles.chipTextActive]}>Todos</Text>
        </TouchableOpacity>
        {CATEGORIAS.map((c) => (
          <TouchableOpacity
            key={c.key}
            style={[styles.chip, catFilter === c.key && styles.chipActive]}
            onPress={() => cambiarFiltro(c.key)}
          >
            <Text style={[styles.chipText, catFilter === c.key && styles.chipTextActive]}>
              {c.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista */}
      {isLoading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} size="large" />
      ) : error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorEmoji}>📡</Text>
          <Text style={styles.errorTitle}>Sin conexión</Text>
          <Text style={styles.errorSub}>No pudimos cargar los avisos. Verificá tu conexión.</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
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
          onEndReached={() => { if (hasNextPage && !isFetchingNextPage) fetchNextPage(); }}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={<Text style={styles.empty}>No hay avisos en esta categoría.</Text>}
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
              {p.images?.[0] ? (
                <Image source={{ uri: thumbUrl(p.images[0]) }} style={styles.cardImg} />
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
          )}
        />
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
  errorBox:       { alignItems: 'center', marginTop: 48, paddingHorizontal: 32, gap: 8 },
  errorEmoji:     { fontSize: 40 },
  errorTitle:     { fontSize: 17, fontWeight: '800', color: Colors.ink },
  errorSub:       { fontSize: 13, color: Colors.inkMuted, textAlign: 'center', lineHeight: 19 },
  retryBtn:       { marginTop: 8, backgroundColor: Colors.primary, borderRadius: 14, paddingHorizontal: 28, paddingVertical: 12 },
  retryText:      { color: Colors.white, fontWeight: '700', fontSize: 14 },
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
