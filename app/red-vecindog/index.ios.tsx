import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { CATEGORIAS_RED_VECINDOG as CATEGORIAS } from '@/lib/redVecindogCategorias';
import { Colors } from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Variante iOS de Red Vecindog: solo navegacion de lectura (directorio de
 * comercios ya registrados). El alta de comercio no esta disponible desde
 * iOS -- se hace por Android o por la web -- para no requerir Apple
 * In-App Purchase (Guideline 3.1.1).
 */
export default function RedVecindogScreenIOS() {
  const { t } = useLanguage();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingTop: 56, paddingBottom: 50 }}>
      <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>{t.cuidadoVolver}</Text></TouchableOpacity>

      <View style={{ alignItems: 'center', marginTop: 12, marginBottom: 24 }}>
        <Text style={styles.title}>{t.rvTitle}</Text>
        <Text style={styles.sub}>{t.rvIosBrowseSub}</Text>
      </View>

      <Text style={styles.sectionTitle}>{t.rvElegiRubro}</Text>
      <View style={{ gap: 10, marginBottom: 24 }}>
        {CATEGORIAS.map((c) => (
          <TouchableOpacity key={c.url} style={styles.catCard} onPress={() => router.push(`/red-vecindog/${c.url}` as any)}>
            <Text style={{ fontSize: 24 }}>{c.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.catLabel}>{c.label}</Text>
              <Text style={styles.catDesc}>{c.desc}</Text>
            </View>
            <Text style={{ fontSize: 18, color: Colors.inkMuted }}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  back: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  title: { fontSize: 28, fontWeight: '900', color: Colors.ink, marginTop: 10, textAlign: 'center' },
  sub: { fontSize: 13, color: Colors.inkMuted, marginTop: 8, textAlign: 'center', lineHeight: 19 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: Colors.ink, marginBottom: 10 },
  catCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderRadius: 16, padding: 14 },
  catLabel: { fontSize: 14, fontWeight: '800', color: Colors.ink },
  catDesc: { fontSize: 11, color: Colors.inkMuted, marginTop: 1 },
});
