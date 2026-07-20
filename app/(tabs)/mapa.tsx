import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Image } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/colors';
import CategoriaDot from '@/components/CategoriaDot';
import { thumbUrl } from '@/lib/imageUtils';

const CAT_COLOR: Record<string, string> = {
  perdido:    '#ef4444',
  encontrado: '#22c55e',
  adopcion:   '#f97316',
  transito:   '#7c3aed',
};

const LEYENDA_LABEL: Record<string, string> = {
  perdido: 'Perdido', encontrado: 'Visto', adopcion: 'En adopción', transito: 'En la calle',
};

function fmt(iso: string | null) {
  if (!iso) return '';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}

// Cache de geocodificacion en memoria — evita pegarle a Nominatim de nuevo
// por la misma zona/ciudad mientras dura la sesion de la app.
const geocodeCache = new Map<string, { lat: number; lng: number }>();

async function geocodificarZona(zona: string, ciudad?: string | null): Promise<{ lat: number; lng: number } | null> {
  const key = `${zona}|${ciudad ?? ''}`.toLowerCase();
  if (geocodeCache.has(key)) return geocodeCache.get(key)!;
  try {
    const query = ciudad ? `${zona}, ${ciudad}, Argentina` : `${zona}, Argentina`;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=ar`,
      { headers: { 'User-Agent': 'Vecindog/1.0 (noreply@mivecindog.com.ar)' } }
    );
    const data = await res.json();
    if (data?.[0]) {
      const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      geocodeCache.set(key, coords);
      return coords;
    }
  } catch { /* sin geocodificar, se omite este aviso del mapa */ }
  return null;
}

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
    cargarPostsSinCoordenadas();
  }, []);

  async function cargarPosts(r = region) {
    // Carga solo los markers dentro de la región visible + 50% de margen
    const latMargin = r.latitudeDelta  * 0.5;
    const lngMargin = r.longitudeDelta * 0.5;
    const { data } = await supabase
      .from('posts')
      .select('id, categoria, nombre, zona, lat, lng, images, fecha')
      .eq('estado', 'activo')
      .not('lat', 'is', null)
      .not('lng', 'is', null)
      .gte('lat', r.latitude  - r.latitudeDelta  / 2 - latMargin)
      .lte('lat', r.latitude  + r.latitudeDelta  / 2 + latMargin)
      .gte('lng', r.longitude - r.longitudeDelta / 2 - lngMargin)
      .lte('lng', r.longitude + r.longitudeDelta / 2 + lngMargin)
      .limit(200);
    setPosts((prev) => {
      // Conservar los que ya se geocodificaron a mano (no tienen bbox propio)
      const geocodedIds = new Set(prev.filter((p) => p.geocodificado).map((p) => p.id));
      const nuevos = (data ?? []).filter((p) => !geocodedIds.has(p.id));
      return [...nuevos, ...prev.filter((p) => p.geocodificado)];
    });
    setLoading(false);
  }

  // Avisos sin lat/lng no aparecian nunca en el mapa (a diferencia de la web,
  // que los geocodifica por zona/ciudad via Nominatim). Se replica esa misma
  // logica aca, una sola vez al entrar al mapa (no en cada pan, para no
  // pegarle de mas a la API gratuita de OpenStreetMap).
  async function cargarPostsSinCoordenadas() {
    const { data } = await supabase
      .from('posts')
      .select('id, categoria, nombre, zona, ciudad, images, fecha')
      .eq('estado', 'activo')
      .is('lat', null)
      .not('zona', 'is', null)
      .limit(25);
    if (!data?.length) return;

    const geocoded: any[] = [];
    for (const p of data) {
      const coords = await geocodificarZona(p.zona, p.ciudad);
      if (coords) geocoded.push({ ...p, lat: coords.lat, lng: coords.lng, geocodificado: true });
    }
    if (geocoded.length > 0) {
      setPosts((prev) => [...prev, ...geocoded]);
    }
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
        onRegionChangeComplete={(r) => { setRegion(r); cargarPosts(r); }}
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
                {p.images?.[0] && (
                  <Image source={{ uri: thumbUrl(p.images[0]) }} style={styles.calloutImg} />
                )}
                <View style={styles.calloutCatRow}>
                  <CategoriaDot categoria={p.categoria} size={8} />
                  <Text style={styles.calloutEmoji}>{LEYENDA_LABEL[p.categoria] ?? p.categoria}</Text>
                </View>
                <Text style={styles.calloutNombre}>{p.nombre || 'Sin nombre'}</Text>
                <Text style={styles.calloutZona}>📍 {p.zona || '—'}</Text>
                {p.fecha && <Text style={styles.calloutZona}>📅 {fmt(p.fecha)}</Text>}
                <Text style={styles.calloutLink}>Ver aviso →</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Leyenda */}
      <View style={styles.leyenda}>
        {Object.keys(CAT_COLOR).map((cat) => (
          <View key={cat} style={styles.leyendaItem}>
            <CategoriaDot categoria={cat} size={10} />
            <Text style={styles.leyendaText}>{LEYENDA_LABEL[cat] ?? cat}</Text>
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
  calloutImg:     { width: '100%', height: 80, borderRadius: 8, marginBottom: 6 },
  calloutCatRow:  { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  calloutEmoji:   { fontSize: 11, fontWeight: '700', color: Colors.inkMuted, textTransform: 'capitalize' },
  calloutNombre:  { fontSize: 15, fontWeight: '800', color: Colors.ink },
  calloutZona:    { fontSize: 12, color: Colors.inkMuted, marginTop: 2 },
  calloutLink:    { fontSize: 12, fontWeight: '700', color: Colors.primary, marginTop: 6 },
  leyenda:        { position: 'absolute', bottom: 24, left: 16, right: 16, backgroundColor: Colors.white, borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  leyendaItem:    { flexDirection: 'row', alignItems: 'center', gap: 4 },
  leyendaText:    { fontSize: 12, fontWeight: '600', color: Colors.ink, textTransform: 'capitalize' },
  leyendaCount:   { fontSize: 12, fontWeight: '800', color: Colors.primary },
  webFallback:    { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: Colors.bg, padding: 32 },
  webTitle:       { fontSize: 20, fontWeight: '800', color: Colors.ink, textAlign: 'center' },
  webSub:         { fontSize: 14, color: Colors.inkMuted, textAlign: 'center' },
});
