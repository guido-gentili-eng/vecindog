import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
  ActivityIndicator, Alert, Linking, Share, Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import {
  listarEstudios, subirArchivoEstudio, agregarEstudio, eliminarEstudio,
  type Estudio, type TipoEstudio,
} from '@/lib/estudios';
import { Colors } from '@/constants/colors';

interface Perro {
  id: string; nombre: string; raza?: string; color?: string;
  tamano?: string; sexo?: string; fecha_nac?: string; chip?: string;
  esterilizado?: boolean; descripcion?: string; foto_url?: string;
}
interface Vacuna {
  id: string; nombre: string; fecha: string; veterinario?: string; proxima?: string;
}

const SECCIONES: { tipo: TipoEstudio; titulo: string; emoji: string; aceptaArchivos: boolean }[] = [
  { tipo: 'laboratorio',              titulo: 'Análisis de Laboratorio',    emoji: '🧪', aceptaArchivos: true },
  { tipo: 'radiografia',              titulo: 'Radiografías',               emoji: '📡', aceptaArchivos: true },
  { tipo: 'ecografia',                titulo: 'Ecografías',                 emoji: '📈', aceptaArchivos: true },
  { tipo: 'certificado_chip',         titulo: 'Certificado de Chip',        emoji: '💾', aceptaArchivos: true },
  { tipo: 'certificado_cvi',          titulo: 'Certificado CVI',            emoji: '📋', aceptaArchivos: true },
  { tipo: 'certificado_antiparasitario', titulo: 'Certificado Antiparasitario', emoji: '💊', aceptaArchivos: true },
  { tipo: 'vacuna_antirrabica',       titulo: 'Vacuna Antirrábica',         emoji: '💉', aceptaArchivos: true },
  { tipo: 'airtag',                   titulo: 'AirTag / Rastreador',        emoji: '📍', aceptaArchivos: false },
];

function fmt(iso: string) {
  if (!iso) return '—';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}

export default function PerroDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [perro,    setPerro]    = useState<Perro | null>(null);
  const [vacunas,  setVacunas]  = useState<Vacuna[]>([]);
  const [estudios, setEstudios] = useState<Estudio[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [subiendo, setSubiendo] = useState<TipoEstudio | null>(null);

  const cargar = useCallback(async () => {
    const [{ data: p }, { data: v }, e] = await Promise.all([
      supabase.from('perros').select('*').eq('id', id).single(),
      supabase.from('vacunas').select('*').eq('perro_id', id).order('fecha', { ascending: false }),
      listarEstudios(id),
    ]);
    setPerro(p);
    setVacunas(v ?? []);
    setEstudios(e);
    setLoading(false);
  }, [id]);

  useEffect(() => { cargar(); }, [cargar]);

  async function subirArchivo(tipo: TipoEstudio) {
    try {
      let uri = '';
      let nombre = '';

      if (tipo === 'ecografia' || tipo === 'radiografia') {
        // Permitir foto/video/doc
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images', 'videos'],
          quality: 0.8,
        });
        if (result.canceled) return;
        uri    = result.assets[0].uri;
        nombre = result.assets[0].fileName ?? `${tipo}-${Date.now()}.jpg`;
      } else {
        // PDF u otro documento
        const result = await DocumentPicker.getDocumentAsync({
          type: ['application/pdf', 'image/*'],
          copyToCacheDirectory: true,
        });
        if (result.canceled) return;
        uri    = result.assets[0].uri;
        nombre = result.assets[0].name;
      }

      setSubiendo(tipo);
      const url   = await subirArchivoEstudio(uri, nombre);
      const nuevo = await agregarEstudio({
        perro_id:    id,
        tipo,
        nombre,
        archivo_url: url,
        fecha:       new Date().toISOString().slice(0, 10),
        notas:       null,
      });
      setEstudios((prev) => [nuevo, ...prev]);
      Alert.alert('✅ Archivo subido', `${nombre} agregado correctamente.`);
    } catch (e) {
      Alert.alert('Error', 'No se pudo subir el archivo. Verificá tu conexión.');
    } finally {
      setSubiendo(null);
    }
  }

  async function agregarAirtag() {
    Alert.prompt?.(
      'AirTag / Rastreador',
      'Ingresá el número de serie o código del rastreador',
      async (texto) => {
        if (!texto?.trim()) return;
        const nuevo = await agregarEstudio({
          perro_id:    id,
          tipo:        'airtag',
          nombre:      texto.trim(),
          archivo_url: null,
          fecha:       new Date().toISOString().slice(0, 10),
          notas:       null,
        });
        setEstudios((prev) => [nuevo, ...prev]);
      }
    ) ?? Alert.alert('AirTag', 'Función disponible en iPhone');
  }

  async function compartirHistoria() {
    const url = `https://www.mivecindog.com.ar/historia/${id}`;
    await Share.share({
      message: `Historia Clínica de ${perro?.nombre ?? 'mi perro'} 🐾\n${url}`,
      url,
      title:   `Historia Clínica de ${perro?.nombre}`,
    });
  }

  async function borrarEstudio(estudio: Estudio) {
    Alert.alert(
      'Eliminar archivo',
      `¿Borrar "${estudio.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar', style: 'destructive',
          onPress: async () => {
            await eliminarEstudio(estudio.id);
            setEstudios((prev) => prev.filter((e) => e.id !== estudio.id));
          },
        },
      ]
    );
  }

  if (loading) return <ActivityIndicator color={Colors.primary} style={{ flex: 1, marginTop: 80 }} size="large" />;
  if (!perro)  return <Text style={{ textAlign: 'center', marginTop: 80 }}>Perro no encontrado</Text>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>

      {/* Header del perro */}
      <View style={styles.header}>
        {perro.foto_url
          ? <Image source={{ uri: perro.foto_url }} style={styles.foto} />
          : <View style={[styles.foto, styles.fotoPlaceholder]}><Text style={{ fontSize: 48 }}>🐶</Text></View>
        }
        <View style={styles.headerInfo}>
          <Text style={styles.nombre}>{perro.nombre}</Text>
          <Text style={styles.sub}>
            {[perro.raza, perro.color, perro.tamano, perro.sexo].filter(Boolean).join(' · ')}
          </Text>
          {perro.chip && <Text style={styles.chip}>💾 Chip: {perro.chip}</Text>}
        </View>
      </View>

      {/* Botón Historia Clínica */}
      <TouchableOpacity style={styles.historiaBtn} onPress={compartirHistoria}>
        <Text style={styles.historiaBtnText}>📤  Compartir Historia Clínica</Text>
      </TouchableOpacity>

      {/* Vacunas */}
      <View style={styles.seccion}>
        <Text style={styles.seccionTitulo}>💉  Carnet de Vacunas</Text>
        {vacunas.length === 0
          ? <EmptyRow />
          : vacunas.map((v) => (
              <View key={v.id} style={styles.item}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemNombre}>{v.nombre}</Text>
                  {v.veterinario && <Text style={styles.itemSub}>{v.veterinario}</Text>}
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.itemFecha}>{fmt(v.fecha)}</Text>
                  {v.proxima && (
                    <Text style={[styles.itemFecha, { color: new Date(v.proxima) < new Date() ? Colors.bad : Colors.good }]}>
                      Próx: {fmt(v.proxima)}
                    </Text>
                  )}
                </View>
              </View>
            ))
        }
      </View>

      {/* Secciones de estudios */}
      {SECCIONES.map(({ tipo, titulo, emoji, aceptaArchivos }) => {
        const items = estudios.filter((e) => e.tipo === tipo);
        return (
          <View key={tipo} style={styles.seccion}>
            <View style={styles.seccionHeader}>
              <Text style={styles.seccionTitulo}>{emoji}  {titulo}</Text>
              <TouchableOpacity
                style={[styles.subirBtn, subiendo === tipo && styles.subirBtnDisabled]}
                onPress={() => aceptaArchivos ? subirArchivo(tipo) : agregarAirtag()}
                disabled={subiendo !== null}
              >
                {subiendo === tipo
                  ? <ActivityIndicator color={Colors.primary} size="small" />
                  : <Text style={styles.subirBtnText}>{aceptaArchivos ? '+ Subir' : '+ Agregar'}</Text>
                }
              </TouchableOpacity>
            </View>

            {items.length === 0
              ? <EmptyRow />
              : items.map((e) => (
                  <View key={e.id} style={styles.item}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemNombre} numberOfLines={1}>{e.nombre}</Text>
                      {e.fecha && <Text style={styles.itemSub}>{fmt(e.fecha)}</Text>}
                    </View>
                    <View style={styles.itemActions}>
                      {e.archivo_url && (
                        <TouchableOpacity
                          style={styles.verBtn}
                          onPress={() => Linking.openURL(e.archivo_url!)}
                        >
                          <Text style={styles.verBtnText}>Ver</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity onPress={() => borrarEstudio(e)}>
                        <Text style={styles.borrarBtn}>🗑</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
            }
          </View>
        );
      })}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function EmptyRow() {
  return (
    <View style={styles.emptyRow}>
      <Text style={styles.emptyRowText}>✗  Sin datos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:         { flex: 1, backgroundColor: Colors.bg },
  inner:             { padding: 16, paddingTop: 8 },
  header:            { flexDirection: 'row', gap: 14, alignItems: 'center', backgroundColor: Colors.white, borderRadius: 20, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  foto:              { width: 80, height: 80, borderRadius: 16 },
  fotoPlaceholder:   { backgroundColor: Colors.cream, alignItems: 'center', justifyContent: 'center' },
  headerInfo:        { flex: 1 },
  nombre:            { fontSize: 20, fontWeight: '900', color: Colors.ink },
  sub:               { fontSize: 13, color: Colors.inkMuted, marginTop: 2 },
  chip:              { fontSize: 11, color: Colors.primary, marginTop: 4, fontWeight: '700' },
  historiaBtn:       { backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 13, alignItems: 'center', marginBottom: 16 },
  historiaBtnText:   { color: Colors.white, fontWeight: '800', fontSize: 15 },
  seccion:           { backgroundColor: Colors.white, borderRadius: 18, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  seccionHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  seccionTitulo:     { fontSize: 13, fontWeight: '800', color: Colors.ink },
  subirBtn:          { backgroundColor: Colors.primary + '20', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  subirBtnDisabled:  { opacity: 0.5 },
  subirBtnText:      { fontSize: 12, fontWeight: '800', color: Colors.primary },
  item:              { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  itemNombre:        { fontSize: 14, fontWeight: '600', color: Colors.ink, maxWidth: 180 },
  itemSub:           { fontSize: 11, color: Colors.inkMuted, marginTop: 2 },
  itemFecha:         { fontSize: 11, color: Colors.inkMuted, fontWeight: '600' },
  itemActions:       { flexDirection: 'row', alignItems: 'center', gap: 10 },
  verBtn:            { backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  verBtnText:        { color: Colors.white, fontSize: 12, fontWeight: '700' },
  borrarBtn:         { fontSize: 18 },
  emptyRow:          { paddingVertical: 10 },
  emptyRowText:      { fontSize: 13, color: Colors.inkMuted + '80', fontWeight: '600' },
});
