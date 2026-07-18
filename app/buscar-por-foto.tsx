import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
  ActivityIndicator, Alert, Linking,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';
import CategoriaDot from '@/components/CategoriaDot';

const COLORES = [
  'Negro', 'Blanco', 'Marrón', 'Caramelo', 'Dorado',
  'Gris', 'Atigrado', 'Tricolor', 'Manchado', 'Canela',
];
const TAMANOS = ['pequeño', 'mediano', 'grande'] as const;
type Tamano = typeof TAMANOS[number] | '';

interface Post {
  id: string; nombre: string | null; raza: string | null; color: string | null;
  tamano: string | null; zona: string | null; ciudad: string | null;
  images: string[] | null; categoria: string; created_at: string;
}
interface PostConScore { post: Post; score: number; matches: string[] }

function normalizar(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
}
function textosCoinciden(a: string, b: string) {
  const na = normalizar(a), nb = normalizar(b);
  return !!na && !!nb && (na === nb || na.includes(nb) || nb.includes(na));
}

function calcularScore(post: Post, color: string, raza: string, tamano: Tamano): PostConScore {
  let score = 0, maxPosible = 0;
  const matches: string[] = [];

  if (color) {
    maxPosible += 30;
    if (post.color && textosCoinciden(color, post.color)) { score += 30; matches.push(`Color: ${post.color}`); }
  }
  if (raza) {
    maxPosible += 30;
    if (post.raza && textosCoinciden(raza, post.raza)) { score += 30; matches.push(`Raza: ${post.raza}`); }
  }
  if (tamano) {
    maxPosible += 15;
    if (post.tamano === tamano) { score += 15; matches.push(`Tamaño: ${post.tamano}`); }
    else if (post.tamano) { score = Math.max(0, score - 8); }
  }

  const pct = maxPosible > 0 ? Math.round((score / maxPosible) * 100) : 0;
  return { post, score: pct, matches };
}

export default function BuscarPorFotoScreen() {
  const { session, isPro } = useAuth();
  const [foto,       setFoto]       = useState<string | null>(null);
  const [analizando, setAnalizando] = useState(false);
  const [color,   setColor]   = useState('');
  const [raza,    setRaza]    = useState('');
  const [tamano,  setTamano]  = useState<Tamano>('');
  const [descripcionIA, setDescripcionIA] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [resultados, setResultados] = useState<PostConScore[] | null>(null);

  async function elegirFoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 0.7 });
    if (result.canceled) return;
    const uri = result.assets[0].uri;
    setFoto(uri);
    setResultados(null);
    await analizarFoto(uri);
  }

  async function analizarFoto(uri: string) {
    if (!session?.access_token) {
      Alert.alert('Iniciá sesión', 'Necesitás estar logueado para usar esta función.');
      return;
    }
    setAnalizando(true);
    try {
      const nombre = uri.split('/').pop() || 'foto.jpg';
      const ext = nombre.split('.').pop()?.toLowerCase();
      const tipo = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

      const form = new FormData();
      form.append('foto', { uri, name: nombre, type: tipo } as any);

      const res = await fetch('https://www.mivecindog.com.ar/api/analizar-foto', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.access_token}` },
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Error al analizar la foto');
      if (data.error) { Alert.alert('No se pudo analizar', data.error); return; }

      if (data.color)  setColor(data.color);
      if (data.raza)   setRaza(data.raza);
      if (data.tamano) setTamano(data.tamano);
      if (data.descripcion) setDescripcionIA(data.descripcion);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'No se pudo analizar la foto. Verificá tu conexión.');
    } finally {
      setAnalizando(false);
    }
  }

  async function buscar() {
    setBuscando(true);
    setResultados(null);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('id, nombre, raza, color, tamano, zona, ciudad, images, categoria, created_at')
        .in('categoria', ['perdido', 'encontrado'])
        .neq('estado', 'resuelto')
        .order('created_at', { ascending: false })
        .limit(500);
      if (error) throw error;

      const conScore = (data ?? [])
        .map((p) => calcularScore(p as Post, color, raza, tamano))
        .filter((r) => r.score >= 30)
        .sort((a, b) => b.score - a.score);

      setResultados(conScore);
    } catch {
      Alert.alert('Error', 'No se pudo buscar. Verificá tu conexión.');
    } finally {
      setBuscando(false);
    }
  }

  if (!isPro) {
    return (
      <View style={styles.lockedContainer}>
        <Text style={{ fontSize: 48 }}>✨</Text>
        <Text style={styles.lockedTitle}>Función de VecindogPro</Text>
        <Text style={styles.lockedSub}>
          Buscar por foto usa inteligencia artificial para analizar la foto de un perro y compararla
          con los avisos activos de la comunidad.
        </Text>
        <TouchableOpacity style={styles.lockedBtn} onPress={() => Linking.openURL('https://www.mivecindog.com.ar/planes')}>
          <Text style={styles.lockedBtnText}>Ver planes</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      <Text style={styles.subtitulo}>
        Subí una foto del perro y la IA va a sugerir color, raza y tamaño para buscarlo entre los avisos activos.
      </Text>

      <TouchableOpacity style={styles.fotoBox} onPress={elegirFoto} disabled={analizando}>
        {foto ? (
          <Image source={{ uri: foto }} style={styles.foto} />
        ) : (
          <>
            <Text style={{ fontSize: 32 }}>📷</Text>
            <Text style={styles.fotoBoxText}>Elegir foto</Text>
          </>
        )}
        {analizando && (
          <View style={styles.fotoOverlay}>
            <ActivityIndicator color={Colors.white} size="large" />
            <Text style={styles.fotoOverlayText}>Analizando con IA…</Text>
          </View>
        )}
      </TouchableOpacity>

      {descripcionIA ? <Text style={styles.descripcionIA}>🐾 {descripcionIA}</Text> : null}

      {foto && !analizando && (
        <>
          <Text style={styles.label}>Color</Text>
          <View style={styles.chipsRow}>
            {COLORES.map((c) => (
              <TouchableOpacity key={c} style={[styles.chip, color === c && styles.chipActive]} onPress={() => setColor(color === c ? '' : c)}>
                <Text style={[styles.chipText, color === c && styles.chipTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Tamaño</Text>
          <View style={styles.chipsRow}>
            {TAMANOS.map((t) => (
              <TouchableOpacity key={t} style={[styles.chip, tamano === t && styles.chipActive]} onPress={() => setTamano(tamano === t ? '' : t)}>
                <Text style={[styles.chipText, tamano === t && styles.chipTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Raza (opcional)</Text>
          <TouchableOpacity style={styles.razaBox} onPress={() => Alert.prompt?.('Raza', 'Ingresá la raza', (t) => setRaza(t ?? ''), 'plain-text', raza)}>
            <Text style={{ color: raza ? Colors.ink : Colors.inkMuted }}>{raza || 'Tocá para escribir la raza'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buscarBtn} onPress={buscar} disabled={buscando}>
            {buscando ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.buscarBtnText}>🔍  Buscar en avisos activos</Text>}
          </TouchableOpacity>
        </>
      )}

      {resultados !== null && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.resultadosTitulo}>
            {resultados.length === 0 ? 'No encontramos coincidencias' : `${resultados.length} posible${resultados.length > 1 ? 's' : ''} coincidencia${resultados.length > 1 ? 's' : ''}`}
          </Text>
          {resultados.map(({ post, score, matches }) => (
            <TouchableOpacity key={post.id} style={styles.resultCard} onPress={() => router.push(`/publicaciones/${post.id}`)}>
              {post.images?.[0]
                ? <Image source={{ uri: post.images[0] }} style={styles.resultImg} />
                : <View style={[styles.resultImg, styles.resultImgEmpty]}><Text style={{ fontSize: 28 }}>🐶</Text></View>
              }
              <View style={{ flex: 1 }}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultNombre}>{post.nombre || 'Sin nombre'}</Text>
                  <View style={styles.scoreBadge}><Text style={styles.scoreBadgeText}>{score}%</Text></View>
                </View>
                <View style={styles.resultSubRow}>
                  <CategoriaDot categoria={post.categoria} size={8} />
                  <Text style={styles.resultSub}>{post.categoria === 'perdido' ? 'Perdido' : 'Encontrado'} · {post.zona || post.ciudad || '—'}</Text>
                </View>
                {matches.length > 0 && <Text style={styles.resultMatches}>{matches.join(' · ')}</Text>}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: Colors.bg },
  inner:           { padding: 16, paddingBottom: 40 },
  subtitulo:       { fontSize: 13, color: Colors.inkMuted, marginBottom: 16, lineHeight: 18 },
  fotoBox:         { height: 200, borderRadius: 20, borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white, overflow: 'hidden' },
  foto:            { width: '100%', height: '100%' },
  fotoBoxText:     { marginTop: 8, fontSize: 13, fontWeight: '700', color: Colors.inkMuted },
  fotoOverlay:      { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center', gap: 8 },
  fotoOverlayText: { color: Colors.white, fontWeight: '700', fontSize: 13 },
  descripcionIA:   { marginTop: 12, fontSize: 13, color: Colors.ink, backgroundColor: Colors.cream, borderRadius: 12, padding: 12, fontStyle: 'italic' },
  label:           { fontSize: 12, fontWeight: '800', color: Colors.inkMuted, marginTop: 18, marginBottom: 8, textTransform: 'uppercase' },
  chipsRow:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip:            { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border },
  chipActive:      { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText:        { fontSize: 13, fontWeight: '600', color: Colors.inkMuted, textTransform: 'capitalize' },
  chipTextActive:  { color: Colors.white },
  razaBox:         { backgroundColor: Colors.white, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 12 },
  buscarBtn:       { backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginTop: 22 },
  buscarBtnText:   { color: Colors.white, fontWeight: '800', fontSize: 14 },
  resultadosTitulo: { fontSize: 14, fontWeight: '800', color: Colors.ink, marginBottom: 10 },
  resultCard:      { flexDirection: 'row', gap: 12, backgroundColor: Colors.white, borderRadius: 16, padding: 10, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 },
  resultImg:       { width: 64, height: 64, borderRadius: 12 },
  resultImgEmpty:  { backgroundColor: Colors.cream, alignItems: 'center', justifyContent: 'center' },
  resultHeader:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resultNombre:    { fontSize: 14, fontWeight: '800', color: Colors.ink, flex: 1 },
  scoreBadge:      { backgroundColor: Colors.primary + '20', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  scoreBadgeText:  { fontSize: 11, fontWeight: '800', color: Colors.primary },
  resultSubRow:    { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  resultSub:       { fontSize: 11, color: Colors.inkMuted },
  resultMatches:   { fontSize: 10, color: Colors.inkMuted, marginTop: 3, fontStyle: 'italic' },
  lockedContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 10, backgroundColor: Colors.bg },
  lockedTitle:     { fontSize: 18, fontWeight: '800', color: Colors.ink },
  lockedSub:       { fontSize: 13, color: Colors.inkMuted, textAlign: 'center', lineHeight: 19 },
  lockedBtn:       { backgroundColor: Colors.primary, borderRadius: 14, paddingHorizontal: 28, paddingVertical: 12, marginTop: 10 },
  lockedBtnText:   { color: Colors.white, fontWeight: '800', fontSize: 14 },
});
