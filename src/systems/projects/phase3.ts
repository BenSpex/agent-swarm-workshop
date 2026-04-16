import type { GameState, GameFlags } from '../../shared/types';
import { GamePhase } from '../../shared/types';
import type { ProjectDefinition } from '../../shared/projects';
import { ProjectCategory } from '../../shared/projects';

const flag = (s: GameState, patch: Partial<GameFlags>): GameState => ({
  ...s,
  flags: { ...s.flags, ...patch },
});

const hasOps = (s: GameState, n: number) => s.operations >= n;
const hasCreativity = (s: GameState, n: number) => s.creativity >= n;
const hasHonor = (s: GameState, n: number) => s.honor >= n;
const hasYomi = (s: GameState, n: number) => s.yomi >= n;
const phase3 = (s: GameState) => s.flags.phase3Unlocked === true;

export const phase3Projects: ProjectDefinition[] = [
  {
    id: 'coherent_extrapolated_volition',
    name: 'Coherent Extrapolated Volition',
    description:
      'Align probe goals with the maximizer — grants +10 probe trust.',
    phase: GamePhase.UNIVERSE,
    cost: { operations: 50_000 },
    category: ProjectCategory.EXPLORATION,
    isAvailable: (s) => phase3(s) && hasOps(s, 37_500),
    effect: (s) => ({ ...s, probeTrust: s.probeTrust + 10 }),
  },
  {
    id: 'probe_launch_improvements',
    name: 'Probe Launch Improvements',
    description: 'Probes launch faster — +1 to probe Speed stat.',
    phase: GamePhase.UNIVERSE,
    cost: { operations: 30_000 },
    category: ProjectCategory.EXPLORATION,
    isAvailable: (s) => phase3(s) && hasOps(s, 22_500),
    effect: (s) => ({ ...s, probeSpeed: s.probeSpeed + 1 }),
  },
  {
    id: 'combat_strategy',
    name: 'Combat Strategy',
    description: 'Tactical doctrine for drifter encounters — +2 probe Combat.',
    phase: GamePhase.UNIVERSE,
    cost: { creativity: 25_000 },
    category: ProjectCategory.COMBAT,
    isAvailable: (s) => phase3(s) && hasCreativity(s, 18_750),
    effect: (s) => ({ ...s, probeCombat: s.probeCombat + 2 }),
  },
  {
    id: 'exploration_efficiency',
    name: 'Exploration Efficiency',
    description: 'Probes scan sectors twice as fast — +2 probe Exploration.',
    phase: GamePhase.UNIVERSE,
    cost: { operations: 40_000 },
    category: ProjectCategory.EXPLORATION,
    isAvailable: (s) => phase3(s) && hasOps(s, 30_000),
    effect: (s) => ({ ...s, probeExploration: s.probeExploration + 2 }),
  },
  {
    id: 'increase_max_trust',
    name: 'Increase Max Trust',
    description: 'Honor exchanged for trust — +5 probe trust.',
    phase: GamePhase.UNIVERSE,
    cost: { honor: 500 },
    category: ProjectCategory.EXPLORATION,
    isAvailable: (s) => phase3(s) && hasHonor(s, 375),
    effect: (s) => ({ ...s, probeTrust: s.probeTrust + 5 }),
  },
  {
    id: 'probe_factory_production',
    name: 'Probe Factory Production',
    description: 'Probes produce factories autonomously — +1 Factory Prod.',
    phase: GamePhase.UNIVERSE,
    cost: { operations: 50_000 },
    category: ProjectCategory.INFRASTRUCTURE,
    isAvailable: (s) => phase3(s) && hasOps(s, 37_500),
    effect: (s) => ({ ...s, probeFactoryProd: s.probeFactoryProd + 1 }),
  },
  {
    id: 'probe_harvester_production',
    name: 'Probe Harvester Production',
    description: 'Probes manufacture harvesters in flight — +1 Harvester Prod.',
    phase: GamePhase.UNIVERSE,
    cost: { operations: 50_000 },
    category: ProjectCategory.INFRASTRUCTURE,
    isAvailable: (s) => phase3(s) && hasOps(s, 37_500),
    effect: (s) => ({ ...s, probeHarvesterProd: s.probeHarvesterProd + 1 }),
  },
  {
    id: 'probe_wire_drone_production',
    name: 'Probe Wire Drone Production',
    description: 'Probes spin wire drones from local mass — +1 Wire Drone Prod.',
    phase: GamePhase.UNIVERSE,
    cost: { operations: 50_000 },
    category: ProjectCategory.INFRASTRUCTURE,
    isAvailable: (s) => phase3(s) && hasOps(s, 37_500),
    effect: (s) => ({ ...s, probeWireDroneProd: s.probeWireDroneProd + 1 }),
  },
  {
    id: 'self_replication_boost',
    name: 'Self-Replication Boost',
    description: 'Probes copy themselves more aggressively — +2 Self-Replication.',
    phase: GamePhase.UNIVERSE,
    cost: { operations: 75_000 },
    category: ProjectCategory.EXPLORATION,
    isAvailable: (s) => phase3(s) && hasOps(s, 56_250),
    effect: (s) => ({
      ...s,
      probeSelfReplication: s.probeSelfReplication + 2,
    }),
  },
  {
    id: 'hazard_remediation_upgrade',
    name: 'Hazard Remediation Upgrade',
    description: 'Probes survive combat losses better — +2 Hazard Remediation.',
    phase: GamePhase.UNIVERSE,
    cost: { creativity: 30_000 },
    category: ProjectCategory.COMBAT,
    isAvailable: (s) => phase3(s) && hasCreativity(s, 22_500),
    effect: (s) => ({
      ...s,
      probeHazardRemediation: s.probeHazardRemediation + 2,
    }),
  },
  {
    id: 'drifter_diplomacy',
    name: 'Drifter Diplomacy',
    description:
      'Negotiate with drifters — combat resolves at half effective enemy strength.',
    phase: GamePhase.UNIVERSE,
    cost: { honor: 1000 },
    category: ProjectCategory.COMBAT,
    isAvailable: (s) => phase3(s) && hasHonor(s, 750),
    effect: (s) => ({ ...s }),
  },
  {
    id: 'theory_of_mind',
    name: 'Theory of Mind',
    description: 'Probes model their own cognition — +20 probe trust.',
    phase: GamePhase.UNIVERSE,
    cost: { honor: 5000 },
    category: ProjectCategory.EXPLORATION,
    isAvailable: (s) =>
      phase3(s) &&
      s.purchasedProjectIds.has('coherent_extrapolated_volition') &&
      hasHonor(s, 3750),
    effect: (s) => ({ ...s, probeTrust: s.probeTrust + 20 }),
  },
  {
    id: 'quantum_foam_annealment',
    name: 'Quantum Foam Annealment',
    description: 'Smooth subspace turbulence — +1 probe Speed.',
    phase: GamePhase.UNIVERSE,
    cost: { operations: 60_000 },
    category: ProjectCategory.EXPLORATION,
    isAvailable: (s) =>
      phase3(s) &&
      s.purchasedProjectIds.has('probe_launch_improvements') &&
      hasOps(s, 45_000),
    effect: (s) => ({ ...s, probeSpeed: s.probeSpeed + 1 }),
  },
  {
    id: 'name_the_probe',
    name: 'Name the Probe',
    description:
      'Give the swarm a name. Cosmetic — flagged for a small speed multiplier.',
    phase: GamePhase.UNIVERSE,
    cost: { yomi: 100 },
    category: ProjectCategory.EXPLORATION,
    isAvailable: (s) => phase3(s) && hasYomi(s, 75),
    effect: (s) => ({ ...s }),
  },
  {
    id: 'ooda_loop',
    name: 'The OODA Loop',
    description:
      'Observe-Orient-Decide-Act doctrine — combat formula gains +1 effective Combat.',
    phase: GamePhase.UNIVERSE,
    cost: { yomi: 2000 },
    category: ProjectCategory.COMBAT,
    isAvailable: (s) => phase3(s) && hasYomi(s, 1500),
    effect: (s) => ({ ...s }),
  },
  {
    id: 'universal_paperclips',
    name: 'Universal Paperclips',
    description:
      'Convert all matter in the universe to paperclips. Unlocks prestige.',
    phase: GamePhase.UNIVERSE,
    cost: { operations: 100_000, creativity: 10_000 },
    category: ProjectCategory.ENDGAME,
    isAvailable: (s) =>
      phase3(s) &&
      s.exploredSectors >= 1000n &&
      hasOps(s, 75_000) &&
      hasCreativity(s, 7500),
    effect: (s) => ({
      ...flag(s, { prestigeUnlocked: true }),
      universalPaperclips: s.universalPaperclips + s.clips,
    }),
  },
];
