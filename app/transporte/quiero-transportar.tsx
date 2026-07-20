import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, ActivityIndicator, Linking,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';

const EXPERIENCIA_OPTS = [
  'Soy dueño/a de perros', 'Tuve perros de niño/a', 'Cuidé perros de amigos/familia',
  'Trabajé con animales', 'Sin experiencia previa',
];
const DISPONIBILIDAD_OPTS = ['De lunes a viernes', 'Fines de semana', 'Cualquier día', 'Solo de día', 'Con horario flexible'];
const VEHICULO_OPTS = [['auto', '🚗 Auto'], ['camioneta', '🚐 Camioneta'], ['camion', '🚛 Camión']] as const;

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function QuieroTransportarScreen() {
  const { user, isPro } = useAuth();
  const [nombre, setNombre] = useState('');
  const [experiencias, setExperiencias] = useState<string[]>([]);
  const [disponibilidad, setDisponibilidad] = useState<string[]>([]);
  const [maxPerros, setMaxPerros] = useState('1');
  const [vehiculo, setVehiculo] = useState<'auto' | 'camioneta' | 'camion' | ''>('');
  const [detalles, setDetalles] = useState('');
  const [contacto, setContacto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [publicado, setPublicado] = useState(false);

  function toggle(arr: string[], setArr: (v: string[]) => void, val: string) {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  }

  async function handleSubmit() {
    if (!user) { setError('Tenés que iniciar sesión para registrarte.'); return; }
    if (!nombre.trim()) { setError('El nombre es obligatorio.'); return; }
    if (!contacto.trim()) { setError('El contacto de WhatsApp es obligatorio.'); return; }
    if (contacto.replace(/\D/g, '').length < 10) { setError('El WhatsApp debe tener al menos 10 dígitos.'); return; }

    setEnviando(true);
    setError('');

    const partes: string[] = [];
    if (vehiculo) partes.push(`Vehículo: ${vehiculo === 'camion' ? 'Camión' : vehiculo.charAt(0).toUpperCase() + vehiculo.slice(1)}.`);
    if (experiencias.length) partes.push(`Experiencia: ${experiencias.join(', ')}.`);
    if (disponibilidad.length) partes.push(`Disponibilidad: ${disponibilidad.join(', ')}.`);
    partes.push(`Puede transportar hasta ${maxPerros} perro${maxPerros !== '1' ? 's' : ''} a la vez.`);
    if (detalles.trim()) partes.push(detalles.trim());
    const descripcion = partes.join(' ');

    const { error: dbErr } = await supabase.from('posts').insert({
      user_id: user.id, perro_id: null, categoria: 'transportador_disponible', especie: 'perro',
      nombre: nombre.trim(), raza: null, color: null, tamano: null, descripcion,
      zona: '', fecha: new Date().toISOString().slice(0, 10), horario: null,
      contacto: contacto.trim(), images: [], estado: 'activo', collar: null, chapita: null, lat: null, lng: null,
    });

    setEnviando(false);
    if (dbErr) { setError('No se pudo registrar. Intentá de nuevo.'); return; }
    setPublicado(true);
    setTimeout(() => router.replace('/transporte' as any), 1800);
  }

  if (!user) {
    return (
      <View style={styles.centerScreen}>
        <Text style={styles.centerText}>Iniciá sesión para registrarte como transportador.</Text>
      </View>
    );
  }

  if (!isPro) {
    return (
      <View style={styles.centerScreen}>
        <View style={styles.proCard}>
          <Text style={{ fontSize: 32 }}>🚗</Text>
          <Text style={styles.proTitle}>Función exclusiva VecindogPro</Text>
          <Text style={styles.proSub}>
            Para registrarte como transportador y recibir calificaciones de los dueños, necesitás tener el plan Pro activo.
          </Text>
          <TouchableOpacity style={styles.proBtn} onPress={() => Linking.openURL('https://www.mivecindog.com.ar/planes')}>
            <Text style={styles.proBtnText}>Ver planes</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (publicado) {
    return (
      <View style={styles.centerScreen}>
        <Text style={{ fontSize: 48 }}>✅</Text>
        <Text style={styles.proTitle}>¡Te registraste como transportador!</Text>
        <Text style={styles.proSub}>Tu perfil ya aparece en el listado de transportadores disponibles.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingTop: 56, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
      <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>← Volver</Text></TouchableOpacity>
      <Text style={styles.title}>Quiero transportar perros</Text>
      <Text style={styles.sub}>Completá tu perfil de transportador para que los dueños puedan encontrarte.</Text>

      <Text style={styles.label}>Tu nombre o apodo *</Text>
      <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Ej: Martina G." placeholderTextColor={Colors.inkMuted} />

      <Text style={styles.label}>Experiencia con perros</Text>
      <View style={styles.chipsRow}>
        {EXPERIENCIA_OPTS.map((o) => <Chip key={o} label={o} active={experiencias.includes(o)} onPress={() => toggle(experiencias, setExperiencias, o)} />)}
      </View>

      <Text style={styles.label}>Disponibilidad</Text>
      <View style={styles.chipsRow}>
        {DISPONIBILIDAD_OPTS.map((o) => <Chip key={o} label={o} active={disponibilidad.includes(o)} onPress={() => toggle(disponibilidad, setDisponibilidad, o)} />)}
      </View>

      <Text style={styles.label}>¿Cuántos perros podés transportar a la vez?</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {['1', '2', '3', '4+'].map((n) => (
          <TouchableOpacity key={n} style={[styles.optBtn, maxPerros === n && styles.optBtnActive]} onPress={() => setMaxPerros(n)}>
            <Text style={[styles.optBtnText, maxPerros === n && styles.optBtnTextActive]}>{n}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>¿Qué vehículo tenés?</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {VEHICULO_OPTS.map(([val, lbl]) => (
          <TouchableOpacity
            key={val}
            style={[styles.optBtn, { flex: 1 }, vehiculo === val && styles.optBtnActive]}
            onPress={() => setVehiculo(vehiculo === val ? '' : val)}
          >
            <Text style={[styles.optBtnText, vehiculo === val && styles.optBtnTextActive]}>{lbl}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Información adicional (opcional)</Text>
      <TextInput
        style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
        value={detalles} onChangeText={setDetalles} multiline
        placeholder="Contá algo más: si tenés auto propio, qué zonas cubrís, si hacés traslados al veterinario…"
        placeholderTextColor={Colors.inkMuted}
      />

      <Text style={styles.label}>WhatsApp de contacto *</Text>
      <TextInput style={styles.input} value={contacto} onChangeText={setContacto} keyboardType="phone-pad" placeholder="Ej: 1122334455" placeholderTextColor={Colors.inkMuted} />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={[styles.submitBtn, enviando && { opacity: 0.6 }]} onPress={handleSubmit} disabled={enviando}>
        {enviando ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.submitBtnText}>🚗 Registrarme como transportador</Text>}
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
  chipActive:  { borderColor: '#3b82f6', backgroundColor: '#eff6ff' },
  chipText:    { fontSize: 12, fontWeight: '600', color: Colors.inkMuted },
  chipTextActive: { color: '#1d4ed8' },
  optBtn:      { borderWidth: 2, borderColor: Colors.border, borderRadius: 14, paddingVertical: 10, paddingHorizontal: 16, alignItems: 'center' },
  optBtnActive: { borderColor: '#3b82f6', backgroundColor: '#eff6ff' },
  optBtnText:  { fontSize: 13, fontWeight: '700', color: Colors.inkMuted },
  optBtnTextActive: { color: '#1d4ed8' },
  error:       { fontSize: 12, fontWeight: '700', color: Colors.bad, marginTop: 12 },
  submitBtn:   { backgroundColor: '#1d4ed8', borderRadius: 16, paddingVertical: 15, alignItems: 'center', marginTop: 24 },
  submitBtnText: { color: Colors.white, fontWeight: '800', fontSize: 15 },
  proCard:     { backgroundColor: Colors.white, borderRadius: 24, padding: 28, alignItems: 'center', gap: 8 },
  proTitle:    { fontSize: 18, fontWeight: '900', color: Colors.ink, textAlign: 'center', marginTop: 4 },
  proSub:      { fontSize: 13, color: Colors.inkMuted, textAlign: 'center' },
  proBtn:      { backgroundColor: '#1d4ed8', borderRadius: 16, paddingHorizontal: 24, paddingVertical: 12, marginTop: 8 },
  proBtnText:  { color: Colors.white, fontWeight: '800', fontSize: 14 },
});
