import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, Linking, TextInput,
  ActivityIndicator, Switch,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';

export default function PerfilScreen() {
  const { user, profile, signOut, saveProfile } = useAuth();
  const [editando,   setEditando]   = useState(false);
  const [saving,     setSaving]     = useState(false);

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

  async function guardar() {
    if (!nombre.trim() || !apellido.trim()) {
      Alert.alert('Campos requeridos', 'Ingresá nombre y apellido');
      return;
    }
    setSaving(true);
    const err = await saveProfile({ nombre, apellido, telefono, ciudad, provincia, pais, direccion });
    setSaving(false);
    if (err) { Alert.alert('Error', err); return; }
    setEditando(false);
    Alert.alert('✅ Guardado', 'Tu perfil fue actualizado.');
  }

  async function handleSignOut() {
    Alert.alert('Cerrar sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: () => signOut() },
    ]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>

      {/* Avatar */}
      <View style={styles.avatarArea}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{inicial}</Text>
        </View>
        <Text style={styles.nombre}>
          {profile ? `${profile.nombre} ${profile.apellido}` : user?.email}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* Datos personales */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Datos personales</Text>
          {!editando ? (
            <TouchableOpacity onPress={iniciarEdicion}>
              <Text style={styles.editLink}>✏️ Editar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setEditando(false)}>
              <Text style={[styles.editLink, { color: Colors.bad }]}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>

        {editando ? (
          <View style={styles.form}>
            <Field label="Nombre *"    value={nombre}    onChange={setNombre}    placeholder="Nombre" />
            <Field label="Apellido *"  value={apellido}  onChange={setApellido}  placeholder="Apellido" />
            <Field label="Teléfono"    value={telefono}  onChange={setTelefono}  placeholder="+54 9 291..." keyboardType="phone-pad" />
            <Field label="Ciudad"      value={ciudad}    onChange={setCiudad}    placeholder="Bahía Blanca" />
            <Field label="Provincia"   value={provincia} onChange={setProvincia} placeholder="Buenos Aires" />
            <Field label="País"        value={pais}      onChange={setPais}      placeholder="Argentina" />
            <Field label="Dirección"   value={direccion} onChange={setDireccion} placeholder="Calle 123" />

            <TouchableOpacity
              style={[styles.saveBtn, saving && { opacity: 0.6 }]}
              onPress={guardar}
              disabled={saving}
            >
              {saving
                ? <ActivityIndicator color={Colors.white} />
                : <Text style={styles.saveBtnText}>Guardar cambios</Text>
              }
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {[
              ['Nombre',    profile ? `${profile.nombre} ${profile.apellido}` : '—'],
              ['Teléfono',  profile?.telefono  || '—'],
              ['Ciudad',    profile?.ciudad    || '—'],
              ['Provincia', profile?.provincia || '—'],
              ['País',      profile?.pais      || '—'],
              ['Dirección', profile?.direccion || '—'],
            ].map(([label, value]) => (
              <View key={label} style={styles.row}>
                <Text style={styles.rowLabel}>{label}</Text>
                <Text style={styles.rowValue} numberOfLines={1}>{value}</Text>
              </View>
            ))}
          </>
        )}
      </View>

      {/* Links */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Vecindog</Text>
        <MenuItem
          label="🗺️  Ver mis avisos publicados"
          onPress={() => router.push('/(tabs)/avisos')}
        />
        <MenuItem
          label="🌐  Abrir versión web"
          onPress={() => Linking.openURL('https://www.mivecindog.com.ar')}
        />
        <MenuItem
          label="📄  Términos y Condiciones"
          onPress={() => Linking.openURL('https://www.mivecindog.com.ar/terminos')}
        />
        <MenuItem
          label="🔒  Política de Privacidad"
          onPress={() => Linking.openURL('https://www.mivecindog.com.ar/privacidad')}
          last
        />
      </View>

      {/* Cerrar sesión */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleSignOut}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Vecindog v1.0.0 · mivecindog.com.ar</Text>
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
  avatarText:    { fontSize: 32, fontWeight: '900', color: Colors.white },
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
  version:       { textAlign: 'center', color: Colors.inkMuted, fontSize: 11, marginTop: 20 },
});
