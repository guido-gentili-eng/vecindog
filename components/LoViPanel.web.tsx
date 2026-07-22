import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { supabase } from '@/lib/supabase';
import { actualizarZonaPost } from '@/lib/posts';
import { Colors } from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Variante web: idéntica a LoViPanel.tsx pero sin react-native-maps, que no
 * tiene build web y rompería el bundle entero (mismo motivo por el que
 * mapa.tsx tiene su propio mapa.web.tsx). Solo se pierde la vista previa
 * del pin en el mapita; el resto del flujo es igual.
 */
interface Props {
  postId: string;
  ownerId: string;
  categoria: 'perdido' | 'encontrado' | string;
  nombre: string | null;
  zonaActual: string;
  ciudad?: string | null;
  onUpdated: (patch: { zona: string; horario: string; fecha: string; lat?: number; lng?: number }) => void;
}

type ZonaSugerencia = { label: string; sub: string; lat: number; lng: number };

function hoyISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function LoViPanel({ postId, ownerId, categoria, nombre, zonaActual, ciudad, onUpdated }: Props) {
  const { t } = useLanguage();
  const [open,       setOpen]       = useState(false);
  const [enviado,    setEnviado]    = useState(false);
  const [enviando,   setEnviando]   = useState(false);
  const [error,      setError]      = useState('');

  const [mismoLugar, setMismoLugar] = useState(false);
  const [gps,        setGps]        = useState<'idle' | 'cargando' | 'ok' | 'error'>('idle');
  const [manual,     setManual]     = useState(false);
  const [calle,      setCalle]      = useState('');
  const [lat,        setLat]        = useState<number | null>(null);
  const [lng,        setLng]        = useState<number | null>(null);
  const [sugerencias, setSugerencias] = useState<ZonaSugerencia[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [fechaModo, setFechaModo] = useState<'hoy' | 'otro'>('hoy');
  const [otroDia,   setOtroDia]   = useState('');
  const [hora,      setHora]      = useState('');

  function reset() {
    setOpen(false); setEnviado(false); setError('');
    setMismoLugar(false); setGps('idle'); setManual(false);
    setCalle(''); setLat(null); setLng(null); setSugerencias([]);
    setFechaModo('hoy'); setOtroDia(''); setHora('');
  }

  async function capturarGps() {
    setGps('cargando');
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') { setGps('error'); setManual(true); return; }
    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLat(loc.coords.latitude); setLng(loc.coords.longitude);
      setGps('ok');
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&format=json&addressdetails=1`,
          { headers: { 'User-Agent': 'Vecindog/1.0 (noreply@mivecindog.com.ar)' } }
        );
        const data = await res.json();
        const a = data?.address ?? {};
        const c = a.road ?? a.pedestrian ?? a.footway ?? '';
        const n = a.house_number ?? '';
        const barrio = a.suburb ?? a.neighbourhood ?? a.quarter ?? '';
        const z = [c && n ? `${c} ${n}` : c, barrio].filter(Boolean).join(', ');
        if (z) setCalle(z);
      } catch { /* sin reverse geocode, el usuario puede editar la dirección a mano */ }
    } catch {
      setGps('error'); setManual(true);
    }
  }

  function handleCalleChange(v: string) {
    setCalle(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (v.trim().length < 3) { setSugerencias([]); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const query = ciudad ? `${v}, ${ciudad}, Argentina` : `${v}, Argentina`;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1&countrycodes=ar`,
          { headers: { 'User-Agent': 'Vecindog/1.0 (noreply@mivecindog.com.ar)' } }
        );
        const data = await res.json();
        const parsed: ZonaSugerencia[] = (Array.isArray(data) ? data : []).map((s: any) => {
          const a = s.address ?? {};
          const road = a.road ?? a.pedestrian ?? a.footway ?? a.residential ?? '';
          const num  = a.house_number ?? '';
          const label = [road, num].filter(Boolean).join(' ') || String(s.display_name ?? '').split(',')[0].trim();
          const sub   = a.city ?? a.town ?? a.village ?? a.suburb ?? '';
          return { label, sub, lat: parseFloat(s.lat), lng: parseFloat(s.lon) };
        }).filter((s: ZonaSugerencia) => s.label);
        setSugerencias(parsed);
      } catch { setSugerencias([]); }
    }, 400);
  }

  function seleccionarSugerencia(s: ZonaSugerencia) {
    setCalle(s.label);
    if (!isNaN(s.lat) && !isNaN(s.lng)) { setLat(s.lat); setLng(s.lng); }
    setSugerencias([]);
  }

  const listo = (mismoLugar || manual || gps === 'ok') && hora.trim() && (fechaModo === 'hoy' || otroDia.trim());

  async function enviar() {
    if (!listo || enviando) return;
    setEnviando(true); setError('');
    try {
      const calleEfectiva = mismoLugar ? zonaActual : calle.trim();
      const fechaEfectiva  = fechaModo === 'hoy' ? hoyISO() : otroDia;
      const latEfectivo = mismoLugar ? undefined : (lat ?? undefined);
      const lngEfectivo = mismoLugar ? undefined : (lng ?? undefined);

      if (categoria === 'perdido') {
        const lugarTexto = mismoLugar ? `${t.loviEnElMismoLugarPrefix}${calleEfectiva}${t.loviEnElMismoLugarSuffix}` : `${t.loviEnPrefix} ${calleEfectiva}`;
        const fechaLabel = fechaModo === 'hoy' ? t.loviFechaHoyLabel : new Date(fechaEfectiva + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long' });
        const { error: notifErr } = await supabase.from('notifications').insert({
          user_id: ownerId,
          post_id: postId,
          tipo:    'avistamiento',
          mensaje: `${t.loviNotifAlguienVioPrefix} ${nombre ?? t.loviNotifTuPerroFallback} ${lugarTexto} ${t.loviALasPrefix} ${hora} (${fechaLabel}).`,
          leida:   false,
        });
        if (notifErr) throw notifErr;
      }

      await actualizarZonaPost(postId, calleEfectiva, hora, latEfectivo, lngEfectivo, fechaEfectiva);
      onUpdated({ zona: calleEfectiva, horario: hora, fecha: fechaEfectiva, lat: latEfectivo, lng: lngEfectivo });
      setEnviado(true);
    } catch {
      setError(t.loviErrEnviar);
    } finally {
      setEnviando(false);
    }
  }

  if (!open && !enviado) {
    return (
      <TouchableOpacity style={styles.cta} onPress={() => setOpen(true)}>
        <Text style={styles.ctaText}>
          {categoria === 'encontrado' ? t.loviCtaYoTambien : t.loviCtaLoVi}
        </Text>
      </TouchableOpacity>
    );
  }

  if (enviado) {
    return (
      <View style={styles.card}>
        <Text style={styles.successText}>
          {categoria === 'encontrado' ? t.loviGraciasEncontrado : t.loviGraciasPerdido}
        </Text>
        <TouchableOpacity onPress={reset}><Text style={styles.reportOtro}>{t.loviReportarOtro}</Text></TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t.loviDondeLoViste}</Text>

      {!mismoLugar && gps !== 'ok' && !manual && (
        <TouchableOpacity style={styles.optBtn} onPress={() => setMismoLugar(true)}>
          <Text style={styles.optBtnText}>{t.loviMismoLugarBtn}</Text>
        </TouchableOpacity>
      )}

      {mismoLugar && (
        <View style={styles.selectedRow}>
          <Text style={styles.selectedText}>{t.loviMismoLugarPrefix} {zonaActual}</Text>
          <TouchableOpacity onPress={() => setMismoLugar(false)}><Text style={styles.changeText}>{t.rvCambiarBtn}</Text></TouchableOpacity>
        </View>
      )}

      {!mismoLugar && (
        gps === 'ok' ? (
          <View style={styles.selectedRow}>
            <Text style={styles.selectedText}>{t.loviGpsCapturado}</Text>
            <TouchableOpacity onPress={() => { setGps('idle'); setManual(true); setLat(null); setLng(null); }}>
              <Text style={styles.changeText}>{t.rvCambiarBtn}</Text>
            </TouchableOpacity>
          </View>
        ) : gps === 'cargando' ? (
          <View style={styles.optBtn}><ActivityIndicator color={Colors.primary} /></View>
        ) : !manual ? (
          <>
            <TouchableOpacity style={[styles.optBtn, styles.optBtnPrimary]} onPress={capturarGps}>
              <Text style={[styles.optBtnText, { color: Colors.primary }]}>
                {gps === 'error' ? t.loviGpsReintentar : t.loviGpsUsar}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setManual(true)}>
              <Text style={styles.manualLink}>{t.loviEscribirManual}</Text>
            </TouchableOpacity>
          </>
        ) : null
      )}

      {(manual || gps === 'ok') && !mismoLugar && (
        <View>
          <TextInput
            style={styles.input}
            value={calle}
            onChangeText={handleCalleChange}
            placeholder={t.loviCallePh}
            placeholderTextColor={Colors.inkMuted + '80'}
          />
          {sugerencias.length > 0 && (
            <View style={styles.sugerenciaList}>
              {sugerencias.map((s, i) => (
                <TouchableOpacity key={i} style={styles.sugerenciaItem} onPress={() => seleccionarSugerencia(s)}>
                  <Text style={styles.sugerenciaText}>📍 {s.label}</Text>
                  {!!s.sub && <Text style={styles.sugerenciaSub}>{s.sub}</Text>}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      {(mismoLugar || manual || gps === 'ok') && (
        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              style={[styles.dateBtn, fechaModo === 'hoy' && styles.dateBtnActive]}
              onPress={() => setFechaModo('hoy')}
            >
              <Text style={[styles.dateBtnText, fechaModo === 'hoy' && styles.dateBtnTextActive]}>{t.loviHoy}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dateBtn, fechaModo === 'otro' && styles.dateBtnActive]}
              onPress={() => setFechaModo('otro')}
            >
              <Text style={[styles.dateBtnText, fechaModo === 'otro' && styles.dateBtnTextActive]}>{t.loviOtroDia}</Text>
            </TouchableOpacity>
          </View>
          {fechaModo === 'otro' && (
            <TextInput
              style={styles.input}
              value={otroDia}
              onChangeText={setOtroDia}
              placeholder={t.dateFormatPh}
              placeholderTextColor={Colors.inkMuted + '80'}
            />
          )}
          <TextInput
            style={styles.input}
            value={hora}
            onChangeText={setHora}
            placeholder={t.loviHoraPh}
            placeholderTextColor={Colors.inkMuted + '80'}
          />
        </View>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {(mismoLugar || manual || gps === 'ok') && (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            style={[styles.sendBtn, !listo && { opacity: 0.5 }]}
            onPress={enviar}
            disabled={!listo || enviando}
          >
            {enviando ? <ActivityIndicator color={Colors.white} size="small" /> : <Text style={styles.sendBtnText}>{t.loviEnviarBtn}</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={reset}>
            <Text style={styles.cancelBtnText}>{t.perfilCancelar}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cta:        { backgroundColor: Colors.primary, borderRadius: 18, paddingVertical: 16, alignItems: 'center', marginBottom: 16 },
  ctaText:    { color: Colors.white, fontWeight: '800', fontSize: 15 },
  card:       { backgroundColor: Colors.white, borderRadius: 18, padding: 16, marginBottom: 16, gap: 10, borderWidth: 1, borderColor: Colors.primary + '30' },
  title:      { fontSize: 13, fontWeight: '800', color: Colors.ink },
  optBtn:     { borderWidth: 2, borderColor: Colors.border, backgroundColor: Colors.cream, borderRadius: 14, paddingVertical: 12, alignItems: 'center' },
  optBtnPrimary: { borderColor: Colors.primary, backgroundColor: Colors.primary + '0d' },
  optBtnText: { fontSize: 13, fontWeight: '700', color: Colors.ink },
  manualLink: { fontSize: 12, color: Colors.inkMuted, textAlign: 'center', textDecorationLine: 'underline', paddingVertical: 4 },
  selectedRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.primary + '14', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10 },
  selectedText: { fontSize: 12, fontWeight: '700', color: Colors.primary, flex: 1 },
  changeText:  { fontSize: 11, fontWeight: '700', color: Colors.inkMuted },
  input:      { borderWidth: 1, borderColor: Colors.border, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, fontSize: 13, color: Colors.ink, backgroundColor: Colors.cream },
  sugerenciaList: { backgroundColor: Colors.white, borderRadius: 14, borderWidth: 1, borderColor: Colors.border, marginTop: 4, overflow: 'hidden' },
  sugerenciaItem: { paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  sugerenciaText: { fontSize: 13, fontWeight: '600', color: Colors.ink },
  sugerenciaSub:  { fontSize: 11, color: Colors.inkMuted, marginTop: 1 },
  dateBtn:    { flex: 1, borderWidth: 2, borderColor: Colors.border, borderRadius: 12, paddingVertical: 9, alignItems: 'center' },
  dateBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '0d' },
  dateBtnText: { fontSize: 12, fontWeight: '700', color: Colors.inkMuted },
  dateBtnTextActive: { color: Colors.primary },
  error:      { fontSize: 11, fontWeight: '700', color: Colors.bad },
  sendBtn:    { flex: 1, backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 12, alignItems: 'center' },
  sendBtnText: { color: Colors.white, fontWeight: '800', fontSize: 13 },
  cancelBtn:  { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14, backgroundColor: Colors.cream },
  cancelBtnText: { fontSize: 13, fontWeight: '700', color: Colors.ink },
  successText: { fontSize: 13, fontWeight: '700', color: Colors.good },
  reportOtro:  { fontSize: 12, fontWeight: '700', color: Colors.primary, marginTop: 4 },
});
