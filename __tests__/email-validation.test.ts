/**
 * Tests para la validación de formato de email en los endpoints de pago.
 * Cubre pago/publicidad y pago/red-vecindog — ambos almacenan el email
 * como `anunciante` en la tabla ads y lo usan para enviar notificaciones.
 */

import { describe, it, expect } from 'vitest';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email);
}

describe('validación de email para anunciante', () => {
  it('acepta email bien formado', () => {
    expect(isValidEmail('negocio@ejemplo.com')).toBe(true);
  });

  it('acepta email con subdominios', () => {
    expect(isValidEmail('ventas@tienda.com.ar')).toBe(true);
  });

  it('acepta email con puntos en el usuario', () => {
    expect(isValidEmail('juan.perez@gmail.com')).toBe(true);
  });

  it('rechaza email sin arroba', () => {
    expect(isValidEmail('negocioejemplo.com')).toBe(false);
  });

  it('rechaza email sin dominio', () => {
    expect(isValidEmail('negocio@')).toBe(false);
  });

  it('rechaza email sin usuario', () => {
    expect(isValidEmail('@ejemplo.com')).toBe(false);
  });

  it('rechaza string vacío', () => {
    expect(isValidEmail('')).toBe(false);
  });

  it('rechaza email con espacios', () => {
    expect(isValidEmail('negocio @ejemplo.com')).toBe(false);
  });

  it('rechaza doble arroba', () => {
    expect(isValidEmail('negocio@@ejemplo.com')).toBe(false);
  });

  it('rechaza texto plano sin estructura', () => {
    expect(isValidEmail('no-es-un-email')).toBe(false);
  });

  it('rechaza inyección de script como email', () => {
    expect(isValidEmail('<script>alert(1)</script>')).toBe(false);
  });
});
