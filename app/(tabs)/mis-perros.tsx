import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, Image, RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';

export default function MisPerrosScreen() {
  const { user } = useAuth();
  const [perros,     setPerros]     = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function cargar() {
    if (!user) return;
    const { data } = await supabase
      .from('perros')
      .select('id, nombre, raza, color, tamano, sexo, foto_url')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setPerros(data ?? []);
    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => { cargar(); }, [user]);

  const onRefresh = () => { setRefreshing(true); cargar(); };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mis perros 🐶</Text>
          <Text style={styles.sub}>{perros.length} registrado{perros.length !== 1 ? 's' : ''}</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/mis-perros/nuevo')}
        >
          <Text style={styles.addBtnText}>+ Agregar</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} size="large" />
      ) : (
        <FlatList
          data={perros}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ fontSize: 64, textAlign: 'center' }}>🐕</Text>
              <Text style={styles.emptyTitle}>Sin perros registrados</Text>
              <Text style={styles.emptySub}>Registrá a tu perro para tener toda su información lista.</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/mis-perros/nuevo')}>
                <Text style={styles.emptyBtnText}>+ Registrar perro</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item: p }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/mis-perros/${p.id}`)}
              activeOpacity={0.8}
            >
              {p.foto_url
                ? <Image source={{ uri: p.foto_url }} style={styles.img} />
                : <View style={[styles.img, styles.imgPlaceholder]}>
                    <Text style={{ fontSize: 32 }}>🐶</Text>
                  </View>
              }
              <View style={styles.info}>
                <Text style={styles.nombre}>{p.nombre}</Text>
                <Text style={styles.detalles} numberOfLines={1}>
                  {[p.raza, p.color, p.tamano, p.sexo].filter(Boolean).join(' · ')}
                </Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.bg },
  header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.white, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  title:        { fontSize: 24, fontWeight: '900', color: Colors.ink },
  sub:          { fontSize: 12, color: Colors.inkMuted, marginTop: 2 },
  addBtn:       { backgroundColor: Colors.primary, paddingHorizontal: 16, paddingVertical: 9, borderRadius: 14 },
  addBtnText:   { color: Colors.white, fontWeight: '800', fontSize: 13 },
  list:         { padding: 16, gap: 10 },
  empty:        { alignItems: 'center', marginTop: 48, paddingHorizontal: 32, gap: 10 },
  emptyTitle:   { fontSize: 17, fontWeight: '800', color: Colors.ink, textAlign: 'center' },
  emptySub:     { fontSize: 13, color: Colors.inkMuted, textAlign: 'center', lineHeight: 20 },
  emptyBtn:     { backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16, marginTop: 4 },
  emptyBtnText: { color: Colors.white, fontWeight: '800', fontSize: 14 },
  card:         { backgroundColor: Colors.white, borderRadius: 18, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  img:          { width: 76, height: 76 },
  imgPlaceholder: { backgroundColor: Colors.cream, alignItems: 'center', justifyContent: 'center' },
  info:         { flex: 1, padding: 14 },
  nombre:       { fontSize: 16, fontWeight: '800', color: Colors.ink },
  detalles:     { fontSize: 12, color: Colors.inkMuted, marginTop: 3 },
  arrow:        { fontSize: 24, color: Colors.inkMuted, paddingRight: 14 },
});
