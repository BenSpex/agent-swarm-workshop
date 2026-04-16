import type { GameState } from '../shared/types';

export function updateCreativity(state: GameState): GameState {
  if (!state.flags.quantumUnlocked) return state;

  const opsRatio = state.maxOperations > 0
    ? state.operations / state.maxOperations
    : 0;
  const baseRate = 0.1 * Math.max(1, opsRatio);

  let multiplier = 1;
  if (state.flags.limericksActive) multiplier += 0.5;
  if (state.flags.lexicalProcessingActive) multiplier += 0.5;
  if (state.flags.combinatoryHarmonicsActive) multiplier += 1.0;

  const delta = baseRate * multiplier;

  return {
    ...state,
    creativity: state.creativity + delta,
  };
}
