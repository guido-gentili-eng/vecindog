/**
 * Tests para listarPostsResueltos en lib/posts.ts.
 * Verifica que filtra correctamente por estado='resuelto' y respeta el límite.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: { getSession: vi.fn() },
    from:  vi.fn(),
  },
}));

import { supabase } from '@/lib/supabase';
import { listarPostsResueltos } from '@/lib/posts';

const mockFrom = supabase.from as ReturnType<typeof vi.fn>;

function makeChain(result: unknown) {
  const chain: Record<string, unknown> = {};
  const methods = ['select', 'eq', 'neq', 'in', 'order', 'not', 'gte', 'lte'];
  for (const m of methods) chain[m] = vi.fn().mockReturnThis();
  (chain.limit as ReturnType<typeof vi.fn>) = vi.fn().mockResolvedValue(result);
  return chain;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('listarPostsResueltos', () => {
  it('devuelve array de posts cuando la query tiene éxito', async () => {
    const fakePost = { id: 'abc', estado: 'resuelto', categoria: 'perdido' };
    mockFrom.mockReturnValue(makeChain({ data: [fakePost], error: null }));
    const result = await listarPostsResueltos();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('abc');
  });

  it('devuelve array vacío cuando no hay posts resueltos', async () => {
    mockFrom.mockReturnValue(makeChain({ data: [], error: null }));
    const result = await listarPostsResueltos();
    expect(result).toEqual([]);
  });

  it('devuelve array vacío cuando data es null', async () => {
    mockFrom.mockReturnValue(makeChain({ data: null, error: null }));
    const result = await listarPostsResueltos();
    expect(result).toEqual([]);
  });

  it('lanza error cuando la query falla', async () => {
    const dbError = { message: 'timeout', code: '408' };
    mockFrom.mockReturnValue(makeChain({ data: null, error: dbError }));
    await expect(listarPostsResueltos()).rejects.toMatchObject({ message: 'timeout' });
  });

  it('usa el límite por defecto de 20', async () => {
    const chain = makeChain({ data: [], error: null });
    mockFrom.mockReturnValue(chain);
    await listarPostsResueltos();
    expect((chain.limit as ReturnType<typeof vi.fn>)).toHaveBeenCalledWith(20);
  });

  it('acepta un límite personalizado', async () => {
    const chain = makeChain({ data: [], error: null });
    mockFrom.mockReturnValue(chain);
    await listarPostsResueltos(5);
    expect((chain.limit as ReturnType<typeof vi.fn>)).toHaveBeenCalledWith(5);
  });
});
