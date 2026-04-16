import { describe, it, expect, vi } from 'vitest';
import type { GameState } from '../../src/shared/types';
import { createEngine } from '../../src/core/engine';

describe('GameEngine', () => {
  it('dispatch notifies subscribers; unsubscribe stops notifications', () => {
    const engine = createEngine();
    const listener = vi.fn();
    const unsub = engine.subscribe(listener);

    engine.dispatch({ type: 'MAKE_CLIP' });
    expect(listener).toHaveBeenCalledTimes(1);

    unsub();
    engine.dispatch({ type: 'MAKE_CLIP' });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('MAKE_CLIP is a no-op when wire == 0', () => {
    const engine = createEngine();
    const base = engine.getState();
    const drained: GameState = { ...base, wire: 0 };
    engine.dispatch({ type: 'LOAD_SAVE', state: drained });

    const clipsBefore = engine.getState().clips;
    engine.dispatch({ type: 'MAKE_CLIP' });
    expect(engine.getState().clips).toBe(clipsBefore);
    expect(engine.getState().wire).toBe(0);
  });

  it('BUY_WIRE adds 1000 wire and subtracts wirePrice', () => {
    const engine = createEngine();
    const base = engine.getState();
    const seeded: GameState = { ...base, funds: 100, wirePrice: 20, wire: 500 };
    engine.dispatch({ type: 'LOAD_SAVE', state: seeded });

    engine.dispatch({ type: 'BUY_WIRE' });
    const after = engine.getState();
    expect(after.wire).toBe(1500);
    expect(after.funds).toBeCloseTo(80, 5);
  });

  it('TICK advances state.tick by 1', () => {
    const engine = createEngine();
    const before = engine.getState().tick;
    engine.dispatch({ type: 'TICK' });
    expect(engine.getState().tick).toBe(before + 1);
  });

  it('start() drives setInterval at 100ms; stop() halts it', () => {
    vi.useFakeTimers();
    try {
      const engine = createEngine();
      const t0 = engine.getState().tick;
      engine.start();
      vi.advanceTimersByTime(500);
      const tMid = engine.getState().tick;
      expect(tMid).toBeGreaterThanOrEqual(t0 + 5);
      engine.stop();
      vi.advanceTimersByTime(500);
      expect(engine.getState().tick).toBe(tMid);
    } finally {
      vi.useRealTimers();
    }
  });

  it('reset() restores initial state', () => {
    const engine = createEngine();
    engine.dispatch({ type: 'MAKE_CLIP' });
    expect(engine.getState().clips).toBe(1n);
    engine.reset();
    expect(engine.getState().clips).toBe(0n);
    expect(engine.getState().tick).toBe(0);
  });
});
