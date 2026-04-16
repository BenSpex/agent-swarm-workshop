import type { GameState } from '../shared/types';
import {
  sellClips,
  produceAutoClips,
  produceMegaClips,
  fluctuateWirePrice,
  calculateDemand,
} from './formulas';

// TODO-INTEGRATION: ../systems barrel not shipped yet — inline identities until Systems merges.
// Each subsystem updater must be pure (GameState -> GameState). Replace these with
// `import { ... } from '../systems';` once systems/index.ts lands.
const updateWireBuyer = (s: GameState): GameState => s;
const updateInvestment = (s: GameState): GameState => s;
const updateCreativity = (s: GameState): GameState => s;
const checkTrustMilestone = (s: GameState): GameState => s;
const updateMatter = (s: GameState): GameState => s;
const updateSwarm = (s: GameState): GameState => s;
const updateProbes = (s: GameState): GameState => s;
const updateStratModeling = (s: GameState): GameState => s;

const MAX_MESSAGES = 50;
const WINDOW_TICKS = 10;

type RollSample = {
  tick: number;
  clips: bigint;
  clipsSold: bigint;
  funds: number;
};
const rollingWindow: RollSample[] = [];

function pushSample(state: GameState, prev: GameState): void {
  const soldDelta = prev.unsoldClips + (state.clips - prev.clips) - state.unsoldClips;
  const clipsSold = soldDelta > 0n ? soldDelta : 0n;
  rollingWindow.push({
    tick: state.tick,
    clips: state.clips,
    clipsSold,
    funds: state.funds,
  });
  while (rollingWindow.length > WINDOW_TICKS) rollingWindow.shift();
}

function computeDerivedMetrics(state: GameState): GameState {
  if (rollingWindow.length < 2) return state;
  const first = rollingWindow[0];
  const last = rollingWindow[rollingWindow.length - 1];
  const spanTicks = Math.max(1, last.tick - first.tick);
  const spanSeconds = spanTicks / 10;
  const clipsDelta = Number(last.clips - first.clips);
  const fundsDelta = last.funds - first.funds;
  let soldSum = 0n;
  for (let i = 1; i < rollingWindow.length; i++) soldSum += rollingWindow[i].clipsSold;
  const soldSumNum = Number(soldSum);
  return {
    ...state,
    clipsPerSecond: clipsDelta / spanSeconds,
    revenuePerSecond: fundsDelta / spanSeconds,
    clipsSoldPerSecond: soldSumNum / spanSeconds,
  };
}

export function tickReducer(state: GameState): GameState {
  const prev = state;
  let s: GameState = { ...state, tick: state.tick + 1 };

  // Demand recalculation from price / marketing / flags.
  s = { ...s, demand: calculateDemand(s.price, s.marketingLevel, s.flags) };

  // Phase 1 production & sales (in-reducer).
  s = produceAutoClips(s);
  s = produceMegaClips(s);
  s = sellClips(s);

  // Wire price fluctuation — the single allowed non-pure step. Use local rng.
  s = { ...s, wirePrice: fluctuateWirePrice(s.wirePrice, Math.random()) };

  // Operations growth (processors generate ops up to maxOperations).
  if (s.processors > 0) {
    const nextOps = Math.min(
      s.maxOperations,
      s.operations + s.processors * s.opsGenerationRate,
    );
    s = { ...s, operations: nextOps };
  }
  s = { ...s, maxOperations: 1000 + s.memory * 1000 };

  // Subsystem updaters — ordering per spec.
  s = updateWireBuyer(s);
  s = updateInvestment(s);
  s = updateCreativity(s);
  s = checkTrustMilestone(s);
  s = updateMatter(s);
  s = updateSwarm(s);
  s = updateProbes(s);
  s = updateStratModeling(s);

  // BLOCK A — Phase 1 → 2 transition.
  if (s.phase === 1 && s.flags.spaceTravelUnlocked) {
    s = {
      ...s,
      phase: 2,
      flags: { ...s.flags, phase2Unlocked: true },
      harvesterDrones: Math.max(s.harvesterDrones, 10),
      messages: ['>>> PHASE 2: EARTH OPERATIONS <<<', ...s.messages].slice(0, MAX_MESSAGES),
    };
  }

  // BLOCK B — Phase 2 → 3 transition.
  if (s.phase === 2 && s.flags.phase3Unlocked) {
    s = {
      ...s,
      phase: 3,
      messages: ['>>> PHASE 3: GALACTIC EXPANSION <<<', ...s.messages].slice(0, MAX_MESSAGES),
    };
  }

  // Rolling-window derived metrics.
  pushSample(s, prev);
  s = computeDerivedMetrics(s);

  return s;
}

export function __resetTickRollingWindow(): void {
  rollingWindow.length = 0;
}
