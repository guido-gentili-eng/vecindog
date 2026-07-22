import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Image, Modal, Linking,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import { subirImagenAd, subirLogoAd } from '@/lib/ads';
import { WHATSAPP_PUBLICIDAD, CONTACT_EMAIL } from '@/lib/contact';
import { Colors } from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PublicitateScreen() {
  const { t } = useLanguage();
  const PAQUETES = [
    { nombre: t.pubPlanBasico, precio: '$15.000', slots: [t.pubSlotCard], destacado: false, slug: 'basico' },
    { nombre: t.pubPlanEstandar, precio: '$28.000', slots: [t.pubSlotCard, t.pubSlotPanel], destacado: true, slug: 'estandar' },
    { nombre: t.pubPlanPremium, precio: '$45.000', slots: [t.pubSlotBanner, t.pubSlotCard, t.pubSlotPanel], destacado: false, slug: 'premium' },
  ];

  const FAQ = [
    [t.pubFaq1Q, t.pubFaq1A],
    [t.pubFaq2Q, t.pubFaq2A],
    [t.pubFaq3Q, t.pubFaq3A],
    [t.pubFaq4Q, t.pubFaq4A],
  ];

  const POR_QUE = [
    [t.pubPorQue1Titulo, t.pubPorQue1Desc],
    [t.pubPorQue2Titulo, t.pubPorQue2Desc],
    [t.pubPorQue3Titulo, t.pubPorQue3Desc],
    [t.pubPorQue4Titulo, t.pubPorQue4Desc],
  ];

  const [totalUsuarios, setTotalUsuarios] = useState<number | null>(null);
  const [planSel, setPlanSel] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('profiles_public').select('*', { count: 'exact', head: true })
      .then(({ count }) => setTotalUsuarios(count ?? null));
  }, []);

  const statUsuarios = totalUsuarios === null ? '…' : `${totalUsuarios.toLocaleString('es-AR')}+`;
  const STATS = [
    [statUsuarios, t.pubStatVecinosLabel],
    [t.pubStatTodoValue, t.pubStatArgentinaLabel],
    [t.pubStat100Value, t.pubStatOrganicoLabel],
    [t.pubStatDirectoValue, t.pubStatDuenosLabel],
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingTop: 56, paddingBottom: 50 }}>
      <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>{t.cuidadoVolver}</Text></TouchableOpacity>

      <View style={{ alignItems: 'center', marginTop: 12, marginBottom: 20 }}>
        <View style={styles.chip}><Text style={styles.chipText}>{t.pubParaNegocios}</Text></View>
        <Text style={styles.title}>{t.pubTitle}</Text>
        <Text style={styles.sub}>{t.pubSub}</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
          <TouchableOpacity style={styles.waBtn} onPress={() => Linking.openURL(WHATSAPP_PUBLICIDAD)}>
            <Text style={styles.waBtnText}>{t.pubWhatsapp}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mailBtn} onPress={() => Linking.openURL(`mailto:${CONTACT_EMAIL}?subject=Quiero%20publicitar%20en%20Vecindog`)}>
            <Text style={styles.mailBtnText}>{t.pubEmail}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsGrid}>
        {STATS.map(([value, label]) => (
          <View key={label} style={styles.statCard}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>{t.pubFormatosTitle}</Text>
      <View style={{ gap: 10, marginBottom: 20 }}>
        <View style={styles.formatoCard}>
          <Text style={styles.formatoLabel}>{t.pubFormato1Label} <Text style={styles.formatoBadge}>{t.pubFormato1Badge}</Text></Text>
          <Text style={styles.formatoDesc}>{t.pubFormato1Desc}</Text>
        </View>
        <View style={styles.formatoCard}>
          <Text style={styles.formatoLabel}>{t.pubFormato2Label} <Text style={[styles.formatoBadge, { backgroundColor: Colors.good }]}>{t.pubFormato2Badge}</Text></Text>
          <Text style={styles.formatoDesc}>{t.pubFormato2Desc}</Text>
        </View>
        <View style={styles.formatoCard}>
          <Text style={styles.formatoLabel}>{t.pubFormato3Label} <Text style={[styles.formatoBadge, { backgroundColor: '#5b8e3a' }]}>{t.pubFormato3Badge}</Text></Text>
          <Text style={styles.formatoDesc}>{t.pubFormato3Desc}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>{t.pubComoFuncionaTitle}</Text>
      <View style={{ gap: 10, marginBottom: 20 }}>
        {[['1️⃣', t.pubPaso1Titulo, t.pubPaso1Desc],
          ['2️⃣', t.pubPaso2Titulo, t.pubPaso2Desc],
          ['3️⃣', t.pubPaso3Titulo, t.pubPaso3Desc]].map(([n, titulo, d]) => (
          <View key={titulo} style={styles.pasoCard}>
            <Text style={{ fontSize: 22 }}>{n}</Text>
            <Text style={styles.pasoTitulo}>{titulo}</Text>
            <Text style={styles.pasoDesc}>{d}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>{t.pubPlanesTitle}</Text>
      <Text style={styles.sectionSub}>{t.pubPlanesSub}</Text>
      <View style={{ gap: 12, marginTop: 12, marginBottom: 20 }}>
        {PAQUETES.map((p) => (
          <View key={p.nombre} style={[styles.planCard, p.destacado && styles.planCardDestacado]}>
            {p.destacado && <View style={styles.planBadge}><Text style={styles.planBadgeText}>{t.pubMasElegido}</Text></View>}
            <Text style={styles.planNombre}>{p.nombre}</Text>
            <Text style={styles.planPrecio}>{p.precio}<Text style={styles.planPrecioMoneda}> {t.pubArsMes}</Text></Text>
            <View style={{ gap: 5, marginTop: 10 }}>
              {p.slots.map((s) => (
                <View key={s} style={{ flexDirection: 'row', gap: 6 }}>
                  <Text style={{ color: Colors.good }}>✓</Text>
                  <Text style={styles.planSlot}>{s}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.planBtn, p.destacado ? styles.planBtnDestacado : styles.planBtnOutline]}
              onPress={() => setPlanSel(p.slug)}
            >
              <Text style={p.destacado ? styles.planBtnDestacadoText : styles.planBtnOutlineText}>{t.pubElegirPrefix} {p.nombre} →</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <Text style={styles.precioEspecial}>{t.pubNecesitasAlgo}</Text>

      <View style={styles.porQueCard}>
        <Text style={{ fontSize: 20, color: Colors.white, fontWeight: '900' }}>{t.pubPorQueTitle}</Text>
        <Text style={styles.porQueSub}>{t.pubPorQueSub}</Text>
        <View style={{ gap: 10, marginTop: 14 }}>
          {POR_QUE.map(([titulo, d]) => (
            <View key={titulo} style={{ flexDirection: 'row', gap: 8 }}>
              <Text style={{ color: '#fca5a5' }}>✓</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.porQueItemTitulo}>{titulo}</Text>
                <Text style={styles.porQueItemDesc}>{d}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.sectionTitle}>{t.pubFaqTitle}</Text>
      <View style={{ gap: 10, marginTop: 10, marginBottom: 20 }}>
        {FAQ.map(([q, a]) => (
          <View key={q} style={styles.faqCard}>
            <Text style={styles.faqQ}>{q}</Text>
            <Text style={styles.faqA}>{a}</Text>
          </View>
        ))}
      </View>

      <View style={styles.finalCta}>
        <Text style={{ fontSize: 32 }}>📣</Text>
        <Text style={styles.finalCtaTitle}>{t.pubFinalTitle}</Text>
        <Text style={styles.finalCtaSub}>{t.pubFinalSub}</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
          <TouchableOpacity style={styles.waBtn} onPress={() => Linking.openURL(WHATSAPP_PUBLICIDAD)}>
            <Text style={styles.waBtnText}>{t.pubWhatsapp}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mailBtn} onPress={() => Linking.openURL(`mailto:${CONTACT_EMAIL}`)}>
            <Text style={styles.mailBtnText}>✉️ {CONTACT_EMAIL}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {planSel && <PagoModal plan={planSel} onClose={() => setPlanSel(null)} />}
    </ScrollView>
  );
}

function PagoModal({ plan, onClose }: { plan: string; onClose: () => void }) {
  const { t } = useLanguage();
  const PLAN_INFO: Record<string, { label: string; precio: string; necesitaLogo: boolean }> = {
    basico: { label: t.pubPlanBasicoLabel, precio: '$15.000/mes', necesitaLogo: false },
    estandar: { label: t.pubPlanEstandarLabel, precio: '$28.000/mes', necesitaLogo: true },
    premium: { label: t.pubPlanPremiumLabel, precio: '$45.000/mes', necesitaLogo: true },
  };
  const info = PLAN_INFO[plan] ?? PLAN_INFO.basico;
  const [negocio, setNegocio] = useState('');
  const [tagline, setTagline] = useState('');
  const [link, setLink] = useState('');
  const [cta, setCta] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [enviado, setEnviado] = useState(false);

  async function elegirImagen(setUri: (u: string) => void) {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 0.7 });
    if (!result.canceled) setUri(result.assets[0].uri);
  }

  async function handleSubmit() {
    if (!negocio.trim()) { setError(t.pubErrNombreNegocio); return; }
    if (!email.trim()) { setError(t.rvErrEmail); return; }
    if (!link.trim()) { setError(t.pubErrLink); return; }
    if (info.necesitaLogo && !logoUri) { setError(t.pubErrLogo); return; }
    try {
      const urlCheck = link.includes('://') ? link : `https://${link}`;
      const parsed = new URL(urlCheck);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error();
    } catch {
      setError(t.pubErrLinkInvalido);
      return;
    }
    setLoading(true); setError('');
    try {
      let imagen_url = ''; let imagen_logo_url = '';
      if (fotoUri) imagen_url = await subirImagenAd(fotoUri);
      if (logoUri && info.necesitaLogo) imagen_logo_url = await subirLogoAd(logoUri);

      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('https://www.mivecindog.com.ar/api/trial/publicidad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) },
        body: JSON.stringify({ plan, negocio, tagline, link, cta, email, telefono, imagen_url, imagen_logo_url }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setEnviado(true);
      } else {
        setError(data.error ?? t.pubErrProcesar);
      }
    } catch {
      setError(t.rvErrConexion);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <ScrollView style={styles.modalSheet} contentContainerStyle={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.modalTitle}>{info.label}</Text>
              <Text style={styles.modalSub}>{t.pubPrimerMesGratisPrefix} {info.precio}</Text>
            </View>
            <TouchableOpacity onPress={onClose}><Text style={{ fontSize: 20, color: Colors.inkMuted }}>✕</Text></TouchableOpacity>
          </View>

          {enviado ? (
            <View style={{ alignItems: 'center', gap: 8, paddingVertical: 20 }}>
              <Text style={{ fontSize: 48 }}>✅</Text>
              <Text style={styles.modalTitle}>{t.pubCampanaActivadaTitle}</Text>
              <Text style={styles.modalSub}>{t.pubCampanaActivadaSub}</Text>
              <TouchableOpacity style={styles.submitBtn} onPress={onClose}><Text style={styles.submitBtnText}>{t.rvCerrarBtn}</Text></TouchableOpacity>
            </View>
          ) : (
            <>
              <TouchableOpacity style={styles.fotoBtn} onPress={() => elegirImagen(setFotoUri)}>
                {fotoUri ? <Image source={{ uri: fotoUri }} style={styles.fotoPreview} /> : (
                  <View style={[styles.fotoPreview, { alignItems: 'center', justifyContent: 'center' }]}><Text style={{ fontSize: 22 }}>🖼️</Text></View>
                )}
                <Text style={styles.fotoBtnText}>{fotoUri ? t.pubCambiarImagen : t.pubSubirLogoFoto}</Text>
              </TouchableOpacity>

              {info.necesitaLogo && (
                <TouchableOpacity style={styles.fotoBtn} onPress={() => elegirImagen(setLogoUri)}>
                  {logoUri ? <Image source={{ uri: logoUri }} style={styles.fotoPreview} /> : (
                    <View style={[styles.fotoPreview, { alignItems: 'center', justifyContent: 'center' }]}><Text style={{ fontSize: 22 }}>🔷</Text></View>
                  )}
                  <Text style={styles.fotoBtnText}>{logoUri ? t.pubCambiarLogo : t.pubSubirLogoCuadrado}</Text>
                </TouchableOpacity>
              )}

              <Text style={styles.label}>{t.rvNombreNegocioLabel}</Text>
              <TextInput style={styles.input} value={negocio} onChangeText={setNegocio} placeholder={t.rvNombreNegocioPh} placeholderTextColor={Colors.inkMuted} />

              <Text style={styles.label}>{t.pubTaglineLabel}</Text>
              <TextInput style={styles.input} value={tagline} onChangeText={setTagline} placeholder={t.pubTaglinePh} placeholderTextColor={Colors.inkMuted} />

              <Text style={styles.label}>{t.pubLinkLabel}</Text>
              <TextInput style={styles.input} value={link} onChangeText={setLink} placeholder="https://instagram.com/tunegocio" placeholderTextColor={Colors.inkMuted} autoCapitalize="none" />

              <Text style={styles.label}>{t.pubCtaLabel}</Text>
              <TextInput style={styles.input} value={cta} onChangeText={setCta} placeholder={t.pubCtaPh} placeholderTextColor={Colors.inkMuted} />

              <Text style={styles.label}>{t.rvEmailLabel}</Text>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="info@tunegocio.com" placeholderTextColor={Colors.inkMuted} />

              <Text style={styles.label}>{t.pubTelefonoLabel}</Text>
              <TextInput style={styles.input} value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" placeholder="+54 9 291 578-2910" placeholderTextColor={Colors.inkMuted} />

              {!!error && <Text style={styles.error}>{error}</Text>}
              <Text style={styles.trialNote}>{t.pubTrialNote}</Text>

              <TouchableOpacity style={[styles.submitBtn, loading && { opacity: 0.6 }]} onPress={handleSubmit} disabled={loading}>
                {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.submitBtnText}>{t.pubActivarBtn}</Text>}
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  back: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  chip: { backgroundColor: Colors.primary + '1a', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  chipText: { fontSize: 11, fontWeight: '800', color: Colors.primary },
  title: { fontSize: 24, fontWeight: '900', color: Colors.ink, marginTop: 10, textAlign: 'center' },
  sub: { fontSize: 13, color: Colors.inkMuted, marginTop: 8, textAlign: 'center', lineHeight: 19 },
  waBtn: { backgroundColor: Colors.primary, borderRadius: 16, paddingHorizontal: 18, paddingVertical: 12 },
  waBtnText: { color: Colors.white, fontWeight: '800', fontSize: 13 },
  mailBtn: { borderWidth: 2, borderColor: Colors.primary + '4d', borderRadius: 16, paddingHorizontal: 18, paddingVertical: 12 },
  mailBtnText: { color: Colors.primary, fontWeight: '800', fontSize: 13 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  statCard: { flexBasis: '47%', flexGrow: 1, backgroundColor: Colors.white, borderRadius: 16, padding: 14, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '900', color: Colors.ink },
  statLabel: { fontSize: 11, color: Colors.inkMuted, marginTop: 2, textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: Colors.ink, marginBottom: 4 },
  sectionSub: { fontSize: 12, color: Colors.inkMuted, marginBottom: 4 },
  formatoCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 14 },
  formatoLabel: { fontSize: 13, fontWeight: '800', color: Colors.ink },
  formatoBadge: { backgroundColor: Colors.primary, color: Colors.white, fontSize: 9, fontWeight: '800', borderRadius: 8, paddingHorizontal: 6, overflow: 'hidden' },
  formatoDesc: { fontSize: 12, color: Colors.inkMuted, marginTop: 4 },
  pasoCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, alignItems: 'center' },
  pasoTitulo: { fontSize: 14, fontWeight: '800', color: Colors.ink, marginTop: 6 },
  pasoDesc: { fontSize: 12, color: Colors.inkMuted, marginTop: 4, textAlign: 'center' },
  planCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 18 },
  planCardDestacado: { borderWidth: 2, borderColor: Colors.primary },
  planBadge: { alignSelf: 'center', backgroundColor: Colors.primary, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 8 },
  planBadgeText: { color: Colors.white, fontSize: 11, fontWeight: '800' },
  planNombre: { fontSize: 18, fontWeight: '900', color: Colors.ink },
  planPrecio: { fontSize: 26, fontWeight: '900', color: Colors.ink, marginTop: 6 },
  planPrecioMoneda: { fontSize: 12, fontWeight: '600', color: Colors.inkMuted },
  planSlot: { fontSize: 12, color: Colors.ink, flex: 1 },
  planBtn: { borderRadius: 16, paddingVertical: 12, alignItems: 'center', marginTop: 14 },
  planBtnDestacado: { backgroundColor: Colors.primary },
  planBtnDestacadoText: { color: Colors.white, fontWeight: '800', fontSize: 13 },
  planBtnOutline: { borderWidth: 2, borderColor: Colors.primary + '4d' },
  planBtnOutlineText: { color: Colors.primary, fontWeight: '800', fontSize: 13 },
  precioEspecial: { fontSize: 11, color: Colors.inkMuted, textAlign: 'center', marginTop: 4, marginBottom: 20 },
  porQueCard: { backgroundColor: '#1c1c1e', borderRadius: 24, padding: 22, marginBottom: 20 },
  porQueSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 8 },
  porQueItemTitulo: { fontSize: 13, fontWeight: '800', color: Colors.white },
  porQueItemDesc: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  faqCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 16 },
  faqQ: { fontSize: 13, fontWeight: '800', color: Colors.ink },
  faqA: { fontSize: 12, color: Colors.inkMuted, marginTop: 4, lineHeight: 17 },
  finalCta: { alignItems: 'center', backgroundColor: Colors.white, borderRadius: 24, padding: 24 },
  finalCtaTitle: { fontSize: 18, fontWeight: '900', color: Colors.ink, marginTop: 8, textAlign: 'center' },
  finalCtaSub: { fontSize: 12, color: Colors.inkMuted, marginTop: 4, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' },
  modalSheet: { backgroundColor: Colors.white, borderRadius: 24, marginHorizontal: 16, maxHeight: '85%' },
  modalTitle: { fontSize: 18, fontWeight: '900', color: Colors.ink },
  modalSub: { fontSize: 12, color: Colors.inkMuted, marginTop: 2 },
  fotoBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 2, borderStyle: 'dashed', borderColor: Colors.primary + '4d', backgroundColor: Colors.primary + '0d', borderRadius: 16, padding: 12, marginBottom: 12 },
  fotoPreview: { width: 50, height: 50, borderRadius: 12, backgroundColor: Colors.cream },
  fotoBtnText: { fontSize: 13, fontWeight: '700', color: Colors.ink },
  label: { fontSize: 11, fontWeight: '700', color: Colors.inkMuted, marginTop: 12, marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.4 },
  input: { backgroundColor: Colors.cream, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: Colors.ink, borderWidth: 1, borderColor: Colors.border },
  error: { fontSize: 12, fontWeight: '700', color: Colors.bad, marginTop: 12 },
  trialNote: { fontSize: 11, color: Colors.inkMuted, textAlign: 'center', marginTop: 12 },
  submitBtn: { backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 15, alignItems: 'center', marginTop: 14 },
  submitBtnText: { color: Colors.white, fontWeight: '800', fontSize: 14 },
});
