/**
 * useGameState — scaffold starter owned by UI team.
 *
 * UI team REPLACES this file with a real implementation using
 * `useSyncExternalStore` against `window.__engine` from main.tsx.
 *
 * Reference implementation (copy and expand):
 *
 *   import { useSyncExternalStore } from 'react';
 *   function subscribe(cb) { return window.__engine?.subscribe(cb) ?? (() => {}); }
 *   function getSnapshot() { return window.__engine?.getState() ?? mockState; }
 *   export function useGameState() { return useSyncExternalStore(subscribe, getSnapshot, getSnapshot); }
 *   export function useDispatch() { return (a) => window.__engine?.dispatch(a); }
 *
 * This scaffold version uses a minimal mock so <PersistentP1Strip /> can
 * render before Core has shipped the engine.
 */
import type { GameState } from '../shared/types';
import type { GameAction } from '../shared/actions';
import { GamePhase } from '../shared/types';

// TODO-INTEGRATION: replace with useSyncExternalStore against window.__engine
// once Core team ships src/core/engine.ts and UI ships src/hooks/mockState.ts.
export function useGameState(): GameState {
  return scaffoldMockState;
}

export function useDispatch(): (action: GameAction) => void {
  return () => {
    // no-op until engine wiring; UI team replaces.
  };
}

// Minimal inline mock to satisfy TS during scaffold-only builds.
// Do NOT use this as a real mockState. UI team builds a proper one.
const scaffoldMockState: GameState = {
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
  messages: ['Scaffold mock — UI team replaces useGameState.ts'],
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
