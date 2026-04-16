import type { GameState } from '../shared/types';

export const updateStratModeling = (s: GameState): GameState => s;

export const resolveRound = (
  s: GameState,
  _choice: 'A' | 'B' | 'RANDOM',
): GameState => s;
