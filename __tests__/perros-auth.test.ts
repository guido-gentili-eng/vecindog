/**
 * Tests para el manejo de auth en lib/perros.ts.
 * Verifica que las funciones fallan de forma segura cuando Supabase
 * retorna error o user es null (en lugar de lanzar TypeError por destructuring).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock del módulo supabase antes de importar perros.ts
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
    storage: { from: vi.fn() },
  },
}));

import { supabase } from '@/lib/supabase';
import { crearPerro, actualizarPerro, eliminarPerro, agregarVacuna, eliminarVacuna } from '@/lib/perros';

const mockGetUser = supabase.auth.getUser as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('crearPerro — manejo de auth', () => {
  it('lanza error descriptivo cuando getUser devuelve error', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: { message: 'network error' } });
    await expect(crearPerro({ nombre: 'Fido', esterilizado: false } as never, [])).rejects.toThrow(
      'Tenés que estar registrado'
    );
  });

  it('lanza error cuando user es null (sin auth error)', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
    await expect(crearPerro({ nombre: 'Fido', esterilizado: false } as never, [])).rejects.toThrow(
      'Tenés que estar registrado'
    );
  });

  it('NO lanza TypeError por destructuring cuando data es null', async () => {
    // Esto era el bug original: data: null causaba crash al intentar data.user
    mockGetUser.mockResolvedValue({ data: null, error: { message: 'fatal' } });
    // Debe lanzar el error controlado, no un TypeError
    const error = await crearPerro({ nombre: 'Fido', esterilizado: false } as never, []).catch(e => e);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).not.toMatch(/Cannot read properties of null/);
  });
});

describe('actualizarPerro — manejo de auth', () => {
  it('lanza error cuando no hay user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
    await expect(actualizarPerro('some-id', {})).rejects.toThrow('No autorizado');
  });
});

describe('eliminarPerro — manejo de auth', () => {
  it('lanza error cuando no hay user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
    await expect(eliminarPerro('some-id')).rejects.toThrow('No autorizado');
  });
});

describe('agregarVacuna — manejo de auth', () => {
  it('lanza error cuando no hay user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
    await expect(agregarVacuna('perro-id', { nombre: 'Rabia', fecha: '2025-01-01', veterinario: '', proxima: '', notas: '' })).rejects.toThrow(
      'No autorizado'
    );
  });
});

describe('eliminarVacuna — manejo de auth', () => {
  it('lanza error cuando no hay user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
    await expect(eliminarVacuna('vac-id')).rejects.toThrow('No autorizado');
  });
});
