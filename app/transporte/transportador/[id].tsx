import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Linking, Modal, TextInput,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { obtenerPost, type Post } from '@/lib/posts';
import {
  getRatingsTransportador, calificarTransportador,
  type TransportadorRating, type ResumenRating,
} from '@/lib/transportadorRatings';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';

function Estrellas({ valor, size = 14 }: { valor: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Text key={i} style={{ fontSize: size, color: i < Math.round(valor) ? '#f59e0b' : '#d1d5db' }}>★</Text>
      ))}
    </View>
  );
}

function ModalPuntuacion({ transportadorPostId, inicial, onGuardado, onClose }: {
  transportadorPostId: string; inicial: TransportadorRating | null; onGuardado: () => void; onClose: () => void;
}) {
  const { t } = useLanguage();
  const [estrellas, setEstrellas] = useState(inicial?.estrellas ?? 0);
  const [cuidadoAnimal, setCuidadoAnimal] = useState<'excelente' | 'bueno' | 'regular' | null>(inicial?.cuidado_animal ?? null);
  const [fuePuntual, setFuePuntual] = useState<boolean | null>(inicial?.fue_puntual ?? null);
  const [buenaCom, setBuenaCom] = useState<boolean | null>(inicial?.buena_comunicacion ?? null);
  const [loRecomienda, setLoRecomienda] = useState<boolean | null>(inicial?.lo_recomendaria ?? null);
  const [comentario, setComentario] = useState(inicial?.comentario ?? '');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (estrellas === 0) { setError(t.ratingErrSeleccionaPuntuacion); return; }
    setEnviando(true);
    setError('');
    try {
      await calificarTransportador({
        transportadorPostId, estrellas, cuidado_animal: cuidadoAnimal,
        fue_puntual: fuePuntual, buena_comunicacion: buenaCom, lo_recomendaria: loRecomienda, comentario,
      });
      onGuardado();
    } catch (err: any) {
      setError(err?.message ?? t.ratingErrGuardarDefault);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <ScrollView contentContainerStyle={styles.modalSheet}>
          <Text style={styles.modalTitle}>{t.transportadorModalTitle}</Text>

          <Text style={styles.modalLabel}>{t.ratingModalPuntuacion}</Text>
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <TouchableOpacity key={n} onPress={() => setEstrellas(n)}>
                <Text style={{ fontSize: 30, color: n <= estrellas ? '#f59e0b' : '#d1d5db' }}>★</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.modalLabel}>{t.ratingComoCuido}</Text>
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
            {([['excelente', t.ratingExcelente], ['bueno', t.ratingBueno], ['regular', t.ratingRegular]] as const).map(([val, lbl]) => (
              <TouchableOpacity
                key={val}
                style={[styles.optBtn, cuidadoAnimal === val && styles.optBtnActive]}
                onPress={() => setCuidadoAnimal(cuidadoAnimal === val ? null : val)}
              >
                <Text style={[styles.optBtnText, cuidadoAnimal === val && styles.optBtnTextActive]}>{lbl}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {([
            [t.ratingFuePuntual, fuePuntual, setFuePuntual],
            [t.ratingBuenaCom, buenaCom, setBuenaCom],
            [t.ratingLoRecomienda, loRecomienda, setLoRecomienda],
          ] as [string, boolean | null, (v: boolean | null) => void][]).map(([pregunta, val, setter]) => (
            <View key={pregunta} style={{ marginBottom: 12 }}>
              <Text style={styles.modalLabel}>{pregunta}</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {([[true, t.bpfSi], [false, t.bpfNo]] as [boolean, string][]).map(([bval, lbl]) => (
                  <TouchableOpacity
                    key={String(bval)}
                    style={[styles.optBtn, { flex: 1 }, val === bval && styles.optBtnActive]}
                    onPress={() => setter(val === bval ? null : bval)}
                  >
                    <Text style={[styles.optBtnText, val === bval && styles.optBtnTextActive]}>{lbl}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          <Text style={styles.modalLabel}>{t.ratingComentarioLabel}</Text>
          <TextInput
            style={[styles.modalInput, { height: 60, textAlignVertical: 'top' }]}
            value={comentario} onChangeText={setComentario} multiline
            placeholder={t.ratingComentarioPh} placeholderTextColor={Colors.inkMuted}
          />

          {!!error && <Text style={styles.error}>{error}</Text>}

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}><Text style={styles.cancelBtnText}>{t.perfilCancelar}</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.saveBtn, enviando && { opacity: 0.6 }]} onPress={handleSubmit} disabled={enviando}>
              {enviando ? <ActivityIndicator color={Colors.white} size="small" /> : <Text style={styles.saveBtnText}>{t.genericGuardar}</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

export default function PerfilTransportadorScreen() {
  const { t } = useLanguage();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [ratings, setRatings] = useState<TransportadorRating[]>([]);
  const [resumen, setResumen] = useState<ResumenRating | null>(null);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardado, setGuardado] = useState(false);

  async function cargar() {
    setCargando(true);
    const [p, { ratings: rs, resumen: res }] = await Promise.all([obtenerPost(id), getRatingsTransportador(id)]);
    setPost(p);
    setRatings(rs);
    setResumen(res);
    setCargando(false);
  }

  useEffect(() => { cargar(); }, [id]);

  function handleGuardado() {
    setModalAbierto(false);
    setGuardado(true);
    cargar();
    setTimeout(() => setGuardado(false), 3000);
  }

  if (cargando) return <ActivityIndicator color={Colors.primary} style={{ flex: 1, marginTop: 60 }} size="large" />;

  if (!post) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Text style={{ color: Colors.inkMuted }}>{t.ratingNoEncontrado}</Text>
        <TouchableOpacity onPress={() => router.replace('/transporte' as any)}><Text style={{ color: '#1d4ed8', fontWeight: '700' }}>{t.cuidadoVolver}</Text></TouchableOpacity>
      </View>
    );
  }

  const yaCalifico = resumen?.miRating != null;
  const esPropioPost = post.user_id === user?.id;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingTop: 56, paddingBottom: 60 }}>
      <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>{t.cuidadoVolver}</Text></TouchableOpacity>

      <View style={styles.headerCard}>
        <View style={styles.avatar}><Text style={{ fontSize: 26 }}>🚗</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.nombre}>{post.nombre ?? t.transportadorFallbackNombre}</Text>
          {!!post.zona && <Text style={styles.zona}>📍 {post.zona}</Text>}
          {resumen && resumen.total > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <Estrellas valor={resumen.promedio} />
              <Text style={styles.promedioText}>{resumen.promedio.toFixed(1)}</Text>
              <Text style={styles.totalText}>({resumen.total} {t.ratingCalificacionesSuffix})</Text>
            </View>
          )}
        </View>
      </View>
      {!!post.contacto && (
        <TouchableOpacity style={styles.waBtn} onPress={() => Linking.openURL(`https://wa.me/${post.contacto!.replace(/\D/g, '')}`)}>
          <Text style={styles.waBtnText}>{t.ratingContactarWhatsapp}</Text>
        </TouchableOpacity>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🚗 {t.ratingSobre}</Text>
        {!!post.descripcion && <Text style={styles.descripcion}>{post.descripcion}</Text>}
        {!!post.horario && (
          <View style={styles.dispoBox}><Text style={styles.dispoText}>{t.ratingDisponibilidadPrefix} {post.horario}</Text></View>
        )}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 10 }}>
        <Text style={styles.sectionTitle}>{t.ratingCalificaciones} {resumen && resumen.total > 0 ? `(${resumen.total})` : ''}</Text>
        {isAuthenticated && !esPropioPost && (
          <TouchableOpacity style={styles.calificarBtn} onPress={() => setModalAbierto(true)}>
            <Text style={styles.calificarBtnText}>{yaCalifico ? t.genericEditar : t.ratingCalificar}</Text>
          </TouchableOpacity>
        )}
      </View>

      {guardado && <Text style={styles.guardadoText}>{t.ratingGuardadoTexto}</Text>}

      {ratings.length === 0 ? (
        <View style={styles.emptyBox}><Text style={styles.emptyText}>{t.ratingSinCalificaciones}</Text></View>
      ) : (
        <View style={{ gap: 10 }}>
          {ratings.map((r) => (
            <View key={r.id} style={styles.ratingCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Estrellas valor={r.estrellas} />
                <Text style={styles.ratingDate}>{new Date(r.created_at).toLocaleDateString('es-AR')}</Text>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                {!!r.cuidado_animal && <View style={styles.badge}><Text style={styles.badgeText}>{t.ratingCuidadoPrefix} {r.cuidado_animal}</Text></View>}
                {r.fue_puntual === true && <View style={styles.badge}><Text style={styles.badgeText}>{t.ratingPuntual}</Text></View>}
                {r.buena_comunicacion === true && <View style={styles.badge}><Text style={styles.badgeText}>{t.ratingBuenaComBadge}</Text></View>}
                {r.lo_recomendaria === true && <View style={styles.badgeGold}><Text style={styles.badgeGoldText}>{t.ratingLoRecomiendaBadge}</Text></View>}
              </View>
              {!!r.comentario && <Text style={styles.comentario}>{r.comentario}</Text>}
            </View>
          ))}
        </View>
      )}

      {modalAbierto && (
        <ModalPuntuacion transportadorPostId={id} inicial={resumen?.miRating ?? null} onGuardado={handleGuardado} onClose={() => setModalAbierto(false)} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: Colors.bg },
  back:       { fontSize: 14, fontWeight: '700', color: '#1d4ed8', marginBottom: 12 },
  headerCard: { flexDirection: 'row', gap: 14, backgroundColor: Colors.white, borderRadius: 20, padding: 18 },
  avatar:     { width: 64, height: 64, borderRadius: 18, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center' },
  nombre:     { fontSize: 20, fontWeight: '900', color: Colors.ink },
  zona:       { fontSize: 13, color: Colors.inkMuted, marginTop: 3 },
  promedioText: { fontSize: 13, fontWeight: '800', color: Colors.ink },
  totalText:  { fontSize: 12, color: Colors.inkMuted },
  waBtn:      { backgroundColor: '#1d4ed8', borderRadius: 16, paddingVertical: 13, alignItems: 'center', marginTop: 12 },
  waBtnText:  { color: Colors.white, fontWeight: '800', fontSize: 14 },
  card:       { backgroundColor: Colors.white, borderRadius: 20, padding: 18, marginTop: 16 },
  cardTitle:  { fontSize: 15, fontWeight: '900', color: Colors.ink, marginBottom: 10 },
  descripcion: { fontSize: 13, color: Colors.inkMuted, lineHeight: 20 },
  dispoBox:   { backgroundColor: Colors.cream, borderRadius: 14, padding: 12, marginTop: 10 },
  dispoText:  { fontSize: 13, color: Colors.ink, fontWeight: '600' },
  sectionTitle: { fontSize: 15, fontWeight: '900', color: Colors.ink },
  calificarBtn: { backgroundColor: '#1d4ed8', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8 },
  calificarBtnText: { color: Colors.white, fontWeight: '800', fontSize: 12 },
  guardadoText: { fontSize: 13, fontWeight: '700', color: '#1d4ed8', marginBottom: 10 },
  emptyBox:   { borderWidth: 1, borderStyle: 'dashed', borderColor: '#93c5fd', backgroundColor: '#eff6ff', borderRadius: 16, padding: 24, alignItems: 'center' },
  emptyText:  { fontSize: 13, color: '#1d4ed8' },
  ratingCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 14 },
  ratingDate: { fontSize: 11, color: Colors.inkMuted },
  badge:      { backgroundColor: '#dbeafe', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText:  { fontSize: 11, fontWeight: '700', color: '#1d4ed8' },
  badgeGold:  { backgroundColor: '#fef3c7', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  badgeGoldText: { fontSize: 11, fontWeight: '700', color: '#92400e' },
  comentario: { fontSize: 13, color: Colors.inkMuted, marginTop: 8, lineHeight: 19 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 16 },
  modalSheet: { backgroundColor: Colors.white, borderRadius: 24, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '900', color: Colors.ink, marginBottom: 16 },
  modalLabel: { fontSize: 13, fontWeight: '700', color: Colors.ink, marginBottom: 6 },
  modalInput: { backgroundColor: Colors.cream, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, fontSize: 13, color: Colors.ink, borderWidth: 1, borderColor: Colors.border },
  optBtn:     { borderWidth: 2, borderColor: Colors.border, borderRadius: 14, paddingVertical: 9, paddingHorizontal: 12, alignItems: 'center' },
  optBtnActive: { borderColor: '#3b82f6', backgroundColor: '#eff6ff' },
  optBtnText: { fontSize: 12, fontWeight: '700', color: Colors.inkMuted },
  optBtnTextActive: { color: '#1d4ed8' },
  error:      { fontSize: 12, fontWeight: '700', color: Colors.bad, marginTop: 6 },
  cancelBtn:  { flex: 1, borderWidth: 2, borderColor: Colors.border, borderRadius: 16, paddingVertical: 12, alignItems: 'center' },
  cancelBtnText: { fontSize: 13, fontWeight: '700', color: Colors.inkMuted },
  saveBtn:    { flex: 1, backgroundColor: '#1d4ed8', borderRadius: 16, paddingVertical: 12, alignItems: 'center' },
  saveBtnText: { color: Colors.white, fontWeight: '800', fontSize: 13 },
});
