import type { GameState } from './types';
import { GamePhase } from './types';

export enum ProjectCategory {
  CLIPPING = 'clipping',
  COMPUTING = 'computing',
  BUSINESS = 'business',
  CREATIVITY = 'creativity',
  INFRASTRUCTURE = 'infrastructure',
  EXPLORATION = 'exploration',
  COMBAT = 'combat',
  ENDGAME = 'endgame',
}

export interface ProjectCost {
  operations?: number;
  creativity?: number;
  funds?: number;
  trust?: number;
  yomi?: number;
  honor?: number;
}

export interface ProjectDefinition {
  id: string;
  name: string;
  description: string;
  phase: GamePhase;
  cost: ProjectCost;
  isAvailable: (state: GameState) => boolean;
  effect: (state: GameState) => GameState;
  category: ProjectCategory;
}
