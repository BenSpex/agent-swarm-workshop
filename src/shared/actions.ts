import type { GameState } from './types';

export type ProbeStat =
  | 'speed' | 'exploration' | 'selfReplication' | 'combat'
  | 'hazardRemediation' | 'factoryProd' | 'harvesterProd' | 'wireDroneProd';

export type GameAction =
  | { type: 'MAKE_CLIP' }
  | { type: 'BUY_WIRE' }
  | { type: 'SET_PRICE'; price: number }
  | { type: 'BUY_AUTOCLIPPER' }
  | { type: 'BUY_MEGACLIPPER' }
  | { type: 'UPGRADE_MARKETING' }
  | { type: 'ADD_PROCESSOR' }
  | { type: 'ADD_MEMORY' }
  | { type: 'BUY_PROJECT'; projectId: string }
  | { type: 'INVEST'; amount: number }
  | { type: 'SET_RISK'; level: number }
  | { type: 'BUY_HARVESTER'; count?: number }
  | { type: 'BUY_WIRE_DRONE'; count?: number }
  | { type: 'BUY_FACTORY'; count?: number }
  | { type: 'BUY_SOLAR_FARM'; count?: number }
  | { type: 'BUY_BATTERY'; count?: number }
  | { type: 'LAUNCH_PROBE' }
  | { type: 'ADJUST_PROBE'; stat: ProbeStat; delta: number }
  | { type: 'TICK' }
  | { type: 'TOGGLE_WIRE_BUYER' }
  | { type: 'DEPOSIT'; amount: number; tier: 'low' | 'med' | 'high' }
  | { type: 'WITHDRAW'; amount: number; tier: 'low' | 'med' | 'high' }
  | { type: 'STRAT_PICK'; choice: 'A' | 'B' | 'RANDOM' }
  | { type: 'STRAT_NEW_TOURNAMENT' }
  | { type: 'COMPUTE' }
  | { type: 'DISASSEMBLE'; target: string; count: number }
  | { type: 'PRESTIGE' }
  | { type: 'LOAD_SAVE'; state: GameState }
  | { type: 'RESET' };
