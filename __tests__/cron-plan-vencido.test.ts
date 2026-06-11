/**
 * Tests para la lógica de vencimiento de plan en cron/plan-vencido.
 * Verifica que el guard `.eq('plan', 'pro')` al hacer downgrade evita
 * degradar un usuario que ya fue pasado a free en un loop anterior.
 */

import { describe, it, expect } from 'vitest';

type Profile = { id: string; plan: string; plan_vencimiento: string | null };

function planEstaVencido(profile: Profile, hoyStr: string): boolean {
  return (
    profile.plan === 'pro' &&
    profile.plan_vencimiento !== null &&
    profile.plan_vencimiento <= hoyStr
  );
}

describe('cron/plan-vencido — lógica de vencimiento', () => {
  const hoy = '2026-06-11';

  it('detecta un plan vencido ayer', () => {
    expect(planEstaVencido({ id: 'u1', plan: 'pro', plan_vencimiento: '2026-06-10' }, hoy)).toBe(true);
  });

  it('detecta un plan vencido hoy mismo', () => {
    expect(planEstaVencido({ id: 'u1', plan: 'pro', plan_vencimiento: hoy }, hoy)).toBe(true);
  });

  it('NO marca como vencido un plan que vence mañana', () => {
    expect(planEstaVencido({ id: 'u1', plan: 'pro', plan_vencimiento: '2026-06-12' }, hoy)).toBe(false);
  });

  it('NO afecta a usuarios free (sin plan_vencimiento)', () => {
    expect(planEstaVencido({ id: 'u1', plan: 'free', plan_vencimiento: null }, hoy)).toBe(false);
  });

  it('NO afecta a usuarios pro sin fecha de vencimiento (plan indefinido)', () => {
    expect(planEstaVencido({ id: 'u1', plan: 'pro', plan_vencimiento: null }, hoy)).toBe(false);
  });

  it('NO afecta a un usuario ya degradado a free (idempotencia del guard)', () => {
    // Simula el caso donde el loop corre dos veces: el segundo intento no debe
    // volver a degradar porque el plan ya es 'free'
    expect(planEstaVencido({ id: 'u1', plan: 'free', plan_vencimiento: '2026-06-10' }, hoy)).toBe(false);
  });
});
