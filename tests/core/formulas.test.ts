import { describe, it, expect } from 'vitest';
import {
  calculateDemand,
  calculateAutoClipperCost,
  calculateMegaClipperCost,
  calculateMarketingCost,
  sellClips,
  produceAutoClips,
  fluctuateWirePrice,
} from '../../src/core/formulas';
import { createInitialState } from '../../src/core/initialState';
import type { GameFlags } from '../../src/shared/types';

const FLAGS_OFF: GameFlags = {
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
};

describe('calculateDemand', () => {
  it('higher price → lower demand (same marketing)', () => {
    const low = calculateDemand(0.10, 1, FLAGS_OFF);
    const high = calculateDemand(0.40, 1, FLAGS_OFF);
    expect(low).toBeGreaterThan(high);
  });

  it('marketing level 10 > marketing level 1', () => {
    const l10 = calculateDemand(0.25, 10, FLAGS_OFF);
    const l1 = calculateDemand(0.25, 1, FLAGS_OFF);
    expect(l10).toBeGreaterThan(l1);
  });

  it('demand is clamped ≥ 0 even at extreme price', () => {
    expect(calculateDemand(100, 1, FLAGS_OFF)).toBeGreaterThanOrEqual(0);
    expect(calculateDemand(100, 10, FLAGS_OFF)).toBeGreaterThanOrEqual(0);
  });
});

describe('calculateAutoClipperCost', () => {
  it('count=0 → 5', () => {
    expect(calculateAutoClipperCost(0)).toBe(5);
  });

  it('monotonically non-decreasing and strictly grows over distance', () => {
    const c0 = calculateAutoClipperCost(0);
    const c10 = calculateAutoClipperCost(10);
    const c20 = calculateAutoClipperCost(20);
    expect(c10).toBeGreaterThan(c0);
    expect(c20).toBeGreaterThan(c10);
    for (let i = 0; i < 20; i++) {
      expect(calculateAutoClipperCost(i + 1)).toBeGreaterThanOrEqual(
        calculateAutoClipperCost(i),
      );
    }
  });
});

describe('calculateMegaClipperCost', () => {
  it('count=0 → 500', () => {
    expect(calculateMegaClipperCost(0)).toBe(500);
  });

  it('grows over distance', () => {
    expect(calculateMegaClipperCost(20)).toBeGreaterThan(calculateMegaClipperCost(0));
  });
});

describe('calculateMarketingCost', () => {
  it('level=1 → 100', () => {
    expect(calculateMarketingCost(1)).toBe(100);
  });

  it('level=2 → 200', () => {
    expect(calculateMarketingCost(2)).toBe(200);
  });
});

describe('sellClips', () => {
  it('no sale when unsoldClips=0', () => {
    const base = createInitialState();
    const s = { ...base, unsoldClips: 0n, price: 1, demand: 10 };
    const next = sellClips(s);
    expect(next).toBe(s);
  });

  it('increases funds, decreases unsoldClips when demand+price+stock > 0', () => {
    const base = createInitialState();
    const s = { ...base, unsoldClips: 100n, price: 1, demand: 10, funds: 0 };
    const next = sellClips(s);
    expect(next.funds).toBeGreaterThan(0);
    expect(next.unsoldClips).toBeLessThan(100n);
  });

  it('no sale when price=0', () => {
    const base = createInitialState();
    const s = { ...base, unsoldClips: 100n, price: 0, demand: 10, funds: 0 };
    const next = sellClips(s);
    expect(next.funds).toBe(0);
  });

  it('no sale when demand=0', () => {
    const base = createInitialState();
    const s = { ...base, unsoldClips: 100n, price: 1, demand: 0, funds: 0 };
    const next = sellClips(s);
    expect(next).toBe(s);
  });
});

describe('produceAutoClips', () => {
  it('0 autoclippers → identity', () => {
    const base = createInitialState();
    const s = { ...base, autoClipperCount: 0, wire: 1000 };
    const next = produceAutoClips(s);
    expect(next).toBe(s);
  });

  it('10 autoclippers + wire ≥ 1 → clips increase, wire decreases', () => {
    const base = createInitialState();
    const s = {
      ...base,
      autoClipperCount: 10,
      wire: 1000,
      clips: 0n,
      unsoldClips: 0n,
    };
    const next = produceAutoClips(s);
    expect(next.clips).toBeGreaterThan(0n);
    expect(next.wire).toBeLessThan(1000);
  });

  it('autoclippers but wire=0 → identity', () => {
    const base = createInitialState();
    const s = { ...base, autoClipperCount: 10, wire: 0 };
    expect(produceAutoClips(s)).toBe(s);
  });
});

describe('fluctuateWirePrice', () => {
  it('rnd=0 → price decreases by 1', () => {
    expect(fluctuateWirePrice(20, 0)).toBe(19);
  });

  it('rnd=1 → price increases by 1', () => {
    expect(fluctuateWirePrice(20, 1)).toBe(21);
  });

  it('clamps to lower bound 10', () => {
    expect(fluctuateWirePrice(10, 0)).toBe(10);
  });

  it('clamps to upper bound 35', () => {
    expect(fluctuateWirePrice(35, 1)).toBe(35);
  });
});
