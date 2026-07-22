import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, ActivityIndicator, Linking,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function QuieroCuidarScreen() {
  const { t } = useLanguage();
  const EXPERIENCIA_OPTS = [t.qcExp1, t.qcExp2, t.qcExp3, t.qcExp4, t.qcExp5];
  const DISPONIBILIDAD_OPTS = [t.qcDisp1, t.qcDisp2, t.qcDisp3, t.qcDisp4, t.qcDisp5];
  const { user, isPro } = useAuth();
  const [nombre, setNombre] = useState('');
  const [experiencias, setExperiencias] = useState<string[]>([]);
  const [disponibilidad, setDisponibilidad] = useState<string[]>([]);
  const [maxPerros, setMaxPerros] = useState('1');
  const [tienePerros, setTienePerros] = useState<'si' | 'no' | ''>('');
  const [detalles, setDetalles] = useState('');
  const [zona, setZona] = useState('');
  const [contacto, setContacto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [publicado, setPublicado] = useState(false);

  function toggle(arr: string[], setArr: (v: string[]) => void, val: string) {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  }

  async function handleSubmit() {
    if (!user) { setError(t.qcErrLogin); return; }
    if (!nombre.trim()) { setError(t.qcErrNombre); return; }
    if (!zona.trim()) { setError(t.qcErrZona); return; }
    if (!contacto.trim()) { setError(t.qcErrContacto); return; }
    if (contacto.replace(/\D/g, '').length < 10) { setError(t.qcErrContactoDigits); return; }

    setEnviando(true);
    setError('');

    const partes: string[] = [];
    if (experiencias.length) partes.push(`${t.qcExperienciaPrefix} ${experiencias.join(', ')}.`);
    if (disponibilidad.length) partes.push(`${t.qcDisponibilidadPrefix} ${disponibilidad.join(', ')}.`);
    partes.push(`${t.qcPuedeCuidarPrefix} ${maxPerros} ${maxPerros !== '1' ? t.qcPerroPlural : t.qcPerroSingular} ${t.qcALaVezSuffix}`);
    if (tienePerros === 'si') partes.push(t.qcTienePerrosSiTexto);
    if (tienePerros === 'no') partes.push(t.qcTienePerrosNoTexto);
    if (detalles.trim()) partes.push(detalles.trim());
    const descripcion = partes.join(' ');

    const { error: dbErr } = await supabase.from('posts').insert({
      user_id: user.id, perro_id: null, categoria: 'cuidador_disponible', especie: 'perro',
      nombre: nombre.trim(), raza: null, color: null, tamano: null, descripcion,
      zona: zona.trim(), fecha: new Date().toISOString().slice(0, 10), horario: null,
      contacto: contacto.trim(), images: [], estado: 'activo', collar: null, chapita: null, lat: null, lng: null,
    });

    setEnviando(false);
    if (dbErr) { setError(t.qcErrRegistrar); return; }
    setPublicado(true);
    setTimeout(() => router.replace('/cuidado' as any), 1800);
  }

  if (!user) {
    return (
      <View style={styles.centerScreen}>
        <Text style={styles.centerText}>{t.qcLoginRequired}</Text>
      </View>
    );
  }

  if (!isPro) {
    return (
      <View style={styles.centerScreen}>
        <View style={styles.proCard}>
          <Text style={{ fontSize: 32 }}>🤲</Text>
          <Text style={styles.proTitle}>{t.qcProTitle}</Text>
          <Text style={styles.proSub}>
            {t.qcProSub}
          </Text>
          <TouchableOpacity style={styles.proBtn} onPress={() => Linking.openURL('https://www.mivecindog.com.ar/planes')}>
            <Text style={styles.proBtnText}>{t.bpfVerPlanes}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (publicado) {
    return (
      <View style={styles.centerScreen}>
        <Text style={{ fontSize: 48 }}>✅</Text>
        <Text style={styles.proTitle}>{t.qcPublicadoTitle}</Text>
        <Text style={styles.proSub}>{t.qcPublicadoSub}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingTop: 56, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
      <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>{t.cuidadoVolver}</Text></TouchableOpacity>
      <Text style={styles.title}>{t.qcTitle}</Text>
      <Text style={styles.sub}>{t.qcSub}</Text>

      <Text style={styles.label}>{t.qcNombreLabel}</Text>
      <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder={t.qcNombrePh} placeholderTextColor={Colors.inkMuted} />

      <Text style={styles.label}>{t.qcExperienciaLabel}</Text>
      <View style={styles.chipsRow}>
        {EXPERIENCIA_OPTS.map((o) => <Chip key={o} label={o} active={experiencias.includes(o)} onPress={() => toggle(experiencias, setExperiencias, o)} />)}
      </View>

      <Text style={styles.label}>{t.qcDisponibilidadLabel}</Text>
      <View style={styles.chipsRow}>
        {DISPONIBILIDAD_OPTS.map((o) => <Chip key={o} label={o} active={disponibilidad.includes(o)} onPress={() => toggle(disponibilidad, setDisponibilidad, o)} />)}
      </View>

      <Text style={styles.label}>{t.qcCuantosPerrosLabel}</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {['1', '2', '3', '4+'].map((n) => (
          <TouchableOpacity key={n} style={[styles.optBtn, maxPerros === n && styles.optBtnActive]} onPress={() => setMaxPerros(n)}>
            <Text style={[styles.optBtnText, maxPerros === n && styles.optBtnTextActive]}>{n}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>{t.qcTienesPerrosLabel}</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {([['si', t.bpfSi], ['no', t.bpfNo]] as const).map(([val, lbl]) => (
          <TouchableOpacity
            key={val}
            style={[styles.optBtn, { flex: 1 }, tienePerros === val && styles.optBtnActive]}
            onPress={() => setTienePerros(tienePerros === val ? '' : val)}
          >
            <Text style={[styles.optBtnText, tienePerros === val && styles.optBtnTextActive]}>{lbl}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>{t.qcInfoAdicionalLabel}</Text>
      <TextInput
        style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
        value={detalles} onChangeText={setDetalles} multiline
        placeholder={t.qcInfoAdicionalPh}
        placeholderTextColor={Colors.inkMuted}
      />

      <Text style={styles.label}>{t.qcZonaLabel}</Text>
      <TextInput style={styles.input} value={zona} onChangeText={setZona} placeholder={t.qcZonaPh} placeholderTextColor={Colors.inkMuted} />

      <Text style={styles.label}>{t.qcContactoLabel}</Text>
      <TextInput style={styles.input} value={contacto} onChangeText={setContacto} keyboardType="phone-pad" placeholder={t.qcContactoPh} placeholderTextColor={Colors.inkMuted} />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={[styles.submitBtn, enviando && { opacity: 0.6 }]} onPress={handleSubmit} disabled={enviando}>
        {enviando ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.submitBtnText}>{t.qcSubmitBtn}</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: Colors.bg },
  centerScreen: { flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 8 },
  centerText:  { fontSize: 14, color: Colors.inkMuted, textAlign: 'center' },
  back:        { fontSize: 14, fontWeight: '700', color: Colors.primary, marginBottom: 12 },
  title:       { fontSize: 26, fontWeight: '900', color: Colors.ink },
  sub:         { fontSize: 13, color: Colors.inkMuted, marginTop: 4, marginBottom: 20 },
  label:       { fontSize: 12, fontWeight: '700', color: Colors.inkMuted, marginTop: 16, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 },
  input:       { backgroundColor: Colors.white, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: Colors.ink, borderWidth: 1, borderColor: Colors.border },
  chipsRow:    { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip:        { borderWidth: 2, borderColor: Colors.border, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 },
  chipActive:  { borderColor: '#14b8a6', backgroundColor: '#f0fdfa' },
  chipText:    { fontSize: 12, fontWeight: '600', color: Colors.inkMuted },
  chipTextActive: { color: '#0f766e' },
  optBtn:      { borderWidth: 2, borderColor: Colors.border, borderRadius: 14, paddingVertical: 10, paddingHorizontal: 16, alignItems: 'center' },
  optBtnActive: { borderColor: '#14b8a6', backgroundColor: '#f0fdfa' },
  optBtnText:  { fontSize: 13, fontWeight: '700', color: Colors.inkMuted },
  optBtnTextActive: { color: '#0f766e' },
  error:       { fontSize: 12, fontWeight: '700', color: Colors.bad, marginTop: 12 },
  submitBtn:   { backgroundColor: '#0f766e', borderRadius: 16, paddingVertical: 15, alignItems: 'center', marginTop: 24 },
  submitBtnText: { color: Colors.white, fontWeight: '800', fontSize: 15 },
  proCard:     { backgroundColor: Colors.white, borderRadius: 24, padding: 28, alignItems: 'center', gap: 8 },
  proTitle:    { fontSize: 18, fontWeight: '900', color: Colors.ink, textAlign: 'center', marginTop: 4 },
  proSub:      { fontSize: 13, color: Colors.inkMuted, textAlign: 'center' },
  proBtn:      { backgroundColor: '#0d9488', borderRadius: 16, paddingHorizontal: 24, paddingVertical: 12, marginTop: 8 },
  proBtnText:  { color: Colors.white, fontWeight: '800', fontSize: 14 },
});
