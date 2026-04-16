import { describe, it, expect } from 'vitest';
import { createMockState } from './_helpers';
import { resolveRound, updateStratModeling } from '../../src/systems/stratModeling';

describe('resolveRound', () => {
  it('gated by strategicModelingUnlocked', () => {
    const state = createMockState({ yomi: 5 });
    const result = resolveRound(state, 'A');
    expect(result).toBe(state);
  });

  it('increments stratModelRound when unlocked', () => {
    const state = createMockState({
      flags: { strategicModelingUnlocked: true },
      stratModelRound: 0,
    });
    const result = resolveRound(state, 'A');
    expect(result.stratModelRound).toBe(1);
  });

  it('playing A changes yomi by +3 or -1', () => {
    const state = createMockState({
      flags: { strategicModelingUnlocked: true },
      yomi: 10,
    });
    for (let i = 0; i < 20; i++) {
      const result = resolveRound(state, 'A');
      const delta = result.yomi - state.yomi;
      expect([3, -1]).toContain(delta);
    }
  });

  it('playing B changes yomi by 0 or +1', () => {
    const state = createMockState({
      flags: { strategicModelingUnlocked: true },
      yomi: 10,
    });
    for (let i = 0; i < 20; i++) {
      const result = resolveRound(state, 'B');
      const delta = result.yomi - state.yomi;
      expect([0, 1]).toContain(delta);
    }
  });

  it('yomi cannot go below zero', () => {
    const state = createMockState({
      flags: { strategicModelingUnlocked: true },
      yomi: 0,
    });
    for (let i = 0; i < 20; i++) {
      const result = resolveRound(state, 'A');
      expect(result.yomi).toBeGreaterThanOrEqual(0);
    }
  });

  it('pushes a round message', () => {
    const state = createMockState({
      flags: { strategicModelingUnlocked: true },
    });
    const result = resolveRound(state, 'A');
    expect(result.messages.length).toBe(1);
    expect(result.messages[0]).toContain('Tournament round');
  });
});

describe('updateStratModeling auto-tourney', () => {
  it('does nothing when autoTourney not enabled', () => {
    const state = createMockState({
      flags: { strategicModelingUnlocked: true, autoTourneyEnabled: false },
      tick: 50,
    });
    const result = updateStratModeling(state);
    expect(result).toBe(state);
  });

  it('does nothing on tick 0', () => {
    const state = createMockState({
      flags: { strategicModelingUnlocked: true, autoTourneyEnabled: true },
      tick: 0,
    });
    const result = updateStratModeling(state);
    expect(result).toBe(state);
  });

  it('fires on tick 50', () => {
    const state = createMockState({
      flags: { strategicModelingUnlocked: true, autoTourneyEnabled: true },
      tick: 50,
      stratModelRound: 0,
    });
    const result = updateStratModeling(state);
    expect(result.stratModelRound).toBe(1);
  });

  it('does not fire on tick 49', () => {
    const state = createMockState({
      flags: { strategicModelingUnlocked: true, autoTourneyEnabled: true },
      tick: 49,
    });
    const result = updateStratModeling(state);
    expect(result).toBe(state);
  });

  it('fires on tick 100 as well', () => {
    const state = createMockState({
      flags: { strategicModelingUnlocked: true, autoTourneyEnabled: true },
      tick: 100,
    });
    const result = updateStratModeling(state);
    expect(result.stratModelRound).toBe(1);
  });
});
