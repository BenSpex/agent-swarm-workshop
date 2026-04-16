import type { GameState } from '../shared/types';

export function updateCreativity(state: GameState): GameState {
  if (!state.flags.quantumUnlocked) return state;
  if (!state.flags.creativityUnlocked) return state;
  let rate = state.processors * 0.05;
  if (state.flags.limericksActive) rate *= 1.5;
  if (state.flags.lexicalProcessingActive) rate *= 1.5;
  if (state.flags.combinatoryHarmonicsActive) rate *= 2;
  if (rate <= 0) return state;
  return { ...state, creativity: state.creativity + rate };
}
