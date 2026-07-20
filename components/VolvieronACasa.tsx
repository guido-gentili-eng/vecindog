import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/colors';

interface PostResuelto {
  id: string; nombre: string | null; categoria: string; images: string[] | null;
}

const EMOJI_CATEGORIA: Record<string, string> = {
  perdido: '🏠 Volvió a casa',
  encontrado: '🏠 Volvió a casa',
  adopcion: '❤️ Fue adoptado',
};

export default function VolvieronACasa() {
  const [posts, setPosts] = useState<PostResuelto[]>([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('posts').select('id, nombre, categoria, images').eq('estado', 'resuelto').order('created_at', { ascending: false }).limit(4),
      supabase.from('posts').select('id', { count: 'exact', head: true }).eq('estado', 'resuelto'),
    ]).then(([postsRes, countRes]) => {
      setPosts((postsRes.data ?? []) as PostResuelto[]);
      setTotal(countRes.count ?? 0);
    }).finally(() => setCargando(false));
  }, []);

  if (!cargando && posts.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <View style={styles.pill}><Text style={styles.pillText}>❤️ Historias reales</Text></View>
          <Text style={styles.title}>Volvieron a casa 🏠</Text>
          <Text style={styles.sub}>Gracias a la comunidad, estos perros reencontraron a su familia.</Text>
        </View>
      </View>

      {cargando ? (
        <ActivityIndicator color={Colors.primary} style={{ marginVertical: 12 }} />
      ) : (
        <View style={{ gap: 8 }}>
          {posts.map((post) => (
            <TouchableOpacity key={post.id} style={styles.card} onPress={() => router.push(`/publicaciones/${post.id}`)}>
              {post.images?.[0] ? (
                <Image source={{ uri: post.images[0] }} style={styles.thumb} />
              ) : (
                <View style={[styles.thumb, { alignItems: 'center', justifyContent: 'center' }]}><Text>🖼️</Text></View>
              )}
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.nombre} numberOfLines={1}>{post.nombre ?? 'Sin nombre'}</Text>
                <Text style={styles.categoria}>{EMOJI_CATEGORIA[post.categoria] ?? '🏠 Reencontrado'}</Text>
              </View>
              <Text style={{ fontSize: 15 }}>❤️</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity onPress={() => router.push('/(tabs)/avisos?resueltos=1' as any)}>
        <Text style={styles.verTodos}>Ver todos →</Text>
      </TouchableOpacity>

      {!cargando && total >= 10 && (
        <Text style={styles.counter}>
          🐾 <Text style={styles.counterBold}>{total} perro{total !== 1 ? 's' : ''}</Text> reencontrado{total !== 1 ? 's' : ''} con la ayuda de Vecindog.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section:    { marginBottom: 24 },
  headerRow:  { marginBottom: 12 },
  pill:       { alignSelf: 'flex-start', backgroundColor: '#fde8e8', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  pillText:   { fontSize: 11, fontWeight: '800', color: '#c0392b' },
  title:      { fontSize: 20, fontWeight: '900', color: Colors.ink, marginTop: 6 },
  sub:        { fontSize: 12, color: Colors.inkMuted, marginTop: 2 },
  card:       { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.white, borderRadius: 16, padding: 10, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  thumb:      { width: 40, height: 40, borderRadius: 10, backgroundColor: Colors.cream },
  nombre:     { fontSize: 13, fontWeight: '800', color: Colors.ink },
  categoria:  { fontSize: 11, color: Colors.inkMuted, marginTop: 1 },
  verTodos:   { fontSize: 12, fontWeight: '700', color: Colors.primary, marginTop: 10, textAlign: 'right' },
  counter:    { fontSize: 12, color: Colors.inkMuted, textAlign: 'center', marginTop: 12, lineHeight: 18 },
  counterBold: { fontWeight: '800', color: Colors.ink },
});
