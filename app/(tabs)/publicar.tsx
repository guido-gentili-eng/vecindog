import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, ActivityIndicator, Alert, Image, Switch, Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { resizeForUpload } from '@/lib/imageUtils';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';
import CategoriaDot from '@/components/CategoriaDot';
import { buscarRazas, COLORES_PERRO } from '@/lib/razas';
import { notificarAmigosPerroPerdido } from '@/lib/amistades';
import { useLanguage } from '@/contexts/LanguageContext';

type ZonaSugerencia = { label: string; sub: string; lat: number; lng: number };

export default function PublicarScreen() {
  const { t } = useLanguage();
  const CATEGORIAS = [
    { key: 'perdido',    label: t.avisosCatPerdido },
    { key: 'encontrado', label: t.avisosCatEncontrado },
    { key: 'adopcion',   label: t.avisosCatAdopcion },
    { key: 'transito',   label: t.avisosCatTransito },
  ];
  const { user, profile } = useAuth();
  const [categoria, setCategoria] = useState('perdido');
  const [nombre,    setNombre]    = useState('');
  const [raza,      setRaza]      = useState('');
  const [color,     setColor]     = useState('');
  const [tamano,    setTamano]    = useState<'pequeño' | 'mediano' | 'grande' | ''>('');
  const [sexo,      setSexo]      = useState<'macho' | 'hembra' | ''>('');
  const [collar,    setCollar]    = useState<boolean | null>(null);
  const [chapita,   setChapita]   = useState<boolean | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [zona,      setZona]      = useState('');
  const [descripcion, setDesc]    = useState('');
  const [contacto,  setContacto]  = useState(profile?.telefono ?? '');
  const [fotos,        setFotos]        = useState<string[]>([]);
  const [loading,      setLoading]      = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [coords,    setCoords]    = useState<{ lat: number; lng: number } | null>(null);
  const [locStatus, setLocStatus] = useState<'idle' | 'loading' | 'ok' | 'denied'>('idle');
  const [contactoPublico, setContactoPublico] = useState(true);

  const [razaSugerencias, setRazaSugerencias] = useState<string[]>([]);
  const [mostrarRazaSug,  setMostrarRazaSug]  = useState(false);

  const [zonaSugerencias, setZonaSugerencias] = useState<ZonaSugerencia[]>([]);
  const [zonaLoading,     setZonaLoading]     = useState(false);
  const [mostrarZonaSug,  setMostrarZonaSug]  = useState(false);
  const zonaDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  function handleRazaChange(v: string) {
    setRaza(v);
    const found = buscarRazas(v);
    setRazaSugerencias(found);
    setMostrarRazaSug(found.length > 0);
  }

  function seleccionarRaza(r: string) {
    setRaza(r);
    setRazaSugerencias([]);
    setMostrarRazaSug(false);
  }

  function handleZonaChange(v: string) {
    setZona(v);
    setMostrarZonaSug(true);
    if (zonaDebounceRef.current) clearTimeout(zonaDebounceRef.current);

    if (v.trim().length < 3) {
      setZonaSugerencias([]);
      return;
    }

    zonaDebounceRef.current = setTimeout(async () => {
      setZonaLoading(true);
      try {
        const query = profile?.ciudad ? `${v}, ${profile.ciudad}, Argentina` : `${v}, Argentina`;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=6&addressdetails=1&countrycodes=ar`,
          { headers: { 'User-Agent': 'Vecindog/1.0 (noreply@mivecindog.com.ar)' } }
        );
        const data = await res.json();
        const parsed: ZonaSugerencia[] = (Array.isArray(data) ? data : []).map((s: any) => {
          const a = s.address ?? {};
          const road = a.road ?? a.pedestrian ?? a.footway ?? a.residential ?? '';
          const num  = a.house_number ?? '';
          const calle = [road, num].filter(Boolean).join(' ') || String(s.display_name ?? '').split(',')[0].trim();
          const ciudadSug = a.city ?? a.town ?? a.village ?? a.suburb ?? '';
          return { label: calle, sub: ciudadSug, lat: parseFloat(s.lat), lng: parseFloat(s.lon) };
        }).filter((s: ZonaSugerencia) => s.label);
        setZonaSugerencias(parsed);
      } catch {
        setZonaSugerencias([]);
      } finally {
        setZonaLoading(false);
      }
    }, 400);
  }

  function seleccionarZona(s: ZonaSugerencia) {
    setZona(s.label);
    if (!isNaN(s.lat) && !isNaN(s.lng)) {
      setCoords({ lat: s.lat, lng: s.lng });
      setLocStatus('ok');
    }
    setZonaSugerencias([]);
    setMostrarZonaSug(false);
  }

  async function elegirFoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert(t.perfilPermisoDenegadoTitle, t.bpfErrPermisoGaleria); return; }
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
    if (!contacto.trim())     { Alert.alert(t.pbErrContactoTitle, t.pbErrContactoSub); return; }
    if (!zona.trim())         { Alert.alert(t.pbErrZonaTitle, t.pbErrZonaSub); return; }
    if (!descripcion.trim()) { Alert.alert(t.pbErrDescTitle, t.pbErrDescSub); return; }

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
          Alert.alert(t.pbErrFotosTitle, t.pbErrFotosSub);
          return;
        }
      }

      const { data: nuevoPost, error } = await supabase.from('posts').insert({
        categoria,
        especie:     'perro',
        nombre:      nombre.trim()   || null,
        raza:        raza.trim()     || null,
        color:       color.trim()    || null,
        tamano:      tamano || null,
        sexo:        sexo   || null,
        collar,
        chapita,
        zona:        zona.trim(),
        ciudad:      profile?.ciudad ?? null,
        lat:         coords?.lat ?? null,
        lng:         coords?.lng ?? null,
        descripcion: descripcion.trim(),
        contacto:         contacto.trim(),
        contacto_publico: contactoPublico,
        images:      uploadedUrls,
        user_id:     user?.id,
        estado:      'activo',
        fecha:       new Date().toISOString().slice(0, 10),
      }).select('id').single();

      if (error) {
        await limpiarSubidos();
        // código 42501 = RLS violation → rate limit alcanzado
        const esRateLimit =
          error.code === '42501' ||
          error.message?.includes('row-level security');
        Alert.alert(
          esRateLimit ? t.pbErrLimiteTitle : t.pbErrGuardarTitle,
          esRateLimit
            ? t.pbErrLimiteSub
            : t.pbErrGuardarSub,
        );
        return;
      }

      if (categoria === 'perdido' && user?.id && nuevoPost?.id) {
        notificarAmigosPerroPerdido({
          ownerId: user.id, postId: nuevoPost.id,
          nombrePerro: nombre.trim() || null, zona: zona.trim(),
        }).catch(() => {});
      }

      Alert.alert(t.pbPublicadoTitle, t.pbPublicadoSub, [
        { text: t.pbVerAvisos, onPress: () => router.replace('/(tabs)/avisos') },
      ]);
    } catch (e) {
      await limpiarSubidos();
      Alert.alert(t.perfilErrorGeneric, t.pbErrGenericoSub);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>{t.pbTitle}</Text>

      {/* Categoría */}
      <Text style={styles.label}>{t.pbTipoAviso}</Text>
      <View style={styles.row}>
        {CATEGORIAS.map((c) => (
          <TouchableOpacity
            key={c.key}
            style={[styles.optBtn, categoria === c.key && styles.optBtnActive]}
            onPress={() => setCategoria(c.key)}
          >
            <CategoriaDot categoria={c.key} size={8} />
            <Text style={[styles.optText, styles.optTextWithDot, categoria === c.key && styles.optTextActive]} numberOfLines={1}>{c.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Buscar por foto — solo tiene sentido para perdido/encontrado */}
      {(categoria === 'perdido' || categoria === 'encontrado') && (
        <TouchableOpacity style={styles.buscarFotoBtn} onPress={() => router.push('/buscar-por-foto')}>
          <Text style={styles.buscarFotoIcon}>🔍</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.buscarFotoTitulo}>{t.pbBuscarFotoTitulo}</Text>
            <Text style={styles.buscarFotoSub}>{t.pbBuscarFotoSub}</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Selector "mis perros" — solo visible en categoría perdido */}
      {categoria === 'perdido' && misPerros.length > 0 && (
        <>
          <Text style={styles.label}>{t.pbEsUnoDeTusPerros}</Text>

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
                      <Text style={styles.perroSelecCambiar}>{t.rvCambiarBtn}</Text>
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
                  {mostrarPerros ? t.pbOcultarMisPerros : t.pbSeleccionarMisPerros}
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
                      <Text style={{ color: Colors.primary, fontWeight: '700' }}>{t.pbUsarFlecha}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}
        </>
      )}

      {/* Fotos */}
      <Text style={styles.label}>{t.pbFotosLabel}</Text>
      <TouchableOpacity style={styles.fotoBtn} onPress={elegirFoto}>
        <Text style={styles.fotoBtnText}>📷  {fotos.length > 0 ? `${fotos.length} ${t.pbFotosElegidasSuffix}` : t.pbFotoBtnAgregar}</Text>
      </TouchableOpacity>
      {fotos.length > 0 && (
        <ScrollView horizontal style={{ marginBottom: 12 }}>
          {fotos.map((uri, i) => (
            <Image key={i} source={{ uri }} style={{ width: 80, height: 80, borderRadius: 10, marginRight: 8 }} />
          ))}
        </ScrollView>
      )}

      {/* Campos */}
      <Text style={styles.label}>{t.pbNombreAnimalLabel}</Text>
      <TextInput style={styles.input} placeholder={t.nuevoPerroNombrePh} placeholderTextColor={Colors.inkMuted} value={nombre} onChangeText={setNombre} />

      <Text style={styles.label}>{t.nuevoPerroRaza}</Text>
      <TextInput
        style={styles.input}
        placeholder={t.nuevoPerroRazaPh}
        placeholderTextColor={Colors.inkMuted}
        value={raza}
        onChangeText={handleRazaChange}
        onFocus={() => handleRazaChange(raza)}
      />
      {mostrarRazaSug && razaSugerencias.length > 0 && (
        <View style={styles.sugerenciaList}>
          {razaSugerencias.slice(0, 8).map((r) => (
            <TouchableOpacity key={r} style={styles.sugerenciaItem} onPress={() => seleccionarRaza(r)}>
              <Text style={styles.sugerenciaText}>🐕  {r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.label}>{t.pbColorLabel}</Text>
      <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowColorPicker(true)}>
        <Text style={styles.pickerBtnText}>{color || t.nuevoPerroColorNoSe}</Text>
        <Text style={styles.pickerBtnChevron}>⌄</Text>
      </TouchableOpacity>

      <Modal visible={showColorPicker} transparent animationType="slide" onRequestClose={() => setShowColorPicker(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowColorPicker(false)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitulo}>{t.pbColorLabel}</Text>
            <TouchableOpacity style={styles.modalOption} onPress={() => { setColor(''); setShowColorPicker(false); }}>
              <Text style={[styles.modalOptionText, color === '' && styles.modalOptionTextActive]}>{t.nuevoPerroColorNoSe}</Text>
            </TouchableOpacity>
            {COLORES_PERRO.map((c) => (
              <TouchableOpacity key={c} style={styles.modalOption} onPress={() => { setColor(c); setShowColorPicker(false); }}>
                <Text style={[styles.modalOptionText, color === c && styles.modalOptionTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Text style={styles.label}>{t.nuevoPerroTamano}</Text>
      <View style={styles.ternarioRow}>
        {([['pequeño', t.perroTamanoChico], ['mediano', t.perroTamanoMediano], ['grande', t.perroTamanoGrande]] as const).map(([v, l]) => (
          <TouchableOpacity
            key={v}
            style={[styles.ternarioBtn, tamano === v && styles.ternarioBtnActive]}
            onPress={() => setTamano(tamano === v ? '' : v)}
          >
            <Text style={[styles.ternarioText, tamano === v && styles.ternarioTextActive]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>{t.pbSexoLabel} <Text style={styles.labelOptional}>{t.pbOpcional}</Text></Text>
      <View style={styles.ternarioRow}>
        {([['macho', t.pbSexoMacho], ['hembra', t.pbSexoHembra], ['', t.pbNoSe]] as const).map(([v, l]) => (
          <TouchableOpacity
            key={v || 'no-se'}
            style={[styles.ternarioBtn, sexo === v && styles.ternarioBtnActive]}
            onPress={() => setSexo(v)}
          >
            <Text style={[styles.ternarioText, sexo === v && styles.ternarioTextActive]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>{t.pbTeniaCollar}</Text>
      <View style={styles.ternarioRow}>
        {([[true, t.bpfSi], [false, t.bpfNo], [null, t.pbNoSe]] as const).map(([v, l]) => (
          <TouchableOpacity
            key={String(v)}
            style={[styles.ternarioBtn, collar === v && styles.ternarioBtnActive]}
            onPress={() => setCollar(v)}
          >
            <Text style={[styles.ternarioText, collar === v && styles.ternarioTextActive]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>{t.pbTeniaChapitaPlaquita}</Text>
      <View style={styles.ternarioRow}>
        {([[true, t.bpfSi], [false, t.bpfNo], [null, t.pbNoSe]] as const).map(([v, l]) => (
          <TouchableOpacity
            key={String(v)}
            style={[styles.ternarioBtn, chapita === v && styles.ternarioBtnActive]}
            onPress={() => setChapita(v)}
          >
            <Text style={[styles.ternarioText, chapita === v && styles.ternarioTextActive]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Ubicación GPS */}
      <Text style={styles.label}>{t.pbUbicacionLabel}</Text>
      <TouchableOpacity
        style={[styles.locBtn, locStatus === 'ok' && styles.locBtnOk]}
        onPress={capturarUbicacion}
        disabled={locStatus === 'loading'}
      >
        {locStatus === 'loading'
          ? <ActivityIndicator color={Colors.primary} size="small" />
          : <Text style={[styles.locBtnText, locStatus === 'ok' && styles.locBtnTextOk]}>
              {locStatus === 'ok'
                ? `${t.pbUbicacionCapturadaPrefix}${coords!.lat.toFixed(4)}, ${coords!.lng.toFixed(4)})`
                : locStatus === 'denied'
                  ? t.pbPermisoDenegadoMapa
                  : t.pbUsarUbicacionActual}
            </Text>
        }
      </TouchableOpacity>

      <Text style={styles.label}>{t.pbDireccionZonaLabel}</Text>
      <View>
        <TextInput
          style={styles.input}
          placeholder={t.pbDireccionZonaPh}
          placeholderTextColor={Colors.inkMuted}
          value={zona}
          onChangeText={handleZonaChange}
          onFocus={() => zonaSugerencias.length > 0 && setMostrarZonaSug(true)}
        />
        {zonaLoading && (
          <ActivityIndicator style={styles.zonaLoadingIcon} color={Colors.inkMuted} size="small" />
        )}
      </View>
      {mostrarZonaSug && zonaSugerencias.length > 0 && (
        <View style={styles.sugerenciaList}>
          {zonaSugerencias.map((s, i) => (
            <TouchableOpacity key={i} style={styles.sugerenciaItem} onPress={() => seleccionarZona(s)}>
              <Text style={styles.sugerenciaText}>📍  {s.label}</Text>
              {!!s.sub && <Text style={styles.sugerenciaSub}>{s.sub}</Text>}
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.label}>{t.pbDescripcionLabel}</Text>
      <TextInput
        style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
        placeholder={t.pbDescripcionPh}
        placeholderTextColor={Colors.inkMuted}
        value={descripcion}
        onChangeText={setDesc}
        multiline
      />

      <Text style={styles.label}>{t.qcContactoLabel}</Text>
      <TextInput
        style={styles.input}
        placeholder={t.pbContactoPh}
        placeholderTextColor={Colors.inkMuted}
        value={contacto}
        onChangeText={setContacto}
        keyboardType="phone-pad"
      />

      {/* Privacidad del contacto */}
      <View style={styles.privacyRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.privacyLabel}>{t.pbMostrarNumeroLabel}</Text>
          <Text style={styles.privacySub}>
            {contactoPublico
              ? t.pbNumeroPublicoSub
              : t.pbNumeroPrivadoSub}
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
              ? `${t.pbSubiendoFotosPrefix} ${uploadedCount}/${fotos.length}…`
              : t.pbGuardandoAviso}
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
          : <Text style={styles.btnText}>{t.pbPublicarBtn}</Text>
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
  buscarFotoBtn:    { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.cream, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, padding: 14, marginTop: 14 },
  buscarFotoIcon:   { fontSize: 22 },
  buscarFotoTitulo: { fontSize: 13, fontWeight: '800', color: Colors.ink },
  buscarFotoSub:    { fontSize: 11, color: Colors.inkMuted, marginTop: 2 },
  optBtn:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white },
  optBtnActive: { borderColor: Colors.primary, backgroundColor: '#fef0ec' },
  optText:      { fontSize: 13, fontWeight: '600', color: Colors.inkMuted },
  optTextWithDot: { marginLeft: 6 },
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
  sugerenciaList:     { borderWidth: 1, borderColor: Colors.border, borderRadius: 14, overflow: 'hidden', marginTop: 4, backgroundColor: Colors.white },
  sugerenciaItem:      { paddingHorizontal: 14, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: Colors.border },
  sugerenciaText:      { fontSize: 14, color: Colors.ink, fontWeight: '600' },
  sugerenciaSub:       { fontSize: 11, color: Colors.inkMuted, marginTop: 2, marginLeft: 20 },
  zonaLoadingIcon:     { position: 'absolute', right: 14, top: 15 },
  labelOptional:       { fontWeight: '400', color: Colors.inkMuted, textTransform: 'none' },
  pickerBtn:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.white, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, borderWidth: 1, borderColor: Colors.border },
  pickerBtnText:       { fontSize: 14, color: Colors.ink, fontWeight: '600' },
  pickerBtnChevron:    { fontSize: 16, color: Colors.inkMuted },
  modalOverlay:        { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet:          { backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 8, paddingBottom: 24, maxHeight: '70%' },
  modalTitulo:         { fontSize: 13, fontWeight: '800', color: Colors.inkMuted, paddingHorizontal: 18, paddingVertical: 10 },
  modalOption:         { paddingHorizontal: 18, paddingVertical: 14, borderTopWidth: 1, borderTopColor: Colors.border },
  modalOptionText:     { fontSize: 15, color: Colors.ink },
  modalOptionTextActive: { color: Colors.primary, fontWeight: '700' },
  ternarioRow:         { flexDirection: 'row', gap: 8 },
  ternarioBtn:         { flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white },
  ternarioBtnActive:   { borderColor: Colors.primary, backgroundColor: '#fef0ec' },
  ternarioText:        { fontSize: 13, fontWeight: '700', color: Colors.inkMuted },
  ternarioTextActive:  { color: Colors.primary },
});
