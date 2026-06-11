/**
 * Tests para la función esc() que previene XSS en los popups del mapa.
 * La función está definida en components/MapView.tsx — la duplicamos aquí
 * para poder testearla en aislamiento sin inicializar Leaflet.
 */

function esc(s: string | null | undefined): string {
  if (!s) return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

describe('esc() — HTML escaping para popups de Leaflet', () => {
  it('escapa < y > (XSS tag injection)', () => {
    expect(esc('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
  });

  it('escapa atributos con comillas dobles', () => {
    expect(esc('"value"')).toBe('&quot;value&quot;');
  });

  it('escapa comillas simples', () => {
    expect(esc("it's")).toBe('it&#39;s');
  });

  it('escapa ampersand', () => {
    expect(esc('perros & gatos')).toBe('perros &amp; gatos');
  });

  it('escapa payload XSS completo tipo onerror', () => {
    const payload = '<img src=x onerror=alert(document.cookie)>';
    const result = esc(payload);
    expect(result).not.toContain('<img');
    expect(result).not.toContain('>');
    expect(result).toContain('&lt;img');
  });

  it('devuelve string vacío para null', () => {
    expect(esc(null)).toBe('');
  });

  it('devuelve string vacío para undefined', () => {
    expect(esc(undefined)).toBe('');
  });

  it('devuelve string vacío para string vacío', () => {
    expect(esc('')).toBe('');
  });

  it('no modifica texto plano sin caracteres especiales', () => {
    expect(esc('Fido en Palermo')).toBe('Fido en Palermo');
  });

  it('escapa múltiples caracteres especiales en un mismo string', () => {
    expect(esc('<b class="x">hola & chau</b>')).toBe(
      '&lt;b class=&quot;x&quot;&gt;hola &amp; chau&lt;/b&gt;'
    );
  });
});
