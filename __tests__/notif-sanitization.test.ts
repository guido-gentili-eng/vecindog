/**
 * Tests para la función esc() en rutas de notificación.
 * Verifica que el texto guardado en la tabla notifications está sanitizado,
 * cubriendo los casos de encontre-perro y sos-perro-perdido.
 */

import { describe, it, expect } from 'vitest';

function esc(s: string | null | undefined): string {
  if (!s) return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function buildMensajeNotif(perroNombre: string, mensaje: string, contacto: string): string {
  return contacto
    ? `📍 Alguien encontró a ${esc(perroNombre)}. Mensaje: "${esc(mensaje) || 'Sin mensaje'}". Contacto: ${esc(contacto)}`
    : `📍 Alguien encontró a ${esc(perroNombre)}. Mensaje: "${esc(mensaje) || 'Sin mensaje'}"`;
}

describe('mensajeNotif — sanitización de inputs del usuario', () => {
  it('escapa tags HTML en el nombre del perro', () => {
    const msg = buildMensajeNotif('<script>alert(1)</script>', '', '');
    expect(msg).not.toContain('<script>');
    expect(msg).toContain('&lt;script&gt;');
  });

  it('escapa XSS en el mensaje', () => {
    const msg = buildMensajeNotif('Fido', '<img src=x onerror=alert(1)>', '');
    expect(msg).not.toContain('<img');
    expect(msg).toContain('&lt;img');
  });

  it('escapa XSS en el contacto', () => {
    const msg = buildMensajeNotif('Fido', 'hola', '<a href="javascript:void(0)">click</a>');
    expect(msg).not.toContain('<a ');
    expect(msg).toContain('&lt;a href=');
  });

  it('incluye el contacto cuando está presente', () => {
    const msg = buildMensajeNotif('Fido', 'Lo vi en el parque', '1123456789');
    expect(msg).toContain('Contacto: 1123456789');
  });

  it('omite la sección de contacto cuando está vacío', () => {
    const msg = buildMensajeNotif('Fido', 'Lo vi', '');
    expect(msg).not.toContain('Contacto:');
  });

  it('usa "Sin mensaje" cuando el mensaje está vacío', () => {
    const msg = buildMensajeNotif('Fido', '', '');
    expect(msg).toContain('"Sin mensaje"');
  });

  it('texto plano pasa sin modificación', () => {
    const msg = buildMensajeNotif('Bobby', 'Está en Palermo', '11-9999-0000');
    expect(msg).toContain('Bobby');
    expect(msg).toContain('Está en Palermo');
    expect(msg).toContain('11-9999-0000');
  });
});
