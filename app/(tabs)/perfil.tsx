import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, Linking,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';

export default function PerfilScreen() {
  const { user, profile, signOut } = useAuth();

  async function handleSignOut() {
    Alert.alert('Cerrar sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: () => signOut() },
    ]);
  }

  const inicial = profile?.nombre?.charAt(0)?.toUpperCase() ?? user?.email?.charAt(0)?.toUpperCase() ?? '?';

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

      {/* Datos */}
      {profile && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Datos personales</Text>
          {[
            ['Teléfono',  profile.telefono],
            ['Ciudad',    profile.ciudad],
            ['Provincia', profile.provincia],
            ['País',      profile.pais],
            ['Dirección', profile.direccion],
          ].filter(([, v]) => v).map(([label, value]) => (
            <View key={label as string} style={styles.row}>
              <Text style={styles.rowLabel}>{label}</Text>
              <Text style={styles.rowValue}>{value}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Links */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>App</Text>
        <TouchableOpacity style={styles.menuItem} onPress={() => Linking.openURL('https://www.mivecindog.com.ar')}>
          <Text style={styles.menuText}>🌐  Abrir versión web</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => Linking.openURL('https://www.mivecindog.com.ar/terminos')}>
          <Text style={styles.menuText}>📄  Términos y Condiciones</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => Linking.openURL('https://www.mivecindog.com.ar/privacidad')}>
          <Text style={styles.menuText}>🔒  Política de Privacidad</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Salir */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleSignOut}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Vecindog v1.0.0 · mivecindog.com.ar</Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: Colors.bg },
  inner:       { padding: 20, paddingTop: 56, paddingBottom: 40 },
  avatarArea:  { alignItems: 'center', marginBottom: 28 },
  avatar:      { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText:  { fontSize: 32, fontWeight: '900', color: Colors.white },
  nombre:      { fontSize: 22, fontWeight: '800', color: Colors.ink },
  email:       { fontSize: 13, color: Colors.inkMuted, marginTop: 4 },
  card:        { backgroundColor: Colors.white, borderRadius: 20, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  cardTitle:   { fontSize: 12, fontWeight: '700', color: Colors.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  row:         { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  rowLabel:    { fontSize: 13, color: Colors.inkMuted },
  rowValue:    { fontSize: 13, fontWeight: '600', color: Colors.ink, flex: 1, textAlign: 'right' },
  menuItem:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  menuText:    { fontSize: 14, color: Colors.ink },
  menuArrow:   { fontSize: 20, color: Colors.inkMuted },
  logoutBtn:   { backgroundColor: '#fee2e2', borderRadius: 16, paddingVertical: 15, alignItems: 'center', marginTop: 8 },
  logoutText:  { color: Colors.bad, fontWeight: '700', fontSize: 15 },
  version:     { textAlign: 'center', color: Colors.inkMuted, fontSize: 11, marginTop: 20 },
});
