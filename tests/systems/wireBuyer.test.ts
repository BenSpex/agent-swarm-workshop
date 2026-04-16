import { describe, it, expect } from 'vitest';
import { createMockState } from './_helpers';
import { updateWireBuyer } from '../../src/systems/wireBuyer';

describe('updateWireBuyer', () => {
  it('gated by wireBuyerUnlocked', () => {
    const state = createMockState({
      flags: { wireBuyerUnlocked: false },
      wireBuyerEnabled: true,
      wire: 5,
      funds: 100,
      wirePrice: 20,
    });
    const result = updateWireBuyer(state);
    expect(result).toBe(state);
  });

  it('gated by wireBuyerEnabled', () => {
    const state = createMockState({
      flags: { wireBuyerUnlocked: true },
      wireBuyerEnabled: false,
      wire: 5,
      funds: 100,
      wirePrice: 20,
    });
    const result = updateWireBuyer(state);
    expect(result).toBe(state);
  });

  it('no-op when wire >= 10', () => {
    const state = createMockState({
      flags: { wireBuyerUnlocked: true },
      wireBuyerEnabled: true,
      wire: 10,
      funds: 100,
      wirePrice: 20,
    });
    const result = updateWireBuyer(state);
    expect(result).toBe(state);
  });

  it('no-op when funds < wirePrice', () => {
    const state = createMockState({
      flags: { wireBuyerUnlocked: true },
      wireBuyerEnabled: true,
      wire: 5,
      funds: 10,
      wirePrice: 20,
    });
    const result = updateWireBuyer(state);
    expect(result).toBe(state);
  });

  it('buys a spool: wire += 1000, funds -= wirePrice', () => {
    const state = createMockState({
      flags: { wireBuyerUnlocked: true },
      wireBuyerEnabled: true,
      wire: 5,
      funds: 100,
      wirePrice: 20,
    });
    const result = updateWireBuyer(state);
    expect(result.wire).toBe(1005);
    expect(result.funds).toBe(80);
  });

  it('pushes a purchase message', () => {
    const state = createMockState({
      flags: { wireBuyerUnlocked: true },
      wireBuyerEnabled: true,
      wire: 5,
      funds: 100,
      wirePrice: 20,
    });
    const result = updateWireBuyer(state);
    expect(result.messages.some((m) => m.toLowerCase().includes('wire'))).toBe(true);
  });

  it('does not mutate input', () => {
    const state = createMockState({
      flags: { wireBuyerUnlocked: true },
      wireBuyerEnabled: true,
      wire: 5,
      funds: 100,
      wirePrice: 20,
    });
    updateWireBuyer(state);
    expect(state.wire).toBe(5);
    expect(state.funds).toBe(100);
  });
});
