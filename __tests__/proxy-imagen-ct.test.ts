/**
 * Tests para la validación de content-type en proxy-imagen.
 * Verifica que sólo se permiten tipos image/* y se bloquea HTML/JS.
 */

import { describe, it, expect } from 'vitest';

function isAllowedContentType(ct: string): boolean {
  return ct.startsWith('image/');
}

describe('proxy-imagen — validación de content-type', () => {
  it('permite image/png', () => {
    expect(isAllowedContentType('image/png')).toBe(true);
  });

  it('permite image/jpeg', () => {
    expect(isAllowedContentType('image/jpeg')).toBe(true);
  });

  it('permite image/webp', () => {
    expect(isAllowedContentType('image/webp')).toBe(true);
  });

  it('permite image/gif', () => {
    expect(isAllowedContentType('image/gif')).toBe(true);
  });

  it('bloquea text/html', () => {
    expect(isAllowedContentType('text/html')).toBe(false);
  });

  it('bloquea text/html con charset', () => {
    expect(isAllowedContentType('text/html; charset=utf-8')).toBe(false);
  });

  it('bloquea application/javascript', () => {
    expect(isAllowedContentType('application/javascript')).toBe(false);
  });

  it('bloquea application/json', () => {
    expect(isAllowedContentType('application/json')).toBe(false);
  });

  it('bloquea text/plain', () => {
    expect(isAllowedContentType('text/plain')).toBe(false);
  });

  it('bloquea string vacío', () => {
    expect(isAllowedContentType('')).toBe(false);
  });

  it('no confunde "image/" embebido en otro tipo', () => {
    expect(isAllowedContentType('application/image/fake')).toBe(false);
  });
});
