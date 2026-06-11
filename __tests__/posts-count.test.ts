/**
 * Tests para contarPostsActivosDelUsuario en lib/posts.ts.
 * Verifica que un error de Supabase se propaga (en vez de silenciarse y devolver 0).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
    from: vi.fn(),
  },
}));

import { supabase } from '@/lib/supabase';
import { contarPostsActivosDelUsuario } from '@/lib/posts';

const mockGetSession = supabase.auth.getSession as ReturnType<typeof vi.fn>;
const mockFrom = supabase.from as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('contarPostsActivosDelUsuario', () => {
  it('devuelve 0 cuando no hay sesión', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    const count = await contarPostsActivosDelUsuario();
    expect(count).toBe(0);
  });

  it('devuelve el count correcto cuando la query tiene éxito', async () => {
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: 'u1' } } } });
    const chain = { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), neq: vi.fn().mockReturnThis(), in: vi.fn().mockResolvedValue({ count: 3, error: null }) };
    mockFrom.mockReturnValue(chain);
    const count = await contarPostsActivosDelUsuario();
    expect(count).toBe(3);
  });

  it('lanza error cuando la query falla (no devuelve 0 silenciosamente)', async () => {
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: 'u1' } } } });
    const dbError = { message: 'connection refused', code: '500' };
    const chain = { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), neq: vi.fn().mockReturnThis(), in: vi.fn().mockResolvedValue({ count: null, error: dbError }) };
    mockFrom.mockReturnValue(chain);
    await expect(contarPostsActivosDelUsuario()).rejects.toMatchObject({ message: 'connection refused' });
  });

  it('devuelve 0 cuando count es null pero sin error (tabla vacía)', async () => {
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: 'u1' } } } });
    const chain = { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), neq: vi.fn().mockReturnThis(), in: vi.fn().mockResolvedValue({ count: null, error: null }) };
    mockFrom.mockReturnValue(chain);
    const count = await contarPostsActivosDelUsuario();
    expect(count).toBe(0);
  });
});
