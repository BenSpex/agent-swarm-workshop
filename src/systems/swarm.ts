import type { GameState } from '../shared/types';

const GIFT_INTERVAL = 600;

export function updateSwarm(state: GameState): GameState {
  if (!state.flags.swarmSyncActive) return state;
  if (state.swarmGiftTimer > 0) {
    return { ...state, swarmGiftTimer: state.swarmGiftTimer - 1 };
  }
  const opsGift = state.momentum * state.swarmSyncLevel * 100;
  const creativityGift = state.swarmSyncLevel * 5;
  if (state.tick % 2 === 0) {
    const cap = state.maxOperations > 0 ? state.maxOperations : Infinity;
    return {
      ...state,
      operations: Math.min(state.operations + opsGift, cap),
      swarmGiftTimer: GIFT_INTERVAL,
    };
  }
  return {
    ...state,
    creativity: state.creativity + creativityGift,
    swarmGiftTimer: GIFT_INTERVAL,
  };
}
