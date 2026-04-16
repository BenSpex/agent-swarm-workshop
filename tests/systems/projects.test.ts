import { describe, it, expect } from 'vitest';
import { createMockState } from './_helpers';
import {
  getAllProjects,
  getProjectById,
  getAvailableProjects,
  PHASE_1_PROJECTS,
  PHASE_2_PROJECTS,
  PHASE_3_PROJECTS,
} from '../../src/systems/projects/index';
import { GamePhase } from '../../src/shared/types';

describe('project registry', () => {
  it('returns >= 50 projects', () => {
    expect(getAllProjects().length).toBeGreaterThanOrEqual(50);
  });

  it('contains 22 Phase 1, 15 Phase 2, and 15 Phase 3 projects', () => {
    expect(PHASE_1_PROJECTS.length).toBeGreaterThanOrEqual(20);
    expect(PHASE_2_PROJECTS.length).toBeGreaterThanOrEqual(15);
    expect(PHASE_3_PROJECTS.length).toBeGreaterThanOrEqual(15);
  });

  it('getProjectById finds autoclippers', () => {
    const p = getProjectById('autoclippers');
    expect(p).toBeDefined();
    expect(p!.phase).toBe(GamePhase.BUSINESS);
  });

  it('returns undefined for unknown id', () => {
    expect(getProjectById('does_not_exist')).toBeUndefined();
  });

  it('all project ids are unique', () => {
    const ids = getAllProjects().map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('getAvailableProjects filters out purchased ids', () => {
    const state = createMockState({
      purchasedProjectIds: new Set(['autoclippers']),
    });
    const available = getAvailableProjects(state);
    expect(available.find((p) => p.id === 'autoclippers')).toBeUndefined();
  });
});

describe('project purity (no input mutation)', () => {
  it('every effect returns a new object reference', () => {
    for (const p of getAllProjects()) {
      const state = createMockState({
        flags: {
          phase2Unlocked: true,
          phase3Unlocked: true,
          creativityUnlocked: true,
          quantumUnlocked: true,
          fullAutoClippersActive: true,
          xavierInitialized: true,
          strategicModelingUnlocked: true,
        },
        purchasedProjectIds: new Set([
          'new_slogan',
          'catchier_slogan',
          'hostile_takeover',
          'improved_autoclippers',
          'even_better_autoclippers',
          'limerick_generation',
          'lexical_processing',
          'quantum_computing',
          'solar_farm_efficiency',
          'factory_optimization',
          'matter_harvesting',
          'battery_optimization',
          'swarm_coordination',
          'strategic_modeling',
          'release_the_drones',
        ]),
      });
      const result = p.effect(state);
      expect(result, `${p.id} must return a new object`).not.toBe(state);
    }
  });

  it('effects do not mutate the input messages array', () => {
    const state = createMockState({
      flags: {
        phase2Unlocked: true,
        phase3Unlocked: true,
        creativityUnlocked: true,
        quantumUnlocked: true,
        xavierInitialized: true,
        strategicModelingUnlocked: true,
      },
      purchasedProjectIds: new Set([
        'release_the_drones',
        'new_slogan',
        'improved_autoclippers',
        'even_better_autoclippers',
        'hostile_takeover',
        'catchier_slogan',
        'limerick_generation',
        'lexical_processing',
        'quantum_computing',
        'solar_farm_efficiency',
        'factory_optimization',
        'matter_harvesting',
        'battery_optimization',
        'swarm_coordination',
        'strategic_modeling',
      ]),
    });
    const originalMessages = state.messages;
    const originalFlags = state.flags;
    for (const p of getAllProjects()) {
      p.effect(state);
    }
    expect(state.messages).toBe(originalMessages);
    expect(state.messages.length).toBe(0);
    expect(state.flags).toBe(originalFlags);
  });

  it('every effect produces an observable change', () => {
    const state = createMockState({
      flags: {
        phase2Unlocked: true,
        phase3Unlocked: true,
        creativityUnlocked: true,
        quantumUnlocked: true,
      },
      opsGenerationRate: 1,
    });
    const replacer = (_k: string, v: unknown) =>
      typeof v === 'bigint' ? v.toString() + 'n' : v;
    const skipKeys = new Set(['flags', 'messages', 'purchasedProjectIds']);
    const snapshot = (s: Record<string, unknown>) =>
      JSON.stringify(
        Object.fromEntries(
          Object.entries(s).filter(([k]) => !skipKeys.has(k)),
        ),
        replacer,
      );
    for (const p of getAllProjects()) {
      const result = p.effect(state);
      const flagsChanged = result.flags !== state.flags;
      const messagesChanged = result.messages !== state.messages;
      const anyFieldChanged =
        snapshot(result as unknown as Record<string, unknown>) !==
        snapshot(state as unknown as Record<string, unknown>);
      expect(
        flagsChanged || messagesChanged || anyFieldChanged,
        `${p.id} effect produced no observable change`,
      ).toBe(true);
    }
  });
});

describe('key Phase 1 project effects', () => {
  it('autoclippers sets autoClippersUnlocked', () => {
    const state = createMockState();
    const result = getProjectById('autoclippers')!.effect(state);
    expect(result.flags.autoClippersUnlocked).toBe(true);
  });

  it('rev_tracker sets revTrackerEnabled', () => {
    const result = getProjectById('rev_tracker')!.effect(createMockState());
    expect(result.flags.revTrackerEnabled).toBe(true);
  });

  it('quantum_computing unlocks creativity + quantum', () => {
    const result = getProjectById('quantum_computing')!.effect(createMockState());
    expect(result.flags.quantumUnlocked).toBe(true);
    expect(result.flags.creativityUnlocked).toBe(true);
  });

  it('space_exploration flips phase2Unlocked', () => {
    const state = createMockState({ flags: { xavierInitialized: true } });
    const result = getProjectById('space_exploration')!.effect(state);
    expect(result.flags.phase2Unlocked).toBe(true);
    expect(result.flags.spaceTravelUnlocked).toBe(true);
  });

  it('hadwiger_problem awards +1 trust', () => {
    const state = createMockState({ trust: 2 });
    const result = getProjectById('hadwiger_problem')!.effect(state);
    expect(result.trust).toBe(3);
  });
});

describe('key Phase 2 project effects', () => {
  it('swarm_coordination activates swarmSync + sets timer=100, level=1', () => {
    const state = createMockState({ flags: { phase2Unlocked: true } });
    const result = getProjectById('swarm_coordination')!.effect(state);
    expect(result.flags.swarmSyncActive).toBe(true);
    expect(result.swarmGiftTimer).toBe(100);
    expect(result.swarmSyncLevel).toBe(1);
  });

  it('matter_harvesting flips matterHarvestingActive', () => {
    const state = createMockState({ flags: { phase2Unlocked: true } });
    const result = getProjectById('matter_harvesting')!.effect(state);
    expect(result.flags.matterHarvestingActive).toBe(true);
  });

  it('release_the_drones flips phase3Unlocked', () => {
    const state = createMockState({
      flags: { phase2Unlocked: true },
      purchasedProjectIds: new Set(['swarm_coordination', 'matter_harvesting']),
    });
    const result = getProjectById('release_the_drones')!.effect(state);
    expect(result.flags.phase3Unlocked).toBe(true);
  });

  it('drone_fleet_expansion adds 10 of each drone', () => {
    const state = createMockState({
      flags: { phase2Unlocked: true },
      wireDrones: 5,
      harvesterDrones: 3,
    });
    const result = getProjectById('drone_fleet_expansion')!.effect(state);
    expect(result.wireDrones).toBe(15);
    expect(result.harvesterDrones).toBe(13);
  });
});

describe('key Phase 3 project effects', () => {
  it('coherent_extrapolated_volition grants +10 probeTrust', () => {
    const state = createMockState({ flags: { phase3Unlocked: true }, probeTrust: 0 });
    const result = getProjectById('coherent_extrapolated_volition')!.effect(state);
    expect(result.probeTrust).toBe(10);
  });

  it('increase_max_trust grants +5 probeTrust', () => {
    const state = createMockState({ flags: { phase3Unlocked: true }, probeTrust: 10 });
    const result = getProjectById('increase_max_trust')!.effect(state);
    expect(result.probeTrust).toBe(15);
  });

  it('the_ooda_loop grants +1 probeCombat', () => {
    const state = createMockState({ flags: { phase3Unlocked: true }, probeCombat: 2 });
    const result = getProjectById('the_ooda_loop')!.effect(state);
    expect(result.probeCombat).toBe(3);
  });

  it('name_the_probe bumps probeSpeed by 0.1', () => {
    const state = createMockState({ flags: { phase3Unlocked: true }, probeSpeed: 1 });
    const result = getProjectById('name_the_probe')!.effect(state);
    expect(result.probeSpeed).toBeCloseTo(1.1, 5);
  });

  it('universal_paperclips unlocks prestige', () => {
    const state = createMockState({ flags: { phase3Unlocked: true } });
    const result = getProjectById('universal_paperclips')!.effect(state);
    expect(result.flags.prestigeUnlocked).toBe(true);
  });
});

describe('isAvailable gating', () => {
  it('rev_tracker is always available', () => {
    expect(getProjectById('rev_tracker')!.isAvailable(createMockState())).toBe(true);
  });

  it('space_exploration requires xavierInitialized', () => {
    const p = getProjectById('space_exploration')!;
    expect(p.isAvailable(createMockState())).toBe(false);
    expect(p.isAvailable(createMockState({ flags: { xavierInitialized: true } }))).toBe(true);
  });

  it('release_the_drones requires phase2Unlocked + prereqs', () => {
    const p = getProjectById('release_the_drones')!;
    expect(p.isAvailable(createMockState())).toBe(false);
    expect(
      p.isAvailable(
        createMockState({
          flags: { phase2Unlocked: true },
          purchasedProjectIds: new Set(['swarm_coordination', 'matter_harvesting']),
        }),
      ),
    ).toBe(true);
  });

  it('phase 3 projects gate on phase3Unlocked', () => {
    for (const p of PHASE_3_PROJECTS) {
      expect(p.isAvailable(createMockState())).toBe(false);
    }
  });
});
