import type { GameState } from '../shared/types';

const SPOOL_SIZE = 1000;
const LOW_WATER_MARK = 10;

export function updateWireBuyer(state: GameState): GameState {
  if (!state.flags.wireBuyerUnlocked) return state;
  if (!state.wireBuyerEnabled) return state;
  if (state.wire >= LOW_WATER_MARK) return state;
  if (state.funds < state.wirePrice) return state;

  return {
    ...state,
    wire: state.wire + SPOOL_SIZE,
    funds: state.funds - state.wirePrice,
    messages: [
      ...state.messages,
      `WireBuyer: purchased spool for $${state.wirePrice.toFixed(2)}`,
    ],
  };
}
