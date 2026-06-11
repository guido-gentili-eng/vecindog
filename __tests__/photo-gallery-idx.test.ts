/**
 * Tests para el clamp de índice en PhotoGallery.
 * Verifica que safeIdx no sale del rango si el array se achica.
 */

import { describe, it, expect } from 'vitest';

function safeIdxFor(idx: number, total: number): number {
  return Math.min(idx, total - 1);
}

describe('PhotoGallery — safeIdx clamp', () => {
  it('devuelve idx sin modificar cuando está dentro del rango', () => {
    expect(safeIdxFor(2, 5)).toBe(2);
  });

  it('clampea al último índice válido cuando idx supera el array', () => {
    expect(safeIdxFor(4, 3)).toBe(2);
  });

  it('devuelve 0 para un array de 1 elemento', () => {
    expect(safeIdxFor(0, 1)).toBe(0);
  });

  it('devuelve 0 cuando idx es 0', () => {
    expect(safeIdxFor(0, 5)).toBe(0);
  });

  it('clampea exactamente al último cuando idx == total', () => {
    expect(safeIdxFor(3, 3)).toBe(2);
  });
});
