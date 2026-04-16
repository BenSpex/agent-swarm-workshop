import { describe, expect, it } from 'vitest';
import { checkTrustMilestone } from '../../src/systems';
import { createMockState } from './_fixtures/mockState';

describe('checkTrustMilestone', () => {
  it('does not award trust below the first threshold', () => {
    const state = createMockState({ clips: 999n, trust: 2 });
    const next = checkTrustMilestone(state);
    expect(next.trust).toBe(2);
  });

  it('awards +1 trust when crossing a single threshold', () => {
    const state = createMockState({ clips: 1000n, trust: 2 });
    const next = checkTrustMilestone(state);
    expect(next.trust).toBeGreaterThanOrEqual(3);
  });

  it('does not double-award on a subsequent call at same threshold', () => {
    let state = createMockState({ clips: 1000n, trust: 2 });
    state = checkTrustMilestone(state);
    const afterFirst = state.trust;
    state = checkTrustMilestone(state);
    expect(state.trust).toBe(afterFirst);
  });

  it('awards trust for each new milestone crossed', () => {
    let state = createMockState({ clips: 0n, trust: 2 });

    state = { ...state, clips: 1000n };
    state = checkTrustMilestone(state);
    const trustAt1k = state.trust;

    state = { ...state, clips: 2000n };
    state = checkTrustMilestone(state);
    expect(state.trust).toBeGreaterThanOrEqual(trustAt1k + 1);

    state = { ...state, clips: 5000n };
    state = checkTrustMilestone(state);
    expect(state.trust).toBeGreaterThanOrEqual(trustAt1k + 2);
  });

  it('does not mutate input state', () => {
    const state = createMockState({ clips: 1000n, trust: 2 });
    checkTrustMilestone(state);
    expect(state.trust).toBe(2);
  });
});
