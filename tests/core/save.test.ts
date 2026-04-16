import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { GameState } from '../../src/shared/types';
import { GamePhase } from '../../src/shared/types';
import {
  SAVE_KEY,
  bigIntReplacer,
  bigIntReviver,
  serializeState,
  deserializeState,
  saveToLocalStorage,
  loadFromLocalStorage,
  clearSave,
} from '../../src/core/save';

function makeState(overrides: Partial<GameState> = {}): GameState {
  const base: GameState = {
    phase: GamePhase.BUSINESS,
    tick: 0,
    flags: {
      autoClippersUnlocked: false, megaClippersUnlocked: false, investmentUnlocked: false,
      quantumUnlocked: false, wireBuyerUnlocked: false, creativityUnlocked: false,
      phase2Unlocked: false, phase3Unlocked: false, prestigeUnlocked: false,
      hypnoHarmonicsActive: false, limericksActive: false, lexicalProcessingActive: false,
      combinatoryHarmonicsActive: false, hadwigerProblemSolved: false,
      tothSausageConjectureSolved: false, donkeySpaceActive: false,
      xavierInitialized: false, hostileTakeoverActive: false, fullAutoClippersActive: false,
      spaceTravelUnlocked: false, strategicModelingUnlocked: false, autoTourneyEnabled: false,
      swarmSyncActive: false, matterHarvestingActive: false, revTrackerEnabled: false,
    },
    messages: ['hello', 'world'],
    clips: 0n, unsoldClips: 0n, funds: 0, price: 0.25, demand: 1.0,
    wire: 1000, wirePrice: 20,
    autoClipperCount: 0, megaClipperCount: 0, autoClipperCost: 5, megaClipperCost: 500,
    marketingLevel: 1, marketingCost: 100, trust: 2,
    processors: 1, memory: 1, operations: 0, maxOperations: 1000,
    creativity: 0, opsGenerationRate: 1,
    clipsPerSecond: 0, revenuePerSecond: 0, clipsSoldPerSecond: 0,
    wireBuyerEnabled: false, yomi: 0, stratModelRound: 0,
    investment: null,
    harvesterDrones: 0, wireDrones: 0, clipFactories: 0n,
    solarFarms: 0, batteries: 0, storedPower: 0, momentum: 0,
    matter: 0, acquiredMatter: 0, swarmSyncLevel: 0, swarmGiftTimer: 0,
    probes: 0n, probeTrust: 0,
    probeSpeed: 1, probeExploration: 1, probeSelfReplication: 1,
    probeCombat: 1, probeHazardRemediation: 1,
    probeFactoryProd: 1, probeHarvesterProd: 1, probeWireDroneProd: 1,
    honor: 0, exploredSectors: 0n, drifterCount: 0n,
    probeDescendants: 0n, probeLosses: 0n,
    prestigeCount: 0, universalPaperclips: 0n,
    purchasedProjectIds: new Set<string>(),
  };
  return { ...base, ...overrides };
}

class MemoryStorage implements Storage {
  private store = new Map<string, string>();
  get length(): number { return this.store.size; }
  clear(): void { this.store.clear(); }
  getItem(key: string): string | null { return this.store.has(key) ? this.store.get(key)! : null; }
  key(index: number): string | null { return Array.from(this.store.keys())[index] ?? null; }
  removeItem(key: string): void { this.store.delete(key); }
  setItem(key: string, value: string): void { this.store.set(key, value); }
}

describe('bigIntReplacer / bigIntReviver', () => {
  it('round-trips bigint 0n, 1n, and 10n**30n', () => {
    const values = [0n, 1n, 10n ** 30n];
    for (const v of values) {
      const json = JSON.stringify({ n: v }, bigIntReplacer);
      const parsed = JSON.parse(json, bigIntReviver) as { n: bigint };
      expect(typeof parsed.n).toBe('bigint');
      expect(parsed.n === v).toBe(true);
    }
  });

  it('round-trips an empty Set', () => {
    const json = JSON.stringify({ s: new Set<string>() }, bigIntReplacer);
    const parsed = JSON.parse(json, bigIntReviver) as { s: Set<string> };
    expect(parsed.s).toBeInstanceOf(Set);
    expect(parsed.s.size).toBe(0);
  });

  it('round-trips a Set with 3 strings', () => {
    const original = new Set(['alpha', 'beta', 'gamma']);
    const json = JSON.stringify({ s: original }, bigIntReplacer);
    const parsed = JSON.parse(json, bigIntReviver) as { s: Set<string> };
    expect(parsed.s).toBeInstanceOf(Set);
    expect(parsed.s.size).toBe(3);
    expect(parsed.s.has('alpha')).toBe(true);
    expect(parsed.s.has('beta')).toBe(true);
    expect(parsed.s.has('gamma')).toBe(true);
  });
});

describe('serializeState / deserializeState', () => {
  it('full GameState round-trips with bigints and Set intact', () => {
    const original = makeState({
      clips: 10n ** 20n,
      unsoldClips: 42n,
      clipFactories: 7n,
      probes: 1234n,
      universalPaperclips: 10n ** 25n,
      exploredSectors: 999n,
      drifterCount: 0n,
      probeDescendants: 500n,
      probeLosses: 3n,
      funds: 123.45,
      price: 0.37,
      messages: ['one', 'two'],
      purchasedProjectIds: new Set(['p1', 'p2', 'p3']),
      investment: { stocks: 10, bonds: 20, totalPortfolio: 30, riskLevel: 1, returnRate: 0.05 },
    });
    const restored = deserializeState(serializeState(original));

    expect(restored.clips === original.clips).toBe(true);
    expect(restored.unsoldClips === original.unsoldClips).toBe(true);
    expect(restored.clipFactories === original.clipFactories).toBe(true);
    expect(restored.probes === original.probes).toBe(true);
    expect(restored.universalPaperclips === original.universalPaperclips).toBe(true);
    expect(restored.exploredSectors === original.exploredSectors).toBe(true);
    expect(restored.drifterCount === original.drifterCount).toBe(true);
    expect(restored.probeDescendants === original.probeDescendants).toBe(true);
    expect(restored.probeLosses === original.probeLosses).toBe(true);

    expect(restored.funds).toBe(original.funds);
    expect(restored.price).toBe(original.price);
    expect(restored.messages).toEqual(original.messages);

    expect(restored.purchasedProjectIds).toBeInstanceOf(Set);
    expect(restored.purchasedProjectIds.size).toBe(3);
    expect(restored.purchasedProjectIds.has('p1')).toBe(true);
    expect(restored.purchasedProjectIds.has('p2')).toBe(true);
    expect(restored.purchasedProjectIds.has('p3')).toBe(true);

    expect(restored.investment).toEqual(original.investment);
    expect(restored.flags).toEqual(original.flags);
  });
});

describe('localStorage integration', () => {
  let originalStorage: Storage | undefined;

  beforeEach(() => {
    originalStorage = (globalThis as { localStorage?: Storage }).localStorage;
    (globalThis as { localStorage?: Storage }).localStorage = new MemoryStorage();
  });

  afterEach(() => {
    if (originalStorage === undefined) {
      delete (globalThis as { localStorage?: Storage }).localStorage;
    } else {
      (globalThis as { localStorage?: Storage }).localStorage = originalStorage;
    }
  });

  it('save → load preserves state', () => {
    const original = makeState({ clips: 10n ** 18n, purchasedProjectIds: new Set(['x']) });
    saveToLocalStorage(original);
    const loaded = loadFromLocalStorage();
    expect(loaded).not.toBeNull();
    expect(loaded!.clips === original.clips).toBe(true);
    expect(loaded!.purchasedProjectIds.has('x')).toBe(true);
  });

  it('loadFromLocalStorage returns null when key absent', () => {
    expect(loadFromLocalStorage()).toBeNull();
  });

  it('loadFromLocalStorage returns null (no throw) on corrupt JSON', () => {
    globalThis.localStorage.setItem(SAVE_KEY, '{not valid json');
    expect(() => loadFromLocalStorage()).not.toThrow();
    expect(loadFromLocalStorage()).toBeNull();
  });

  it('clearSave removes the saved payload', () => {
    saveToLocalStorage(makeState());
    expect(loadFromLocalStorage()).not.toBeNull();
    clearSave();
    expect(loadFromLocalStorage()).toBeNull();
  });
});
