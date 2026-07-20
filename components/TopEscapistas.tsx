import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Linking } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';

interface Escapista {
  clave: string; perro_id: string | null; nombre: string;
  raza: string | null; color: string | null; tamano: string | null;
  foto: string | null; fugas: number; zona: string;
}

function norm(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
}

function ciudadMatchZona(ciudad: string, zona: string): boolean {
  const c = norm(ciudad), z = norm(zona);
  if (z.includes(c) || c.includes(z)) return true;
  return c.split(/\s+/).filter((w) => w.length > 3).some((p) => z.includes(p));
}

const MEDAL_BG: Record<number, string> = { 0: '#FFD700', 1: '#C0C0C0', 2: '#CD7F32' };
const MEDAL_TXT: Record<number, string> = { 0: '#5a4200', 1: '#3a3a3a', 2: '#ffffff' };

export default function TopEscapistas() {
  const { profile, isPro } = useAuth();
  const ciudad = profile?.ciudad ?? null;
  const [lista, setLista] = useState<Escapista[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function cargar() {
      try {
        const { data: posts } = await supabase
          .from('posts')
          .select('id, perro_id, nombre, zona, raza, color, tamano, images')
          .eq('categoria', 'perdido')
          .order('created_at', { ascending: false })
          .limit(1000);

        if (!posts?.length || cancelled) { setCargando(false); return; }

        let candidatos = posts as any[];
        if (ciudad) {
          const filtrados = candidatos.filter((p) => ciudadMatchZona(ciudad, p.zona ?? ''));
          if (filtrados.length >= 3) candidatos = filtrados;
        }

        const conteo: Record<string, any> = {};
        for (const p of candidatos) {
          if (!p.nombre) continue;
          const clave = p.perro_id ?? `${norm(p.nombre)}|${norm(p.zona ?? '')}`;
          if (!conteo[clave]) {
            conteo[clave] = {
              fugas: 0, zona: p.zona, nombre: p.nombre, raza: p.raza, color: p.color,
              tamano: p.tamano, foto: p.images?.[0] ?? null, perro_id: p.perro_id,
            };
          }
          conteo[clave].fugas++;
        }

        const top10 = Object.entries(conteo).sort((a: any, b: any) => b[1].fugas - a[1].fugas).slice(0, 10);
        if (!top10.length || cancelled) { setCargando(false); return; }

        const perroIds = top10.map(([, v]: any) => v.perro_id).filter(Boolean) as string[];
        let perroFotos: Record<string, string> = {};
        if (perroIds.length) {
          const { data: perros } = await supabase.from('perros_public').select('id, foto_url').in('id', perroIds);
          perroFotos = Object.fromEntries((perros ?? []).filter((p: any) => p.foto_url).map((p: any) => [p.id, p.foto_url]));
        }
        if (cancelled) return;

        const resultado: Escapista[] = top10.map(([clave, v]: any) => ({
          clave, perro_id: v.perro_id, nombre: v.nombre, raza: v.raza, color: v.color, tamano: v.tamano,
          foto: (v.perro_id && perroFotos[v.perro_id]) ? perroFotos[v.perro_id] : v.foto,
          fugas: v.fugas, zona: v.zona,
        }));
        if (!cancelled) setLista(resultado);
      } catch { /* silencioso */ }
      finally { if (!cancelled) setCargando(false); }
    }
    cargar();
    return () => { cancelled = true; };
  }, [ciudad]);

  if (!cargando && lista.length === 0 && isPro) return null;

  const tituloLugar = ciudad ?? 'la comunidad';

  if (!isPro) {
    return (
      <View style={styles.section}>
        <View style={styles.pill}><Text style={styles.pillText}>⚠️ Ranking</Text></View>
        <Text style={styles.title}>Los más escapistas 🏃</Text>
        <TouchableOpacity style={styles.lockedBox} onPress={() => Linking.openURL('https://www.mivecindog.com.ar/planes')}>
          <Text style={{ fontSize: 24 }}>🔒</Text>
          <Text style={styles.lockedText}>Función exclusiva de VecindogPro</Text>
          <View style={styles.lockedBtn}><Text style={styles.lockedBtnText}>✨ Ver planes</Text></View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.pill}><Text style={styles.pillText}>⚠️ Ranking</Text></View>
      <Text style={styles.title}>Los más escapistas 🏃</Text>
      <Text style={styles.sub}>Los perros con más avisos de pérdida en {tituloLugar}.</Text>

      {cargando ? (
        <ActivityIndicator color={Colors.primary} style={{ marginVertical: 12 }} />
      ) : (
        <View style={{ gap: 8, marginTop: 10 }}>
          {lista.map((p, i) => (
            <View key={p.clave} style={styles.card}>
              <View style={[styles.medal, { backgroundColor: MEDAL_BG[i] ?? Colors.cream }]}>
                <Text style={[styles.medalText, { color: MEDAL_TXT[i] ?? Colors.inkMuted }]}>{i + 1}</Text>
              </View>
              {p.foto ? <Image source={{ uri: p.foto }} style={styles.thumb} /> : (
                <View style={[styles.thumb, { alignItems: 'center', justifyContent: 'center' }]}><Text>🐶</Text></View>
              )}
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.nombre} numberOfLines={1}>{p.nombre}</Text>
                <Text style={styles.detalle} numberOfLines={1}>
                  {[p.raza, p.color, p.tamano].filter(Boolean).join(' · ')}{p.zona ? ` · 📍 ${p.zona}` : ''}
                </Text>
              </View>
              <View style={styles.fugasBadge}>
                <Text style={styles.fugasText}>{p.fugas} {p.fugas === 1 ? 'fuga' : 'fugas'}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section:    { marginBottom: 24 },
  pill:       { alignSelf: 'flex-start', backgroundColor: '#fff3cd', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  pillText:   { fontSize: 11, fontWeight: '800', color: '#8a5a00' },
  title:      { fontSize: 20, fontWeight: '900', color: Colors.ink, marginTop: 6 },
  sub:        { fontSize: 12, color: Colors.inkMuted, marginTop: 2 },
  card:       { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.white, borderRadius: 16, padding: 10, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  medal:      { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  medalText:  { fontSize: 13, fontWeight: '900' },
  thumb:      { width: 44, height: 44, borderRadius: 10, backgroundColor: Colors.cream },
  nombre:     { fontSize: 14, fontWeight: '800', color: Colors.ink },
  detalle:    { fontSize: 11, color: Colors.inkMuted, marginTop: 1 },
  fugasBadge: { backgroundColor: Colors.bad + '1a', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  fugasText:  { fontSize: 11, fontWeight: '800', color: Colors.bad },
  lockedBox:  { alignItems: 'center', gap: 8, backgroundColor: Colors.white, borderRadius: 20, padding: 24, marginTop: 10 },
  lockedText: { fontSize: 12, color: Colors.inkMuted },
  lockedBtn:  { backgroundColor: Colors.primary, borderRadius: 20, paddingHorizontal: 18, paddingVertical: 10, marginTop: 4 },
  lockedBtnText: { color: Colors.white, fontWeight: '800', fontSize: 13 },
});
