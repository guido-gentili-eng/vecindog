import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Platform } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/colors';

const CAT_COLOR: Record<string, string> = {
  perdido:    '#ef4444',
  encontrado: '#22c55e',
  adopcion:   '#f59e0b',
};

const CAT_EMOJI: Record<string, string> = {
  perdido: '🔴', encontrado: '🟢', adopcion: '🟤',
};

export default function MapaScreen() {
  const [posts,    setPosts]    = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [region,   setRegion]   = useState({
    latitude:       -38.7183,
    longitude:      -62.2661,
    latitudeDelta:  0.5,
    longitudeDelta: 0.5,
  });

  useEffect(() => {
    cargarPosts();
    pedirUbicacion();
  }, []);

  async function cargarPosts() {
    const { data } = await supabase
      .from('posts')
      .select('id, categoria, nombre, zona, lat, lng')
      .eq('estado', 'activo')
      .not('lat', 'is', null)
      .not('lng', 'is', null)
      .limit(100);
    setPosts(data ?? []);
    setLoading(false);
  }

  async function pedirUbicacion() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = loc.coords;
      setLocation({ lat: latitude, lng: longitude });
      setRegion({
        latitude, longitude,
        latitudeDelta:  0.1,
        longitudeDelta: 0.1,
      });
    } catch { /* sin GPS, usa región default */ }
  }

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webFallback}>
        <Text style={{ fontSize: 48 }}>🗺️</Text>
        <Text style={styles.webTitle}>Mapa disponible en la app</Text>
        <Text style={styles.webSub}>El mapa interactivo funciona en iOS y Android.</Text>
        <Text style={styles.webSub}>{posts.length} avisos con ubicación cargados.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      )}

      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {/* Marcadores de avisos */}
        {posts.map((p) => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.lat, longitude: p.lng }}
            pinColor={CAT_COLOR[p.categoria] ?? Colors.primary}
          >
            <Callout onPress={() => router.push(`/publicaciones/${p.id}`)}>
              <View style={styles.callout}>
                <Text style={styles.calloutEmoji}>{CAT_EMOJI[p.categoria]} {p.categoria}</Text>
                <Text style={styles.calloutNombre}>{p.nombre || 'Sin nombre'}</Text>
                <Text style={styles.calloutZona}>📍 {p.zona || '—'}</Text>
                <Text style={styles.calloutLink}>Ver aviso →</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Leyenda */}
      <View style={styles.leyenda}>
        {Object.entries(CAT_EMOJI).map(([cat, emoji]) => (
          <View key={cat} style={styles.leyendaItem}>
            <Text style={styles.leyendaEmoji}>{emoji}</Text>
            <Text style={styles.leyendaText}>{cat}</Text>
          </View>
        ))}
        <Text style={styles.leyendaCount}>{posts.length} avisos</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1 },
  map:            { flex: 1 },
  loadingOverlay: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bg + 'aa', zIndex: 10 },
  callout:        { minWidth: 160, padding: 10 },
  calloutEmoji:   { fontSize: 11, fontWeight: '700', color: Colors.inkMuted, textTransform: 'capitalize', marginBottom: 4 },
  calloutNombre:  { fontSize: 15, fontWeight: '800', color: Colors.ink },
  calloutZona:    { fontSize: 12, color: Colors.inkMuted, marginTop: 2 },
  calloutLink:    { fontSize: 12, fontWeight: '700', color: Colors.primary, marginTop: 6 },
  leyenda:        { position: 'absolute', bottom: 24, left: 16, right: 16, backgroundColor: Colors.white, borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  leyendaItem:    { flexDirection: 'row', alignItems: 'center', gap: 4 },
  leyendaEmoji:   { fontSize: 14 },
  leyendaText:    { fontSize: 12, fontWeight: '600', color: Colors.ink, textTransform: 'capitalize' },
  leyendaCount:   { fontSize: 12, fontWeight: '800', color: Colors.primary },
  webFallback:    { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: Colors.bg, padding: 32 },
  webTitle:       { fontSize: 20, fontWeight: '800', color: Colors.ink, textAlign: 'center' },
  webSub:         { fontSize: 14, color: Colors.inkMuted, textAlign: 'center' },
});
