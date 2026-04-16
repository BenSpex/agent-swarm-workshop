import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  serializeState,
  deserializeState,
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage,
} from '../../src/core/save';
import { createInitialState } from '../../src/core/initialState';
import type { GameState } from '../../src/shared/types';

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

describe('serializeState / deserializeState', () => {
  it('produces a string', () => {
    const state = createInitialState();
    expect(typeof serializeState(state)).toBe('string');
  });

  it('round-trips an equivalent state', () => {
    const state = createInitialState();
    const round = deserializeState(serializeState(state));
    expect(round.phase).toBe(state.phase);
    expect(round.tick).toBe(state.tick);
    expect(round.clips).toBe(state.clips);
    expect(round.funds).toBe(state.funds);
    expect(round.messages).toEqual(state.messages);
  });

  it('round-trips very large BigInt values', () => {
    const big = 12345678901234567890n;
    const state: GameState = { ...createInitialState(), clips: big };
    const round = deserializeState(serializeState(state));
    expect(round.clips).toBe(big);
    expect(typeof round.clips).toBe('bigint');
  });

  it('round-trips a Set and preserves it as a Set', () => {
    const state: GameState = {
      ...createInitialState(),
      purchasedProjectIds: new Set<string>(['a', 'b']),
    };
    const round = deserializeState(serializeState(state));
    expect(round.purchasedProjectIds).toBeInstanceOf(Set);
    expect(round.purchasedProjectIds.has('a')).toBe(true);
    expect(round.purchasedProjectIds.has('b')).toBe(true);
    expect(round.purchasedProjectIds.size).toBe(2);
  });
});

describe('localStorage round-trip', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', makeLocalStorageMock());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('saveToLocalStorage + loadFromLocalStorage round-trips the full state', () => {
    const state: GameState = {
      ...createInitialState(),
      clips: 987654321n,
      funds: 1234,
      purchasedProjectIds: new Set<string>(['p1', 'p2', 'p3']),
    };
    saveToLocalStorage(state);
    const loaded = loadFromLocalStorage();
    expect(loaded).not.toBeNull();
    expect(loaded!.clips).toBe(987654321n);
    expect(loaded!.funds).toBe(1234);
    expect(loaded!.purchasedProjectIds).toBeInstanceOf(Set);
    expect(loaded!.purchasedProjectIds.has('p2')).toBe(true);
  });

  it('loadFromLocalStorage returns null when key is missing', () => {
    expect(loadFromLocalStorage()).toBeNull();
  });

  it('corrupt JSON → loadFromLocalStorage returns null (no throw)', () => {
    localStorage.setItem('wy-paperclips-save', '}{not json{{');
    expect(() => loadFromLocalStorage()).not.toThrow();
    expect(loadFromLocalStorage()).toBeNull();
  });

  it('clearLocalStorage removes the save', () => {
    saveToLocalStorage(createInitialState());
    expect(loadFromLocalStorage()).not.toBeNull();
    clearLocalStorage();
    expect(loadFromLocalStorage()).toBeNull();
  });
});
