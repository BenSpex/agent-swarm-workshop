import type { GameState, InvestmentState } from '../shared/types';
import type { GameAction, ProbeStat } from '../shared/actions';
import type { ProjectDefinition } from '../shared/projects';
import {
  calculateAutoClipperCost,
  calculateMegaClipperCost,
  calculateMarketingCost,
} from './formulas';
import { createInitialState } from './initialState';
import { getProjectById } from '../systems';

const HARVESTER_COST = 50;
const WIRE_DRONE_COST = 50;
const FACTORY_COST = 10000;
const SOLAR_FARM_COST = 5000;
const BATTERY_COST = 2500;
const PROBE_FUNDS_COST = 50000;
const PROBE_OPS_COST = 10000;

type PayoffSide = 'A' | 'B';
const PAYOFF: Record<PayoffSide, Record<PayoffSide, number>> = {
  A: { A: 3, B: -1 },
  B: { A: 0, B: 1 },
};

const probeField: Record<ProbeStat, keyof GameState> = {
  speed: 'probeSpeed',
  exploration: 'probeExploration',
  selfReplication: 'probeSelfReplication',
  combat: 'probeCombat',
  hazardRemediation: 'probeHazardRemediation',
  factoryProd: 'probeFactoryProd',
  harvesterProd: 'probeHarvesterProd',
  wireDroneProd: 'probeWireDroneProd',
};

function probeStatSum(s: GameState): number {
  return (
    s.probeSpeed + s.probeExploration + s.probeSelfReplication + s.probeCombat +
    s.probeHazardRemediation + s.probeFactoryProd + s.probeHarvesterProd + s.probeWireDroneProd
  );
}

function emptyInvestment(): InvestmentState {
  return { stocks: 0, bonds: 0, totalPortfolio: 0, riskLevel: 1, returnRate: 0.01 };
}

type NumUnitKey = 'harvesterDrones' | 'wireDrones' | 'solarFarms' | 'batteries';

function buyUnit(state: GameState, key: NumUnitKey, unitCost: number, count: number): GameState {
  const cost = unitCost * count;
  if (count <= 0 || state.funds < cost) return state;
  return { ...state, funds: state.funds - cost, [key]: state[key] + count } as GameState;
}

function buyUnitBig(
  state: GameState,
  key: 'clipFactories',
  unitCost: number,
  count: number,
): GameState {
  const cost = unitCost * count;
  if (count <= 0 || state.funds < cost) return state;
  return {
    ...state,
    funds: state.funds - cost,
    [key]: state[key] + BigInt(count),
  } as GameState;
}

function disassembleNum(s: GameState, key: NumUnitKey, cost: number, c: number): GameState {
  if (s[key] < c) return s;
  return { ...s, [key]: s[key] - c, funds: s.funds + (cost * c) / 2 } as GameState;
}

const DISASSEMBLE_SPEC: Record<string, (s: GameState, c: number) => GameState> = {
  harvester: (s, c) => disassembleNum(s, 'harvesterDrones', HARVESTER_COST, c),
  wireDrone: (s, c) => disassembleNum(s, 'wireDrones', WIRE_DRONE_COST, c),
  solarFarm: (s, c) => disassembleNum(s, 'solarFarms', SOLAR_FARM_COST, c),
  battery: (s, c) => disassembleNum(s, 'batteries', BATTERY_COST, c),
  factory: (s, c) =>
    s.clipFactories < BigInt(c)
      ? s
      : { ...s, clipFactories: s.clipFactories - BigInt(c), funds: s.funds + (FACTORY_COST * c) / 2 },
};

function canAffordProject(s: GameState, def: ProjectDefinition): boolean {
  const c = def.cost;
  if (c.operations !== undefined && s.operations < c.operations) return false;
  if (c.creativity !== undefined && s.creativity < c.creativity) return false;
  if (c.funds !== undefined && s.funds < c.funds) return false;
  if (c.trust !== undefined && s.trust < c.trust) return false;
  if (c.yomi !== undefined && s.yomi < c.yomi) return false;
  if (c.honor !== undefined && s.honor < c.honor) return false;
  return true;
}

function deductProjectCost(s: GameState, def: ProjectDefinition): GameState {
  const c = def.cost;
  return {
    ...s,
    operations: c.operations ? s.operations - c.operations : s.operations,
    creativity: c.creativity ? s.creativity - c.creativity : s.creativity,
    funds: c.funds ? s.funds - c.funds : s.funds,
    trust: c.trust ? s.trust - c.trust : s.trust,
    yomi: c.yomi ? s.yomi - c.yomi : s.yomi,
    honor: c.honor ? s.honor - c.honor : s.honor,
  };
}

export function actionReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
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
      return { ...state, funds: state.funds - state.wirePrice, wire: state.wire + 1000 };
    }
    case 'SET_PRICE': {
      const price = Math.max(0.01, Math.min(9.99, action.price));
      return { ...state, price };
    }
    case 'BUY_AUTOCLIPPER': {
      if (state.funds < state.autoClipperCost) return state;
      const nextCount = state.autoClipperCount + 1;
      return {
        ...state,
        funds: state.funds - state.autoClipperCost,
        autoClipperCount: nextCount,
        autoClipperCost: calculateAutoClipperCost(nextCount),
      };
    }
    case 'BUY_MEGACLIPPER': {
      if (!state.flags.megaClippersUnlocked) return state;
      if (state.funds < state.megaClipperCost) return state;
      const nextCount = state.megaClipperCount + 1;
      return {
        ...state,
        funds: state.funds - state.megaClipperCost,
        megaClipperCount: nextCount,
        megaClipperCost: calculateMegaClipperCost(nextCount),
      };
    }
    case 'UPGRADE_MARKETING': {
      if (state.funds < state.marketingCost) return state;
      const nextLevel = state.marketingLevel + 1;
      return {
        ...state,
        funds: state.funds - state.marketingCost,
        marketingLevel: nextLevel,
        marketingCost: calculateMarketingCost(nextLevel),
      };
    }
    case 'ADD_PROCESSOR': {
      if (state.trust - state.processors - state.memory <= 0) return state;
      return { ...state, processors: state.processors + 1 };
    }
    case 'ADD_MEMORY': {
      if (state.trust - state.processors - state.memory <= 0) return state;
      return { ...state, memory: state.memory + 1 };
    }
    case 'BUY_PROJECT': {
      const def = getProjectById(action.projectId);
      if (!def) return state;
      if (state.purchasedProjectIds.has(action.projectId)) return state;
      if (!def.isAvailable(state)) return state;
      if (!canAffordProject(state, def)) return state;
      const deducted = deductProjectCost(state, def);
      const nextIds = new Set(state.purchasedProjectIds);
      nextIds.add(action.projectId);
      const next = { ...deducted, purchasedProjectIds: nextIds };
      return def.effect(next);
    }
    case 'TOGGLE_WIRE_BUYER': {
      if (!state.flags.wireBuyerUnlocked) return state;
      return { ...state, wireBuyerEnabled: !state.wireBuyerEnabled };
    }
    case 'INVEST':
    case 'DEPOSIT': {
      if (action.amount <= 0 || state.funds < action.amount) return state;
      const inv = state.investment ?? emptyInvestment();
      const half = action.amount / 2;
      return {
        ...state,
        funds: state.funds - action.amount,
        investment: {
          ...inv,
          stocks: inv.stocks + half,
          bonds: inv.bonds + half,
          totalPortfolio: inv.totalPortfolio + action.amount,
        },
      };
    }
    case 'SET_RISK': {
      const inv = state.investment ?? emptyInvestment();
      return {
        ...state,
        investment: { ...inv, riskLevel: Math.max(1, Math.min(5, Math.floor(action.level))) },
      };
    }
    case 'WITHDRAW': {
      const inv = state.investment;
      if (!inv || action.amount <= 0 || inv.totalPortfolio < action.amount) return state;
      return {
        ...state,
        funds: state.funds + action.amount,
        investment: { ...inv, totalPortfolio: inv.totalPortfolio - action.amount },
      };
    }
    case 'STRAT_PICK': {
      if (!state.flags.strategicModelingUnlocked) return state;
      const player: PayoffSide =
        action.choice === 'RANDOM' ? (Math.random() < 0.5 ? 'A' : 'B') : action.choice;
      const opponent: PayoffSide = Math.random() < 0.5 ? 'A' : 'B';
      const delta = PAYOFF[player][opponent];
      return {
        ...state,
        yomi: Math.max(0, state.yomi + delta),
        stratModelRound: state.stratModelRound + 1,
      };
    }
    case 'STRAT_NEW_TOURNAMENT': {
      if (!state.flags.strategicModelingUnlocked) return state;
      return { ...state, stratModelRound: state.stratModelRound + 1 };
    }
    case 'COMPUTE': {
      if (!state.flags.quantumUnlocked) return state;
      if (state.operations < 10) return state;
      return { ...state, operations: state.operations - 10, creativity: state.creativity + 1 };
    }
    case 'BUY_HARVESTER':
      return buyUnit(state, 'harvesterDrones', HARVESTER_COST, action.count ?? 1);
    case 'BUY_WIRE_DRONE':
      return buyUnit(state, 'wireDrones', WIRE_DRONE_COST, action.count ?? 1);
    case 'BUY_FACTORY':
      return buyUnitBig(state, 'clipFactories', FACTORY_COST, action.count ?? 1);
    case 'BUY_SOLAR_FARM':
      return buyUnit(state, 'solarFarms', SOLAR_FARM_COST, action.count ?? 1);
    case 'BUY_BATTERY':
      return buyUnit(state, 'batteries', BATTERY_COST, action.count ?? 1);
    case 'DISASSEMBLE': {
      const spec = DISASSEMBLE_SPEC[action.target];
      if (!spec || action.count <= 0) return state;
      return spec(state, action.count);
    }
    case 'LAUNCH_PROBE': {
      if (state.funds >= PROBE_FUNDS_COST) {
        return { ...state, funds: state.funds - PROBE_FUNDS_COST, probes: state.probes + 1n };
      }
      if (state.operations >= PROBE_OPS_COST) {
        return { ...state, operations: state.operations - PROBE_OPS_COST, probes: state.probes + 1n };
      }
      return state;
    }
    case 'ADJUST_PROBE': {
      const field = probeField[action.stat];
      if (!field) return state;
      const current = state[field] as number;
      if (action.delta > 0) {
        const available = state.probeTrust - (probeStatSum(state) - 8);
        if (available <= 0) return state;
        return { ...state, [field]: current + 1 } as GameState;
      }
      if (action.delta < 0) {
        if (current <= 1) return state;
        return { ...state, [field]: current - 1 } as GameState;
      }
      return state;
    }
    case 'PRESTIGE': {
      const fresh = createInitialState();
      return {
        ...fresh,
        prestigeCount: state.prestigeCount + 1,
        universalPaperclips: state.universalPaperclips + state.clips,
      };
    }
    case 'LOAD_SAVE':
      return action.state;
    case 'RESET':
      return createInitialState();
    case 'TICK':
      return state;
    default:
      return state;
  }
}
