import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, Image, Alert, RefreshControl,
} from 'react-native';
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
      <View style={styles.header}>
        <Text style={styles.title}>Mis perros 🐶</Text>
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
            <View style={styles.emptyBox}>
              <Text style={{ fontSize: 56, textAlign: 'center' }}>🐕</Text>
              <Text style={styles.emptyText}>Todavía no registraste ningún perro.</Text>
              <Text style={styles.emptySub}>Registrá a tu perro para tener toda su info lista si algún día se pierde.</Text>
            </View>
          }
          renderItem={({ item: p }) => (
            <View style={styles.card}>
              {p.foto_url
                ? <Image source={{ uri: p.foto_url }} style={styles.img} />
                : <View style={[styles.img, styles.imgPlaceholder]}>
                    <Text style={{ fontSize: 32 }}>🐶</Text>
                  </View>
              }
              <View style={styles.body}>
                <Text style={styles.nombre}>{p.nombre}</Text>
                <Text style={styles.sub}>
                  {[p.raza, p.color, p.tamano, p.sexo].filter(Boolean).join(' · ')}
                </Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: Colors.bg },
  header:         { backgroundColor: Colors.white, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  title:          { fontSize: 24, fontWeight: '900', color: Colors.ink },
  list:           { padding: 16, gap: 10 },
  emptyBox:       { alignItems: 'center', marginTop: 48, paddingHorizontal: 32, gap: 8 },
  emptyText:      { fontSize: 16, fontWeight: '700', color: Colors.ink, textAlign: 'center' },
  emptySub:       { fontSize: 13, color: Colors.inkMuted, textAlign: 'center', lineHeight: 20 },
  card:           { backgroundColor: Colors.white, borderRadius: 18, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  img:            { width: 72, height: 72 },
  imgPlaceholder: { backgroundColor: Colors.cream, alignItems: 'center', justifyContent: 'center' },
  body:           { flex: 1, padding: 14 },
  nombre:         { fontSize: 16, fontWeight: '800', color: Colors.ink },
  sub:            { fontSize: 12, color: Colors.inkMuted, marginTop: 3 },
  arrow:          { fontSize: 22, color: Colors.inkMuted, paddingRight: 14 },
});
