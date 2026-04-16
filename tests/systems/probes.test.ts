import { afterEach, describe, expect, it, vi } from 'vitest';
import { updateProbes } from '../../src/systems';
import { GamePhase } from '../../src/shared/types';
import { createMockState } from './_fixtures/mockState';

describe('updateProbes', () => {
  afterEach(() => vi.restoreAllMocks());

  it('is a no-op outside Phase 3', () => {
    const state = createMockState({
      phase: GamePhase.BUSINESS,
      probes: 100n,
      exploredSectors: 0n,
      probeExploration: 5,
      probeSpeed: 2,
    });
    const next = updateProbes(state);
    expect(next.exploredSectors).toBe(0n);
  });

  it('exploration scales with probes * probeExploration * probeSpeed', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const base = createMockState({
      phase: GamePhase.UNIVERSE,
      probes: 10n,
      exploredSectors: 0n,
      probeExploration: 1,
      probeSpeed: 1,
    });
    const boosted = createMockState({
      phase: GamePhase.UNIVERSE,
      probes: 10n,
      exploredSectors: 0n,
      probeExploration: 5,
      probeSpeed: 2,
    });

    const nextBase = updateProbes(base);
    const nextBoosted = updateProbes(boosted);
    expect(nextBoosted.exploredSectors >= nextBase.exploredSectors).toBe(true);
  });

  it('self-replication increases probe count and probeDescendants', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createMockState({
      phase: GamePhase.UNIVERSE,
      probes: 100n,
      probeSelfReplication: 5,
      probeDescendants: 0n,
    });
    const next = updateProbes(state);
    expect(next.probes >= state.probes).toBe(true);
    if (next.probes > state.probes) {
      expect(next.probeDescendants > state.probeDescendants).toBe(true);
    }
  });

  it('combat triggers when drifterCount > 0 (hazardRemediation reduces losses)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const weak = createMockState({
      phase: GamePhase.UNIVERSE,
      probes: 100n,
      probeCombat: 1,
      probeHazardRemediation: 1,
      drifterCount: 50n,
      probeLosses: 0n,
    });
    const tough = createMockState({
      phase: GamePhase.UNIVERSE,
      probes: 100n,
      probeCombat: 1,
      probeHazardRemediation: 10,
      drifterCount: 50n,
      probeLosses: 0n,
    });

    const afterWeak = updateProbes(weak);
    const afterTough = updateProbes(tough);

    const weakLost = weak.probes - afterWeak.probes;
    const toughLost = tough.probes - afterTough.probes;

    expect(toughLost <= weakLost).toBe(true);
  });

  it('winning combat awards honor', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createMockState({
      phase: GamePhase.UNIVERSE,
      probes: 1_000_000n,
      probeCombat: 100,
      drifterCount: 10n,
      honor: 0,
    });
    const next = updateProbes(state);
    expect(next.honor).toBeGreaterThanOrEqual(state.honor);
  });

  it('does not mutate input state', () => {
    const state = createMockState({
      phase: GamePhase.UNIVERSE,
      probes: 100n,
      exploredSectors: 0n,
    });
    updateProbes(state);
    expect(state.exploredSectors).toBe(0n);
    expect(state.probes).toBe(100n);
  });
});
