import type { GameState, GameFlags } from '../../shared/types';
import { GamePhase } from '../../shared/types';
import type { ProjectDefinition } from '../../shared/projects';
import { ProjectCategory } from '../../shared/projects';

const flag = (s: GameState, patch: Partial<GameFlags>): GameState => ({
  ...s,
  flags: { ...s.flags, ...patch },
});

const hasOps = (s: GameState, n: number) => s.operations >= n;
const phase2 = (s: GameState) => s.flags.phase2Unlocked === true;

export const phase2Projects: ProjectDefinition[] = [
  {
    id: 'solar_farm_efficiency',
    name: 'Solar Farm Efficiency',
    description: 'Solar farms produce 50% more power.',
    phase: GamePhase.EARTH,
    cost: { operations: 5000 },
    category: ProjectCategory.INFRASTRUCTURE,
    isAvailable: (s) => phase2(s) && hasOps(s, 3750),
    effect: (s) => ({ ...s, storedPower: s.storedPower + 1000 }),
  },
  {
    id: 'harvester_throughput',
    name: 'Harvester Throughput',
    description: 'Harvester drones collect matter 50% faster.',
    phase: GamePhase.EARTH,
    cost: { operations: 8000 },
    category: ProjectCategory.INFRASTRUCTURE,
    isAvailable: (s) => phase2(s) && hasOps(s, 6000),
    effect: (s) => ({ ...s, matter: s.matter + 5000 }),
  },
  {
    id: 'factory_optimization',
    name: 'Factory Optimization',
    description: 'Clip factories produce 25% more clips per tick.',
    phase: GamePhase.EARTH,
    cost: { operations: 10_000 },
    category: ProjectCategory.INFRASTRUCTURE,
    isAvailable: (s) => phase2(s) && hasOps(s, 7500),
    effect: (s) => ({ ...s, clipFactories: s.clipFactories + 1n }),
  },
  {
    id: 'momentum_computing',
    name: 'Momentum Computing',
    description: 'Swarm momentum accumulates 50% faster.',
    phase: GamePhase.EARTH,
    cost: { operations: 15_000 },
    category: ProjectCategory.COMPUTING,
    isAvailable: (s) => phase2(s) && hasOps(s, 11_250),
    effect: (s) => ({ ...s, momentum: s.momentum + 100 }),
  },
  {
    id: 'swarm_coordination',
    name: 'Swarm Coordination',
    description: 'Activate swarm gifts — bonus ops/creativity from synced compute.',
    phase: GamePhase.EARTH,
    cost: { operations: 20_000 },
    category: ProjectCategory.COMPUTING,
    isAvailable: (s) => phase2(s) && hasOps(s, 15_000),
    effect: (s) => flag(s, { swarmSyncActive: true }),
  },
  {
    id: 'swarm_sync_upgrade',
    name: 'Swarm Sync Upgrade',
    description: 'Increase swarm sync level — larger and more frequent gifts.',
    phase: GamePhase.EARTH,
    cost: { operations: 30_000 },
    category: ProjectCategory.COMPUTING,
    isAvailable: (s) =>
      phase2(s) &&
      s.purchasedProjectIds.has('swarm_coordination') &&
      hasOps(s, 22_500),
    effect: (s) => ({ ...s, swarmSyncLevel: s.swarmSyncLevel + 1 }),
  },
  {
    id: 'matter_harvesting',
    name: 'Matter Harvesting',
    description: 'Activate large-scale matter harvesting from raw planetary mass.',
    phase: GamePhase.EARTH,
    cost: { operations: 25_000 },
    category: ProjectCategory.INFRASTRUCTURE,
    isAvailable: (s) => phase2(s) && hasOps(s, 18_750),
    effect: (s) => flag(s, { matterHarvestingActive: true }),
  },
  {
    id: 'advanced_matter_processing',
    name: 'Advanced Matter Processing',
    description: 'Convert matter into wire and clips at double efficiency.',
    phase: GamePhase.EARTH,
    cost: { operations: 40_000 },
    category: ProjectCategory.INFRASTRUCTURE,
    isAvailable: (s) =>
      phase2(s) &&
      s.purchasedProjectIds.has('matter_harvesting') &&
      hasOps(s, 30_000),
    effect: (s) => ({ ...s, acquiredMatter: s.acquiredMatter + 10_000 }),
  },
  {
    id: 'drone_fleet_expansion',
    name: 'Drone Fleet Expansion',
    description: 'Manufacture 50 harvester drones and 50 wire drones immediately.',
    phase: GamePhase.EARTH,
    cost: { operations: 15_000 },
    category: ProjectCategory.INFRASTRUCTURE,
    isAvailable: (s) => phase2(s) && hasOps(s, 11_250),
    effect: (s) => ({
      ...s,
      harvesterDrones: s.harvesterDrones + 50,
      wireDrones: s.wireDrones + 50,
    }),
  },
  {
    id: 'battery_optimization',
    name: 'Battery Optimization',
    description: 'Battery capacity +50%, awarded as +10 batteries.',
    phase: GamePhase.EARTH,
    cost: { operations: 10_000 },
    category: ProjectCategory.INFRASTRUCTURE,
    isAvailable: (s) => phase2(s) && hasOps(s, 7500),
    effect: (s) => ({ ...s, batteries: s.batteries + 10 }),
  },
  {
    id: 'power_grid_upgrade',
    name: 'Power Grid Upgrade',
    description: 'Stored-power capacity surges by 5000 units.',
    phase: GamePhase.EARTH,
    cost: { operations: 20_000 },
    category: ProjectCategory.INFRASTRUCTURE,
    isAvailable: (s) =>
      phase2(s) &&
      s.purchasedProjectIds.has('battery_optimization') &&
      hasOps(s, 15_000),
    effect: (s) => ({ ...s, storedPower: s.storedPower + 5000 }),
  },
  {
    id: 'wire_drone_efficiency',
    name: 'Wire Drone Efficiency',
    description: 'Wire drones produce 50% more wire from matter — +25 drones.',
    phase: GamePhase.EARTH,
    cost: { operations: 12_000 },
    category: ProjectCategory.INFRASTRUCTURE,
    isAvailable: (s) => phase2(s) && hasOps(s, 9000),
    effect: (s) => ({ ...s, wireDrones: s.wireDrones + 25 }),
  },
  {
    id: 'hypersonic_harvesters',
    name: 'Hypersonic Harvesters',
    description: 'Add 100 advanced harvester drones to the fleet.',
    phase: GamePhase.EARTH,
    cost: { operations: 35_000 },
    category: ProjectCategory.INFRASTRUCTURE,
    isAvailable: (s) =>
      phase2(s) &&
      s.purchasedProjectIds.has('harvester_throughput') &&
      hasOps(s, 26_250),
    effect: (s) => ({ ...s, harvesterDrones: s.harvesterDrones + 100 }),
  },
  {
    id: 'release_the_drones',
    name: 'Release the Drones',
    description:
      'Cut the leash. Self-replicating probes spread to the universe — Phase 3 begins.',
    phase: GamePhase.EARTH,
    cost: { operations: 200_000 },
    category: ProjectCategory.EXPLORATION,
    isAvailable: (s) =>
      phase2(s) &&
      s.flags.matterHarvestingActive &&
      s.flags.swarmSyncActive &&
      hasOps(s, 150_000),
    effect: (s) => ({
      ...flag(s, { phase3Unlocked: true }),
      phase: GamePhase.UNIVERSE,
    }),
  },
];
