import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/colors';

export default function MapaScreenWeb() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('estado', 'activo')
      .not('lat', 'is', null)
      .not('lng', 'is', null)
      .then(({ count }) => setCount(count ?? 0));
  }, []);

  return (
    <View style={styles.webFallback}>
      <Text style={{ fontSize: 48 }}>🗺️</Text>
      <Text style={styles.webTitle}>Mapa disponible en la app</Text>
      <Text style={styles.webSub}>El mapa interactivo funciona en iOS y Android.</Text>
      {count !== null && <Text style={styles.webSub}>{count} avisos con ubicación cargados.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  webFallback: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: Colors.bg, padding: 32 },
  webTitle:    { fontSize: 20, fontWeight: '800', color: Colors.ink, textAlign: 'center' },
  webSub:      { fontSize: 14, color: Colors.inkMuted, textAlign: 'center' },
});
