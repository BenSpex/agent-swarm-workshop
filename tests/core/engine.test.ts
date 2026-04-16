import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createEngine } from '../../src/core/engine';
import { __resetTickRollingWindow } from '../../src/core/tickHandler';

function makeLocalStorageMock(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => {
      store.set(k, String(v));
    },
    removeItem: (k: string) => {
      store.delete(k);
    },
    key: (i: number) => Array.from(store.keys())[i] ?? null,
  } as Storage;
}

describe('createEngine', () => {
  beforeEach(() => {
    __resetTickRollingWindow();
    vi.stubGlobal('localStorage', makeLocalStorageMock());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('returns an object with all GameEngine methods', () => {
    const eng = createEngine();
    expect(typeof eng.getState).toBe('function');
    expect(typeof eng.dispatch).toBe('function');
    expect(typeof eng.subscribe).toBe('function');
    expect(typeof eng.start).toBe('function');
    expect(typeof eng.stop).toBe('function');
    expect(typeof eng.save).toBe('function');
    expect(typeof eng.load).toBe('function');
    expect(typeof eng.reset).toBe('function');
    expect(typeof eng.getMessages).toBe('function');
  });

  it('dispatch(MAKE_CLIP) with wire≥1 → clips 0n → 1n, wire -1', () => {
    const eng = createEngine();
    const initialWire = eng.getState().wire;
    expect(eng.getState().clips).toBe(0n);
    eng.dispatch({ type: 'MAKE_CLIP' });
    expect(eng.getState().clips).toBe(1n);
    expect(eng.getState().wire).toBe(initialWire - 1);
  });

  it('subscribe fires on every dispatch; unsubscribe stops callbacks', () => {
    const eng = createEngine();
    const calls: number[] = [];
    const unsub = eng.subscribe((s) => {
      calls.push(s.tick);
    });
    eng.dispatch({ type: 'MAKE_CLIP' });
    eng.dispatch({ type: 'MAKE_CLIP' });
    expect(calls.length).toBe(2);
    unsub();
    eng.dispatch({ type: 'MAKE_CLIP' });
    expect(calls.length).toBe(2);
  });

  it('start() advances tick with fake timers, stop() halts ticks', () => {
    vi.useFakeTimers();
    const eng = createEngine();
    eng.start();
    vi.advanceTimersByTime(350);
    const ticksAfterRun = eng.getState().tick;
    expect(ticksAfterRun).toBeGreaterThanOrEqual(3);
    eng.stop();
    vi.advanceTimersByTime(500);
    expect(eng.getState().tick).toBe(ticksAfterRun);
  });

  it('start() and stop() are idempotent', () => {
    vi.useFakeTimers();
    const eng = createEngine();
    eng.start();
    eng.start();
    vi.advanceTimersByTime(350);
    const tickCount = eng.getState().tick;
    expect(tickCount).toBeGreaterThanOrEqual(3);
    expect(tickCount).toBeLessThanOrEqual(4);
    eng.stop();
    eng.stop();
    vi.advanceTimersByTime(500);
    expect(eng.getState().tick).toBe(tickCount);
  });

  it('reset() restores initial state', () => {
    const eng = createEngine();
    eng.dispatch({ type: 'MAKE_CLIP' });
    eng.dispatch({ type: 'MAKE_CLIP' });
    expect(eng.getState().clips).toBe(2n);
    eng.reset();
    const s = eng.getState();
    expect(s.clips).toBe(0n);
    expect(s.tick).toBe(0);
    expect(s.messages).toEqual(['Welcome to Universal Paperclips.']);
  });

  it('save() + new engine + load() restores state', () => {
    const eng1 = createEngine();
    eng1.dispatch({ type: 'MAKE_CLIP' });
    eng1.dispatch({ type: 'MAKE_CLIP' });
    eng1.dispatch({ type: 'MAKE_CLIP' });
    const wireBefore = eng1.getState().wire;
    const clipsBefore = eng1.getState().clips;
    eng1.save();

    const eng2 = createEngine();
    expect(eng2.getState().clips).toBe(0n);
    const ok = eng2.load();
    expect(ok).toBe(true);
    expect(eng2.getState().clips).toBe(clipsBefore);
    expect(eng2.getState().wire).toBe(wireBefore);
  });

  it('load() returns false when no save exists', () => {
    const eng = createEngine();
    expect(eng.load()).toBe(false);
  });
});
