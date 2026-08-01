import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, Linking, TextInput,
  ActivityIndicator, Switch, Image, Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/colors';
import { subirArchivoEstudio } from '@/lib/estudios';
import { buscarCiudades, type Ciudad } from '@/lib/ciudades';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { isBiometricAvailable, isBiometricEnabled, setBiometricEnabled, authenticateWithBiometrics } from '@/lib/biometrics';

type PerroSOS = { id: string; nombre: string; raza: string | null; color: string | null; foto_url: string | null };

export default function PerfilScreen() {
  const { t } = useLanguage();
  const { user, profile, isPro, isGuest, exitGuest, signOut, saveProfile } = useAuth();
  const [editando,   setEditando]   = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [subiendoAvatar, setSubiendoAvatar] = useState(false);
  const [ciudadSugerencias, setCiudadSugerencias] = useState<Ciudad[]>([]);
  const [mostrarCiudadSug,  setMostrarCiudadSug]  = useState(false);
  const [sosOpen, setSosOpen] = useState(false);
  const [perrosSOS, setPerrosSOS] = useState<PerroSOS[]>([]);
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [biometricOn, setBiometricOn] = useState(false);
  const [biometricBusy, setBiometricBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from('perros').select('id, nombre, raza, color, foto_url').eq('user_id', user.id).order('nombre')
      .then(({ data }) => setPerrosSOS(data ?? []));
  }, [user]);

  useEffect(() => {
    isBiometricAvailable().then(setBiometricSupported);
    isBiometricEnabled().then(setBiometricOn);
  }, []);

  async function handleToggleBiometric(value: boolean) {
    if (!value) {
      await setBiometricEnabled(false);
      setBiometricOn(false);
      return;
    }
    setBiometricBusy(true);
    const ok = await authenticateWithBiometrics(t.perfilBiometricTitle);
    setBiometricBusy(false);
    if (!ok) { Alert.alert(t.perfilErrorGeneric, t.perfilBiometricEnableFail); return; }
    await setBiometricEnabled(true);
    setBiometricOn(true);
  }

  // Form state
  const [nombre,    setNombre]    = useState(profile?.nombre    ?? '');
  const [apellido,  setApellido]  = useState(profile?.apellido  ?? '');
  const [telefono,  setTelefono]  = useState(profile?.telefono  ?? '');
  const [ciudad,    setCiudad]    = useState(profile?.ciudad    ?? '');
  const [provincia, setProvincia] = useState(profile?.provincia ?? '');
  const [pais,      setPais]      = useState(profile?.pais      ?? 'Argentina');
  const [direccion, setDireccion] = useState(profile?.direccion ?? '');

  const inicial = profile?.nombre?.charAt(0)?.toUpperCase()
    ?? user?.email?.charAt(0)?.toUpperCase() ?? '?';

  function iniciarEdicion() {
    setNombre(profile?.nombre    ?? '');
    setApellido(profile?.apellido  ?? '');
    setTelefono(profile?.telefono  ?? '');
    setCiudad(profile?.ciudad    ?? '');
    setProvincia(profile?.provincia ?? '');
    setPais(profile?.pais      ?? 'Argentina');
    setDireccion(profile?.direccion ?? '');
    setEditando(true);
  }

  function handleCiudadChange(v: string) {
    setCiudad(v);
    const found = buscarCiudades(v);
    setCiudadSugerencias(found);
    setMostrarCiudadSug(found.length > 0 && v.trim().length > 0);
  }

  function seleccionarCiudad(c: Ciudad) {
    setCiudad(c.nombre);
    setProvincia(c.provincia);
    setCiudadSugerencias([]);
    setMostrarCiudadSug(false);
  }

  async function cambiarAvatar() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert(t.perfilPermisoDenegadoTitle, t.perfilPermisoDenegadoSub); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 0.7 });
    if (result.canceled) return;
    setSubiendoAvatar(true);
    try {
      const nombreArchivo = result.assets[0].fileName ?? `avatar-${Date.now()}.jpg`;
      const url = await subirArchivoEstudio(result.assets[0].uri, nombreArchivo);
      const err = await saveProfile({
        nombre:    profile?.nombre    ?? '',
        apellido:  profile?.apellido  ?? '',
        telefono:  profile?.telefono  ?? '',
        ciudad:    profile?.ciudad    ?? '',
        provincia: profile?.provincia ?? '',
        pais:      profile?.pais      ?? 'Argentina',
        direccion: profile?.direccion ?? '',
        foto_url:  url,
      });
      if (err) Alert.alert(t.perfilErrorGeneric, err);
    } catch {
      Alert.alert(t.perfilErrorGeneric, t.perfilErrorFotoSub);
    } finally {
      setSubiendoAvatar(false);
    }
  }

  async function guardar() {
    if (!nombre.trim() || !apellido.trim()) {
      Alert.alert(t.perfilCamposRequeridosTitle, t.perfilCamposRequeridosSub);
      return;
    }
    setSaving(true);
    const err = await saveProfile({ nombre, apellido, telefono, ciudad, provincia, pais, direccion, foto_url: profile?.foto_url ?? null });
    setSaving(false);
    if (err) { Alert.alert(t.perfilErrorGeneric, err); return; }
    setEditando(false);
    Alert.alert(t.perfilGuardadoTitle, t.perfilGuardadoSub);
  }

  async function handleSignOut() {
    Alert.alert(t.perfilCerrarSesion, t.perfilCerrarSesionConfirm, [
      { text: t.perfilCancelar, style: 'cancel' },
      { text: t.perfilCerrarSesionSalir, style: 'destructive', onPress: () => signOut() },
    ]);
  }

  function handleCrearCuenta() {
    exitGuest();
    router.replace('/(auth)/login');
  }

  if (isGuest) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center', padding: 32 }]}>
        <Text style={{ fontSize: 56, marginBottom: 12 }}>🐾</Text>
        <Text style={styles.emptyPromptTitle}>{t.perfilGuestTitle}</Text>
        <Text style={[styles.emptyPromptSub, { marginTop: 8, marginBottom: 20 }]}>
          {t.perfilGuestSub}
        </Text>
        <TouchableOpacity style={styles.emptyPromptBtn} onPress={handleCrearCuenta}>
          <Text style={styles.emptyPromptBtnText}>{t.perfilGuestBtn}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>

      {/* Avatar */}
      <View style={styles.avatarArea}>
        <TouchableOpacity onPress={cambiarAvatar} disabled={subiendoAvatar} style={{ position: 'relative' }}>
          {profile?.foto_url
            ? <Image source={{ uri: profile.foto_url }} style={styles.avatarImg} />
            : <View style={styles.avatar}><Text style={styles.avatarText}>{inicial}</Text></View>
          }
          <View style={styles.avatarEditBadge}>
            {subiendoAvatar
              ? <ActivityIndicator color={Colors.white} size="small" />
              : <Text style={{ fontSize: 13 }}>📷</Text>}
          </View>
        </TouchableOpacity>
        <Text style={styles.nombre}>
          {profile ? `${profile.nombre} ${profile.apellido}` : user?.email}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* Datos personales */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>{t.perfilDatosPersonales}</Text>
          {!editando ? (
            <TouchableOpacity onPress={iniciarEdicion}>
              <Text style={styles.editLink}>{t.perfilEditar}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setEditando(false)}>
              <Text style={[styles.editLink, { color: Colors.bad }]}>{t.perfilCancelar}</Text>
            </TouchableOpacity>
          )}
        </View>

        {editando ? (
          <View style={styles.form}>
            <Field label={t.perfilFieldNombre}    value={nombre}    onChange={setNombre}    placeholder={t.perfilRowNombre} />
            <Field label={t.perfilFieldApellido}  value={apellido}  onChange={setApellido}  placeholder={t.perfilFieldApellido.replace(' *', '')} />
            <Field label={t.perfilFieldTelefono}    value={telefono}  onChange={setTelefono}  placeholder={t.perfilFieldTelefonoPh} keyboardType="phone-pad" />

            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: Colors.inkMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t.perfilFieldCiudad}</Text>
              <TextInput
                style={{ backgroundColor: Colors.bg, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: Colors.ink, borderWidth: 1, borderColor: Colors.border }}
                value={ciudad}
                onChangeText={handleCiudadChange}
                onFocus={() => handleCiudadChange(ciudad)}
                placeholder={t.perfilFieldCiudadPh}
                placeholderTextColor={Colors.inkMuted}
              />
              {mostrarCiudadSug && ciudadSugerencias.length > 0 && (
                <View style={styles.sugerenciaList}>
                  {ciudadSugerencias.slice(0, 6).map((c) => (
                    <TouchableOpacity key={c.nombre} style={styles.sugerenciaItem} onPress={() => seleccionarCiudad(c)}>
                      <Text style={styles.sugerenciaText}>📍  {c.nombre}</Text>
                      <Text style={styles.sugerenciaSub}>{c.provincia}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <Field label={t.perfilFieldProvincia}   value={provincia} onChange={setProvincia} placeholder={t.perfilFieldProvinciaPh} />
            <Field label={t.perfilFieldPais}        value={pais}      onChange={setPais}      placeholder={t.perfilFieldPaisPh} />
            <Field label={t.perfilFieldDireccion}   value={direccion} onChange={setDireccion} placeholder={t.perfilFieldDireccionPh} />

            <TouchableOpacity
              style={[styles.saveBtn, saving && { opacity: 0.6 }]}
              onPress={guardar}
              disabled={saving}
            >
              {saving
                ? <ActivityIndicator color={Colors.white} />
                : <Text style={styles.saveBtnText}>{t.perfilGuardarCambios}</Text>
              }
            </TouchableOpacity>
          </View>
        ) : !profile?.nombre ? (
          /* Perfil vacío — prompt de completado */
          <View style={styles.emptyPrompt}>
            <Text style={styles.emptyPromptEmoji}>👋</Text>
            <Text style={styles.emptyPromptTitle}>{t.perfilCompletarTitle}</Text>
            <Text style={styles.emptyPromptSub}>
              {t.perfilCompletarSub}
            </Text>
            <TouchableOpacity style={styles.emptyPromptBtn} onPress={iniciarEdicion}>
              <Text style={styles.emptyPromptBtnText}>{t.perfilCompletarBtn}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {[
              [t.perfilRowNombre,    `${profile.nombre} ${profile.apellido}`],
              [t.perfilRowTelefono,  profile.telefono  || '—'],
              [t.perfilRowCiudad,    profile.ciudad    || '—'],
              [t.perfilRowProvincia, profile.provincia || '—'],
              [t.perfilRowPais,      profile.pais      || '—'],
              [t.perfilRowDireccion, profile.direccion || '—'],
            ].map(([label, value]) => (
              <View key={label} style={styles.row}>
                <Text style={styles.rowLabel}>{label}</Text>
                <Text style={styles.rowValue} numberOfLines={1}>{value}</Text>
              </View>
            ))}
          </>
        )}
      </View>

      {/* SOS perro perdido */}
      {isPro ? (
        <TouchableOpacity style={styles.sosBtn} onPress={() => setSosOpen(true)}>
          <View style={styles.sosIcon}><Text style={{ fontSize: 22 }}>🚨</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sosTitle}>{t.perfilSosTitle}</Text>
            <Text style={styles.sosSub}>{t.perfilSosSub}</Text>
          </View>
          <Text style={{ fontSize: 18, color: Colors.white, opacity: 0.7 }}>›</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.sosBtnLocked} onPress={() => Linking.openURL('https://www.mivecindog.com.ar/planes')}>
          <Text style={{ fontSize: 22 }}>🔒</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.sosTitleLocked}>{t.perfilSosTitle}</Text>
            <Text style={styles.sosSubLocked}>{t.perfilSosSubLocked}</Text>
          </View>
        </TouchableOpacity>
      )}

      {sosOpen && (
        <SOSModal
          perros={perrosSOS}
          onClose={() => setSosOpen(false)}
        />
      )}

      {/* Links */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Vecindog</Text>
        <MenuItem
          label={t.perfilLinkMisAvisos}
          onPress={() => router.push('/(tabs)/avisos')}
        />
        <MenuItem
          label={t.perfilLinkPublicitate}
          onPress={() => router.push('/publicitate' as any)}
        />
        {user?.email === process.env.EXPO_PUBLIC_ADMIN_EMAIL && (
          <MenuItem
            label={t.perfilLinkAdmin}
            onPress={() => router.push('/admin/reportes')}
          />
        )}
        <MenuItem
          label={t.perfilLinkWeb}
          onPress={() => Linking.openURL('https://www.mivecindog.com.ar')}
        />
        <MenuItem
          label={t.perfilLinkTerminos}
          onPress={() => Linking.openURL('https://www.mivecindog.com.ar/terminos')}
        />
        <MenuItem
          label={t.perfilLinkPrivacidad}
          onPress={() => Linking.openURL('https://www.mivecindog.com.ar/privacidad')}
          last
        />
      </View>

      {/* Idioma */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>{t.perfilIdioma}</Text>
        </View>
        <LanguageSwitcher />
      </View>

      {/* Desbloqueo biométrico */}
      {biometricSupported && (
        <View style={styles.card}>
          <View style={styles.biometricRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{t.perfilBiometricTitle}</Text>
              <Text style={styles.biometricSub}>{t.perfilBiometricSub}</Text>
            </View>
            {biometricBusy
              ? <ActivityIndicator color={Colors.primary} />
              : (
                <Switch
                  value={biometricOn}
                  onValueChange={handleToggleBiometric}
                  trackColor={{ true: Colors.primary }}
                />
              )
            }
          </View>
        </View>
      )}

      {/* Cerrar sesión */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleSignOut}>
        <Text style={styles.logoutText}>{t.perfilCerrarSesion}</Text>
      </TouchableOpacity>

      <Text style={styles.version}>{t.perfilVersion}</Text>
    </ScrollView>
  );
}

function Field({ label, value, onChange, placeholder, keyboardType }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; keyboardType?: any;
}) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ fontSize: 11, fontWeight: '700', color: Colors.inkMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </Text>
      <TextInput
        style={{ backgroundColor: Colors.bg, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: Colors.ink, borderWidth: 1, borderColor: Colors.border }}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={Colors.inkMuted}
        keyboardType={keyboardType}
      />
    </View>
  );
}

function SOSModal({ perros, onClose }: { perros: PerroSOS[]; onClose: () => void }) {
  const { t } = useLanguage();
  const [perroSel, setPerroSel] = useState<string>(perros[0]?.id ?? '');
  const [enviando, setEnviando] = useState(false);
  const [enviado,  setEnviado]  = useState(false);
  const [amigosCount, setAmigosCount] = useState<number | null>(null);
  const [errorSos, setErrorSos] = useState('');

  const perroActual = perros.find((p) => p.id === perroSel) ?? perros[0] ?? null;

  async function handleSOS() {
    setEnviando(true);
    setErrorSos('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('https://www.mivecindog.com.ar/api/sos-perro-perdido', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ nombre_perro: perroActual?.nombre ?? '' }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Error');
      setAmigosCount(json.amigos ?? 0);
      setEnviado(true);
    } catch {
      setErrorSos(t.perfilModalErrorEnvio);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>{t.perfilModalSosTitle}</Text>
              <Text style={styles.modalSub}>{t.perfilModalSosSub}</Text>
            </View>
            <TouchableOpacity onPress={onClose}><Text style={{ fontSize: 20, color: Colors.inkMuted }}>✕</Text></TouchableOpacity>
          </View>

          {!enviado ? (
            <>
              {perros.length === 0 ? (
                <Text style={styles.modalEmpty}>
                  {t.perfilModalSinPerros}
                </Text>
              ) : (
                <View style={{ gap: 8, marginBottom: 16 }}>
                  <Text style={styles.modalLabel}>{t.perfilModalCualSePerdio}</Text>
                  {perros.map((p) => (
                    <TouchableOpacity
                      key={p.id}
                      style={[styles.perroOpt, perroSel === p.id && styles.perroOptActive]}
                      onPress={() => setPerroSel(p.id)}
                    >
                      {p.foto_url
                        ? <Image source={{ uri: p.foto_url }} style={styles.perroOptImg} />
                        : <View style={[styles.perroOptImg, { alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.cream }]}><Text>🐶</Text></View>
                      }
                      <View style={{ flex: 1 }}>
                        <Text style={styles.perroOptNombre}>{p.nombre}</Text>
                        <Text style={styles.perroOptSub}>{[p.raza, p.color].filter(Boolean).join(' · ') || t.perfilSinDescripcion}</Text>
                      </View>
                      {perroSel === p.id && <Text style={{ color: Colors.bad, fontSize: 16 }}>✓</Text>}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {!!errorSos && <Text style={styles.modalError}>{errorSos}</Text>}

              {perros.length > 0 && (
                <TouchableOpacity
                  style={[styles.sosSendBtn, (enviando || !perroSel) && { opacity: 0.6 }]}
                  onPress={handleSOS}
                  disabled={enviando || !perroSel}
                >
                  {enviando
                    ? <ActivityIndicator color={Colors.white} />
                    : <Text style={styles.sosSendBtnText}>{t.perfilModalAlertarBtn}</Text>}
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.modalCancelBtn} onPress={onClose}>
                <Text style={styles.modalCancelBtnText}>{t.perfilModalCerrar}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={{ alignItems: 'center', gap: 8, paddingVertical: 12 }}>
              <Text style={{ fontSize: 40 }}>✅</Text>
              <Text style={styles.modalTitle}>{t.perfilModalEnviadaTitle}</Text>
              {amigosCount !== null && amigosCount > 0 ? (
                <Text style={styles.modalSub}>
                  {t.perfilModalAvisamosPrefix} {amigosCount} {amigosCount !== 1 ? t.perfilModalAmigoPlural : t.perfilModalAmigoSingular} {t.perfilModalAvisamosSuffix}
                </Text>
              ) : (
                <Text style={styles.modalSub}>
                  {t.perfilModalSinAmigos}
                </Text>
              )}
              <TouchableOpacity style={styles.modalCancelBtn} onPress={onClose}>
                <Text style={styles.modalCancelBtnText}>{t.perfilModalListo}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

function MenuItem({ label, onPress, last = false }: { label: string; onPress: () => void; last?: boolean }) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, last && { borderBottomWidth: 0 }]}
      onPress={onPress}
    >
      <Text style={styles.menuText}>{label}</Text>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: Colors.bg },
  inner:         { padding: 20, paddingTop: 56, paddingBottom: 40 },
  avatarArea:    { alignItems: 'center', marginBottom: 24 },
  avatar:        { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 12, shadowColor: Colors.primary, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  avatarImg:     { width: 80, height: 80, borderRadius: 40, marginBottom: 12 },
  avatarEditBadge: { position: 'absolute', bottom: 8, right: -4, width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.white },
  avatarText:    { fontSize: 32, fontWeight: '900', color: Colors.white },
  sugerenciaList: { borderWidth: 1, borderColor: Colors.border, borderRadius: 12, overflow: 'hidden', marginTop: 4, backgroundColor: Colors.white },
  sugerenciaItem: { paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  sugerenciaText: { fontSize: 13, color: Colors.ink, fontWeight: '600' },
  sugerenciaSub:  { fontSize: 11, color: Colors.inkMuted, marginTop: 1 },
  nombre:        { fontSize: 20, fontWeight: '800', color: Colors.ink },
  email:         { fontSize: 13, color: Colors.inkMuted, marginTop: 4 },
  card:          { backgroundColor: Colors.white, borderRadius: 20, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle:     { fontSize: 12, fontWeight: '700', color: Colors.inkMuted, textTransform: 'uppercase', letterSpacing: 1 },
  editLink:      { fontSize: 13, fontWeight: '700', color: Colors.primary },
  row:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  rowLabel:      { fontSize: 13, color: Colors.inkMuted, width: 80 },
  rowValue:      { fontSize: 13, fontWeight: '600', color: Colors.ink, flex: 1, textAlign: 'right' },
  form:          { gap: 2 },
  saveBtn:       { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  saveBtnText:   { color: Colors.white, fontWeight: '800', fontSize: 15 },
  menuItem:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: Colors.border },
  menuText:      { fontSize: 14, color: Colors.ink },
  menuArrow:     { fontSize: 20, color: Colors.inkMuted },
  logoutBtn:     { backgroundColor: '#fee2e2', borderRadius: 16, paddingVertical: 15, alignItems: 'center', marginTop: 4 },
  logoutText:    { color: Colors.bad, fontWeight: '700', fontSize: 15 },
  version:          { textAlign: 'center', color: Colors.inkMuted, fontSize: 11, marginTop: 20 },
  biometricRow:     { flexDirection: 'row', alignItems: 'center', gap: 12 },
  biometricSub:     { fontSize: 12, color: Colors.inkMuted, marginTop: 4, lineHeight: 17 },
  emptyPrompt:      { alignItems: 'center', paddingVertical: 20, gap: 8 },
  emptyPromptEmoji: { fontSize: 36 },
  emptyPromptTitle: { fontSize: 16, fontWeight: '800', color: Colors.ink },
  emptyPromptSub:   { fontSize: 13, color: Colors.inkMuted, textAlign: 'center', lineHeight: 19 },
  emptyPromptBtn:   { marginTop: 8, backgroundColor: Colors.primary, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 12 },
  emptyPromptBtnText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  sosBtn:        { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.bad, borderRadius: 18, padding: 16, marginBottom: 16 },
  sosIcon:       { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  sosTitle:      { fontSize: 15, fontWeight: '900', color: Colors.white },
  sosSub:        { fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  sosBtnLocked:  { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.white, borderRadius: 18, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  sosTitleLocked: { fontSize: 14, fontWeight: '700', color: Colors.inkMuted },
  sosSubLocked:   { fontSize: 11, color: Colors.inkMuted, marginTop: 2 },
  modalOverlay:  { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalSheet:    { backgroundColor: Colors.white, borderRadius: 24, padding: 20 },
  modalHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 10 },
  modalTitle:    { fontSize: 17, fontWeight: '900', color: Colors.ink },
  modalSub:      { fontSize: 12, color: Colors.inkMuted, marginTop: 3, textAlign: 'center' },
  modalLabel:    { fontSize: 12, fontWeight: '700', color: Colors.inkMuted },
  modalEmpty:    { fontSize: 13, color: Colors.inkMuted, textAlign: 'center', backgroundColor: Colors.cream, borderRadius: 14, padding: 14, marginBottom: 16 },
  modalError:    { fontSize: 12, fontWeight: '700', color: Colors.bad, marginBottom: 8, textAlign: 'center' },
  perroOpt:      { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 2, borderColor: Colors.border, borderRadius: 16, padding: 10 },
  perroOptActive: { borderColor: Colors.bad, backgroundColor: Colors.bad + '0d' },
  perroOptImg:   { width: 40, height: 40, borderRadius: 10 },
  perroOptNombre: { fontSize: 13, fontWeight: '700', color: Colors.ink },
  perroOptSub:   { fontSize: 11, color: Colors.inkMuted },
  sosSendBtn:    { backgroundColor: Colors.bad, borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  sosSendBtnText: { color: Colors.white, fontWeight: '800', fontSize: 14 },
  modalCancelBtn: { paddingVertical: 12, alignItems: 'center', marginTop: 8 },
  modalCancelBtnText: { color: Colors.inkMuted, fontWeight: '700', fontSize: 13 },
});
