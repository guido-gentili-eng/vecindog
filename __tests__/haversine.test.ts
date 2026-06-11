/**
 * Tests para la función haversineKm usada en notificar-vecinos.
 * Verifica que el cálculo de distancia geodésica es correcto dentro
 * de un margen razonable y que casos extremos no producen NaN.
 */

import { describe, it, expect } from 'vitest';

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

describe('haversineKm — distancia geodésica', () => {
  it('devuelve 0 para el mismo punto', () => {
    expect(haversineKm(-38.72, -62.27, -38.72, -62.27)).toBe(0);
  });

  it('calcula ~1 km entre dos puntos separados ~1 km', () => {
    // Bahía Blanca: desplazar ~9 segundos de latitud ≈ 1 km
    const dist = haversineKm(-38.7183, -62.2663, -38.7273, -62.2663);
    expect(dist).toBeGreaterThan(0.9);
    expect(dist).toBeLessThan(1.1);
  });

  it('calcula distancia Buenos Aires → Bahía Blanca (~574 km)', () => {
    const dist = haversineKm(-34.6037, -58.3816, -38.7183, -62.2663);
    expect(dist).toBeGreaterThan(550);
    expect(dist).toBeLessThan(600);
  });

  it('nunca devuelve NaN para coordenadas válidas extremas', () => {
    expect(haversineKm(-90, -180, 90, 180)).not.toBeNaN();
  });

  it('es simétrico (A→B igual que B→A)', () => {
    const d1 = haversineKm(-34.6037, -58.3816, -38.7183, -62.2663);
    const d2 = haversineKm(-38.7183, -62.2663, -34.6037, -58.3816);
    expect(Math.abs(d1 - d2)).toBeLessThan(0.001);
  });

  it('detecta correctamente si un punto está dentro del radio de 1 km', () => {
    const base = { lat: -38.72, lng: -62.27 };
    const cercano = { lat: -38.725, lng: -62.27 }; // ~0.55 km
    const lejano  = { lat: -38.74,  lng: -62.27 }; // ~2.2 km

    expect(haversineKm(base.lat, base.lng, cercano.lat, cercano.lng)).toBeLessThan(1);
    expect(haversineKm(base.lat, base.lng, lejano.lat,  lejano.lng)).toBeGreaterThan(1);
  });
});
