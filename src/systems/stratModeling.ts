import type { GameState } from '../shared/types';

type Choice = 'A' | 'B';

const PAYOFF: Record<Choice, Record<Choice, number>> = {
  A: { A: 3, B: -1 },
  B: { A: 0, B: 1 },
};

const AUTO_TOURNEY_INTERVAL = 50;

function pickRandom(): Choice {
  return Math.random() < 0.5 ? 'A' : 'B';
}

export function resolveRound(
  state: GameState,
  choice: 'A' | 'B' | 'RANDOM',
): GameState {
  const player: Choice = choice === 'RANDOM' ? pickRandom() : choice;
  const opponent: Choice = pickRandom();
  const payoff = PAYOFF[player][opponent];
  return {
    ...state,
    yomi: state.yomi + payoff,
    stratModelRound: state.stratModelRound + 1,
  };
}

export function updateStratModeling(state: GameState): GameState {
  if (!state.flags.autoTourneyEnabled) return state;
  if (state.tick <= 0) return state;
  if (state.tick % AUTO_TOURNEY_INTERVAL !== 0) return state;
  return resolveRound(state, 'RANDOM');
}
