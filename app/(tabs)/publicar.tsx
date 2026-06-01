import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, ActivityIndicator, Alert, Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';

const CATEGORIAS = [
  { key: 'perdido',    label: '🔴 Perdido' },
  { key: 'encontrado', label: '🟢 Encontrado' },
  { key: 'adopcion',   label: '🟤 En adopción' },
];

const ESPECIES = [
  { key: 'perro', label: '🐕 Perro' },
  { key: 'gato',  label: '🐈 Gato' },
  { key: 'otro',  label: '🐾 Otro' },
];

export default function PublicarScreen() {
  const { user, profile } = useAuth();
  const [categoria, setCategoria] = useState('perdido');
  const [especie,   setEspecie]   = useState('perro');
  const [nombre,    setNombre]    = useState('');
  const [raza,      setRaza]      = useState('');
  const [color,     setColor]     = useState('');
  const [zona,      setZona]      = useState('');
  const [descripcion, setDesc]    = useState('');
  const [contacto,  setContacto]  = useState(profile?.telefono ?? '');
  const [fotos,     setFotos]     = useState<string[]>([]);
  const [loading,   setLoading]   = useState(false);

  async function elegirFoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 0.7,
      allowsMultipleSelection: true,
      selectionLimit: 4,
    });
    if (!result.canceled) {
      setFotos(result.assets.map((a) => a.uri));
    }
  }

  async function publicar() {
    if (!contacto.trim()) { Alert.alert('Falta el contacto', 'Ingresá tu número de WhatsApp'); return; }
    if (!zona.trim())     { Alert.alert('Falta la zona', 'Ingresá el barrio o zona'); return; }

    setLoading(true);
    try {
      // Subir fotos a Supabase Storage
      const uploadedUrls: string[] = [];
      for (const uri of fotos) {
        const filename = `${categoria}/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
        const response = await fetch(uri);
        const blob     = await response.blob();
        const { error: upErr } = await supabase.storage.from('posts').upload(filename, blob, { contentType: 'image/jpeg' });
        if (!upErr) {
          const { data } = supabase.storage.from('posts').getPublicUrl(filename);
          uploadedUrls.push(data.publicUrl);
        }
      }

      const { error } = await supabase.from('posts').insert({
        categoria,
        especie,
        nombre:      nombre.trim()   || null,
        raza:        raza.trim()     || null,
        color:       color.trim()    || null,
        zona:        zona.trim(),
        ciudad:      profile?.ciudad ?? null,
        descripcion: descripcion.trim() || null,
        contacto:    contacto.trim(),
        images:      uploadedUrls,
        user_id:     user?.id,
        estado:      'activo',
        fecha:       new Date().toISOString().slice(0, 10),
      });

      if (error) { Alert.alert('Error', error.message); return; }

      Alert.alert('¡Aviso publicado!', 'Tu aviso ya es visible para los vecinos.', [
        { text: 'Ver avisos', onPress: () => router.replace('/(tabs)/avisos') },
      ]);
    } catch (e) {
      Alert.alert('Error', 'No se pudo publicar. Verificá tu conexión.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Nuevo aviso</Text>

      {/* Categoría */}
      <Text style={styles.label}>Tipo de aviso</Text>
      <View style={styles.row}>
        {CATEGORIAS.map((c) => (
          <TouchableOpacity
            key={c.key}
            style={[styles.optBtn, categoria === c.key && styles.optBtnActive]}
            onPress={() => setCategoria(c.key)}
          >
            <Text style={[styles.optText, categoria === c.key && styles.optTextActive]}>{c.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Especie */}
      <Text style={styles.label}>Animal</Text>
      <View style={styles.row}>
        {ESPECIES.map((e) => (
          <TouchableOpacity
            key={e.key}
            style={[styles.optBtn, especie === e.key && styles.optBtnActive]}
            onPress={() => setEspecie(e.key)}
          >
            <Text style={[styles.optText, especie === e.key && styles.optTextActive]}>{e.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Fotos */}
      <Text style={styles.label}>Fotos</Text>
      <TouchableOpacity style={styles.fotoBtn} onPress={elegirFoto}>
        <Text style={styles.fotoBtnText}>📷  {fotos.length > 0 ? `${fotos.length} foto(s) elegida(s)` : 'Agregar fotos'}</Text>
      </TouchableOpacity>
      {fotos.length > 0 && (
        <ScrollView horizontal style={{ marginBottom: 12 }}>
          {fotos.map((uri, i) => (
            <Image key={i} source={{ uri }} style={{ width: 80, height: 80, borderRadius: 10, marginRight: 8 }} />
          ))}
        </ScrollView>
      )}

      {/* Campos */}
      <Text style={styles.label}>Nombre del animal</Text>
      <TextInput style={styles.input} placeholder="Ej: Bobby" placeholderTextColor={Colors.inkMuted} value={nombre} onChangeText={setNombre} />

      <Text style={styles.label}>Raza</Text>
      <TextInput style={styles.input} placeholder="Ej: Labrador, criollo…" placeholderTextColor={Colors.inkMuted} value={raza} onChangeText={setRaza} />

      <Text style={styles.label}>Color</Text>
      <TextInput style={styles.input} placeholder="Ej: marrón y blanco" placeholderTextColor={Colors.inkMuted} value={color} onChangeText={setColor} />

      <Text style={styles.label}>Zona / Barrio *</Text>
      <TextInput style={styles.input} placeholder="Ej: Barrio Palihue, calle Sarmiento" placeholderTextColor={Colors.inkMuted} value={zona} onChangeText={setZona} />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
        placeholder="Marcas especiales, collar, comportamiento…"
        placeholderTextColor={Colors.inkMuted}
        value={descripcion}
        onChangeText={setDesc}
        multiline
      />

      <Text style={styles.label}>WhatsApp de contacto *</Text>
      <TextInput
        style={styles.input}
        placeholder="+54 9 291 123 4567"
        placeholderTextColor={Colors.inkMuted}
        value={contacto}
        onChangeText={setContacto}
        keyboardType="phone-pad"
      />

      <TouchableOpacity
        style={[styles.btn, loading && { opacity: 0.6 }]}
        onPress={publicar}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnText}>Publicar aviso</Text>
        }
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  inner:     { padding: 20, paddingTop: 56, paddingBottom: 40 },
  title:     { fontSize: 24, fontWeight: '900', color: Colors.ink, marginBottom: 20 },
  label:     { fontSize: 13, fontWeight: '700', color: Colors.inkMuted, marginBottom: 6, marginTop: 12 },
  row:       { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  optBtn:    { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white },
  optBtnActive: { borderColor: Colors.primary, backgroundColor: '#fef0ec' },
  optText:      { fontSize: 13, fontWeight: '600', color: Colors.inkMuted },
  optTextActive: { color: Colors.primary, fontWeight: '700' },
  fotoBtn:   { borderWidth: 1.5, borderStyle: 'dashed', borderColor: Colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginBottom: 12 },
  fotoBtnText: { color: Colors.primary, fontWeight: '700', fontSize: 14 },
  input:     { backgroundColor: Colors.white, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, fontSize: 14, color: Colors.ink, borderWidth: 1, borderColor: Colors.border, marginBottom: 2 },
  btn:       { backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 24 },
  btnText:   { color: Colors.white, fontWeight: '800', fontSize: 16 },
});
