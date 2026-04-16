import { describe, it, expect } from 'vitest';
import { createMockState } from './_helpers';
import { updateProbes } from '../../src/systems/probes';
import { GamePhase } from '../../src/shared/types';

describe('updateProbes', () => {
  it('returns state unchanged outside UNIVERSE phase', () => {
    const state = createMockState({
      phase: GamePhase.BUSINESS,
      probes: 100n,
    });
    const result = updateProbes(state);
    expect(result).toBe(state);
  });

  it('returns state unchanged with zero probes', () => {
    const state = createMockState({
      phase: GamePhase.UNIVERSE,
      probes: 0n,
    });
    const result = updateProbes(state);
    expect(result).toBe(state);
  });

  it('exploration grows exploredSectors (probes * exploration * speed)', () => {
    const state = createMockState({
      phase: GamePhase.UNIVERSE,
      probes: 100n,
      probeExploration: 1,
      probeSpeed: 2,
      probeSelfReplication: 0,
      exploredSectors: 0n,
      drifterCount: 0n,
    });
    const result = updateProbes(state);
    expect(result.exploredSectors).toBe(200n);
  });

  it('probeSpeed acts as a multiplier on exploration', () => {
    const slow = updateProbes(
      createMockState({
        phase: GamePhase.UNIVERSE,
        probes: 100n,
        probeExploration: 1,
        probeSpeed: 1,
        probeSelfReplication: 0,
      }),
    );
    const fast = updateProbes(
      createMockState({
        phase: GamePhase.UNIVERSE,
        probes: 100n,
        probeExploration: 1,
        probeSpeed: 3,
        probeSelfReplication: 0,
      }),
    );
    expect(fast.exploredSectors).toBeGreaterThan(slow.exploredSectors);
  });

  it('self-replication grows probes and probeDescendants together', () => {
    const state = createMockState({
      phase: GamePhase.UNIVERSE,
      probes: 100000n,
      probeSelfReplication: 10,
      probeExploration: 0,
      probeSpeed: 0,
      exploredSectors: 0n,
      drifterCount: 0n,
      probeDescendants: 0n,
    });
    const result = updateProbes(state);
    expect(result.probes).toBeGreaterThan(state.probes);
    expect(result.probeDescendants).toBeGreaterThan(0n);
    expect(result.probeDescendants).toBe(result.probes - state.probes);
  });

  it('probeLosses is bigint', () => {
    const state = createMockState({
      phase: GamePhase.UNIVERSE,
      probes: 100n,
      drifterCount: 0n,
    });
    const result = updateProbes(state);
    expect(typeof result.probeLosses).toBe('bigint');
  });

  it('combat produces either honor or probeLosses over many iterations', () => {
    let state = createMockState({
      phase: GamePhase.UNIVERSE,
      probes: 100n,
      probeCombat: 5,
      probeExploration: 0,
      probeSpeed: 0,
      probeSelfReplication: 0,
      drifterCount: 10n,
      probeHazardRemediation: 0,
    });
    const startHonor = state.honor;
    const startLosses = state.probeLosses;
    for (let i = 0; i < 100; i++) {
      state = updateProbes(state);
      if (state.probes <= 0n) break;
      if (state.drifterCount === 0n && state.honor === startHonor) {
        // drifters defeated but before next combat, re-arm
        state = { ...state, drifterCount: 10n };
      }
    }
    const resolved = state.honor > startHonor || state.probeLosses > startLosses;
    expect(resolved).toBe(true);
  });

  it('hazardRemediation reduces probe losses (distribution comparison)', () => {
    function runLosses(hazard: number): bigint {
      let totalLosses = 0n;
      for (let run = 0; run < 80; run++) {
        let state = createMockState({
          phase: GamePhase.UNIVERSE,
          probes: 10000n,
          probeCombat: 0,
          probeExploration: 0,
          probeSpeed: 0,
          probeSelfReplication: 0,
          drifterCount: 1000n,
          probeHazardRemediation: hazard,
        });
        for (let t = 0; t < 5; t++) {
          state = updateProbes(state);
          if (state.probes <= 0n) break;
          if (state.drifterCount === 0n) {
            state = { ...state, drifterCount: 1000n };
          }
        }
        totalLosses += state.probeLosses;
      }
      return totalLosses;
    }
    const lossesNoHazard = runLosses(0);
    const lossesWithHazard = runLosses(20);
    expect(lossesWithHazard).toBeLessThan(lossesNoHazard);
  });

  it('does not mutate the input state', () => {
    const state = createMockState({
      phase: GamePhase.UNIVERSE,
      probes: 100n,
      probeExploration: 1,
      probeSpeed: 1,
      exploredSectors: 0n,
    });
    const originalMessages = state.messages;
    const originalSectors = state.exploredSectors;
    updateProbes(state);
    expect(state.messages).toBe(originalMessages);
    expect(state.exploredSectors).toBe(originalSectors);
  });
});
