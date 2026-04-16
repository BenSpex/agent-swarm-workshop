import type { GameState } from '../shared/types';

const GIFT_TIMER_RESET = 100;

export function updateSwarm(state: GameState): GameState {
  if (!state.flags.swarmSyncActive) return state;

  const nextTimer = state.swarmGiftTimer - 1;

  if (nextTimer > 0) {
    return { ...state, swarmGiftTimer: nextTimer };
  }

  const level = Math.max(1, state.swarmSyncLevel);
  const momentum = Math.max(1, state.momentum);
  const giftMagnitude = level * momentum * 100;

  const giveOps = Math.random() < 0.5;
  let nextOps = state.operations;
  let nextCreativity = state.creativity;
  let label: string;

  if (giveOps) {
    nextOps = Math.min(state.maxOperations || state.operations + giftMagnitude, state.operations + giftMagnitude);
    label = `+${giftMagnitude} ops`;
  } else {
    nextCreativity = state.creativity + giftMagnitude;
    label = `+${giftMagnitude} creativity`;
  }

  return {
    ...state,
    swarmGiftTimer: GIFT_TIMER_RESET,
    operations: nextOps,
    creativity: nextCreativity,
    messages: [...state.messages, `Swarm gift: ${label}`],
  };
}
