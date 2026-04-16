import type { GameState } from '../shared/types';

const SPOOL_SIZE = 1000;

export function updateWireBuyer(state: GameState): GameState {
  if (!state.flags.wireBuyerUnlocked) return state;
  if (!state.wireBuyerEnabled) return state;
  if (state.wire >= 10) return state;
  if (state.funds < state.wirePrice) return state;
  return {
    ...state,
    funds: state.funds - state.wirePrice,
    wire: state.wire + SPOOL_SIZE,
  };
}
