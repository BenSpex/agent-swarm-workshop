import { describe, it, expect } from 'vitest';
import { GamePhase, type GameFlags, type GameState } from '../../src/shared/types';
import {
  calculateDemand,
  calculateAutoClipperCost,
  calculateMegaClipperCost,
  calculateMarketingCost,
  sellClips,
  produceAutoClips,
  produceMegaClips,
  fluctuateWirePrice,
  WIRE_PRICE_MIN,
  WIRE_PRICE_MAX,
  AUTOCLIPPER_BASE_COST,
  AUTOCLIPPER_COST_GROWTH,
  MEGACLIPPER_BASE_COST,
  MEGACLIPPER_COST_GROWTH,
  MARKETING_BASE_COST,
} from '../../src/core/formulas';

function makeFlags(overrides: Partial<GameFlags> = {}): GameFlags {
  return {
    autoClippersUnlocked: false,
    megaClippersUnlocked: false,
    investmentUnlocked: false,
    quantumUnlocked: false,
    wireBuyerUnlocked: false,
    creativityUnlocked: false,
    phase2Unlocked: false,
    phase3Unlocked: false,
    prestigeUnlocked: false,
    hypnoHarmonicsActive: false,
    limericksActive: false,
    lexicalProcessingActive: false,
    combinatoryHarmonicsActive: false,
    hadwigerProblemSolved: false,
    tothSausageConjectureSolved: false,
    donkeySpaceActive: false,
    xavierInitialized: false,
    hostileTakeoverActive: false,
    fullAutoClippersActive: false,
    spaceTravelUnlocked: false,
    strategicModelingUnlocked: false,
    autoTourneyEnabled: false,
    swarmSyncActive: false,
    matterHarvestingActive: false,
    revTrackerEnabled: false,
    ...overrides,
  };
}

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    phase: GamePhase.BUSINESS,
    tick: 0,
    flags: makeFlags(),
    messages: [],

    clips: 0n,
    unsoldClips: 0n,
    funds: 0,
    price: 0.25,
    demand: 0,
    wire: 0,
    wirePrice: 20,
    autoClipperCount: 0,
    megaClipperCount: 0,
    autoClipperCost: 5,
    megaClipperCost: 500,
    marketingLevel: 1,
    marketingCost: 100,
    trust: 2,
    processors: 1,
    memory: 1,
    operations: 0,
    maxOperations: 1000,
    creativity: 0,
    opsGenerationRate: 0,

    clipsPerSecond: 0,
    revenuePerSecond: 0,
    clipsSoldPerSecond: 0,
    wireBuyerEnabled: false,
    yomi: 0,
    stratModelRound: 0,

    investment: null,

    harvesterDrones: 0,
    wireDrones: 0,
    clipFactories: 0n,
    solarFarms: 0,
    batteries: 0,
    storedPower: 0,
    momentum: 0,
    matter: 0,
    acquiredMatter: 0,
    swarmSyncLevel: 0,
    swarmGiftTimer: 0,

    probes: 0n,
    probeTrust: 0,
    probeSpeed: 1,
    probeExploration: 1,
    probeSelfReplication: 1,
    probeCombat: 1,
    probeHazardRemediation: 1,
    probeFactoryProd: 1,
    probeHarvesterProd: 1,
    probeWireDroneProd: 1,
    honor: 0,
    exploredSectors: 0n,
    drifterCount: 0n,
    probeDescendants: 0n,
    probeLosses: 0n,

    prestigeCount: 0,
    universalPaperclips: 0n,

    purchasedProjectIds: new Set<string>(),
    ...overrides,
  };
}

describe('calculateDemand', () => {
  it('decreases as price rises', () => {
    const flags = makeFlags();
    const low = calculateDemand(0.1, 1, flags);
    const high = calculateDemand(5, 1, flags);
    expect(low).toBeGreaterThan(high);
  });

  it('increases with marketing level', () => {
    const flags = makeFlags();
    const m1 = calculateDemand(0.25, 1, flags);
    const m5 = calculateDemand(0.25, 5, flags);
    expect(m5).toBeGreaterThan(m1);
  });

  it('hypnoHarmonics multiplier boosts demand ~1.5x', () => {
    const base = calculateDemand(0.5, 1, makeFlags());
    const boosted = calculateDemand(0.5, 1, makeFlags({ hypnoHarmonicsActive: true }));
    expect(boosted).toBeCloseTo(base * 1.5, 5);
  });

  it('limericks multiplier stacks on top', () => {
    const base = calculateDemand(0.5, 1, makeFlags());
    const both = calculateDemand(
      0.5,
      1,
      makeFlags({ hypnoHarmonicsActive: true, limericksActive: true }),
    );
    expect(both).toBeCloseTo(base * 1.5 * 1.5, 5);
  });

  it('returns 0 for zero or negative price', () => {
    expect(calculateDemand(0, 1, makeFlags())).toBe(0);
    expect(calculateDemand(-1, 1, makeFlags())).toBe(0);
  });
});

describe('calculateAutoClipperCost', () => {
  it('starts at 5 for count 0', () => {
    expect(calculateAutoClipperCost(0)).toBe(AUTOCLIPPER_BASE_COST);
  });

  it('is monotonically increasing', () => {
    let prev = calculateAutoClipperCost(0);
    for (let i = 1; i < 50; i++) {
      const next = calculateAutoClipperCost(i);
      expect(next).toBeGreaterThanOrEqual(prev);
      prev = next;
    }
  });

  it('matches ceil(5 * 1.1^count)', () => {
    expect(calculateAutoClipperCost(10)).toBe(
      Math.ceil(AUTOCLIPPER_BASE_COST * Math.pow(AUTOCLIPPER_COST_GROWTH, 10)),
    );
  });

  it('handles negative counts gracefully', () => {
    expect(calculateAutoClipperCost(-1)).toBe(AUTOCLIPPER_BASE_COST);
  });
});

describe('calculateMegaClipperCost', () => {
  it('starts at 500 for count 0', () => {
    expect(calculateMegaClipperCost(0)).toBe(MEGACLIPPER_BASE_COST);
  });

  it('is monotonically increasing', () => {
    let prev = calculateMegaClipperCost(0);
    for (let i = 1; i < 50; i++) {
      const next = calculateMegaClipperCost(i);
      expect(next).toBeGreaterThanOrEqual(prev);
      prev = next;
    }
  });

  it('matches ceil(500 * 1.07^count)', () => {
    expect(calculateMegaClipperCost(10)).toBe(
      Math.ceil(MEGACLIPPER_BASE_COST * Math.pow(MEGACLIPPER_COST_GROWTH, 10)),
    );
  });
});

describe('calculateMarketingCost', () => {
  it('is 100 at level 1', () => {
    expect(calculateMarketingCost(1)).toBe(MARKETING_BASE_COST);
  });

  it('doubles each level', () => {
    expect(calculateMarketingCost(2)).toBe(200);
    expect(calculateMarketingCost(3)).toBe(400);
    expect(calculateMarketingCost(4)).toBe(800);
  });

  it('clamps level to at least 1', () => {
    expect(calculateMarketingCost(0)).toBe(MARKETING_BASE_COST);
  });
});

describe('sellClips', () => {
  it('is a no-op when unsoldClips is 0', () => {
    const state = makeState({ unsoldClips: 0n, demand: 10, price: 1 });
    const next = sellClips(state);
    expect(next).toBe(state);
  });

  it('is a no-op when demand is 0', () => {
    const state = makeState({ unsoldClips: 100n, demand: 0, price: 1 });
    const next = sellClips(state);
    expect(next).toBe(state);
  });

  it('sells min(unsoldClips, floor(demand)) and updates funds', () => {
    const state = makeState({
      unsoldClips: 100n,
      demand: 30,
      price: 0.25,
      funds: 0,
    });
    const next = sellClips(state);
    expect(next.unsoldClips).toBe(70n);
    expect(next.funds).toBeCloseTo(30 * 0.25, 10);
  });

  it('caps sales at unsoldClips inventory', () => {
    const state = makeState({
      unsoldClips: 5n,
      demand: 100,
      price: 1,
      funds: 0,
    });
    const next = sellClips(state);
    expect(next.unsoldClips).toBe(0n);
    expect(next.funds).toBe(5);
  });

  it('preserves bigint type on unsoldClips', () => {
    const state = makeState({
      unsoldClips: 1_000_000_000_000_000_000n,
      demand: 10,
      price: 1,
    });
    const next = sellClips(state);
    expect(typeof next.unsoldClips).toBe('bigint');
    expect(next.unsoldClips).toBe(1_000_000_000_000_000_000n - 10n);
  });

  it('does not mutate input state', () => {
    const state = makeState({ unsoldClips: 10n, demand: 5, price: 1, funds: 0 });
    sellClips(state);
    expect(state.unsoldClips).toBe(10n);
    expect(state.funds).toBe(0);
  });
});

describe('produceAutoClips', () => {
  it('is a no-op with 0 autoclippers', () => {
    const state = makeState({ autoClipperCount: 0, wire: 100 });
    const next = produceAutoClips(state);
    expect(next).toBe(state);
  });

  it('is a no-op with 0 wire (wire gate)', () => {
    const state = makeState({ autoClipperCount: 100, wire: 0 });
    const next = produceAutoClips(state);
    expect(next).toBe(state);
    expect(next.clips).toBe(0n);
    expect(next.unsoldClips).toBe(0n);
  });

  it('consumes 1 wire per produced clip', () => {
    const state = makeState({ autoClipperCount: 100, wire: 100 });
    const next = produceAutoClips(state);
    const produced = Number(next.clips);
    expect(produced).toBeGreaterThan(0);
    expect(next.wire).toBe(100 - produced);
    expect(next.unsoldClips).toBe(BigInt(produced));
  });

  it('caps production at available wire', () => {
    const state = makeState({ autoClipperCount: 10_000, wire: 3 });
    const next = produceAutoClips(state);
    expect(next.wire).toBeGreaterThanOrEqual(0);
    expect(Number(next.clips)).toBeLessThanOrEqual(3);
  });

  it('preserves bigint type on clips/unsoldClips', () => {
    const state = makeState({
      autoClipperCount: 100,
      wire: 100,
      clips: 5_000_000_000_000n,
      unsoldClips: 1_000_000_000_000n,
    });
    const next = produceAutoClips(state);
    expect(typeof next.clips).toBe('bigint');
    expect(typeof next.unsoldClips).toBe('bigint');
  });
});

describe('produceMegaClips', () => {
  it('is a no-op with 0 megaclippers', () => {
    const state = makeState({ megaClipperCount: 0, wire: 100 });
    const next = produceMegaClips(state);
    expect(next).toBe(state);
  });

  it('is a no-op with 0 wire', () => {
    const state = makeState({ megaClipperCount: 10, wire: 0 });
    const next = produceMegaClips(state);
    expect(next).toBe(state);
  });

  it('produces dramatically more than autoclippers', () => {
    const baseline = makeState({ autoClipperCount: 10, wire: 1_000_000 });
    const mega = makeState({ megaClipperCount: 10, wire: 1_000_000 });
    const afterAuto = produceAutoClips(baseline);
    const afterMega = produceMegaClips(mega);
    expect(Number(afterMega.clips)).toBeGreaterThan(Number(afterAuto.clips));
  });
});

describe('fluctuateWirePrice', () => {
  it('keeps wirePrice within [WIRE_PRICE_MIN, WIRE_PRICE_MAX]', () => {
    let state = makeState({ wirePrice: 20 });
    for (let i = 0; i < 1000; i++) {
      state = fluctuateWirePrice(state);
      expect(state.wirePrice).toBeGreaterThanOrEqual(WIRE_PRICE_MIN);
      expect(state.wirePrice).toBeLessThanOrEqual(WIRE_PRICE_MAX);
    }
  });

  it('clamps at upper bound', () => {
    const state = makeState({ wirePrice: WIRE_PRICE_MAX });
    for (let i = 0; i < 100; i++) {
      const next = fluctuateWirePrice(state);
      expect(next.wirePrice).toBeLessThanOrEqual(WIRE_PRICE_MAX);
    }
  });

  it('clamps at lower bound', () => {
    const state = makeState({ wirePrice: WIRE_PRICE_MIN });
    for (let i = 0; i < 100; i++) {
      const next = fluctuateWirePrice(state);
      expect(next.wirePrice).toBeGreaterThanOrEqual(WIRE_PRICE_MIN);
    }
  });
});
