import { describe, expect, it } from 'vitest';
import { updateWireBuyer } from '../../src/systems';
import { createMockState } from './_fixtures/mockState';

describe('updateWireBuyer', () => {
  it('is a no-op when wireBuyerEnabled is false', () => {
    const state = createMockState({
      wireBuyerEnabled: false,
      wire: 0,
      funds: 10_000,
      wirePrice: 20,
      flags: { wireBuyerUnlocked: true } as never,
    });
    const next = updateWireBuyer(state);
    expect(next.wire).toBe(0);
    expect(next.funds).toBe(10_000);
  });

  it('is a no-op when wire >= 10 (low-water mark not hit)', () => {
    const state = createMockState({
      wireBuyerEnabled: true,
      wire: 500,
      funds: 10_000,
      wirePrice: 20,
      flags: { wireBuyerUnlocked: true } as never,
    });
    const next = updateWireBuyer(state);
    expect(next.wire).toBe(500);
    expect(next.funds).toBe(10_000);
  });

  it('is a no-op when funds < wirePrice', () => {
    const state = createMockState({
      wireBuyerEnabled: true,
      wire: 0,
      funds: 5,
      wirePrice: 20,
      flags: { wireBuyerUnlocked: true } as never,
    });
    const next = updateWireBuyer(state);
    expect(next.wire).toBe(0);
    expect(next.funds).toBe(5);
  });

  it('buys wire when enabled, low-water hit, and funds sufficient', () => {
    const state = createMockState({
      wireBuyerEnabled: true,
      wire: 0,
      funds: 100,
      wirePrice: 20,
      flags: { wireBuyerUnlocked: true } as never,
    });
    const next = updateWireBuyer(state);
    expect(next.wire).toBeGreaterThan(0);
    expect(next.funds).toBeLessThan(100);
  });

  it('adds roughly a spool (1000) of wire on a buy', () => {
    const state = createMockState({
      wireBuyerEnabled: true,
      wire: 0,
      funds: 1000,
      wirePrice: 20,
      flags: { wireBuyerUnlocked: true } as never,
    });
    const next = updateWireBuyer(state);
    expect(next.wire).toBeGreaterThanOrEqual(1000);
  });

  it('does not mutate input state', () => {
    const state = createMockState({
      wireBuyerEnabled: true,
      wire: 0,
      funds: 100,
      wirePrice: 20,
      flags: { wireBuyerUnlocked: true } as never,
    });
    updateWireBuyer(state);
    expect(state.wire).toBe(0);
    expect(state.funds).toBe(100);
  });
});
