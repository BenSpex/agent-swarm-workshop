import type { GameState } from '../shared/types';
import type { GameAction, ProbeStat } from '../shared/actions';
import { createInitialState } from './initialState';
import {
  sellClips,
  produceAutoClips,
  produceMegaClips,
  fluctuateWirePrice,
  calculateAutoClipperCost as autoClipperCostFn,
  calculateMegaClipperCost as megaClipperCostFn,
  calculateMarketingCost as marketingCostFn,
} from './formulas';

import {
  updateWireBuyer,
  updateInvestment,
  updateCreativity,
  checkTrustMilestone,
  updateMatter,
  updateSwarm,
  updateProbes,
  updateStratModeling,
  getProjectById,
} from '../systems';

const PROBE_STAT_MAP: Record<ProbeStat, keyof GameState> = {
  speed: 'probeSpeed',
  exploration: 'probeExploration',
  selfReplication: 'probeSelfReplication',
  combat: 'probeCombat',
  hazardRemediation: 'probeHazardRemediation',
  factoryProd: 'probeFactoryProd',
  harvesterProd: 'probeHarvesterProd',
  wireDroneProd: 'probeWireDroneProd',
};

const PROBE_STAT_KEYS: Array<keyof GameState> = [
  'probeSpeed', 'probeExploration', 'probeSelfReplication', 'probeCombat',
  'probeHazardRemediation', 'probeFactoryProd', 'probeHarvesterProd', 'probeWireDroneProd',
];
const sumProbeStats = (s: GameState): number =>
  PROBE_STAT_KEYS.reduce((a, k) => a + (s[k] as number), 0);

const STRAT_PAYOFF: Record<'A' | 'B', Record<'A' | 'B', number>> = {
  A: { A: 3, B: -1 }, B: { A: 0, B: 1 },
};
const LAUNCH_PROBE_COST = 10000;

function updateOperations(s: GameState): GameState {
  const rate = s.opsGenerationRate > 0 ? s.opsGenerationRate : s.processors * 10;
  const next = Math.min(s.maxOperations, s.operations + rate * 0.1);
  if (next === s.operations) return s;
  return { ...s, operations: next };
}

function stepTick(s: GameState): GameState {
  let n = s;

  // Phase transitions — orchestrator-required (Core's responsibility per spec).
  if (n.phase === 1 && n.flags.spaceTravelUnlocked) {
    n = {
      ...n,
      phase: 2,
      flags: { ...n.flags, phase2Unlocked: true },
      harvesterDrones: Math.max(n.harvesterDrones, 10),
      messages: ['>>> PHASE 2: EARTH OPERATIONS <<<', ...n.messages].slice(0, 50),
    };
  }
  if (n.phase === 2 && n.flags.phase3Unlocked) {
    n = {
      ...n,
      phase: 3,
      messages: ['>>> PHASE 3: GALACTIC EXPANSION <<<', ...n.messages].slice(0, 50),
    };
  }

  n = sellClips(n);
  n = produceAutoClips(n);
  n = produceMegaClips(n);
  n = updateWireBuyer(n);
  n = fluctuateWirePrice(n);
  n = updateInvestment(n);
  n = updateCreativity(n);
  n = updateStratModeling(n);
  n = checkTrustMilestone(n);
  n = updateOperations(n);
  if (n.phase >= 2) {
    n = updateMatter(n);
    n = updateSwarm(n);
  }
  if (n.phase >= 3) n = updateProbes(n);
  return { ...n, tick: n.tick + 1 };
}

export function rootReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'TICK':
      return stepTick(state);

    case 'MAKE_CLIP': {
      if (state.wire < 1) return state;
      return {
        ...state,
        clips: state.clips + 1n,
        unsoldClips: state.unsoldClips + 1n,
        wire: state.wire - 1,
      };
    }

    case 'BUY_WIRE': {
      if (state.funds < state.wirePrice) return state;
      return {
        ...state,
        funds: state.funds - state.wirePrice,
        wire: state.wire + 1000,
      };
    }

    case 'SET_PRICE': {
      const clamped = Math.max(0.01, Math.min(9.99, action.price));
      return { ...state, price: clamped };
    }

    case 'BUY_AUTOCLIPPER': {
      if (state.funds < state.autoClipperCost) return state;
      const newCount = state.autoClipperCount + 1;
      return {
        ...state,
        funds: state.funds - state.autoClipperCost,
        autoClipperCount: newCount,
        autoClipperCost: autoClipperCostFn(newCount),
      };
    }

    case 'BUY_MEGACLIPPER': {
      if (!state.flags.megaClippersUnlocked) return state;
      if (state.funds < state.megaClipperCost) return state;
      const newCount = state.megaClipperCount + 1;
      return {
        ...state,
        funds: state.funds - state.megaClipperCost,
        megaClipperCount: newCount,
        megaClipperCost: megaClipperCostFn(newCount),
      };
    }

    case 'UPGRADE_MARKETING': {
      if (state.funds < state.marketingCost) return state;
      const newLevel = state.marketingLevel + 1;
      return {
        ...state,
        funds: state.funds - state.marketingCost,
        marketingLevel: newLevel,
        marketingCost: marketingCostFn(newLevel),
      };
    }

    case 'ADD_PROCESSOR': {
      if (state.trust <= state.processors + state.memory) return state;
      return { ...state, processors: state.processors + 1 };
    }

    case 'ADD_MEMORY': {
      if (state.trust <= state.processors + state.memory) return state;
      const nextMemory = state.memory + 1;
      return { ...state, memory: nextMemory, maxOperations: nextMemory * 1000 };
    }

    case 'BUY_PROJECT': {
      const def = getProjectById(action.projectId);
      if (!def || !def.isAvailable(state)) return state;
      if (state.purchasedProjectIds.has(action.projectId)) return state;
      const c = def.cost;
      if (c.operations !== undefined && state.operations < c.operations) return state;
      if (c.creativity !== undefined && state.creativity < c.creativity) return state;
      if (c.funds !== undefined && state.funds < c.funds) return state;
      if (c.trust !== undefined && state.trust < c.trust) return state;
      if (c.yomi !== undefined && state.yomi < c.yomi) return state;
      if (c.honor !== undefined && state.honor < c.honor) return state;
      let next: GameState = {
        ...state,
        operations: state.operations - (c.operations ?? 0),
        creativity: state.creativity - (c.creativity ?? 0),
        funds: state.funds - (c.funds ?? 0),
        trust: state.trust - (c.trust ?? 0),
        yomi: state.yomi - (c.yomi ?? 0),
        honor: state.honor - (c.honor ?? 0),
        purchasedProjectIds: new Set([...state.purchasedProjectIds, action.projectId]),
      };
      next = def.effect(next);
      return next;
    }

    case 'TOGGLE_WIRE_BUYER':
      if (!state.flags.wireBuyerUnlocked) return state;
      return { ...state, wireBuyerEnabled: !state.wireBuyerEnabled };

    case 'INVEST':
    case 'DEPOSIT': {
      if (!state.investment || state.funds < action.amount) return state;
      const inv = state.investment;
      return { ...state, funds: state.funds - action.amount,
        investment: { ...inv, totalPortfolio: inv.totalPortfolio + action.amount } };
    }

    case 'WITHDRAW': {
      if (!state.investment || state.investment.totalPortfolio < action.amount) return state;
      const inv = state.investment;
      return { ...state, funds: state.funds + action.amount,
        investment: { ...inv, totalPortfolio: inv.totalPortfolio - action.amount } };
    }

    case 'SET_RISK':
      if (!state.investment) return state;
      return { ...state, investment: { ...state.investment, riskLevel: action.level } };

    case 'BUY_HARVESTER': {
      const count = action.count ?? 1;
      const cost = 1000 * count;
      if (state.funds < cost) return state;
      return { ...state, funds: state.funds - cost, harvesterDrones: state.harvesterDrones + count };
    }

    case 'BUY_WIRE_DRONE': {
      const count = action.count ?? 1;
      const cost = 2000 * count;
      if (state.funds < cost) return state;
      return { ...state, funds: state.funds - cost, wireDrones: state.wireDrones + count };
    }

    case 'BUY_FACTORY': {
      const count = action.count ?? 1;
      const cost = 100000 * count;
      if (state.funds < cost) return state;
      return { ...state, funds: state.funds - cost, clipFactories: state.clipFactories + BigInt(count) };
    }

    case 'BUY_SOLAR_FARM': {
      const count = action.count ?? 1;
      const cost = 25000 * count;
      if (state.funds < cost) return state;
      return { ...state, funds: state.funds - cost, solarFarms: state.solarFarms + count };
    }

    case 'BUY_BATTERY': {
      const count = action.count ?? 1;
      const cost = 5000 * count;
      if (state.funds < cost) return state;
      return { ...state, funds: state.funds - cost, batteries: state.batteries + count };
    }

    case 'LAUNCH_PROBE': {
      if (state.funds < LAUNCH_PROBE_COST) return state;
      return {
        ...state,
        funds: state.funds - LAUNCH_PROBE_COST,
        probes: state.probes + 1n,
        probeDescendants: state.probeDescendants + 1n,
      };
    }

    case 'ADJUST_PROBE': {
      const field = PROBE_STAT_MAP[action.stat];
      const current = state[field] as number;
      if (action.delta > 0) {
        const available = state.probeTrust - (sumProbeStats(state) - 8);
        if (available <= 0) return state;
        return { ...state, [field]: current + 1 };
      }
      if (action.delta < 0) {
        if (current <= 1) return state;
        return { ...state, [field]: current - 1 };
      }
      return state;
    }

    case 'STRAT_PICK': {
      if (!state.flags.strategicModelingUnlocked) return state;
      const player: 'A' | 'B' = action.choice === 'RANDOM'
        ? (Math.random() < 0.5 ? 'A' : 'B')
        : action.choice;
      const opp: 'A' | 'B' = Math.random() < 0.5 ? 'A' : 'B';
      return {
        ...state,
        yomi: state.yomi + STRAT_PAYOFF[player][opp],
        stratModelRound: state.stratModelRound + 1,
      };
    }

    case 'STRAT_NEW_TOURNAMENT':
      return { ...state, stratModelRound: state.stratModelRound + 1 };

    case 'COMPUTE':
      if (!state.flags.quantumUnlocked || state.operations < 10) return state;
      return { ...state, operations: state.operations - 10, creativity: state.creativity + 1 };

    case 'DISASSEMBLE': {
      const key = action.target as keyof GameState;
      const current = state[key];
      if (typeof current !== 'number' || current < action.count) return state;
      return { ...state, [key]: current - action.count };
    }

    case 'PRESTIGE': {
      const kept = state.universalPaperclips + state.clips;
      return {
        ...createInitialState(),
        prestigeCount: state.prestigeCount + 1,
        universalPaperclips: kept,
      };
    }

    case 'LOAD_SAVE':
      return action.state;

    case 'RESET':
      return createInitialState();

    default:
      return state;
  }
}
