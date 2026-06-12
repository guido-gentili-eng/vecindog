import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, ActivityIndicator, Alert, Image, Switch,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { resizeForUpload } from '@/lib/imageUtils';
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
  const [fotos,        setFotos]        = useState<string[]>([]);
  const [loading,      setLoading]      = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [coords,    setCoords]    = useState<{ lat: number; lng: number } | null>(null);
  const [locStatus, setLocStatus] = useState<'idle' | 'loading' | 'ok' | 'denied'>('idle');
  const [contactoPublico, setContactoPublico] = useState(true);

  // Mis perros
  type Perro = { id: string; nombre: string; raza: string | null; color: string | null; foto_url: string | null };
  const [misPerros,     setMisPerros]     = useState<Perro[]>([]);
  const [perroSelec,    setPerroSelec]    = useState<string | null>(null); // id
  const [mostrarPerros, setMostrarPerros] = useState(false);

  useEffect(() => {
    if (categoria !== 'perdido' || !user) return;
    supabase
      .from('perros')
      .select('id, nombre, raza, color, foto_url')
      .eq('user_id', user.id)
      .order('nombre')
      .then(({ data }) => setMisPerros(data ?? []));
  }, [categoria]);

  function seleccionarPerro(perro: Perro) {
    setPerroSelec(perro.id);
    setNombre(perro.nombre);
    setRaza(perro.raza ?? '');
    setColor(perro.color ?? '');
    setEspecie('perro');
    setMostrarPerros(false);
  }

  function limpiarSeleccion() {
    setPerroSelec(null);
    setNombre('');
    setRaza('');
    setColor('');
  }

  async function capturarUbicacion() {
    setLocStatus('loading');
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocStatus('denied');
      return;
    }
    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      setLocStatus('ok');
    } catch {
      setLocStatus('denied');
    }
  }

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
    setUploadedCount(0);

    // Rutas exitosas — se usan para limpiar si algo falla después
    const subidosPaths: string[] = [];

    async function limpiarSubidos() {
      if (subidosPaths.length === 0) return;
      await supabase.storage.from('posts').remove(subidosPaths);
    }

    try {
      async function subirFoto(uri: string): Promise<string> {
        const path    = `${categoria}/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
        const resized = await resizeForUpload(uri);
        const blob    = await fetch(resized).then((r) => r.blob());
        const { error } = await supabase.storage.from('posts').upload(path, blob, { contentType: 'image/jpeg' });
        if (error) throw new Error(error.message);
        subidosPaths.push(path); // registrar solo cuando el upload fue exitoso
        setUploadedCount((n) => n + 1);
        return supabase.storage.from('posts').getPublicUrl(path).data.publicUrl;
      }

      let uploadedUrls: string[] = [];
      if (fotos.length > 0) {
        try {
          uploadedUrls = await Promise.all(fotos.map(subirFoto));
        } catch (uploadErr) {
          await limpiarSubidos();
          Alert.alert('Error al subir fotos', 'No se pudieron subir todas las imágenes. Las parcialmente subidas fueron eliminadas. Intentá de nuevo.');
          return;
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
        lat:         coords?.lat ?? null,
        lng:         coords?.lng ?? null,
        descripcion: descripcion.trim() || null,
        contacto:         contacto.trim(),
        contacto_publico: contactoPublico,
        images:      uploadedUrls,
        user_id:     user?.id,
        estado:      'activo',
        fecha:       new Date().toISOString().slice(0, 10),
      });

      if (error) {
        await limpiarSubidos();
        // código 42501 = RLS violation → rate limit alcanzado
        const esRateLimit =
          error.code === '42501' ||
          error.message?.includes('row-level security');
        Alert.alert(
          esRateLimit ? 'Límite alcanzado' : 'Error al guardar',
          esRateLimit
            ? 'Podés publicar hasta 5 avisos por hora. Esperá un momento e intentá de nuevo.'
            : 'Las fotos fueron eliminadas. Intentá publicar de nuevo.',
        );
        return;
      }

      Alert.alert('¡Aviso publicado!', 'Tu aviso ya es visible para los vecinos.', [
        { text: 'Ver avisos', onPress: () => router.replace('/(tabs)/avisos') },
      ]);
    } catch (e) {
      await limpiarSubidos();
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

      {/* Selector "mis perros" — solo visible en categoría perdido */}
      {categoria === 'perdido' && misPerros.length > 0 && (
        <>
          <Text style={styles.label}>¿Es uno de tus perros?</Text>

          {perroSelec ? (
            /* Perro ya seleccionado */
            <View style={styles.perroSelecRow}>
              {(() => {
                const p = misPerros.find((x) => x.id === perroSelec)!;
                return (
                  <>
                    {p.foto_url
                      ? <Image source={{ uri: p.foto_url }} style={styles.perroSelecImg} />
                      : <View style={[styles.perroSelecImg, styles.perroSelecImgEmpty]}><Text>🐕</Text></View>
                    }
                    <View style={{ flex: 1 }}>
                      <Text style={styles.perroSelecNombre}>{p.nombre}</Text>
                      {p.raza ? <Text style={styles.perroSelecSub}>{p.raza}</Text> : null}
                    </View>
                    <TouchableOpacity onPress={limpiarSeleccion}>
                      <Text style={styles.perroSelecCambiar}>Cambiar</Text>
                    </TouchableOpacity>
                  </>
                );
              })()}
            </View>
          ) : (
            /* Botón para abrir/cerrar el listado */
            <>
              <TouchableOpacity
                style={styles.perroDropBtn}
                onPress={() => setMostrarPerros((v) => !v)}
              >
                <Text style={styles.perroDropBtnText}>
                  {mostrarPerros ? '▲  Ocultar mis perros' : '🐕  Seleccionar de mis perros'}
                </Text>
              </TouchableOpacity>

              {mostrarPerros && (
                <View style={styles.perroList}>
                  {misPerros.map((p) => (
                    <TouchableOpacity
                      key={p.id}
                      style={styles.perroItem}
                      onPress={() => seleccionarPerro(p)}
                    >
                      {p.foto_url
                        ? <Image source={{ uri: p.foto_url }} style={styles.perroItemImg} />
                        : <View style={[styles.perroItemImg, styles.perroSelecImgEmpty]}><Text>🐕</Text></View>
                      }
                      <View style={{ flex: 1 }}>
                        <Text style={styles.perroItemNombre}>{p.nombre}</Text>
                        {p.raza ? <Text style={styles.perroItemSub}>{p.raza}</Text> : null}
                      </View>
                      <Text style={{ color: Colors.primary, fontWeight: '700' }}>Usar →</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}
        </>
      )}

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

      {/* Ubicación GPS */}
      <Text style={styles.label}>Ubicación en el mapa</Text>
      <TouchableOpacity
        style={[styles.locBtn, locStatus === 'ok' && styles.locBtnOk]}
        onPress={capturarUbicacion}
        disabled={locStatus === 'loading'}
      >
        {locStatus === 'loading'
          ? <ActivityIndicator color={Colors.primary} size="small" />
          : <Text style={[styles.locBtnText, locStatus === 'ok' && styles.locBtnTextOk]}>
              {locStatus === 'ok'
                ? `📍 Ubicación capturada (${coords!.lat.toFixed(4)}, ${coords!.lng.toFixed(4)})`
                : locStatus === 'denied'
                  ? '⚠️  Permiso denegado — el aviso no aparecerá en el mapa'
                  : '📍  Usar mi ubicación actual'}
            </Text>
        }
      </TouchableOpacity>

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

      {/* Privacidad del contacto */}
      <View style={styles.privacyRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.privacyLabel}>Mostrar número públicamente</Text>
          <Text style={styles.privacySub}>
            {contactoPublico
              ? 'Cualquier usuario registrado verá tu número.'
              : 'Los usuarios deberán solicitar el contacto.'}
          </Text>
        </View>
        <Switch
          value={contactoPublico}
          onValueChange={setContactoPublico}
          trackColor={{ false: Colors.border, true: Colors.primary }}
          thumbColor={Colors.white}
        />
      </View>

      {loading && fotos.length > 0 && (
        <View style={styles.progressWrap}>
          <View style={[styles.progressBar, { width: `${(uploadedCount / fotos.length) * 100}%` as any }]} />
          <Text style={styles.progressText}>
            {uploadedCount < fotos.length
              ? `Subiendo fotos ${uploadedCount}/${fotos.length}…`
              : 'Guardando aviso…'}
          </Text>
        </View>
      )}

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
  btn:           { backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 24 },
  btnText:       { color: Colors.white, fontWeight: '800', fontSize: 16 },
  progressWrap:       { backgroundColor: Colors.white, borderRadius: 12, padding: 12, marginBottom: 12, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  progressBar:        { position: 'absolute', top: 0, left: 0, bottom: 0, backgroundColor: Colors.primary, opacity: 0.15, borderRadius: 12 },
  progressText:       { fontSize: 13, fontWeight: '600', color: Colors.ink, textAlign: 'center' },
  privacyRow:   { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: Colors.border, marginTop: 8, gap: 12 },
  privacyLabel: { fontSize: 13, fontWeight: '700', color: Colors.ink, marginBottom: 2 },
  privacySub:   { fontSize: 11, color: Colors.inkMuted, lineHeight: 15 },
  locBtn:             { borderWidth: 1.5, borderColor: Colors.border, borderRadius: 14, paddingVertical: 13, paddingHorizontal: 14, backgroundColor: Colors.white, marginBottom: 2 },
  locBtnOk:           { borderColor: Colors.good, backgroundColor: '#f0fdf4' },
  locBtnText:         { fontSize: 14, fontWeight: '600', color: Colors.inkMuted },
  locBtnTextOk:       { color: Colors.good },
  perroDropBtn:       { borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 14, paddingVertical: 13, paddingHorizontal: 14, backgroundColor: '#fef0ec', alignItems: 'center' },
  perroDropBtnText:   { fontSize: 14, fontWeight: '700', color: Colors.primary },
  perroList:          { borderWidth: 1, borderColor: Colors.border, borderRadius: 14, overflow: 'hidden', marginTop: 6 },
  perroItem:          { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.white },
  perroItemImg:       { width: 44, height: 44, borderRadius: 22 },
  perroItemNombre:    { fontSize: 14, fontWeight: '700', color: Colors.ink },
  perroItemSub:       { fontSize: 12, color: Colors.inkMuted },
  perroSelecRow:      { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fef0ec', borderRadius: 14, padding: 12, borderWidth: 1.5, borderColor: Colors.primary },
  perroSelecImg:      { width: 44, height: 44, borderRadius: 22 },
  perroSelecImgEmpty: { backgroundColor: Colors.cream, alignItems: 'center', justifyContent: 'center' },
  perroSelecNombre:   { fontSize: 14, fontWeight: '700', color: Colors.ink },
  perroSelecSub:      { fontSize: 12, color: Colors.inkMuted },
  perroSelecCambiar:  { fontSize: 13, fontWeight: '700', color: Colors.primary },
});
