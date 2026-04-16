import type { GameState } from '../shared/types';

const MILESTONES: bigint[] = [
  1000n,
  2000n,
  5000n,
  10000n,
  25000n,
  50000n,
  100000n,
  250000n,
  500000n,
  1000000n,
];

function sentinelFor(milestone: bigint): string {
  return `trust_milestone_${milestone.toString()}`;
}

export function checkTrustMilestone(state: GameState): GameState {
  let newTrust = state.trust;
  let purchased: Set<string> | null = null;
  let messages: string[] | null = null;

  for (const milestone of MILESTONES) {
    const sentinel = sentinelFor(milestone);
    const base = purchased ?? state.purchasedProjectIds;
    if (state.clips >= milestone && !base.has(sentinel)) {
      if (!purchased) purchased = new Set(state.purchasedProjectIds);
      if (!messages) messages = [...state.messages];
      purchased.add(sentinel);
      messages.push(`Trust awarded: ${milestone.toString()} clips milestone`);
      newTrust += 1;
    }
  }

  if (!purchased) return state;

  return {
    ...state,
    trust: newTrust,
    purchasedProjectIds: purchased,
    messages: messages ?? state.messages,
  };
}
