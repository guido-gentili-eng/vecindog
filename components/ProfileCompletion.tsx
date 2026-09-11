import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/colors';
import type { Vacuna } from '@/lib/vacunas';
import type { Estudio } from '@/lib/estudios';
import type { Peso } from '@/lib/pesos';
import type { ContactoEmergencia } from '@/lib/contactosEmergencia';

interface PerroChecklist {
  id: string;
  nombre: string;
  foto_url?: string;
  raza?: string;
  color?: string;
  fecha_nac?: string;
  chip?: string;
  vet_nombre?: string | null;
  vet_telefono?: string | null;
}

interface Props {
  perro: PerroChecklist;
  vacunas: Vacuna[];
  estudios: Estudio[];
  pesos: Peso[];
  contactos: ContactoEmergencia[];
  dataLoaded: boolean;
}

interface CheckItem {
  key: string;
  label: string;
  done: boolean;
  opcional?: boolean;
  skipKey?: string;
}

function buildChecklist(
  perro: PerroChecklist,
  vacunas: Vacuna[],
  estudios: Estudio[],
  pesos: Peso[],
  contactos: ContactoEmergencia[],
  skipped: Set<string>,
): CheckItem[] {
  return [
    { key: 'foto',      label: 'Foto de perfil',             done: !!perro.foto_url },
    { key: 'raza',      label: 'Raza',                       done: !!perro.raza },
    { key: 'color',     label: 'Color',                      done: !!perro.color },
    { key: 'fecha_nac', label: 'Fecha de nacimiento',        done: !!perro.fecha_nac },
    { key: 'chip',      label: 'Número de chip',             done: !!perro.chip },
    { key: 'vet',       label: 'Datos del veterinario',      done: !!(perro.vet_nombre || perro.vet_telefono) },
    { key: 'vacunas',   label: 'Vacunas registradas',        done: vacunas.length > 0 },
    { key: 'peso',      label: 'Peso registrado',            done: pesos.length > 0 },
    { key: 'contacto',  label: 'Contacto de emergencia',     done: contactos.length > 0 },
    {
      key: 'laboratorio',
      label: 'Análisis de sangre',
      done: estudios.some((e) => e.tipo === 'laboratorio') || skipped.has('laboratorio'),
      opcional: true,
      skipKey: 'laboratorio',
    },
  ];
}

// "visto en esta sesión" — en memoria, se reinicia solo al reabrir la app (equivalente a sessionStorage en la web)
const vistoEnEstaSesion = new Set<string>();
const skipPrefix = 'perro_skip_';

export default function ProfileCompletion({ perro, vacunas, estudios, pesos, contactos, dataLoaded }: Props) {
  const [visible,   setVisible]   = useState(false);
  const [skipped,   setSkipped]   = useState<Set<string>>(new Set());
  const [dismissed, setDismissed] = useState(false);
  const cargado = useRef(false);

  useEffect(() => {
    if (!dataLoaded || cargado.current) return;
    cargado.current = true;
    if (vistoEnEstaSesion.has(perro.id)) return;

    (async () => {
      const val = await AsyncStorage.getItem(`${skipPrefix}laboratorio_${perro.id}`);
      const savedSkips = new Set<string>(val === '1' ? ['laboratorio'] : []);
      setSkipped(savedSkips);
      const items = buildChecklist(perro, vacunas, estudios, pesos, contactos, savedSkips);
      if (!items.every((i) => i.done)) setVisible(true);
    })();
  }, [dataLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  function dismiss() {
    vistoEnEstaSesion.add(perro.id);
    setVisible(false);
    setDismissed(true);
  }

  function skipItem(skipKey: string) {
    AsyncStorage.setItem(`${skipPrefix}${skipKey}_${perro.id}`, '1');
    setSkipped((prev) => new Set([...prev, skipKey]));
  }

  const items    = buildChecklist(perro, vacunas, estudios, pesos, contactos, skipped);
  const done     = items.filter((i) => i.done).length;
  const total    = items.length;
  const pct      = Math.round((done / total) * 100);
  const allDone  = done === total;

  if (!visible && dismissed) return null;

  if (!visible) {
    if (allDone) {
      return (
        <View style={styles.badgeDone}>
          <Text style={styles.badgeDoneText}>✓  Perfil completo 🎉</Text>
        </View>
      );
    }
    return (
      <TouchableOpacity style={styles.badgeProgress} onPress={() => setVisible(true)}>
        <View style={{ flex: 1 }}>
          <View style={styles.badgeProgressRow}>
            <Text style={styles.badgeProgressLabel}>Completar perfil</Text>
            <Text style={styles.badgeProgressPct}>{pct}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${pct}%` }]} />
          </View>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
    );
  }

  const pending = items.filter((i) => !i.done);

  return (
    <Modal visible transparent animationType="slide" onRequestClose={dismiss}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>
                {allDone ? 'Perfil completo 🎉' : `Completá el perfil de ${perro.nombre}`}
              </Text>
              <Text style={styles.subtitle}>{done} de {total} secciones completas</Text>
            </View>
            <TouchableOpacity onPress={dismiss} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.progressTrackBig}>
            <View style={[styles.progressFillBig, { width: `${pct}%` }]} />
          </View>

          <ScrollView style={{ maxHeight: 340 }}>
            {allDone ? (
              <View style={styles.allDoneBox}>
                <Text style={{ fontSize: 40 }}>🐕</Text>
                <Text style={styles.allDoneText}>
                  ¡Excelente! Completaste todos los datos de {perro.nombre}. Tu perfil está al 100%.
                </Text>
              </View>
            ) : (
              <>
                {pending.map((item) => (
                  <View key={item.key} style={styles.itemRow}>
                    <View style={styles.itemDot} />
                    <Text style={styles.itemLabel}>{item.label}</Text>
                    {item.opcional && item.skipKey && !skipped.has(item.skipKey) && (
                      <TouchableOpacity onPress={() => skipItem(item.skipKey!)} style={styles.skipBtn}>
                        <Text style={styles.skipBtnText}>No tengo</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                {items.filter((i) => i.done).map((item) => (
                  <View key={item.key} style={[styles.itemRow, { opacity: 0.5 }]}>
                    <Text style={styles.itemDoneCheck}>✓</Text>
                    <Text style={[styles.itemLabel, { textDecorationLine: 'line-through' }]}>{item.label}</Text>
                  </View>
                ))}
              </>
            )}
          </ScrollView>

          <TouchableOpacity style={styles.ctaBtn} onPress={dismiss}>
            <Text style={styles.ctaBtnText}>{allDone ? '¡Genial!' : 'Entendido, voy a completarlo'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  badgeDone: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.good + '18', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 12,
    marginBottom: 12,
  },
  badgeDoneText: { fontSize: 13, fontWeight: '800', color: Colors.good },

  badgeProgress: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.primary + '0d', borderRadius: 18, borderWidth: 1, borderColor: Colors.primary + '33',
    paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12,
  },
  badgeProgressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  badgeProgressLabel: { fontSize: 12, fontWeight: '800', color: Colors.ink },
  badgeProgressPct: { fontSize: 12, fontWeight: '800', color: Colors.primary },
  progressTrack: { height: 6, borderRadius: 3, backgroundColor: Colors.ink + '1a' },
  progressFill: { height: 6, borderRadius: 3, backgroundColor: Colors.primary },
  chevron: { fontSize: 18, color: Colors.inkMuted },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 20, paddingHorizontal: 20, paddingBottom: 24, maxHeight: '80%',
  },
  header: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  title: { fontSize: 17, fontWeight: '900', color: Colors.ink },
  subtitle: { fontSize: 12, color: Colors.inkMuted, marginTop: 2 },
  closeBtn: { padding: 4, marginLeft: 8 },
  closeBtnText: { fontSize: 16, color: Colors.inkMuted },

  progressTrackBig: { height: 8, borderRadius: 4, backgroundColor: Colors.ink + '1a', marginBottom: 12 },
  progressFillBig: { height: 8, borderRadius: 4, backgroundColor: Colors.primary },

  allDoneBox: { alignItems: 'center', gap: 10, paddingVertical: 16 },
  allDoneText: { fontSize: 13, color: Colors.inkMuted, textAlign: 'center', lineHeight: 19 },

  itemRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.ink + '08', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10,
    marginBottom: 8,
  },
  itemDot: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: Colors.ink + '33' },
  itemDoneCheck: { fontSize: 16, color: Colors.good },
  itemLabel: { flex: 1, fontSize: 13, fontWeight: '700', color: Colors.ink },
  skipBtn: {
    borderWidth: 1, borderColor: Colors.ink + '1a', borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  skipBtnText: { fontSize: 11, fontWeight: '800', color: Colors.inkMuted },

  ctaBtn: { backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  ctaBtnText: { fontSize: 14, fontWeight: '800', color: Colors.white },
});
