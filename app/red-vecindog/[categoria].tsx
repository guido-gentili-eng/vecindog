import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, ActivityIndicator, Linking,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { categoriaPorUrl } from '@/lib/redVecindogCategorias';
import { Colors } from '@/constants/colors';

type Comercio = {
  id: string; titulo: string; subtitulo: string | null; imagen_url: string | null;
  direccion_comercio: string | null; telefono_comercio: string | null;
  horario_apertura: string | null; horario_cierre: string | null; dias_atencion: string | null;
};

export default function CategoriaRedVecindogScreen() {
  const { categoria } = useLocalSearchParams<{ categoria: string }>();
  const { profile, isPro } = useAuth();
  const cat = categoriaPorUrl(categoria);
  const [comercios, setComercios] = useState<Comercio[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!cat || !profile?.ciudad || !isPro) { setCargando(false); return; }
    const hoy = new Date().toISOString().slice(0, 10);
    supabase
      .from('ads')
      .select('id, titulo, subtitulo, imagen_url, direccion_comercio, telefono_comercio, horario_apertura, horario_cierre, dias_atencion')
      .eq('variant', 'comercio')
      .eq('activo', true)
      .eq('categoria_local', cat.slug)
      .ilike('direccion_comercio', `%${profile.ciudad}%`)
      .or(`fecha_fin.is.null,fecha_fin.gte.${hoy}`)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setComercios((data ?? []) as Comercio[]); setCargando(false); });
  }, [categoria, profile?.ciudad, isPro]);

  if (!cat) {
    return (
      <View style={styles.centerScreen}>
        <Text style={{ color: Colors.inkMuted }}>Categoría no encontrada.</Text>
        <TouchableOpacity onPress={() => router.replace('/red-vecindog' as any)}><Text style={{ color: '#b45309', fontWeight: '700', marginTop: 8 }}>← Volver</Text></TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingTop: 56, paddingBottom: 50 }}>
      <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>← Volver</Text></TouchableOpacity>

      <View style={{ alignItems: 'center', marginTop: 12, marginBottom: 20 }}>
        <Text style={{ fontSize: 40 }}>{cat.emoji}</Text>
        <Text style={styles.title}>{cat.label}</Text>
        <Text style={styles.sub}>{cat.desc}</Text>
      </View>

      {!profile?.ciudad ? (
        <View style={styles.emptyCard}>
          <Text style={{ fontSize: 32 }}>📍</Text>
          <Text style={styles.emptyTitle}>Completá tu ciudad</Text>
          <Text style={styles.emptySub}>Necesitamos saber tu ciudad para mostrarte los negocios cerca tuyo.</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/(tabs)/perfil')}>
            <Text style={styles.emptyBtnText}>Ir a mi perfil</Text>
          </TouchableOpacity>
        </View>
      ) : !isPro ? (
        <View style={styles.proCard}>
          <Text style={{ fontSize: 32 }}>🔒</Text>
          <Text style={styles.emptyTitle}>Función exclusiva VecindogPro</Text>
          <Text style={styles.emptySub}>Con Pro accedés al directorio completo de negocios de tu ciudad, con teléfono, dirección y horarios.</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => Linking.openURL('https://www.mivecindog.com.ar/planes')}>
            <Text style={styles.emptyBtnText}>Ver planes</Text>
          </TouchableOpacity>
        </View>
      ) : cargando ? (
        <ActivityIndicator color={Colors.primary} style={{ marginVertical: 30 }} />
      ) : comercios.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={{ fontSize: 32 }}>{cat.emoji}</Text>
          <Text style={styles.emptyTitle}>Todavía no hay negocios en {profile.ciudad}</Text>
          <Text style={styles.emptySub}>¿Tenés un negocio de esta categoría? Sumate a la Red Vecindog.</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/red-vecindog' as any)}>
            <Text style={styles.emptyBtnText}>Registrar mi negocio</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ gap: 10 }}>
          {comercios.map((c) => (
            <TouchableOpacity key={c.id} style={styles.card} onPress={() => router.push(`/comercio/${c.id}` as any)}>
              {c.imagen_url ? <Image source={{ uri: c.imagen_url }} style={styles.cardImg} /> : (
                <View style={[styles.cardImg, styles.cardImgFallback]}><Text style={{ fontSize: 22 }}>{cat.emoji}</Text></View>
              )}
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.cardTitulo}>{c.titulo}</Text>
                {!!c.subtitulo && <Text style={styles.cardSub} numberOfLines={1}>{c.subtitulo}</Text>}
                {!!c.direccion_comercio && <Text style={styles.cardMeta}>📍 {c.direccion_comercio}</Text>}
                {!!c.dias_atencion && <Text style={styles.cardMeta}>🕐 {c.dias_atencion} {c.horario_apertura ? `${c.horario_apertura}–${c.horario_cierre}` : ''}</Text>}
              </View>
              {!!c.telefono_comercio && (
                <TouchableOpacity style={styles.waBtn} onPress={() => Linking.openURL(`tel:${c.telefono_comercio}`)}>
                  <Text style={{ fontSize: 16 }}>📞</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  centerScreen: { flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' },
  back: { fontSize: 14, fontWeight: '700', color: '#b45309' },
  title: { fontSize: 22, fontWeight: '900', color: Colors.ink, marginTop: 8 },
  sub: { fontSize: 13, color: Colors.inkMuted, marginTop: 4, textAlign: 'center' },
  emptyCard: { alignItems: 'center', gap: 8, backgroundColor: Colors.white, borderRadius: 20, padding: 24, marginTop: 10 },
  proCard: { alignItems: 'center', gap: 8, backgroundColor: Colors.white, borderRadius: 20, padding: 24, marginTop: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: Colors.ink, textAlign: 'center', marginTop: 4 },
  emptySub: { fontSize: 12, color: Colors.inkMuted, textAlign: 'center' },
  emptyBtn: { backgroundColor: '#f59e0b', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 11, marginTop: 8 },
  emptyBtnText: { color: Colors.white, fontWeight: '800', fontSize: 13 },
  card: { flexDirection: 'row', gap: 12, backgroundColor: Colors.white, borderRadius: 18, padding: 12, alignItems: 'center' },
  cardImg: { width: 56, height: 56, borderRadius: 14 },
  cardImgFallback: { backgroundColor: '#fef3c7', alignItems: 'center', justifyContent: 'center' },
  cardTitulo: { fontSize: 14, fontWeight: '800', color: Colors.ink },
  cardSub: { fontSize: 12, color: Colors.inkMuted, marginTop: 1 },
  cardMeta: { fontSize: 11, color: Colors.inkMuted, marginTop: 2 },
  waBtn: { width: 40, height: 40, borderRadius: 14, backgroundColor: '#f59e0b', alignItems: 'center', justifyContent: 'center' },
});
