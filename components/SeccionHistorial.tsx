import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, Linking } from 'react-native';
import { Colors } from '@/constants/colors';

export type Campo = {
  key:         string;
  label:       string;
  tipo?:       'text' | 'textarea' | 'date' | 'numero' | 'select';
  placeholder?: string;
  opciones?:   readonly string[];
  requerido?:  boolean;
};

interface Props {
  titulo:        string;
  emoji:         string;
  locked?:       boolean;
  campos:        Campo[];
  items:         any[];
  renderItem:    (item: any) => React.ReactNode;
  onGuardar:     (valores: Record<string, string>) => Promise<void>;
  vacio?:        string;
}

function hoy() {
  return new Date().toISOString().slice(0, 10);
}

function fechaValida(s: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return false;
  const [, y, mo, d] = m;
  const dt = new Date(`${y}-${mo}-${d}T00:00:00`);
  return dt.getFullYear() === Number(y) && dt.getMonth() + 1 === Number(mo) && dt.getDate() === Number(d);
}

export default function SeccionHistorial({
  titulo, emoji, locked, campos, items, renderItem, onGuardar, vacio,
}: Props) {
  const [agregando, setAgregando] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [valores,   setValores]   = useState<Record<string, string>>({});

  function valorInicial(): Record<string, string> {
    const v: Record<string, string> = {};
    for (const c of campos) v[c.key] = c.tipo === 'date' ? hoy() : (c.opciones?.[0] ?? '');
    return v;
  }

  function abrirForm() {
    setValores(valorInicial());
    setAgregando(true);
  }

  async function handleGuardar() {
    const faltante = campos.find((c) => c.requerido && !valores[c.key]?.trim());
    if (faltante) {
      Alert.alert('Falta un dato', `Completá "${faltante.label}".`);
      return;
    }
    const fechaInvalida = campos.find((c) => c.tipo === 'date' && valores[c.key]?.trim() && !fechaValida(valores[c.key].trim()));
    if (fechaInvalida) {
      Alert.alert('Fecha inválida', `"${fechaInvalida.label}" tiene que tener el formato AAAA-MM-DD (ej: ${hoy()}).`);
      return;
    }
    setSaving(true);
    try {
      await onGuardar(valores);
      setAgregando(false);
      setValores({});
    } catch (e) {
      const msg = e instanceof Error && e.message ? e.message : 'No se pudo guardar. Verificá tu conexión.';
      Alert.alert('Error', msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.seccion}>
      <View style={styles.header}>
        <Text style={styles.titulo}>{emoji}  {titulo}</Text>
        {locked ? (
          <TouchableOpacity style={styles.proBtn} onPress={() => Linking.openURL('https://www.mivecindog.com.ar/planes')}>
            <Text style={styles.proBtnText}>✨ VecindogPro</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.addBtn} onPress={() => (agregando ? setAgregando(false) : abrirForm())}>
            <Text style={styles.addBtnText}>{agregando ? '✕' : '+ Agregar'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {!locked && agregando && (
        <View style={styles.form}>
          {campos.map((c) => (
            <View key={c.key} style={styles.campo}>
              <Text style={styles.campoLabel}>{c.label}{c.requerido ? ' *' : ''}</Text>
              {c.tipo === 'select' && c.opciones ? (
                <View style={styles.chipsRow}>
                  {c.opciones.map((op) => (
                    <TouchableOpacity
                      key={op}
                      style={[styles.chip, valores[c.key] === op && styles.chipActive]}
                      onPress={() => setValores((v) => ({ ...v, [c.key]: op }))}
                    >
                      <Text style={[styles.chipText, valores[c.key] === op && styles.chipTextActive]} numberOfLines={1}>
                        {op}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <TextInput
                  style={[styles.input, c.tipo === 'textarea' && styles.inputArea]}
                  placeholder={c.placeholder ?? (c.tipo === 'date' ? 'AAAA-MM-DD' : '')}
                  placeholderTextColor={Colors.inkMuted}
                  value={valores[c.key] ?? ''}
                  onChangeText={(t) => setValores((v) => ({ ...v, [c.key]: t }))}
                  multiline={c.tipo === 'textarea'}
                  keyboardType={c.tipo === 'numero' ? 'decimal-pad' : 'default'}
                />
              )}
            </View>
          ))}
          <View style={styles.formBtns}>
            <TouchableOpacity style={styles.guardarBtn} onPress={handleGuardar} disabled={saving}>
              {saving ? <ActivityIndicator color={Colors.white} size="small" /> : <Text style={styles.guardarBtnText}>Guardar</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelarBtn} onPress={() => setAgregando(false)}>
              <Text style={styles.cancelarBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {items.length === 0 && !agregando ? (
        <Text style={styles.vacio}>{vacio ?? 'Sin datos todavía.'}</Text>
      ) : (
        items.map((item) => <View key={item.id}>{renderItem(item)}</View>)
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  seccion:        { backgroundColor: Colors.white, borderRadius: 18, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  header:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  titulo:         { fontSize: 13, fontWeight: '800', color: Colors.ink },
  proBtn:         { backgroundColor: Colors.primary + '20', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  proBtnText:     { fontSize: 12, fontWeight: '800', color: Colors.primary },
  addBtn:         { backgroundColor: Colors.primary + '20', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, minWidth: 32, alignItems: 'center' },
  addBtnText:     { fontSize: 12, fontWeight: '800', color: Colors.primary },
  form:           { backgroundColor: Colors.cream, borderRadius: 14, padding: 12, marginBottom: 10, gap: 10 },
  campo:          { gap: 4 },
  campoLabel:     { fontSize: 11, fontWeight: '700', color: Colors.inkMuted },
  input:          { backgroundColor: Colors.white, borderRadius: 10, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 12, paddingVertical: 9, fontSize: 13, color: Colors.ink },
  inputArea:      { minHeight: 60, textAlignVertical: 'top' },
  chipsRow:       { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip:           { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border },
  chipActive:     { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText:       { fontSize: 12, fontWeight: '600', color: Colors.inkMuted },
  chipTextActive: { color: Colors.white },
  formBtns:       { flexDirection: 'row', gap: 8, marginTop: 2 },
  guardarBtn:     { flex: 1, backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 11, alignItems: 'center' },
  guardarBtnText: { color: Colors.white, fontWeight: '800', fontSize: 13 },
  cancelarBtn:    { paddingHorizontal: 16, paddingVertical: 11, borderRadius: 12, borderWidth: 1, borderColor: Colors.border },
  cancelarBtnText: { color: Colors.inkMuted, fontWeight: '700', fontSize: 13 },
  vacio:          { fontSize: 13, color: Colors.inkMuted + '80', fontWeight: '600', paddingVertical: 6 },
});
