import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MapaScreenWeb() {
  const { t } = useLanguage();
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
      <Text style={styles.webTitle}>{t.mapaWebTitle}</Text>
      <Text style={styles.webSub}>{t.mapaWebSub}</Text>
      {count !== null && <Text style={styles.webSub}>{count} {t.mapaWebCargadosSuffix}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  webFallback: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: Colors.bg, padding: 32 },
  webTitle:    { fontSize: 20, fontWeight: '800', color: Colors.ink, textAlign: 'center' },
  webSub:      { fontSize: 14, color: Colors.inkMuted, textAlign: 'center' },
});
