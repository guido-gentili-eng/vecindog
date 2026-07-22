import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Linking, Image, Modal, TextInput,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { getComercioReviews, calificarComercio, type ComercioReview, type ResumenReviews } from '@/lib/comercioReviews';
import { Colors } from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';

const CATEGORIA_LABEL: Record<string, string> = {
  'Veterinaria': '🏥 Veterinaria', 'Pet Shop': '🛍️ Pet Shop', 'Peluquería Canina': '✂️ Peluquería Canina',
  'Adiestrador': '🏆 Adiestrador', 'Paseador': '🐕 Paseador', 'Guardería / Hotel': '🏠 Guardería / Hotel',
  'Refugio / Rescate': '❤️ Refugio / Rescate', 'Tienda de Mascotas': '🛒 Tienda de Mascotas', 'Farmacia Veterinaria': '💊 Farmacia Veterinaria',
};

type Comercio = {
  id: string; titulo: string; subtitulo: string | null; descripcion_comercio: string | null;
  imagen_url: string | null; categoria_local: string | null; direccion_comercio: string | null;
  telefono_comercio: string | null; horario_apertura: string | null; horario_cierre: string | null;
  dias_atencion: string | null; href: string | null;
};

type Novedad = { id: string; titulo: string; texto: string; imagen_url: string | null; created_at: string };

function track(adId: string, event_type: string) {
  fetch('https://www.mivecindog.com.ar/api/comercio-stats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ad_id: adId, event_type }),
  }).catch(() => {});
}

function Estrellas({ valor, size = 14 }: { valor: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Text key={i} style={{ fontSize: size, color: i < Math.round(valor) ? '#f59e0b' : '#d1d5db' }}>★</Text>
      ))}
    </View>
  );
}

function ModalCalificar({ adId, inicial, onGuardado, onClose }: { adId: string; inicial: ComercioReview | null; onGuardado: () => void; onClose: () => void }) {
  const { t } = useLanguage();
  const [estrellas, setEstrellas] = useState(inicial?.estrellas ?? 0);
  const [comentario, setComentario] = useState(inicial?.comentario ?? '');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (estrellas === 0) { setError(t.ratingErrSeleccionaPuntuacion); return; }
    setEnviando(true); setError('');
    try {
      await calificarComercio(adId, estrellas, comentario);
      onGuardado();
    } catch (e: any) {
      setError(e?.message ?? t.ratingErrGuardarDefault);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>{t.comercioCalificarTitle}</Text>
          <View style={{ flexDirection: 'row', gap: 6, marginVertical: 14, justifyContent: 'center' }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <TouchableOpacity key={n} onPress={() => setEstrellas(n)}>
                <Text style={{ fontSize: 32, color: n <= estrellas ? '#f59e0b' : '#d1d5db' }}>★</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={[styles.input, { height: 70, textAlignVertical: 'top' }]}
            value={comentario} onChangeText={setComentario} multiline
            placeholder={t.comercioComentarioPh} placeholderTextColor={Colors.inkMuted}
          />
          {!!error && <Text style={styles.error}>{error}</Text>}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}><Text style={styles.cancelBtnText}>{t.perfilCancelar}</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.saveBtn, enviando && { opacity: 0.6 }]} onPress={handleSubmit} disabled={enviando}>
              {enviando ? <ActivityIndicator color={Colors.white} size="small" /> : <Text style={styles.saveBtnText}>{t.genericGuardar}</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function ComercioDetailScreen() {
  const { t } = useLanguage();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [comercio, setComercio] = useState<Comercio | null>(null);
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [reviews, setReviews] = useState<ComercioReview[]>([]);
  const [resumen, setResumen] = useState<ResumenReviews | null>(null);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardado, setGuardado] = useState(false);

  async function cargarReviews() {
    try {
      const { reviews: rs, resumen: res } = await getComercioReviews(id);
      setReviews(rs); setResumen(res);
    } catch { /* silencioso */ }
  }

  useEffect(() => {
    async function cargar() {
      setCargando(true);
      const { data } = await supabase
        .from('ads')
        .select('id, titulo, subtitulo, descripcion_comercio, imagen_url, categoria_local, direccion_comercio, telefono_comercio, horario_apertura, horario_cierre, dias_atencion, href')
        .eq('id', id).eq('variant', 'comercio').single();
      setComercio(data as Comercio | null);
      if (data) {
        track(id, 'view');
        fetch(`https://www.mivecindog.com.ar/api/novedades?ad_id=${id}`)
          .then((r) => r.json()).then((j) => setNovedades(j.novedades ?? [])).catch(() => {});
        await cargarReviews();
      }
      setCargando(false);
    }
    cargar();
  }, [id]);

  function handleGuardado() {
    setModalAbierto(false); setGuardado(true);
    cargarReviews();
    setTimeout(() => setGuardado(false), 3000);
  }

  if (cargando) return <ActivityIndicator color={Colors.primary} style={{ flex: 1, marginTop: 60 }} size="large" />;

  if (!comercio) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Text style={{ color: Colors.inkMuted }}>{t.comercioNoEncontrado}</Text>
        <TouchableOpacity onPress={() => router.back()}><Text style={{ color: '#b45309', fontWeight: '700' }}>{t.cuidadoVolver}</Text></TouchableOpacity>
      </View>
    );
  }

  const telDigits = comercio.telefono_comercio?.replace(/\D/g, '') ?? '';
  const waDigits = telDigits.replace(/^0/, '').replace(/^54?9?/, '');
  const yaCalifico = resumen?.miReview != null;
  const esFallback = !comercio.href || comercio.href.startsWith('tel:') || comercio.href === 'https://www.mivecindog.com.ar';

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingTop: 56, paddingBottom: 50 }}>
      <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>{t.cuidadoVolver}</Text></TouchableOpacity>

      {comercio.imagen_url ? <Image source={{ uri: comercio.imagen_url }} style={styles.banner} /> : (
        <View style={[styles.banner, styles.bannerFallback]}><Text style={{ fontSize: 40 }}>🐾</Text></View>
      )}

      {!!comercio.categoria_local && (
        <View style={styles.catBadge}><Text style={styles.catBadgeText}>{CATEGORIA_LABEL[comercio.categoria_local] ?? comercio.categoria_local}</Text></View>
      )}
      <Text style={styles.titulo}>{comercio.titulo}</Text>
      {!!comercio.subtitulo && <Text style={styles.subtitulo}>{comercio.subtitulo}</Text>}
      {!!comercio.descripcion_comercio && <Text style={styles.descripcion}>{comercio.descripcion_comercio}</Text>}

      {!!comercio.dias_atencion && (
        <View style={styles.dispoBox}>
          <Text style={styles.dispoText}>🕐 {comercio.dias_atencion}{comercio.horario_apertura ? ` · ${comercio.horario_apertura}–${comercio.horario_cierre}` : ''}</Text>
        </View>
      )}

      <View style={{ gap: 8, marginTop: 16 }}>
        {!!comercio.telefono_comercio && (
          <>
            <TouchableOpacity style={styles.actionBtn} onPress={() => { track(id, 'click_telefono'); Linking.openURL(`tel:${comercio.telefono_comercio}`); }}>
              <Text style={styles.actionBtnText}>{t.comercioLlamar}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#25D366' }]} onPress={() => { track(id, 'click_telefono'); Linking.openURL(`https://wa.me/549${waDigits}`); }}>
              <Text style={styles.actionBtnText}>{t.comercioWhatsapp}</Text>
            </TouchableOpacity>
          </>
        )}
        {!!comercio.direccion_comercio && (
          <TouchableOpacity style={styles.actionBtnOutline} onPress={() => { track(id, 'click_mapa'); Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(comercio.direccion_comercio!)}`); }}>
            <Text style={styles.actionBtnOutlineText}>📍 {comercio.direccion_comercio}</Text>
          </TouchableOpacity>
        )}
        {!esFallback && (
          <TouchableOpacity style={styles.actionBtnOutline} onPress={() => { track(id, 'click_link'); Linking.openURL(comercio.href!); }}>
            <Text style={styles.actionBtnOutlineText}>{t.comercioVisitarSitio}</Text>
          </TouchableOpacity>
        )}
      </View>

      {novedades.length > 0 && (
        <View style={{ marginTop: 24 }}>
          <Text style={styles.sectionTitle}>{t.comercioNovedades}</Text>
          <View style={{ gap: 10, marginTop: 10 }}>
            {novedades.map((n) => (
              <View key={n.id} style={styles.novedadCard}>
                {!!n.imagen_url && <Image source={{ uri: n.imagen_url }} style={styles.novedadImg} />}
                <Text style={styles.novedadTitulo}>{n.titulo}</Text>
                <Text style={styles.novedadTexto}>{n.texto}</Text>
                <Text style={styles.novedadFecha}>{new Date(n.created_at).toLocaleDateString('es-AR')}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 10 }}>
        <Text style={styles.sectionTitle}>{t.comercioResenas} {resumen && resumen.total > 0 ? `(${resumen.total})` : ''}</Text>
        {isAuthenticated && (
          <TouchableOpacity style={styles.calificarBtn} onPress={() => setModalAbierto(true)}>
            <Text style={styles.calificarBtnText}>{yaCalifico ? t.genericEditar : t.ratingCalificar}</Text>
          </TouchableOpacity>
        )}
      </View>

      {resumen && resumen.total > 0 && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <Estrellas valor={resumen.promedio} />
          <Text style={{ fontSize: 13, fontWeight: '800', color: Colors.ink }}>{resumen.promedio.toFixed(1)}</Text>
        </View>
      )}
      {guardado && <Text style={styles.guardadoText}>{t.comercioGuardadoText}</Text>}

      {reviews.length === 0 ? (
        <View style={styles.emptyBox}><Text style={styles.emptyText}>{t.comercioSinResenas}</Text></View>
      ) : (
        <View style={{ gap: 10 }}>
          {reviews.map((r) => (
            <View key={r.id} style={styles.reviewCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.reviewNombre}>{[r.profiles?.nombre, r.profiles?.apellido].filter(Boolean).join(' ') || t.amigosUsuarioFallback}</Text>
                <Text style={styles.reviewDate}>{new Date(r.created_at).toLocaleDateString('es-AR')}</Text>
              </View>
              <Estrellas valor={r.estrellas} />
              {!!r.comentario && <Text style={styles.reviewComentario}>{r.comentario}</Text>}
            </View>
          ))}
        </View>
      )}

      {modalAbierto && (
        <ModalCalificar adId={id} inicial={resumen?.miReview ?? null} onGuardado={handleGuardado} onClose={() => setModalAbierto(false)} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  back: { fontSize: 14, fontWeight: '700', color: '#b45309', marginBottom: 12 },
  banner: { width: '100%', height: 160, borderRadius: 20 },
  bannerFallback: { backgroundColor: '#fef3c7', alignItems: 'center', justifyContent: 'center' },
  catBadge: { alignSelf: 'flex-start', backgroundColor: '#fef3c7', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginTop: 14 },
  catBadgeText: { fontSize: 11, fontWeight: '800', color: '#92400e' },
  titulo: { fontSize: 22, fontWeight: '900', color: Colors.ink, marginTop: 8 },
  subtitulo: { fontSize: 13, color: Colors.inkMuted, marginTop: 2 },
  descripcion: { fontSize: 13, color: Colors.ink, marginTop: 10, lineHeight: 20 },
  dispoBox: { backgroundColor: Colors.white, borderRadius: 14, padding: 12, marginTop: 12 },
  dispoText: { fontSize: 13, color: Colors.ink, fontWeight: '600' },
  actionBtn: { backgroundColor: '#f59e0b', borderRadius: 16, paddingVertical: 13, alignItems: 'center' },
  actionBtnText: { color: Colors.white, fontWeight: '800', fontSize: 14 },
  actionBtnOutline: { borderWidth: 2, borderColor: Colors.border, borderRadius: 16, paddingVertical: 12, alignItems: 'center' },
  actionBtnOutlineText: { color: Colors.ink, fontWeight: '700', fontSize: 13 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: Colors.ink },
  novedadCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 14 },
  novedadImg: { width: '100%', height: 100, borderRadius: 12, marginBottom: 8 },
  novedadTitulo: { fontSize: 13, fontWeight: '800', color: Colors.ink },
  novedadTexto: { fontSize: 12, color: Colors.inkMuted, marginTop: 4, lineHeight: 17 },
  novedadFecha: { fontSize: 10, color: Colors.inkMuted, marginTop: 6 },
  calificarBtn: { backgroundColor: '#f59e0b', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8 },
  calificarBtnText: { color: Colors.white, fontWeight: '800', fontSize: 12 },
  guardadoText: { fontSize: 13, fontWeight: '700', color: '#b45309', marginBottom: 8 },
  emptyBox: { borderWidth: 1, borderStyle: 'dashed', borderColor: '#fbbf24', backgroundColor: '#fffbeb', borderRadius: 16, padding: 20, alignItems: 'center' },
  emptyText: { fontSize: 13, color: '#92400e' },
  reviewCard: { backgroundColor: Colors.white, borderRadius: 14, padding: 12, gap: 4 },
  reviewNombre: { fontSize: 13, fontWeight: '700', color: Colors.ink },
  reviewDate: { fontSize: 11, color: Colors.inkMuted },
  reviewComentario: { fontSize: 12, color: Colors.inkMuted, marginTop: 4, lineHeight: 17 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalSheet: { backgroundColor: Colors.white, borderRadius: 24, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '900', color: Colors.ink, textAlign: 'center' },
  input: { backgroundColor: Colors.cream, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, fontSize: 13, color: Colors.ink, borderWidth: 1, borderColor: Colors.border },
  error: { fontSize: 12, fontWeight: '700', color: Colors.bad, marginTop: 8, textAlign: 'center' },
  cancelBtn: { flex: 1, borderWidth: 2, borderColor: Colors.border, borderRadius: 16, paddingVertical: 12, alignItems: 'center' },
  cancelBtnText: { fontSize: 13, fontWeight: '700', color: Colors.inkMuted },
  saveBtn: { flex: 1, backgroundColor: '#f59e0b', borderRadius: 16, paddingVertical: 12, alignItems: 'center' },
  saveBtnText: { color: Colors.white, fontWeight: '800', fontSize: 13 },
});
