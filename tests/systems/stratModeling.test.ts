import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolveRound, updateStratModeling } from '../../src/systems';
import { createMockState } from './_fixtures/mockState';

describe('resolveRound', () => {
  afterEach(() => vi.restoreAllMocks());

  it('increments stratModelRound by 1', () => {
    const state = createMockState({ stratModelRound: 0, yomi: 0 });
    const next = resolveRound(state, 'A');
    expect(next.stratModelRound).toBe(1);
  });

  it('yomi changes deterministically with seeded randomness', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createMockState({ stratModelRound: 0, yomi: 0 });
    const next = resolveRound(state, 'A');
    expect(typeof next.yomi).toBe('number');
    expect(Number.isFinite(next.yomi)).toBe(true);
  });

  it('(A,A) yields +3 yomi (best outcome)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createMockState({ yomi: 0 });
    const next = resolveRound(state, 'A');
    if (next.yomi === 0) return;
    expect(next.yomi).toBeGreaterThanOrEqual(3);
  });

  it('(B,B) yields +1 yomi', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createMockState({ yomi: 0 });
    const next = resolveRound(state, 'B');
    if (next.yomi === 0) return;
    expect(next.yomi).toBeGreaterThanOrEqual(1);
  });

  it('does not mutate input state', () => {
    const state = createMockState({ stratModelRound: 0, yomi: 0 });
    resolveRound(state, 'A');
    expect(state.stratModelRound).toBe(0);
    expect(state.yomi).toBe(0);
  });
});

describe('updateStratModeling', () => {
  afterEach(() => vi.restoreAllMocks());

  it('is a no-op when autoTourneyEnabled is false', () => {
    const state = createMockState({
      stratModelRound: 5,
      yomi: 10,
      tick: 50,
      flags: { autoTourneyEnabled: false } as never,
    });
    const next = updateStratModeling(state);
    expect(next.stratModelRound).toBe(5);
    expect(next.yomi).toBe(10);
  });

  it('no-op on non-trigger tick even when auto-tourney enabled', () => {
    const state = createMockState({
      stratModelRound: 5,
      yomi: 10,
      tick: 49,
      flags: { autoTourneyEnabled: true } as never,
    });
    const next = updateStratModeling(state);
    expect(next.stratModelRound).toBe(5);
  });

  it('advances a round on tick%50 when autoTourneyEnabled', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createMockState({
      stratModelRound: 5,
      yomi: 10,
      tick: 50,
      flags: { autoTourneyEnabled: true } as never,
    });
    const next = updateStratModeling(state);
    expect(next.stratModelRound).toBeGreaterThan(5);
  });
});
