import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Image, Modal, Linking,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import { subirImagenAd } from '@/lib/ads';
import { useAuth } from '@/contexts/AuthContext';
import { buscarCiudades, type Ciudad } from '@/lib/ciudades';
import { CATEGORIAS_RED_VECINDOG as CATEGORIAS } from '@/lib/redVecindogCategorias';
import { Colors } from '@/constants/colors';

const BENEFICIOS = [
  ['📍', 'En el mapa', 'Tu negocio aparece directamente donde los vecinos buscan perros perdidos.'],
  ['📞', 'Teléfono visible', 'Los usuarios ven tu número con un toque desde el mapa.'],
  ['🕐', 'Horario de atención', 'Informá tus días y horarios para que lleguen cuando abrís.'],
  ['📌', 'Dirección exacta', 'Tu dirección y localidad visibles para toda la comunidad.'],
];

const BENEFITS_LIST = [
  'Aparecés en el mapa donde los vecinos buscan perros',
  'Teléfono, dirección y horario siempre visibles',
  'Clasificado en tu rubro (vet, petshop, peluquería…)',
  'Audiencia 100% dueños de mascotas activos',
  'Sin bots — usuarios reales de tu zona',
  'Activación en menos de 24 horas',
];

export default function RedVecindogScreen() {
  const [precioInfo, setPrecioInfo] = useState({ esPromo: true, precioRegular: 12900 });
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    fetch('https://www.mivecindog.com.ar/api/pago/red-vecindog')
      .then((r) => r.json())
      .then((d) => setPrecioInfo(d))
      .catch(() => {});
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingTop: 56, paddingBottom: 50 }}>
      <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>← Volver</Text></TouchableOpacity>

      <View style={{ alignItems: 'center', marginTop: 12, marginBottom: 24 }}>
        <View style={styles.chip}>
          <Text style={styles.chipText}>
            {precioInfo.esPromo ? '⭐ Promo · 3 meses gratis' : `⭐ Red · $${precioInfo.precioRegular?.toLocaleString('es-AR')} ARS/mes`}
          </Text>
        </View>
        <Text style={styles.title}>Red Vecindog</Text>
        <Text style={styles.sub}>Sumá tu negocio y aparecé en el mapa donde los vecinos buscan a sus perros — con tu teléfono, horario y dirección siempre visibles.</Text>
        <TouchableOpacity style={styles.ctaBtn} onPress={() => setModalAbierto(true)}>
          <Text style={styles.ctaBtnText}>🏢 Registrar mi negocio</Text>
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

      <Text style={styles.sectionTitle}>Elegí tu rubro</Text>
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

      {precioInfo.esPromo && (
        <View style={styles.promoBanner}>
          <Text style={{ fontSize: 26 }}>🎉</Text>
          <Text style={styles.promoTitle}>Primeros 3 meses gratis</Text>
          <Text style={styles.promoDesc}>Registrá tu negocio ahora y no pagás nada hasta el 4to mes.</Text>
        </View>
      )}

      <View style={styles.pricingCard}>
        <Text style={styles.pricingTitle}>Una sola tarifa, sin sorpresas</Text>
        <Text style={styles.pricingPrice}>${precioInfo.precioRegular?.toLocaleString('es-AR')}<Text style={styles.pricingPer}> / mes desde el 4to mes</Text></Text>
        <View style={{ gap: 8, marginTop: 14 }}>
          {BENEFITS_LIST.map((b) => (
            <View key={b} style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
              <Text style={{ color: Colors.white }}>✓</Text>
              <Text style={styles.pricingBenefit}>{b}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.pricingBtn} onPress={() => setModalAbierto(true)}>
          <Text style={styles.pricingBtnText}>Unirme a la red →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.finalCta}>
        <Text style={{ fontSize: 32 }}>🏢</Text>
        <Text style={styles.finalCtaTitle}>¿Listo para sumarte?</Text>
        <Text style={styles.finalCtaSub}>Completá el formulario y tu negocio aparece en el mapa en menos de 24 horas.</Text>
        <TouchableOpacity style={styles.ctaBtn} onPress={() => setModalAbierto(true)}>
          <Text style={styles.ctaBtnText}>🏢 Registrar mi negocio</Text>
        </TouchableOpacity>
      </View>

      {modalAbierto && <RegistroModal onClose={() => setModalAbierto(false)} precioInfo={precioInfo} />}
    </ScrollView>
  );
}

function RegistroModal({ onClose, precioInfo }: { onClose: () => void; precioInfo: { esPromo: boolean; precioRegular: number } }) {
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

  function handleLocalidadChange(v: string) {
    setLocalidadQuery(v);
    setCiudadSug(v.trim().length > 0 ? buscarCiudades(v).slice(0, 6) : []);
  }
  function seleccionarCiudad(c: Ciudad) {
    setLocalidad(c.nombre); setLocalidadQuery(''); setLocalidadLat(c.lat); setLocalidadLng(c.lng); setCiudadSug([]);
  }

  async function elegirFoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 0.7 });
    if (!result.canceled) setFotoUri(result.assets[0].uri);
  }

  async function handleSubmit() {
    if (!nombre.trim()) { setError('Ingresá el nombre del negocio.'); return; }
    if (!categoria) { setError('Seleccioná una categoría.'); return; }
    if (!localidad.trim()) { setError('Ingresá tu ciudad.'); return; }
    if (!telefono.trim()) { setError('Ingresá un teléfono de contacto.'); return; }
    if (!direccion.trim()) { setError('Ingresá la dirección del negocio.'); return; }
    if (!email.trim()) { setError('Ingresá tu email.'); return; }
    if (telefono.replace(/\D/g, '').length < 10) { setError('El teléfono debe tener al menos 10 dígitos.'); return; }
    if (!user) { setError('Tenés que iniciar sesión para registrar tu negocio.'); return; }

    setLoading(true); setError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setError('Sesión expirada. Volvé a iniciar sesión.'); setLoading(false); return; }

      let imagen_url = '';
      if (fotoUri) imagen_url = await subirImagenAd(fotoUri);

      const res = await fetch('https://www.mivecindog.com.ar/api/trial/red-vecindog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({
          nombre, categoria, telefono, direccion, localidad,
          lat: localidadLat, lng: localidadLng,
          horario_apertura: horarioApertura, horario_cierre: horarioCierre, dias_atencion: diasAtencion,
          descripcion, link, email, imagen_url,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setEnviado(true);
      } else {
        setError(data.error ?? 'No se pudo procesar el registro.');
      }
    } catch {
      setError('Error de conexión. Intentá de nuevo.');
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
              <Text style={styles.modalTitle}>Registrar mi negocio</Text>
              <Text style={styles.modalSub}>
                {precioInfo.esPromo ? '🎁 3 meses gratis' : `$${precioInfo.precioRegular?.toLocaleString('es-AR')}/mes`}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}><Text style={{ fontSize: 20, color: Colors.inkMuted }}>✕</Text></TouchableOpacity>
          </View>

          {enviado ? (
            <View style={{ alignItems: 'center', gap: 8, paddingVertical: 20 }}>
              <Text style={{ fontSize: 48 }}>✅</Text>
              <Text style={styles.modalTitle}>¡Negocio registrado!</Text>
              <Text style={styles.modalSub}>Ya aparece en la Red Vecindog. Te enviamos un mail con los detalles.</Text>
              <TouchableOpacity style={styles.submitBtn} onPress={onClose}><Text style={styles.submitBtnText}>Cerrar</Text></TouchableOpacity>
            </View>
          ) : (
            <>
              <TouchableOpacity style={styles.fotoBtn} onPress={elegirFoto}>
                {fotoUri ? <Image source={{ uri: fotoUri }} style={styles.fotoPreview} /> : (
                  <View style={[styles.fotoPreview, { alignItems: 'center', justifyContent: 'center' }]}><Text style={{ fontSize: 22 }}>🖼️</Text></View>
                )}
                <Text style={styles.fotoBtnText}>{fotoUri ? 'Cambiar foto' : 'Subir foto del local'}</Text>
              </TouchableOpacity>

              <Text style={styles.label}>Nombre del negocio *</Text>
              <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Veterinaria Central" placeholderTextColor={Colors.inkMuted} />

              <Text style={styles.label}>Categoría *</Text>
              <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowCatPicker(true)}>
                <Text style={{ color: categoria ? Colors.ink : Colors.inkMuted }}>{categoria || 'Seleccioná una categoría'}</Text>
              </TouchableOpacity>

              <Text style={styles.label}>Descripción breve</Text>
              <TextInput style={styles.input} value={descripcion} onChangeText={setDescripcion} placeholder="Especialistas en razas pequeñas…" placeholderTextColor={Colors.inkMuted} />

              <Text style={styles.label}>Dirección *</Text>
              <TextInput style={styles.input} value={direccion} onChangeText={setDireccion} placeholder="Av. San Martín 1234" placeholderTextColor={Colors.inkMuted} />

              <Text style={styles.label}>Ciudad *</Text>
              {localidad ? (
                <View style={styles.selectedRow}>
                  <Text style={styles.selectedText}>📍 {localidad}</Text>
                  <TouchableOpacity onPress={() => setLocalidad('')}><Text style={styles.changeText}>Cambiar</Text></TouchableOpacity>
                </View>
              ) : (
                <View>
                  <TextInput style={styles.input} value={localidadQuery} onChangeText={handleLocalidadChange} placeholder="Ej: Bahía Blanca" placeholderTextColor={Colors.inkMuted} />
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

              <Text style={styles.label}>Días de atención</Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {['Lunes a viernes', 'Lunes a sábado', 'Todos los días'].map((op) => (
                  <TouchableOpacity key={op} style={[styles.dayBtn, diasAtencion === op && styles.dayBtnActive]} onPress={() => setDiasAtencion(diasAtencion === op ? '' : op)}>
                    <Text style={[styles.dayBtnText, diasAtencion === op && styles.dayBtnTextActive]}>{op}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Apertura</Text>
                  <TextInput style={styles.input} value={horarioApertura} onChangeText={setHorarioApertura} placeholder="09:00" placeholderTextColor={Colors.inkMuted} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Cierre</Text>
                  <TextInput style={styles.input} value={horarioCierre} onChangeText={setHorarioCierre} placeholder="18:00" placeholderTextColor={Colors.inkMuted} />
                </View>
              </View>

              <Text style={styles.label}>Teléfono *</Text>
              <TextInput style={styles.input} value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" placeholder="+54 9 291 578-2910" placeholderTextColor={Colors.inkMuted} />

              <Text style={styles.label}>Link del negocio</Text>
              <TextInput style={styles.input} value={link} onChangeText={setLink} placeholder="https://instagram.com/tunegocio" placeholderTextColor={Colors.inkMuted} autoCapitalize="none" />

              <Text style={styles.label}>Email *</Text>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="info@tunegocio.com" placeholderTextColor={Colors.inkMuted} />

              {!!error && <Text style={styles.error}>{error}</Text>}
              <Text style={styles.trialNote}>Sin costo los primeros 3 meses · después se renueva mensualmente</Text>

              <TouchableOpacity style={[styles.submitBtn, loading && { opacity: 0.6 }]} onPress={handleSubmit} disabled={loading}>
                {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.submitBtnText}>Activar gratis — 3 meses sin costo</Text>}
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
  chip: { backgroundColor: '#fef3c7', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  chipText: { fontSize: 11, fontWeight: '800', color: '#92400e' },
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
  promoBanner: { borderWidth: 2, borderColor: '#fbbf24', backgroundColor: '#fffbeb', borderRadius: 20, padding: 18, alignItems: 'center', marginBottom: 20 },
  promoTitle: { fontSize: 18, fontWeight: '900', color: Colors.ink, marginTop: 6 },
  promoDesc: { fontSize: 12, color: Colors.inkMuted, marginTop: 4, textAlign: 'center' },
  pricingCard: { backgroundColor: '#f59e0b', borderRadius: 24, padding: 22, marginBottom: 20 },
  pricingTitle: { fontSize: 18, fontWeight: '900', color: Colors.white },
  pricingPrice: { fontSize: 30, fontWeight: '900', color: Colors.white, marginTop: 8 },
  pricingPer: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.8)' },
  pricingBenefit: { fontSize: 12, color: 'rgba(255,255,255,0.9)', flex: 1 },
  pricingBtn: { backgroundColor: Colors.white, borderRadius: 16, paddingVertical: 12, alignItems: 'center', marginTop: 16 },
  pricingBtnText: { color: '#b45309', fontWeight: '800', fontSize: 14 },
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
