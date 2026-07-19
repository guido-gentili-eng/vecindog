import React from 'react';
import { View, StyleSheet } from 'react-native';

// Punto de color por categoría, hecho con estilos (no emoji unicode).
// Algunos emojis de círculo de color (🟢, 🟤) no los soporta la fuente
// de ciertos Android viejos, y cuando eso pasa arrastra a blanco el
// resto del texto de esa misma línea. Un View evita ese riesgo por completo.
export const CATEGORIA_COLOR: Record<string, string> = {
  perdido:    '#ef4444',
  encontrado: '#22c55e',
  adopcion:   '#f97316',
  transito:   '#7c3aed',
};

export default function CategoriaDot({ categoria, size = 10 }: { categoria: string; size?: number }) {
  return (
    <View
      style={[
        styles.dot,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: CATEGORIA_COLOR[categoria] ?? '#9ca3af' },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {},
});
