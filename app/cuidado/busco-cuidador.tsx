import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, ActivityIndicator, Image,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';

type Perro = { id: string; nombre: string; raza: string | null; color: string | null; tamano: string | null; sexo: string | null; foto_url: string | null };

export default function BuscoCuidadorScreen() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [perros, setPerros] = useState<Perro[]>([]);
  const [perroSel, setPerroSel] = useState<Perro | null>(null);
  const [cargandoPerros, setCargandoPerros] = useState(true);
  const [descripcion, setDescripcion] = useState('');
  const [zona, setZona] = useState('');
  const [contacto, setContacto] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [publicado, setPublicado] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from('perros').select('id, nombre, raza, color, tamano, sexo, foto_url').eq('user_id', user.id).order('nombre')
      .then(({ data }) => {
        const lista = (data ?? []) as Perro[];
        setPerros(lista);
        if (lista.length === 1) setPerroSel(lista[0]);
        setCargandoPerros(false);
      });
  }, [user]);

  async function handleSubmit() {
    if (!user) { setError(t.bcErrLogin); return; }
    if (!zona.trim()) { setError(t.bcErrZona); return; }
    if (!contacto.trim()) { setError(t.bcErrContacto); return; }
    if (contacto.replace(/\D/g, '').length < 10) { setError(t.bcErrContactoDigits); return; }
    if (fechaDesde && fechaHasta && fechaHasta < fechaDesde) { setError(t.bcErrFechas); return; }

    setEnviando(true);
    setError('');

    const fechaTexto = (fechaDesde && fechaHasta) ? `${t.bcFechasPrefix} ${fechaDesde} ${t.bcFechasAlSuffix} ${fechaHasta}.` : fechaDesde ? `${t.bcDesdeElPrefix} ${fechaDesde}.` : '';
    const descFinal = [descripcion.trim(), fechaTexto].filter(Boolean).join(' ') || t.bcDescDefault;

    const { error: dbErr } = await supabase.from('posts').insert({
      user_id: user.id, perro_id: perroSel?.id ?? null, categoria: 'busco_cuidador', especie: 'perro',
      nombre: perroSel?.nombre || null, raza: perroSel?.raza || null, color: perroSel?.color || null, tamano: perroSel?.tamano || null,
      descripcion: descFinal, zona: zona.trim(), fecha: fechaHasta || new Date().toISOString().slice(0, 10), horario: null,
      contacto: contacto.trim(), images: perroSel?.foto_url ? [perroSel.foto_url] : [], estado: 'activo',
      collar: null, chapita: null, lat: null, lng: null,
    });

    setEnviando(false);
    if (dbErr) { setError(t.bcErrPublicar); return; }
    setPublicado(true);
    setTimeout(() => router.replace('/cuidado' as any), 1800);
  }

  if (!user) {
    return (
      <View style={styles.centerScreen}>
        <Text style={styles.centerText}>{t.bcLoginRequired}</Text>
        <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.loginBtnText}>{t.bcLoginBtn}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (publicado) {
    return (
      <View style={styles.centerScreen}>
        <Text style={{ fontSize: 48 }}>✅</Text>
        <Text style={styles.proTitle}>{t.bcPublicadoTitle}</Text>
        <Text style={styles.proSub}>{t.bcPublicadoSub}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingTop: 56, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
      <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>{t.cuidadoVolver}</Text></TouchableOpacity>
      <Text style={styles.title}>{t.bcTitle}</Text>
      <Text style={styles.sub}>{t.bcSub}</Text>

      <View style={styles.perrosCard}>
        <Text style={styles.perrosTitle}>{t.bcParaCualPerro}</Text>
        {cargandoPerros ? (
          <ActivityIndicator color={Colors.primary} />
        ) : perros.length === 0 ? (
          <View>
            <Text style={styles.centerText}>{t.bcSinPerros}</Text>
            <TouchableOpacity onPress={() => router.push('/mis-perros/nuevo')}>
              <Text style={styles.registrarLink}>{t.bcRegistrarUno}</Text>
            </TouchableOpacity>
            <Text style={[styles.centerText, { fontSize: 11, marginTop: 6 }]}>
              {t.bcContinuarSinPerro}
            </Text>
          </View>
        ) : (
          <View style={{ gap: 8 }}>
            {perros.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={[styles.perroOpt, perroSel?.id === p.id && styles.perroOptActive]}
                onPress={() => setPerroSel(perroSel?.id === p.id ? null : p)}
              >
                {p.foto_url ? <Image source={{ uri: p.foto_url }} style={styles.perroImg} /> : (
                  <View style={[styles.perroImg, { alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.cream }]}><Text>🐶</Text></View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.perroNombre}>{p.nombre}</Text>
                  {!!p.raza && <Text style={styles.perroSub}>{p.raza}</Text>}
                </View>
                {perroSel?.id === p.id && <Text style={{ color: '#0d9488', fontSize: 16 }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <Text style={styles.label}>{t.bcFechasLabel}</Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.dateLabel}>{t.bcDesdeLabel}</Text>
          <TextInput style={styles.input} value={fechaDesde} onChangeText={setFechaDesde} placeholder={t.dateFormatPh} placeholderTextColor={Colors.inkMuted} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.dateLabel}>{t.bcHastaLabel}</Text>
          <TextInput style={styles.input} value={fechaHasta} onChangeText={setFechaHasta} placeholder={t.dateFormatPh} placeholderTextColor={Colors.inkMuted} />
        </View>
      </View>

      <Text style={styles.label}>{t.qcZonaLabel}</Text>
      <TextInput style={styles.input} value={zona} onChangeText={setZona} placeholder={t.qcZonaPh} placeholderTextColor={Colors.inkMuted} />

      <Text style={styles.label}>{t.bcDescLabel}</Text>
      <TextInput
        style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
        value={descripcion} onChangeText={setDescripcion} multiline
        placeholder={t.bcDescPh}
        placeholderTextColor={Colors.inkMuted}
      />

      <Text style={styles.label}>{t.qcContactoLabel}</Text>
      <TextInput style={styles.input} value={contacto} onChangeText={setContacto} keyboardType="phone-pad" placeholder={t.qcContactoPh} placeholderTextColor={Colors.inkMuted} />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={[styles.submitBtn, enviando && { opacity: 0.6 }]} onPress={handleSubmit} disabled={enviando}>
        {enviando ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.submitBtnText}>{t.bcSubmitBtn}</Text>}
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
  dateLabel:   { fontSize: 11, fontWeight: '600', color: Colors.inkMuted, marginBottom: 4 },
  input:       { backgroundColor: Colors.white, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: Colors.ink, borderWidth: 1, borderColor: Colors.border },
  error:       { fontSize: 12, fontWeight: '700', color: Colors.bad, marginTop: 12 },
  submitBtn:   { backgroundColor: '#0d9488', borderRadius: 16, paddingVertical: 15, alignItems: 'center', marginTop: 24 },
  submitBtnText: { color: Colors.white, fontWeight: '800', fontSize: 15 },
  loginBtn:    { backgroundColor: '#0d9488', borderRadius: 16, paddingHorizontal: 24, paddingVertical: 12, marginTop: 8 },
  loginBtnText: { color: Colors.white, fontWeight: '800', fontSize: 14 },
  proTitle:    { fontSize: 18, fontWeight: '900', color: Colors.ink, textAlign: 'center', marginTop: 4 },
  proSub:      { fontSize: 13, color: Colors.inkMuted, textAlign: 'center' },
  perrosCard:  { backgroundColor: Colors.white, borderRadius: 18, padding: 16, marginTop: 8 },
  perrosTitle: { fontSize: 13, fontWeight: '800', color: Colors.ink, marginBottom: 10 },
  registrarLink: { fontSize: 13, fontWeight: '700', color: '#0d9488', marginTop: 4 },
  perroOpt:    { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 2, borderColor: Colors.border, borderRadius: 16, padding: 10 },
  perroOptActive: { borderColor: '#14b8a6', backgroundColor: '#f0fdfa' },
  perroImg:    { width: 40, height: 40, borderRadius: 10 },
  perroNombre: { fontSize: 13, fontWeight: '700', color: Colors.ink },
  perroSub:    { fontSize: 11, color: Colors.inkMuted },
});
