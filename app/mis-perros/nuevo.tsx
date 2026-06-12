import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, ActivityIndicator, Alert, Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { resizeForUpload } from '@/lib/imageUtils';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';

const SEXOS   = ['macho', 'hembra'];
const TAMANOS = [{ k: 'pequeño', l: 'S' }, { k: 'mediano', l: 'M' }, { k: 'grande', l: 'L' }];

export default function NuevoPerroScreen() {
  const { user } = useAuth();
  const [nombre,       setNombre]       = useState('');
  const [raza,         setRaza]         = useState('');
  const [color,        setColor]        = useState('');
  const [sexo,         setSexo]         = useState('');
  const [tamano,       setTamano]       = useState('');
  const [fechaNac,     setFechaNac]     = useState('');
  const [chip,         setChip]         = useState('');
  const [esterilizado, setEsterilizado] = useState(false);
  const [descripcion,  setDescripcion]  = useState('');
  const [fotoUri,      setFotoUri]      = useState('');
  const [loading,      setLoading]      = useState(false);

  async function elegirFoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permiso denegado'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!result.canceled) setFotoUri(result.assets[0].uri);
  }

  async function guardar() {
    if (!nombre.trim()) { Alert.alert('Falta el nombre', 'Ingresá el nombre de tu perro'); return; }
    setLoading(true);
    try {
      let foto_url = '';
      if (fotoUri) {
        const path    = `perros/${Date.now()}.jpg`;
        const resized = await resizeForUpload(fotoUri);
        const blob    = await fetch(resized).then((r) => r.blob());
        const { error: upErr } = await supabase.storage.from('perros').upload(path, blob, { contentType: 'image/jpeg' });
        if (!upErr) {
          const { data } = supabase.storage.from('perros').getPublicUrl(path);
          foto_url = data.publicUrl;
        }
      }

      const { error } = await supabase.from('perros').insert({
        user_id:     user?.id,
        nombre:      nombre.trim(),
        raza:        raza.trim()        || null,
        color:       color.trim()       || null,
        sexo:        sexo               || null,
        tamano:      tamano             || null,
        fecha_nac:   fechaNac           || null,
        chip:        chip.trim()        || null,
        esterilizado,
        descripcion: descripcion.trim() || null,
        foto_url:    foto_url           || null,
      });

      if (error) { Alert.alert('Error', error.message); return; }
      Alert.alert('¡Listo!', `${nombre} fue registrado correctamente.`, [
        { text: 'Ver mis perros', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Error', 'No se pudo guardar. Verificá tu conexión.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">

      {/* Foto */}
      <TouchableOpacity style={styles.fotoArea} onPress={elegirFoto}>
        {fotoUri
          ? <Image source={{ uri: fotoUri }} style={styles.fotoImg} />
          : <View style={styles.fotoPlaceholder}>
              <Text style={{ fontSize: 40 }}>📷</Text>
              <Text style={styles.fotoText}>Agregar foto</Text>
            </View>
        }
      </TouchableOpacity>

      {/* Nombre */}
      <Text style={styles.label}>Nombre *</Text>
      <TextInput style={styles.input} placeholder="Ej: Bobby" placeholderTextColor={Colors.inkMuted} value={nombre} onChangeText={setNombre} />

      <Text style={styles.label}>Raza</Text>
      <TextInput style={styles.input} placeholder="Ej: Labrador" placeholderTextColor={Colors.inkMuted} value={raza} onChangeText={setRaza} />

      <Text style={styles.label}>Color</Text>
      <TextInput style={styles.input} placeholder="Ej: Marrón" placeholderTextColor={Colors.inkMuted} value={color} onChangeText={setColor} />

      {/* Sexo */}
      <Text style={styles.label}>Sexo</Text>
      <View style={styles.row}>
        {SEXOS.map((s) => (
          <TouchableOpacity key={s} style={[styles.opt, sexo === s && styles.optActive]} onPress={() => setSexo(sexo === s ? '' : s)}>
            <Text style={[styles.optText, sexo === s && styles.optTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tamaño */}
      <Text style={styles.label}>Tamaño</Text>
      <View style={styles.row}>
        {TAMANOS.map(({ k, l }) => (
          <TouchableOpacity key={k} style={[styles.opt, tamano === k && styles.optActive]} onPress={() => setTamano(tamano === k ? '' : k)}>
            <Text style={[styles.optText, tamano === k && styles.optTextActive]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Fecha de nacimiento</Text>
      <TextInput style={styles.input} placeholder="AAAA-MM-DD" placeholderTextColor={Colors.inkMuted} value={fechaNac} onChangeText={setFechaNac} />

      <Text style={styles.label}>Nº de Microchip</Text>
      <TextInput style={styles.input} placeholder="Nº de chip" placeholderTextColor={Colors.inkMuted} value={chip} onChangeText={setChip} />

      {/* Esterilizado */}
      <TouchableOpacity style={styles.checkRow} onPress={() => setEsterilizado(!esterilizado)}>
        <View style={[styles.check, esterilizado && styles.checkActive]}>
          {esterilizado && <Text style={{ color: Colors.white, fontSize: 12, fontWeight: '900' }}>✓</Text>}
        </View>
        <Text style={styles.checkLabel}>Esterilizado/a</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
        placeholder="Marcas especiales, comportamiento…"
        placeholderTextColor={Colors.inkMuted}
        value={descripcion} onChangeText={setDescripcion} multiline
      />

      <TouchableOpacity style={[styles.btn, loading && { opacity: 0.6 }]} onPress={guardar} disabled={loading}>
        {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.btnText}>Guardar perro</Text>}
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: Colors.bg },
  inner:            { padding: 20, paddingBottom: 40 },
  fotoArea:         { alignSelf: 'center', marginBottom: 20 },
  fotoImg:          { width: 120, height: 120, borderRadius: 24 },
  fotoPlaceholder:  { width: 120, height: 120, borderRadius: 24, backgroundColor: Colors.cream, alignItems: 'center', justifyContent: 'center', gap: 4 },
  fotoText:         { fontSize: 12, fontWeight: '700', color: Colors.primary },
  label:            { fontSize: 13, fontWeight: '700', color: Colors.inkMuted, marginBottom: 6, marginTop: 14 },
  input:            { backgroundColor: Colors.white, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: Colors.ink, borderWidth: 1, borderColor: Colors.border },
  row:              { flexDirection: 'row', gap: 8 },
  opt:              { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white },
  optActive:        { borderColor: Colors.primary, backgroundColor: '#fef0ec' },
  optText:          { fontSize: 13, fontWeight: '600', color: Colors.inkMuted, textTransform: 'capitalize' },
  optTextActive:    { color: Colors.primary, fontWeight: '700' },
  checkRow:         { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16 },
  check:            { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  checkActive:      { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkLabel:       { fontSize: 14, fontWeight: '600', color: Colors.ink },
  btn:              { backgroundColor: Colors.primary, borderRadius: 18, paddingVertical: 16, alignItems: 'center', marginTop: 24 },
  btnText:          { color: Colors.white, fontWeight: '900', fontSize: 16 },
});
