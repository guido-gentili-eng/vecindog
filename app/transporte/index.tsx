import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, ActivityIndicator, Linking,
} from 'react-native';
import { router } from 'expo-router';
import { listarPostsCuidado, resolverPost, type Post } from '@/lib/posts';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';

function TransportadorCard({ post: p, promedio, mio, onResolver }: { post: Post; promedio?: number; mio: boolean; onResolver: () => void }) {
  const foto = p.images?.[0];
  return (
    <View style={styles.card}>
      {foto ? <Image source={{ uri: foto }} style={styles.cardImg} /> : (
        <View style={[styles.cardImg, styles.cardImgFallback]}><Text style={{ fontSize: 26 }}>🚗</Text></View>
      )}
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 6 }}>
          <Text style={styles.cardNombre} numberOfLines={1}>{p.nombre ?? 'Transportador'}</Text>
          {mio && (
            <TouchableOpacity style={styles.deactivateBtn} onPress={onResolver}>
              <Text style={styles.deactivateBtnText}>Desactivar</Text>
            </TouchableOpacity>
          )}
        </View>
        {promedio != null && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Text key={i} style={{ fontSize: 12, color: i < Math.round(promedio) ? '#f59e0b' : '#d1d5db' }}>★</Text>
            ))}
            <Text style={styles.promedioText}>{promedio.toFixed(1)}</Text>
          </View>
        )}
        {!!p.descripcion && <Text style={styles.cardDesc} numberOfLines={2}>{p.descripcion}</Text>}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
          {!!p.zona && <Text style={styles.cardMeta}>📍 {p.zona}</Text>}
          {!!p.horario && <Text style={styles.cardMeta}>📅 {p.horario}</Text>}
        </View>
        <TouchableOpacity onPress={() => router.push(`/transporte/transportador/${p.id}` as any)}>
          <Text style={styles.verPerfil}>⭐ Ver perfil</Text>
        </TouchableOpacity>
      </View>
      {!!p.contacto && (
        <TouchableOpacity style={styles.waBtn} onPress={() => Linking.openURL(`https://wa.me/${p.contacto!.replace(/\D/g, '')}`)}>
          <Text style={{ fontSize: 16 }}>📞</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function TransporteScreen() {
  const { user } = useAuth();
  const [transportadores, setTransportadores] = useState<Post[]>([]);
  const [promedios, setPromedios] = useState<Record<string, number>>({});
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      const posts = await listarPostsCuidado('transportador_disponible');
      if (!posts.length) { setCargando(false); return; }

      const { data: ratings } = await supabase
        .from('transportador_ratings')
        .select('transportador_post_id, estrellas')
        .in('transportador_post_id', posts.map((p) => p.id));

      const mapa: Record<string, { suma: number; total: number }> = {};
      for (const r of ratings ?? []) {
        if (!mapa[r.transportador_post_id]) mapa[r.transportador_post_id] = { suma: 0, total: 0 };
        mapa[r.transportador_post_id].suma += r.estrellas;
        mapa[r.transportador_post_id].total += 1;
      }
      const promediosCalc: Record<string, number> = {};
      for (const [id, { suma, total }] of Object.entries(mapa)) promediosCalc[id] = suma / total;
      setPromedios(promediosCalc);

      posts.sort((a, b) => (promediosCalc[b.id] ?? -1) - (promediosCalc[a.id] ?? -1));
      setTransportadores(posts);
      setCargando(false);
    }
    cargar();
  }, []);

  async function handleResolver(id: string) {
    await resolverPost(id);
    setTransportadores((p) => p.filter((x) => x.id !== id));
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingTop: 56, paddingBottom: 40 }}>
      <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>← Volver</Text></TouchableOpacity>

      <View style={{ alignItems: 'center', marginTop: 12, marginBottom: 20 }}>
        <View style={styles.chip}><Text style={styles.chipText}>🚗 Comunidad</Text></View>
        <Text style={styles.title}>Transporte de perros</Text>
        <Text style={styles.sub}>Vecinos que ayudan a trasladar mascotas.</Text>
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            🚫 Solo intercambios entre vecinos — está prohibido cobrar o ofrecer servicios comerciales en esta sección.
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.ctaBanner} onPress={() => router.push('/transporte/quiero-transportar' as any)}>
        <Text style={{ fontSize: 24 }}>🚗</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.ctaTitle}>Quiero transportar</Text>
          <Text style={styles.ctaSub}>Registrate como transportador de tu zona</Text>
        </View>
        <Text style={styles.ctaArrow}>›</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>🚗 Transportadores disponibles {transportadores.length > 0 && `(${transportadores.length})`}</Text>
      {cargando ? (
        <ActivityIndicator color={Colors.primary} style={{ marginVertical: 16 }} />
      ) : transportadores.length === 0 ? (
        <View style={styles.emptyBox}><Text style={styles.emptyText}>Todavía no hay transportadores registrados.</Text></View>
      ) : (
        <View style={{ gap: 10 }}>
          {transportadores.map((p) => (
            <TransportadorCard key={p.id} post={p} promedio={promedios[p.id]} mio={p.user_id === user?.id} onResolver={() => handleResolver(p.id)} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: Colors.bg },
  back:       { fontSize: 14, fontWeight: '700', color: Colors.primary },
  chip:       { backgroundColor: '#dbeafe', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  chipText:   { fontSize: 11, fontWeight: '800', color: '#1d4ed8' },
  title:      { fontSize: 26, fontWeight: '900', color: Colors.ink, marginTop: 8, textAlign: 'center' },
  sub:        { fontSize: 13, color: Colors.inkMuted, marginTop: 6, textAlign: 'center' },
  warningBox: { backgroundColor: '#fee2e2', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, marginTop: 10 },
  warningText: { fontSize: 12, fontWeight: '700', color: '#b91c1c', textAlign: 'center' },
  ctaBanner:  { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#1d4ed8', borderRadius: 20, padding: 16, marginBottom: 20 },
  ctaTitle:   { fontSize: 16, fontWeight: '900', color: Colors.white },
  ctaSub:     { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  ctaArrow:   { fontSize: 20, color: Colors.white, opacity: 0.7 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: Colors.ink, marginBottom: 10 },
  emptyBox:   { borderWidth: 1, borderStyle: 'dashed', borderColor: '#93c5fd', backgroundColor: '#eff6ff', borderRadius: 16, padding: 20, alignItems: 'center' },
  emptyText:  { fontSize: 13, color: '#1d4ed8', textAlign: 'center' },
  card:       { flexDirection: 'row', gap: 12, backgroundColor: Colors.white, borderRadius: 18, padding: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  cardImg:    { width: 56, height: 56, borderRadius: 14 },
  cardImgFallback: { backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center' },
  cardNombre: { fontSize: 15, fontWeight: '800', color: Colors.ink, flex: 1 },
  promedioText: { fontSize: 11, fontWeight: '800', color: Colors.ink, marginLeft: 2 },
  cardDesc:   { fontSize: 12, color: Colors.inkMuted, marginTop: 2 },
  cardMeta:   { fontSize: 11, color: Colors.inkMuted },
  verPerfil:  { fontSize: 12, fontWeight: '800', color: '#1d4ed8', marginTop: 6 },
  deactivateBtn: { backgroundColor: Colors.bad + '1a', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  deactivateBtnText: { fontSize: 10, fontWeight: '800', color: Colors.bad },
  waBtn:      { width: 40, height: 40, borderRadius: 14, backgroundColor: '#1d4ed8', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
});
