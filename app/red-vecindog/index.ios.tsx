import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Image, Modal,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useIAP } from 'expo-iap';
import { supabase } from '@/lib/supabase';
import { subirImagenAd } from '@/lib/ads';
import { useAuth } from '@/contexts/AuthContext';
import { buscarCiudades, type Ciudad } from '@/lib/ciudades';
import { capturarUbicacionGPS, buscarDirecciones, type DireccionSugerencia } from '@/lib/ubicacion';
import { CATEGORIAS_RED_VECINDOG as CATEGORIAS } from '@/lib/redVecindogCategorias';
import { RED_VECINDOG_IOS_SKU } from '@/lib/iapRedVecindog';
import { Colors } from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Variante iOS de Red Vecindog: el alta de comercio se compra por Apple
 * In-App Purchase (Guideline 3.1.1), no via MercadoPago/web. El directorio
 * de comercios (navegacion de lectura) sigue redirigiendo a la web por
 * ahora -- ver app/red-vecindog/[categoria].ios.tsx.
 */
export default function RedVecindogScreenIOS() {
  const { t } = useLanguage();
  const BENEFICIOS = [
    ['📍', t.rvBenef1Titulo, t.rvBenef1Desc],
    ['📞', t.rvBenef2Titulo, t.rvBenef2Desc],
    ['🕐', t.rvBenef3Titulo, t.rvBenef3Desc],
    ['📌', t.rvBenef4Titulo, t.rvBenef4Desc],
  ];
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingTop: 56, paddingBottom: 50 }}>
      <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>{t.cuidadoVolver}</Text></TouchableOpacity>

      <View style={{ alignItems: 'center', marginTop: 12, marginBottom: 24 }}>
        <Text style={styles.title}>{t.rvTitle}</Text>
        <Text style={styles.sub}>{t.rvSub}</Text>
        <TouchableOpacity style={styles.ctaBtn} onPress={() => setModalAbierto(true)}>
          <Text style={styles.ctaBtnText}>{t.rvCtaBtn}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.beneficiosGrid}>
        {BENEFICIOS.map(([emoji, titulo, desc]) => (
          <View key={titulo} style={styles.beneficioCard}>
            <Text style={{ fontSize: 22 }}>{emoji}</Text>
            <Text style={styles.beneficioTitulo}>{titulo}</Text>
            <Text style={styles.beneficioDesc}>{desc}</Text>
          </View>
        ))}
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

      <View style={styles.finalCta}>
        <Text style={{ fontSize: 32 }}>🏢</Text>
        <Text style={styles.finalCtaTitle}>{t.rvFinalTitulo}</Text>
        <Text style={styles.finalCtaSub}>{t.rvFinalSub}</Text>
        <TouchableOpacity style={styles.ctaBtn} onPress={() => setModalAbierto(true)}>
          <Text style={styles.ctaBtnText}>{t.rvCtaBtn}</Text>
        </TouchableOpacity>
      </View>

      {modalAbierto && <RegistroModalIOS onClose={() => setModalAbierto(false)} />}
    </ScrollView>
  );
}

function RegistroModalIOS({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [showCatPicker, setShowCatPicker] = useState(false);
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [localidadQuery, setLocalidadQuery] = useState('');
  const [ciudadSug, setCiudadSug] = useState<Ciudad[]>([]);
  const [localidadLat, setLocalidadLat] = useState<number | null>(null);
  const [localidadLng, setLocalidadLng] = useState<number | null>(null);
  const [horarioApertura, setHorarioApertura] = useState('');
  const [horarioCierre, setHorarioCierre] = useState('');
  const [diasAtencion, setDiasAtencion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [link, setLink] = useState('');
  const [email, setEmail] = useState('');
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [enviado, setEnviado] = useState(false);

  const { subscriptions, fetchProducts, requestPurchase, finishTransaction } = useIAP({
    onPurchaseSuccess: async (purchase) => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { setError(t.rvErrSesionExpirada); setLoading(false); return; }

        let imagen_url = '';
        if (fotoUri) imagen_url = await subirImagenAd(fotoUri);

        const res = await fetch('https://www.mivecindog.com.ar/api/iap/red-vecindog/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
          body: JSON.stringify({
            purchaseToken: purchase.purchaseToken,
            nombre, categoria, telefono, direccion, localidad,
            lat: localidadLat, lng: localidadLng,
            horario_apertura: horarioApertura, horario_cierre: horarioCierre, dias_atencion: diasAtencion,
            descripcion, link, email, imagen_url,
          }),
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          await finishTransaction({ purchase });
          setEnviado(true);
        } else {
          setError(data.error ?? t.rvErrProcesar);
        }
      } catch {
        setError(t.rvErrConexion);
      } finally {
        setLoading(false);
      }
    },
    onPurchaseError: (err) => {
      setLoading(false);
      if (err.code !== 'user-cancelled') setError(err.message || t.rvErrProcesar);
    },
  });

  React.useEffect(() => {
    fetchProducts({ skus: [RED_VECINDOG_IOS_SKU], type: 'subs' });
  }, []);

  const precioMostrado = subscriptions[0]?.displayPrice ?? '…';

  const [locStatus, setLocStatus] = useState<'idle' | 'loading' | 'ok' | 'denied'>('idle');
  const [direccionSug, setDireccionSug] = useState<DireccionSugerencia[]>([]);
  const [direccionLoading, setDireccionLoading] = useState(false);
  const [mostrarDireccionSug, setMostrarDireccionSug] = useState(false);
  const direccionDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleLocalidadChange(v: string) {
    setLocalidadQuery(v);
    setCiudadSug(v.trim().length > 0 ? buscarCiudades(v).slice(0, 6) : []);
  }
  function seleccionarCiudad(c: Ciudad) {
    setLocalidad(c.nombre); setLocalidadQuery(''); setLocalidadLat(c.lat); setLocalidadLng(c.lng); setCiudadSug([]);
  }

  async function handleCapturarUbicacion() {
    setLocStatus('loading');
    try {
      const res = await capturarUbicacionGPS();
      if (!res) { setLocStatus('denied'); return; }
      setLocalidadLat(res.lat); setLocalidadLng(res.lng);
      if (res.direccion) setDireccion(res.direccion);
      setLocStatus('ok');
    } catch {
      setLocStatus('denied');
    }
  }

  function handleDireccionChange(v: string) {
    setDireccion(v);
    setMostrarDireccionSug(true);
    if (direccionDebounceRef.current) clearTimeout(direccionDebounceRef.current);
    if (v.trim().length < 3) { setDireccionSug([]); return; }
    direccionDebounceRef.current = setTimeout(async () => {
      setDireccionLoading(true);
      try {
        setDireccionSug(await buscarDirecciones(v, localidad || undefined));
      } catch {
        setDireccionSug([]);
      } finally {
        setDireccionLoading(false);
      }
    }, 400);
  }

  function seleccionarDireccionSug(s: DireccionSugerencia) {
    setDireccion(s.label);
    setDireccionSug([]);
    setMostrarDireccionSug(false);
    if (!isNaN(s.lat) && !isNaN(s.lng)) { setLocalidadLat(s.lat); setLocalidadLng(s.lng); }
  }

  async function elegirFoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 0.7 });
    if (!result.canceled) setFotoUri(result.assets[0].uri);
  }

  async function handleActivar() {
    if (!nombre.trim()) { setError(t.rvErrNombreNegocio); return; }
    if (!categoria) { setError(t.rvErrCategoria); return; }
    if (!localidad.trim()) { setError(t.rvErrCiudad); return; }
    if (!telefono.trim()) { setError(t.rvErrTelefono); return; }
    if (!direccion.trim()) { setError(t.rvErrDireccion); return; }
    if (!email.trim()) { setError(t.rvErrEmail); return; }
    if (telefono.replace(/\D/g, '').length < 10) { setError(t.rvErrTelefonoDigits); return; }
    if (!user) { setError(t.rvErrLogin); return; }

    setLoading(true); setError('');
    // La compra se confirma en el callback onPurchaseSuccess de arriba --
    // ahi es donde se sube la foto y se manda todo al backend.
    requestPurchase({ type: 'subs', request: { apple: { sku: RED_VECINDOG_IOS_SKU } } })
      .catch(() => setLoading(false));
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <ScrollView style={styles.modalSheet} contentContainerStyle={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.modalTitle}>{t.rvModalTitulo}</Text>
              <Text style={styles.modalSub}>{precioMostrado}/mes</Text>
            </View>
            <TouchableOpacity onPress={onClose}><Text style={{ fontSize: 20, color: Colors.inkMuted }}>✕</Text></TouchableOpacity>
          </View>

          {enviado ? (
            <View style={{ alignItems: 'center', gap: 8, paddingVertical: 20 }}>
              <Text style={{ fontSize: 48 }}>✅</Text>
              <Text style={styles.modalTitle}>{t.rvRegistradoTitulo}</Text>
              <Text style={styles.modalSub}>{t.rvRegistradoSub}</Text>
              <TouchableOpacity style={styles.submitBtn} onPress={onClose}><Text style={styles.submitBtnText}>{t.rvCerrarBtn}</Text></TouchableOpacity>
            </View>
          ) : (
            <>
              <TouchableOpacity style={styles.fotoBtn} onPress={elegirFoto}>
                {fotoUri ? <Image source={{ uri: fotoUri }} style={styles.fotoPreview} /> : (
                  <View style={[styles.fotoPreview, { alignItems: 'center', justifyContent: 'center' }]}><Text style={{ fontSize: 22 }}>🖼️</Text></View>
                )}
                <Text style={styles.fotoBtnText}>{fotoUri ? t.rvCambiarFoto : t.rvSubirFoto}</Text>
              </TouchableOpacity>

              <Text style={styles.label}>{t.rvNombreNegocioLabel}</Text>
              <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder={t.rvNombreNegocioPh} placeholderTextColor={Colors.inkMuted} />

              <Text style={styles.label}>{t.rvCategoriaLabel}</Text>
              <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowCatPicker(true)}>
                <Text style={{ color: categoria ? Colors.ink : Colors.inkMuted }}>{categoria || t.rvSeleccionaCategoria}</Text>
              </TouchableOpacity>

              <Text style={styles.label}>{t.rvDescBreveLabel}</Text>
              <TextInput style={styles.input} value={descripcion} onChangeText={setDescripcion} placeholder={t.rvDescBrevePh} placeholderTextColor={Colors.inkMuted} />

              <Text style={styles.label}>{t.rvDireccionLabel}</Text>
              {locStatus === 'ok' ? (
                <View style={[styles.locBtn, styles.locBtnOk, styles.locOkRow]}>
                  <Text style={[styles.locBtnText, styles.locBtnTextOk]}>{t.pbUbicacionConfirmada}</Text>
                  <TouchableOpacity onPress={() => setLocStatus('idle')}><Text style={styles.locCambiarText}>{t.pbUbicacionCambiar}</Text></TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.locBtn} onPress={handleCapturarUbicacion} disabled={locStatus === 'loading'}>
                  {locStatus === 'loading'
                    ? <ActivityIndicator color={Colors.primary} size="small" />
                    : <Text style={styles.locBtnText}>{locStatus === 'denied' ? t.rvPermisoDenegadoMapa : t.pbUsarUbicacionActual}</Text>}
                </TouchableOpacity>
              )}
              <View>
                <TextInput
                  style={styles.input}
                  value={direccion}
                  onChangeText={handleDireccionChange}
                  onFocus={() => direccionSug.length > 0 && setMostrarDireccionSug(true)}
                  placeholder={t.rvDireccionPh}
                  placeholderTextColor={Colors.inkMuted}
                />
                {direccionLoading && <ActivityIndicator style={styles.zonaLoadingIcon} color={Colors.inkMuted} size="small" />}
                {mostrarDireccionSug && direccionSug.length > 0 && (
                  <View style={styles.sugerenciaList}>
                    {direccionSug.map((s, i) => (
                      <TouchableOpacity key={`${s.label}-${i}`} style={styles.sugerenciaItem} onPress={() => seleccionarDireccionSug(s)}>
                        <Text style={styles.sugerenciaText}>📍 {s.label}</Text>
                        {!!s.sub && <Text style={styles.sugerenciaSub}>{s.sub}</Text>}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <Text style={styles.label}>{t.rvCiudadLabel}</Text>
              {localidad ? (
                <View style={styles.selectedRow}>
                  <Text style={styles.selectedText}>📍 {localidad}</Text>
                  <TouchableOpacity onPress={() => setLocalidad('')}><Text style={styles.changeText}>{t.rvCambiarBtn}</Text></TouchableOpacity>
                </View>
              ) : (
                <View>
                  <TextInput style={styles.input} value={localidadQuery} onChangeText={handleLocalidadChange} placeholder={t.rvCiudadPh} placeholderTextColor={Colors.inkMuted} />
                  {ciudadSug.length > 0 && (
                    <View style={styles.sugerenciaList}>
                      {ciudadSug.map((c) => (
                        <TouchableOpacity key={c.nombre} style={styles.sugerenciaItem} onPress={() => seleccionarCiudad(c)}>
                          <Text style={styles.sugerenciaText}>📍 {c.nombre}</Text>
                          <Text style={styles.sugerenciaSub}>{c.provincia}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              )}

              <Text style={styles.label}>{t.rvDiasAtencionLabel}</Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {[t.rvDia1, t.rvDia2, t.rvDia3].map((op) => (
                  <TouchableOpacity key={op} style={[styles.dayBtn, diasAtencion === op && styles.dayBtnActive]} onPress={() => setDiasAtencion(diasAtencion === op ? '' : op)}>
                    <Text style={[styles.dayBtnText, diasAtencion === op && styles.dayBtnTextActive]}>{op}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>{t.rvAperturaLabel}</Text>
                  <TextInput style={styles.input} value={horarioApertura} onChangeText={setHorarioApertura} placeholder="09:00" placeholderTextColor={Colors.inkMuted} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>{t.rvCierreLabel}</Text>
                  <TextInput style={styles.input} value={horarioCierre} onChangeText={setHorarioCierre} placeholder="18:00" placeholderTextColor={Colors.inkMuted} />
                </View>
              </View>

              <Text style={styles.label}>{t.rvTelefonoLabel}</Text>
              <TextInput style={styles.input} value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" placeholder="+54 9 291 578-2910" placeholderTextColor={Colors.inkMuted} />

              <Text style={styles.label}>{t.rvLinkLabel}</Text>
              <TextInput style={styles.input} value={link} onChangeText={setLink} placeholder="https://instagram.com/tunegocio" placeholderTextColor={Colors.inkMuted} autoCapitalize="none" />

              <Text style={styles.label}>{t.rvEmailLabel}</Text>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="info@tunegocio.com" placeholderTextColor={Colors.inkMuted} />

              {!!error && <Text style={styles.error}>{error}</Text>}
              <Text style={styles.trialNote}>{t.rvIosPagoNote}</Text>

              <TouchableOpacity style={[styles.submitBtn, loading && { opacity: 0.6 }]} onPress={handleActivar} disabled={loading}>
                {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.submitBtnText}>{t.rvIosActivarBtn} · {precioMostrado}/mes</Text>}
              </TouchableOpacity>
            </>
          )}
        </ScrollView>

        {showCatPicker && (
          <Modal visible transparent animationType="fade" onRequestClose={() => setShowCatPicker(false)}>
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCatPicker(false)}>
              <View style={styles.catPickerSheet}>
                {CATEGORIAS.map((c) => (
                  <TouchableOpacity key={c.slug} style={styles.catPickerOption} onPress={() => { setCategoria(c.slug); setShowCatPicker(false); }}>
                    <Text style={{ fontSize: 18 }}>{c.emoji}</Text>
                    <Text style={styles.catPickerText}>{c.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  back: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  title: { fontSize: 28, fontWeight: '900', color: Colors.ink, marginTop: 10, textAlign: 'center' },
  sub: { fontSize: 13, color: Colors.inkMuted, marginTop: 8, textAlign: 'center', lineHeight: 19 },
  ctaBtn: { backgroundColor: '#f59e0b', borderRadius: 18, paddingHorizontal: 24, paddingVertical: 14, marginTop: 16 },
  ctaBtnText: { color: Colors.white, fontWeight: '800', fontSize: 15 },
  beneficiosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  beneficioCard: { flexBasis: '47%', flexGrow: 1, backgroundColor: Colors.white, borderRadius: 16, padding: 14, gap: 4 },
  beneficioTitulo: { fontSize: 13, fontWeight: '800', color: Colors.ink, marginTop: 4 },
  beneficioDesc: { fontSize: 11, color: Colors.inkMuted, lineHeight: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: Colors.ink, marginBottom: 10 },
  catCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderRadius: 16, padding: 14 },
  catLabel: { fontSize: 14, fontWeight: '800', color: Colors.ink },
  catDesc: { fontSize: 11, color: Colors.inkMuted, marginTop: 1 },
  finalCta: { alignItems: 'center', backgroundColor: Colors.white, borderRadius: 24, padding: 24 },
  finalCtaTitle: { fontSize: 18, fontWeight: '900', color: Colors.ink, marginTop: 8 },
  finalCtaSub: { fontSize: 12, color: Colors.inkMuted, marginTop: 4, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' },
  modalSheet: { backgroundColor: Colors.white, borderRadius: 24, marginHorizontal: 16, maxHeight: '85%' },
  modalTitle: { fontSize: 18, fontWeight: '900', color: Colors.ink },
  modalSub: { fontSize: 12, color: Colors.inkMuted, marginTop: 2 },
  fotoBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 2, borderStyle: 'dashed', borderColor: '#fbbf24', backgroundColor: '#fffbeb', borderRadius: 16, padding: 12, marginBottom: 14 },
  fotoPreview: { width: 50, height: 50, borderRadius: 12, backgroundColor: Colors.cream },
  fotoBtnText: { fontSize: 13, fontWeight: '700', color: Colors.ink },
  label: { fontSize: 11, fontWeight: '700', color: Colors.inkMuted, marginTop: 12, marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.4 },
  input: { backgroundColor: Colors.cream, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: Colors.ink, borderWidth: 1, borderColor: Colors.border },
  pickerBtn: { backgroundColor: Colors.cream, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, borderWidth: 1, borderColor: Colors.border },
  selectedRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fef3c7', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 11 },
  selectedText: { fontSize: 13, fontWeight: '700', color: '#92400e' },
  changeText: { fontSize: 11, fontWeight: '700', color: Colors.inkMuted },
  sugerenciaList: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, marginTop: 4, overflow: 'hidden' },
  sugerenciaItem: { paddingHorizontal: 14, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: Colors.border },
  sugerenciaText: { fontSize: 13, fontWeight: '600', color: Colors.ink },
  sugerenciaSub: { fontSize: 11, color: Colors.inkMuted },
  locBtn: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: 14, paddingVertical: 13, paddingHorizontal: 14, backgroundColor: Colors.white, marginBottom: 8 },
  locBtnOk: { borderColor: Colors.good, backgroundColor: '#f0fdf4' },
  locBtnText: { fontSize: 13, fontWeight: '600', color: Colors.inkMuted },
  locBtnTextOk: { color: Colors.good },
  locOkRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  locCambiarText: { fontSize: 12, fontWeight: '600', color: Colors.inkMuted, textDecorationLine: 'underline' },
  zonaLoadingIcon: { position: 'absolute', right: 14, top: 15 },
  dayBtn: { flex: 1, borderWidth: 2, borderColor: Colors.border, borderRadius: 12, paddingVertical: 8, alignItems: 'center' },
  dayBtnActive: { borderColor: '#f59e0b', backgroundColor: '#fffbeb' },
  dayBtnText: { fontSize: 10, fontWeight: '700', color: Colors.inkMuted, textAlign: 'center' },
  dayBtnTextActive: { color: '#92400e' },
  error: { fontSize: 12, fontWeight: '700', color: Colors.bad, marginTop: 12 },
  trialNote: { fontSize: 11, color: Colors.inkMuted, textAlign: 'center', marginTop: 12 },
  submitBtn: { backgroundColor: '#f59e0b', borderRadius: 16, paddingVertical: 15, alignItems: 'center', marginTop: 14 },
  submitBtnText: { color: Colors.white, fontWeight: '800', fontSize: 14 },
  catPickerSheet: { backgroundColor: Colors.white, borderRadius: 20, marginHorizontal: 30, padding: 10, maxHeight: '70%' },
  catPickerOption: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  catPickerText: { fontSize: 14, fontWeight: '600', color: Colors.ink },
});
