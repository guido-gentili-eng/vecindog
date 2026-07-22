import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, ActivityIndicator, Linking,
} from 'react-native';
import { router } from 'expo-router';
import { listarPostsCuidado, resolverPost, type Post } from '@/lib/posts';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';

function PostCuidadoCard({ post: p, mio, onResolver }: { post: Post; mio: boolean; onResolver: () => void }) {
  const { t } = useLanguage();
  const esCuidador = p.categoria === 'cuidador_disponible';
  const foto = p.images?.[0];

  return (
    <View style={styles.card}>
      {foto ? <Image source={{ uri: foto }} style={styles.cardImg} /> : (
        <View style={[styles.cardImg, styles.cardImgFallback]}>
          <Text style={{ fontSize: 26 }}>{esCuidador ? '🙋' : '🔍'}</Text>
        </View>
      )}
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 6 }}>
          <Text style={styles.cardNombre} numberOfLines={1}>
            {p.nombre ?? (esCuidador ? t.cuidadoCuidadorFallback : t.cuidadoBuscaCuidadorFallback)}
          </Text>
          {mio && (
            <TouchableOpacity style={styles.deactivateBtn} onPress={onResolver}>
              <Text style={styles.deactivateBtnText}>{t.cuidadoDesactivar}</Text>
            </TouchableOpacity>
          )}
        </View>
        {!!p.descripcion && <Text style={styles.cardDesc} numberOfLines={2}>{p.descripcion}</Text>}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
          {!!p.zona && <Text style={styles.cardMeta}>📍 {p.zona}</Text>}
          {!!p.horario && <Text style={styles.cardMeta}>📅 {p.horario}</Text>}
        </View>
        {esCuidador && (
          <TouchableOpacity onPress={() => router.push(`/cuidado/cuidador/${p.id}` as any)}>
            <Text style={styles.verPerfil}>{t.cuidadoVerPerfil}</Text>
          </TouchableOpacity>
        )}
      </View>
      {!!p.contacto && (
        <TouchableOpacity
          style={styles.waBtn}
          onPress={() => Linking.openURL(`https://wa.me/${p.contacto!.replace(/\D/g, '')}`)}
        >
          <Text style={{ fontSize: 16 }}>📞</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function CuidadoScreen() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [buscadores, setBuscadores] = useState<Post[]>([]);
  const [cuidadores, setCuidadores] = useState<Post[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([
      listarPostsCuidado('busco_cuidador'),
      listarPostsCuidado('cuidador_disponible'),
    ]).then(([b, c]) => { setBuscadores(b); setCuidadores(c); })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  async function handleResolver(id: string, cat: 'busco_cuidador' | 'cuidador_disponible') {
    await resolverPost(id);
    if (cat === 'busco_cuidador') setBuscadores((p) => p.filter((x) => x.id !== id));
    else setCuidadores((p) => p.filter((x) => x.id !== id));
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingTop: 56, paddingBottom: 40 }}>
      <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>{t.cuidadoVolver}</Text></TouchableOpacity>

      <View style={{ alignItems: 'center', marginTop: 12, marginBottom: 20 }}>
        <View style={styles.chip}><Text style={styles.chipText}>{t.cuidadoComunidad}</Text></View>
        <Text style={styles.title}>{t.cuidadoTitle}</Text>
        <Text style={styles.sub}>{t.cuidadoSub}</Text>
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            {t.cuidadoWarning}
          </Text>
        </View>
      </View>

      {/* Busco cuidador */}
      <TouchableOpacity style={[styles.ctaBanner, { backgroundColor: '#0d9488' }]} onPress={() => router.push('/cuidado/busco-cuidador' as any)}>
        <Text style={{ fontSize: 24 }}>🔍</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.ctaTitle}>{t.cuidadoBuscoTitle}</Text>
          <Text style={styles.ctaSub}>{t.cuidadoBuscoSub}</Text>
        </View>
        <Text style={styles.ctaArrow}>›</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>{t.cuidadoBuscandoSection} {buscadores.length > 0 && `(${buscadores.length})`}</Text>
      {cargando ? (
        <ActivityIndicator color={Colors.primary} style={{ marginVertical: 16 }} />
      ) : buscadores.length === 0 ? (
        <View style={styles.emptyBox}><Text style={styles.emptyText}>{t.cuidadoEmptyBusco}</Text></View>
      ) : (
        <View style={{ gap: 10, marginBottom: 8 }}>
          {buscadores.map((p) => (
            <PostCuidadoCard key={p.id} post={p} mio={p.user_id === user?.id} onResolver={() => handleResolver(p.id, 'busco_cuidador')} />
          ))}
        </View>
      )}

      {/* Quiero cuidar */}
      <TouchableOpacity style={[styles.ctaBanner, { backgroundColor: '#115e59', marginTop: 20 }]} onPress={() => router.push('/cuidado/quiero-cuidar' as any)}>
        <Text style={{ fontSize: 24 }}>🙋</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.ctaTitle}>{t.cuidadoQuieroTitle}</Text>
          <Text style={styles.ctaSub}>{t.cuidadoQuieroSub}</Text>
        </View>
        <Text style={styles.ctaArrow}>›</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>{t.cuidadoDisponiblesSection} {cuidadores.length > 0 && `(${cuidadores.length})`}</Text>
      {cargando ? (
        <ActivityIndicator color={Colors.primary} style={{ marginVertical: 16 }} />
      ) : cuidadores.length === 0 ? (
        <View style={styles.emptyBox}><Text style={styles.emptyText}>{t.cuidadoEmptyCuidadores}</Text></View>
      ) : (
        <View style={{ gap: 10 }}>
          {cuidadores.map((p) => (
            <PostCuidadoCard key={p.id} post={p} mio={p.user_id === user?.id} onResolver={() => handleResolver(p.id, 'cuidador_disponible')} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: Colors.bg },
  back:       { fontSize: 14, fontWeight: '700', color: Colors.primary },
  chip:       { backgroundColor: '#ccfbf1', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  chipText:   { fontSize: 11, fontWeight: '800', color: '#0f766e' },
  title:      { fontSize: 26, fontWeight: '900', color: Colors.ink, marginTop: 8, textAlign: 'center' },
  sub:        { fontSize: 13, color: Colors.inkMuted, marginTop: 6, textAlign: 'center' },
  warningBox: { backgroundColor: '#fee2e2', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, marginTop: 10 },
  warningText: { fontSize: 12, fontWeight: '700', color: '#b91c1c', textAlign: 'center' },
  ctaBanner:  { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 20, padding: 16, marginBottom: 14 },
  ctaTitle:   { fontSize: 16, fontWeight: '900', color: Colors.white },
  ctaSub:     { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  ctaArrow:   { fontSize: 20, color: Colors.white, opacity: 0.7 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: Colors.ink, marginBottom: 10 },
  emptyBox:   { borderWidth: 1, borderStyle: 'dashed', borderColor: '#5eead4', backgroundColor: '#f0fdfa', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 8 },
  emptyText:  { fontSize: 13, color: '#0d9488', textAlign: 'center' },
  card:       { flexDirection: 'row', gap: 12, backgroundColor: Colors.white, borderRadius: 18, padding: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  cardImg:    { width: 56, height: 56, borderRadius: 14 },
  cardImgFallback: { backgroundColor: '#ccfbf1', alignItems: 'center', justifyContent: 'center' },
  cardNombre: { fontSize: 15, fontWeight: '800', color: Colors.ink, flex: 1 },
  cardDesc:   { fontSize: 12, color: Colors.inkMuted, marginTop: 2 },
  cardMeta:   { fontSize: 11, color: Colors.inkMuted },
  verPerfil:  { fontSize: 12, fontWeight: '800', color: '#0d9488', marginTop: 6 },
  deactivateBtn: { backgroundColor: Colors.bad + '1a', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  deactivateBtnText: { fontSize: 10, fontWeight: '800', color: Colors.bad },
  waBtn:      { width: 40, height: 40, borderRadius: 14, backgroundColor: '#0d9488', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
});
