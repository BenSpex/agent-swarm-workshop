import type { GameState } from '../shared/types';

type Choice = 'A' | 'B';
type PlayerChoice = Choice | 'RANDOM';

function payoff(player: Choice, opponent: Choice): number {
  if (player === 'A' && opponent === 'A') return 3;
  if (player === 'A' && opponent === 'B') return -1;
  if (player === 'B' && opponent === 'A') return 0;
  return 1;
}

function rollChoice(): Choice {
  return Math.random() < 0.5 ? 'A' : 'B';
}

export function resolveRound(state: GameState, choice: PlayerChoice): GameState {
  if (!state.flags.strategicModelingUnlocked) return state;

  const player: Choice = choice === 'RANDOM' ? rollChoice() : choice;
  const opponent: Choice = rollChoice();
  const delta = payoff(player, opponent);

  const nextYomi = Math.max(0, state.yomi + delta);
  const nextRound = state.stratModelRound + 1;

  return {
    ...state,
    yomi: nextYomi,
    stratModelRound: nextRound,
    messages: [
      ...state.messages,
      `Tournament round ${nextRound}: played ${player} vs ${opponent} -> ${delta >= 0 ? '+' : ''}${delta} yomi`,
    ],
  };
}

export function updateStratModeling(state: GameState): GameState {
  if (!state.flags.strategicModelingUnlocked) return state;
  if (!state.flags.autoTourneyEnabled) return state;
  if (state.tick === 0 || state.tick % 50 !== 0) return state;

  return resolveRound(state, 'RANDOM');
}
