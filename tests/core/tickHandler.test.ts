import { describe, it, expect, beforeEach } from 'vitest';
import { tickReducer, __resetTickRollingWindow } from '../../src/core/tickHandler';
import { actionReducer } from '../../src/core/actionHandlers';
import { createInitialState } from '../../src/core/initialState';
import { GamePhase } from '../../src/shared/types';

describe('tickReducer', () => {
  beforeEach(() => {
    __resetTickRollingWindow();
  });

  it('TICK increments tick counter and does not crash', () => {
    const s0 = createInitialState();
    const s1 = tickReducer(s0);
    expect(s1.tick).toBe(1);
    const s2 = tickReducer(s1);
    expect(s2.tick).toBe(2);
  });

  it('phase 1 → 2 transition when spaceTravelUnlocked', () => {
    const s0 = {
      ...createInitialState(),
      phase: GamePhase.BUSINESS,
      flags: { ...createInitialState().flags, spaceTravelUnlocked: true },
      harvesterDrones: 0,
    };
    const s1 = tickReducer(s0);
    expect(s1.phase).toBe(GamePhase.EARTH);
    expect(s1.flags.phase2Unlocked).toBe(true);
    expect(s1.harvesterDrones).toBeGreaterThanOrEqual(10);
    expect(s1.messages[0]).toBe('>>> PHASE 2: EARTH OPERATIONS <<<');
  });

  it('phase 2 → 3 transition when phase3Unlocked', () => {
    const base = createInitialState();
    const s0 = {
      ...base,
      phase: GamePhase.EARTH,
      flags: { ...base.flags, phase3Unlocked: true },
    };
    const s1 = tickReducer(s0);
    expect(s1.phase).toBe(GamePhase.UNIVERSE);
    expect(s1.messages[0]).toBe('>>> PHASE 3: GALACTIC EXPANSION <<<');
  });
});

describe('actionReducer — ADJUST_PROBE', () => {
  it('increment speed when probeTrust=3 and all stats=1 (available=3)', () => {
    const base = createInitialState();
    const s0 = { ...base, probeTrust: 3 };
    const s1 = actionReducer(s0, { type: 'ADJUST_PROBE', stat: 'speed', delta: 1 });
    expect(s1.probeSpeed).toBe(2);
    expect(s1.probeTrust).toBe(3);
  });

  it('decrement guarded when stat is already 1', () => {
    const base = createInitialState();
    const s0 = { ...base, probeTrust: 3 };
    expect(s0.probeSpeed).toBe(1);
    const s1 = actionReducer(s0, { type: 'ADJUST_PROBE', stat: 'speed', delta: -1 });
    expect(s1).toBe(s0);
  });

  it('increment guarded when available trust is 0', () => {
    const base = createInitialState();
    const s0 = { ...base, probeTrust: 0 };
    const s1 = actionReducer(s0, { type: 'ADJUST_PROBE', stat: 'speed', delta: 1 });
    expect(s1).toBe(s0);
  });
});

describe('actionReducer — BUY_PROJECT', () => {
  it('unknown id → state unchanged, no throw', () => {
    const s0 = createInitialState();
    let s1: typeof s0 | undefined;
    expect(() => {
      s1 = actionReducer(s0, { type: 'BUY_PROJECT', projectId: 'does-not-exist' });
    }).not.toThrow();
    expect(s1).toBe(s0);
  });
});
