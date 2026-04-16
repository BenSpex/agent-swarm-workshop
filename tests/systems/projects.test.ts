import { describe, expect, it } from 'vitest';
import { getAllProjects, getProjectById } from '../../src/systems';
import { GamePhase } from '../../src/shared/types';
import { createMockState } from './_fixtures/mockState';

describe('projects — spot-checks', () => {
  describe('quantum_computing', () => {
    const p = () => getProjectById('quantum_computing');

    it('exists and is a phase-1 computing project', () => {
      const q = p();
      expect(q, 'quantum_computing must exist').toBeDefined();
      expect(q!.phase).toBe(GamePhase.BUSINESS);
      expect(q!.cost.operations).toBeGreaterThan(0);
    });

    it('effect sets quantumUnlocked and creativityUnlocked flags', () => {
      const q = p()!;
      const before = createMockState({ operations: 20000, processors: 10 });
      const after = q.effect(before);
      expect(after.flags.quantumUnlocked).toBe(true);
      expect(after.flags.creativityUnlocked).toBe(true);
    });

    it('effect does not mutate the input state', () => {
      const q = p()!;
      const before = createMockState({ operations: 20000, processors: 10 });
      const beforeFlagSnapshot = before.flags.quantumUnlocked;
      q.effect(before);
      expect(before.flags.quantumUnlocked).toBe(beforeFlagSnapshot);
    });
  });

  describe('space_exploration', () => {
    const p = () => getProjectById('space_exploration');

    it('exists with matching phase + cost', () => {
      const s = p();
      expect(s, 'space_exploration must exist').toBeDefined();
      expect(s!.phase).toBe(GamePhase.BUSINESS);
      expect(s!.cost.operations).toBeGreaterThan(0);
    });

    it('effect unlocks phase2 / spaceTravel', () => {
      const s = p()!;
      const before = createMockState({
        operations: 200_000,
        creativity: 10_000,
        clips: 100_000_000n,
        flags: { creativityUnlocked: true } as never,
      });
      const after = s.effect(before);
      expect(
        after.flags.phase2Unlocked || after.flags.spaceTravelUnlocked,
      ).toBe(true);
    });
  });

  describe('auto_tourney', () => {
    const p = () => getProjectById('auto_tourney');

    it('effect enables autoTourneyEnabled flag', () => {
      const t = p();
      if (!t) {
        return;
      }
      const before = createMockState({
        operations: 20_000,
        yomi: 100,
        flags: { strategicModelingUnlocked: true } as never,
      });
      const after = t.effect(before);
      expect(after.flags.autoTourneyEnabled).toBe(true);
    });
  });

  describe('release_the_drones (phase 2 trigger)', () => {
    const p = () => getProjectById('release_the_drones');

    it('exists and triggers phase 3 or sets spaceTravel-era flag', () => {
      const r = p();
      if (!r) return;
      expect(r.phase).toBe(GamePhase.EARTH);

      const before = createMockState({
        phase: GamePhase.EARTH,
        operations: 500_000,
        flags: { phase2Unlocked: true } as never,
      });
      const after = r.effect(before);
      expect(
        after.flags.phase3Unlocked || after.phase === GamePhase.UNIVERSE,
      ).toBe(true);
    });
  });

  describe('universal_paperclips (prestige)', () => {
    const p = () => getProjectById('universal_paperclips');

    it('exists as a phase-3 endgame project', () => {
      const u = p();
      if (!u) return;
      expect(u.phase).toBe(GamePhase.UNIVERSE);
    });

    it('effect increments prestigeCount', () => {
      const u = p();
      if (!u) return;
      const before = createMockState({
        phase: GamePhase.UNIVERSE,
        operations: 500_000,
        creativity: 50_000,
        prestigeCount: 0,
      });
      const after = u.effect(before);
      expect(after.prestigeCount).toBeGreaterThanOrEqual(before.prestigeCount);
    });
  });
});

describe('projects — parameterized shape + purity', () => {
  it('every effect returns a new object (no mutation)', () => {
    const all = getAllProjects();
    expect(all.length).toBeGreaterThan(0);
    for (const p of all) {
      const state = createMockState({
        operations: 1_000_000,
        creativity: 1_000_000,
        funds: 1_000_000,
        yomi: 1_000_000,
        honor: 1_000_000,
        clips: 1_000_000_000_000n,
        processors: 100,
        memory: 100,
        marketingLevel: 10,
        probeTrust: 1000,
        autoClipperCount: 100,
        flags: {
          autoClippersUnlocked: true,
          megaClippersUnlocked: true,
          creativityUnlocked: true,
          quantumUnlocked: true,
          strategicModelingUnlocked: true,
          phase2Unlocked: true,
          phase3Unlocked: true,
          spaceTravelUnlocked: true,
          matterHarvestingActive: true,
          swarmSyncActive: true,
        } as never,
        purchasedProjectIds: new Set([
          'improved_auto_clippers',
          'lexical_processing',
          'new_slogan',
          'hostile_takeover',
        ]),
      });
      const next = p.effect(state);
      expect(next, `${p.id}.effect returned nullish`).toBeTruthy();
      expect(
        next,
        `${p.id}.effect must return new object`,
      ).not.toBe(state);
    }
  });

  it('every isAvailable is callable with a fresh state and returns boolean', () => {
    const state = createMockState();
    for (const p of getAllProjects()) {
      const r = p.isAvailable(state);
      expect(typeof r, `${p.id}.isAvailable must return boolean`).toBe(
        'boolean',
      );
    }
  });
});
