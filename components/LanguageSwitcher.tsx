import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useLanguage, type Lang } from '@/contexts/LanguageContext';
import { Colors } from '@/constants/colors';

const OPTIONS: { key: Lang; label: string; flag: string }[] = [
  { key: 'es', label: 'Español', flag: '🇦🇷' },
  { key: 'en', label: 'English', flag: '🇺🇸' },
  { key: 'pt', label: 'Português', flag: '🇧🇷' },
];

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const actual = OPTIONS.find((o) => o.key === lang) ?? OPTIONS[0];

  return (
    <>
      <TouchableOpacity style={styles.btn} onPress={() => setOpen(true)}>
        <Text style={styles.btnText}>{actual.flag} {actual.label}</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            {OPTIONS.map((o) => (
              <TouchableOpacity
                key={o.key}
                style={[styles.option, o.key === lang && styles.optionActive]}
                onPress={() => { setLang(o.key); setOpen(false); }}
              >
                <Text style={{ fontSize: 18 }}>{o.flag}</Text>
                <Text style={[styles.optionText, o.key === lang && styles.optionTextActive]}>{o.label}</Text>
                {o.key === lang && <Text style={{ color: Colors.primary, marginLeft: 'auto' }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  btn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.border, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: Colors.white },
  btnText: { fontSize: 12, fontWeight: '700', color: Colors.ink },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 30 },
  sheet: { backgroundColor: Colors.white, borderRadius: 20, padding: 10 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 13, borderRadius: 14 },
  optionActive: { backgroundColor: Colors.primary + '14' },
  optionText: { fontSize: 14, fontWeight: '600', color: Colors.ink },
  optionTextActive: { color: Colors.primary, fontWeight: '800' },
});
