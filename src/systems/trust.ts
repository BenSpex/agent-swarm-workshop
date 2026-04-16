import type { GameState } from '../shared/types';

const MILESTONES: readonly bigint[] = [
  1_000n,
  2_000n,
  5_000n,
  10_000n,
  25_000n,
  50_000n,
  100_000n,
  250_000n,
  500_000n,
  1_000_000n,
  2_500_000n,
  5_000_000n,
  10_000_000n,
  25_000_000n,
  50_000_000n,
  100_000_000n,
  250_000_000n,
  500_000_000n,
  1_000_000_000n,
];

// Canonical Universal Paperclips initial pool.
// Starting trust=2, free processors=1, free memory=1 (didn't cost trust).
const INITIAL_TRUST = 2;
const INITIAL_PROCESSORS = 1;
const INITIAL_MEMORY = 1;

export function checkTrustMilestone(state: GameState): GameState {
  let crossed = 0;
  for (const m of MILESTONES) {
    if (state.clips >= m) crossed++;
    else break;
  }
  // Trust earned from milestones is recoverable by counting:
  // available trust + trust-spent on extra processors + trust-spent on extra memory,
  // minus the starting pool. Processors/memory above their starting count consumed trust.
  const spentProcessors = Math.max(0, state.processors - INITIAL_PROCESSORS);
  const spentMemory = Math.max(0, state.memory - INITIAL_MEMORY);
  const earned = Math.max(
    0,
    state.trust + spentProcessors + spentMemory - INITIAL_TRUST,
  );
  if (earned >= crossed) return state;
  const delta = crossed - earned;
  return { ...state, trust: state.trust + delta };
}
