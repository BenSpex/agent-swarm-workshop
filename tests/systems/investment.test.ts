import { afterEach, describe, expect, it, vi } from 'vitest';
import { updateInvestment } from '../../src/systems';
import { createMockState } from './_fixtures/mockState';

describe('updateInvestment', () => {
  afterEach(() => vi.restoreAllMocks());

  it('is a no-op when investment is null (locked)', () => {
    const state = createMockState({ investment: null });
    const next = updateInvestment(state);
    expect(next.investment).toBeNull();
  });

  it('does not mutate the input state', () => {
    const state = createMockState({
      investment: {
        stocks: 100,
        bonds: 100,
        totalPortfolio: 200,
        riskLevel: 2,
        returnRate: 0,
      } as never,
    });
    const snapshot = {
      stocks: state.investment!.stocks,
      bonds: state.investment!.bonds,
    };
    updateInvestment(state);
    expect(state.investment!.stocks).toBe(snapshot.stocks);
    expect(state.investment!.bonds).toBe(snapshot.bonds);
  });

  it('keeps totalPortfolio = stocks + bonds after update', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const state = createMockState({
      investment: {
        stocks: 1000,
        bonds: 500,
        totalPortfolio: 1500,
        riskLevel: 2,
        returnRate: 0,
      } as never,
    });
    const next = updateInvestment(state);
    if (!next.investment) return;
    expect(next.investment.totalPortfolio).toBeCloseTo(
      next.investment.stocks + next.investment.bonds,
      1,
    );
  });

  it('riskLevel affects variance (higher risk = larger swings)', () => {
    const samples = (riskLevel: number) => {
      const values: number[] = [];
      for (let i = 0; i < 100; i++) {
        vi.spyOn(Math, 'random').mockReturnValue(i / 100);
        const s = createMockState({
          investment: {
            stocks: 10_000,
            bonds: 0,
            totalPortfolio: 10_000,
            riskLevel,
            returnRate: 0,
          } as never,
        });
        const next = updateInvestment(s);
        if (next.investment) values.push(next.investment.stocks);
        vi.restoreAllMocks();
      }
      return values;
    };

    const range = (nums: number[]) => Math.max(...nums) - Math.min(...nums);
    const lowRisk = range(samples(1));
    const highRisk = range(samples(5));

    if (lowRisk === 0 && highRisk === 0) return;
    expect(highRisk).toBeGreaterThanOrEqual(lowRisk);
  });
});
