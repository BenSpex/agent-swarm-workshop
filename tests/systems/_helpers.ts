import type { GameState, GameFlags } from '../../src/shared/types';
import { GamePhase } from '../../src/shared/types';

function defaultFlags(): GameFlags {
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
  };
}

export function createMockState(overrides: Partial<GameState> = {}): GameState {
  const base: GameState = {
    phase: GamePhase.BUSINESS,
    tick: 0,
    flags: defaultFlags(),
    messages: [],

    clips: 0n,
    unsoldClips: 0n,
    funds: 0,
    price: 0.25,
    demand: 1,
    wire: 1000,
    wirePrice: 20,
    autoClipperCount: 0,
    megaClipperCount: 0,
    autoClipperCost: 5,
    megaClipperCost: 1000,
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
  };

  const merged: GameState = { ...base, ...overrides };
  if (overrides.flags) {
    merged.flags = { ...base.flags, ...overrides.flags };
  }
  return merged;
}
