import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator, TextInput, Image, RefreshControl,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { thumbUrl } from '@/lib/imageUtils';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/colors';
import AdSlot from '@/components/AdSlot';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Translations } from '@/lib/translations';

const PAGE_SIZE = 30;

type PostSummary = {
  id: string; categoria: string; nombre: string | null; estado: string;
  raza: string | null; zona: string | null; ciudad: string | null;
  images: string[] | null; created_at: string;
  descripcion: string | null; horario: string | null;
  situacion_transito: string | null; fecha_limite_transito: string | null;
};

const CATEGORIAS_FILTRO_KEYS = ['', 'perdido', 'encontrado', 'adopcion', 'transito'] as const;

function diasRestantes(fechaLimite: string): number {
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const limite = new Date(`${fechaLimite}T00:00:00`);
  return Math.ceil((limite.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
}

async function fetchAvisosPage({
  pageParam,
  search,
  categoria,
  soloResueltos,
}: {
  pageParam: string | null;
  search: string;
  categoria: string;
  soloResueltos: boolean;
}): Promise<PostSummary[]> {
  let q = supabase
    .from('posts')
    .select('id, categoria, nombre, raza, zona, ciudad, images, created_at, estado, descripcion, horario, situacion_transito, fecha_limite_transito')
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE);

  q = q.eq('estado', soloResueltos ? 'resuelto' : 'activo');
  if (categoria)     q = q.eq('categoria', categoria);
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
  perdido: '#fca5a5', encontrado: '#86efac', adopcion: '#fcd34d', transito: '#ddd6fe',
};

function catLabel(t: Translations): Record<string, string> {
  return { perdido: t.avisosCatPerdido, encontrado: t.avisosCatEncontrado, adopcion: t.avisosCatAdopcion, transito: t.avisosCatTransito };
}

export default function AvisosScreen() {
  const { t } = useLanguage();
  const CAT_LABEL = catLabel(t);
  const CATEGORIAS_FILTRO = CATEGORIAS_FILTRO_KEYS.map((key) => ({
    key,
    label: key === '' ? t.avisosCatTodos : CAT_LABEL[key],
  }));
  const { resueltos } = useLocalSearchParams<{ resueltos?: string }>();
  const soloResueltos = resueltos === '1';
  const [search,         setSearch]         = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoria,      setCategoria]      = useState('');
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
    isError,
  } = useInfiniteQuery({
    queryKey:         ['avisos', debouncedSearch, categoria, soloResueltos],
    queryFn:          ({ pageParam }) =>
      fetchAvisosPage({ pageParam: pageParam as string | null, search: debouncedSearch, categoria, soloResueltos }),
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
          <Text style={styles.title}>{soloResueltos ? t.vacTitle : t.avisosTitle}</Text>
        </View>
        <TextInput
          style={styles.search}
          placeholder={t.avisosSearchPh}
          placeholderTextColor={Colors.inkMuted}
          value={search}
          onChangeText={setSearch}
        />
        <View style={styles.catRow}>
          {CATEGORIAS_FILTRO.map((c) => (
            <TouchableOpacity
              key={c.key}
              style={[styles.catChip, categoria === c.key && styles.catChipActive]}
              onPress={() => setCategoria(c.key)}
            >
              <Text style={[styles.catChipText, categoria === c.key && styles.catChipTextActive]}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {!isLoading && (
          <Text style={styles.resultCount}>{posts.length} {posts.length === 1 ? t.avisosCountSingular : t.avisosCountPlural}</Text>
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} size="large" />
      ) : isError ? (
        <View style={styles.errorWrap}>
          <Text style={styles.errorText}>{t.avisosErrorText}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryBtnText}>{t.homeRetry}</Text>
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
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={{ fontSize: 40 }}>🐾</Text>
              <Text style={styles.empty}>{t.avisosEmpty}</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={() => router.push('/publicar')}>
                <Text style={styles.retryBtnText}>{t.avisosPublicar}</Text>
              </TouchableOpacity>
            </View>
          }
          onEndReached={() => { if (hasNextPage && !isFetchingNextPage) fetchNextPage(); }}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            isFetchingNextPage
              ? <ActivityIndicator color={Colors.primary} style={{ marginVertical: 16 }} />
              : null
          }
          renderItem={({ item: p, index }) => {
            const dias = p.categoria === 'transito' && p.situacion_transito === 'tengo' && p.fecha_limite_transito
              ? diasRestantes(p.fecha_limite_transito)
              : null;
            return (
              <View>
              {index > 0 && (index + 1) % 4 === 0 && <AdSlot variant="card" />}
              <TouchableOpacity
                style={styles.card}
                onPress={() => router.push(`/publicaciones/${p.id}`)}
                activeOpacity={0.85}
              >
                <View>
                  {p.images?.[0]
                    ? <Image source={{ uri: thumbUrl(p.images[0]) }} style={styles.img} />
                    : <View style={[styles.img, { backgroundColor: Colors.cream, alignItems: 'center', justifyContent: 'center' }]}>
                        <Text style={{ fontSize: 30 }}>🐶</Text>
                      </View>
                  }
                  {(p.images?.length ?? 0) > 1 && (
                    <View style={styles.fotoCountBadge}>
                      <Text style={styles.fotoCountText}>📷 {p.images!.length}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.body}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                    <View style={[styles.badge, { backgroundColor: CAT_COLOR[p.categoria] ?? '#e5e7eb' }]}>
                      <Text style={styles.badgeText}>{CAT_LABEL[p.categoria] ?? p.categoria}</Text>
                    </View>
                    {p.estado === 'resuelto' && (
                      <View style={[styles.badge, { backgroundColor: '#d1fae5' }]}>
                        <Text style={[styles.badgeText, { color: Colors.good }]}>{t.avisosBadgeResuelto}</Text>
                      </View>
                    )}
                    {p.categoria === 'transito' && p.situacion_transito === 'calle' && (
                      <View style={[styles.badge, { backgroundColor: '#ede9fe' }]}>
                        <Text style={[styles.badgeText, { color: '#7c3aed' }]}>{t.avisosBadgeEnLaCalle}</Text>
                      </View>
                    )}
                    {dias != null && (
                      <View style={[styles.badge, { backgroundColor: dias <= 3 ? '#fee2e2' : '#ede9fe' }]}>
                        <Text style={[styles.badgeText, { color: dias <= 3 ? Colors.bad : '#7c3aed' }]}>
                          {dias > 0 ? `${dias}${t.avisosDiasRestantesSuffix}` : t.avisosVenceHoy}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.nombre}>{p.nombre || t.homeSinNombre}</Text>
                  {p.raza ? <Text style={styles.sub}>{p.raza}</Text> : null}
                  {p.descripcion ? <Text style={styles.descripcion} numberOfLines={2}>{p.descripcion}</Text> : null}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 3 }}>
                    <Text style={styles.zona}>📍 {p.zona || p.ciudad || '—'}</Text>
                    {p.horario && <Text style={styles.zona}>🕐 {p.horario}</Text>}
                  </View>
                </View>
              </TouchableOpacity>
              </View>
            );
          }}
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
  search:    { backgroundColor: Colors.cream, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: Colors.ink },
  catRow:    { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  catChip:       { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white },
  catChipActive: { borderColor: Colors.primary, backgroundColor: '#fef0ec' },
  catChipText:       { fontSize: 12, fontWeight: '600', color: Colors.inkMuted },
  catChipTextActive: { color: Colors.primary, fontWeight: '700' },
  resultCount: { fontSize: 12, color: Colors.inkMuted, marginTop: 8, fontWeight: '600' },
  list:      { padding: 16, gap: 10 },
  empty:     { textAlign: 'center', color: Colors.inkMuted },
  emptyWrap: { alignItems: 'center', gap: 10, marginTop: 48, paddingHorizontal: 32 },
  errorWrap: { alignItems: 'center', gap: 10, marginTop: 48 },
  errorText: { color: Colors.inkMuted, fontWeight: '600' },
  retryBtn:  { backgroundColor: Colors.primary, borderRadius: 14, paddingHorizontal: 18, paddingVertical: 10 },
  retryBtnText: { color: Colors.white, fontWeight: '800', fontSize: 13 },
  card:      { backgroundColor: Colors.white, borderRadius: 18, overflow: 'hidden', flexDirection: 'row', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  img:       { width: 96, height: 104 },
  fotoCountBadge: { position: 'absolute', bottom: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 8, paddingHorizontal: 5, paddingVertical: 1 },
  fotoCountText:  { fontSize: 9, color: Colors.white, fontWeight: '700' },
  body:      { flex: 1, padding: 12, justifyContent: 'center' },
  badge:     { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: '700', color: Colors.ink },
  nombre:    { fontSize: 15, fontWeight: '800', color: Colors.ink },
  sub:       { fontSize: 12, color: Colors.inkMuted },
  descripcion: { fontSize: 11, color: Colors.inkMuted, marginTop: 2 },
  zona:      { fontSize: 12, color: Colors.inkMuted, marginTop: 2 },
});
