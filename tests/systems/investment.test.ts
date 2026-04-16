import { describe, it, expect } from 'vitest';
import { createMockState } from './_helpers';
import { updateInvestment } from '../../src/systems/investment';

describe('updateInvestment', () => {
  it('returns state unchanged when investment is null', () => {
    const state = createMockState({ investment: null });
    const result = updateInvestment(state);
    expect(result).toBe(state);
  });

  it('produces a new state object when investment is set', () => {
    const state = createMockState({
      investment: {
        stocks: 1000,
        bonds: 1000,
        totalPortfolio: 2000,
        riskLevel: 50,
        returnRate: 0,
      },
    });
    const result = updateInvestment(state);
    expect(result).not.toBe(state);
    expect(result.investment).not.toBeNull();
  });

  it('keeps portfolio finite and > 0 after 10 ticks', () => {
    let state = createMockState({
      investment: {
        stocks: 1000,
        bonds: 1000,
        totalPortfolio: 2000,
        riskLevel: 50,
        returnRate: 0,
      },
    });
    for (let i = 0; i < 10; i++) {
      state = updateInvestment(state);
    }
    expect(Number.isFinite(state.investment!.totalPortfolio)).toBe(true);
    expect(state.investment!.totalPortfolio).toBeGreaterThan(0);
    expect(Number.isFinite(state.investment!.stocks)).toBe(true);
    expect(Number.isFinite(state.investment!.bonds)).toBe(true);
  });

  it('preserves riskLevel across ticks', () => {
    const state = createMockState({
      investment: {
        stocks: 500,
        bonds: 500,
        totalPortfolio: 1000,
        riskLevel: 75,
        returnRate: 0,
      },
    });
    const result = updateInvestment(state);
    expect(result.investment!.riskLevel).toBe(75);
  });

  it('does not mutate the input investment object', () => {
    const inv = {
      stocks: 1000,
      bonds: 1000,
      totalPortfolio: 2000,
      riskLevel: 50,
      returnRate: 0,
    };
    const state = createMockState({ investment: inv });
    updateInvestment(state);
    expect(inv.stocks).toBe(1000);
    expect(inv.bonds).toBe(1000);
  });

  it('clamps riskLevel out of [0,100] without exploding', () => {
    const state = createMockState({
      investment: {
        stocks: 100,
        bonds: 100,
        totalPortfolio: 200,
        riskLevel: 9999,
        returnRate: 0,
      },
    });
    let s = state;
    for (let i = 0; i < 5; i++) s = updateInvestment(s);
    expect(Number.isFinite(s.investment!.totalPortfolio)).toBe(true);
  });
});
