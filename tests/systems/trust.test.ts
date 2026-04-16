import { describe, it, expect } from 'vitest';
import { createMockState } from './_helpers';
import { checkTrustMilestone } from '../../src/systems/trust';

describe('checkTrustMilestone', () => {
  it('awards +1 trust when crossing 1000 clips', () => {
    const state = createMockState({ clips: 1000n, trust: 2 });
    const result = checkTrustMilestone(state);
    expect(result.trust).toBe(3);
    expect(result.purchasedProjectIds.has('trust_milestone_1000')).toBe(true);
  });

  it('does not award at 999 clips', () => {
    const state = createMockState({ clips: 999n, trust: 2 });
    const result = checkTrustMilestone(state);
    expect(result).toBe(state);
    expect(result.trust).toBe(2);
  });

  it('is idempotent once the milestone sentinel is set', () => {
    const state = createMockState({
      clips: 1500n,
      trust: 2,
      purchasedProjectIds: new Set(['trust_milestone_1000']),
    });
    const result = checkTrustMilestone(state);
    expect(result.trust).toBe(2);
    expect(result).toBe(state);
  });

  it('awards multiple milestones at once when crossing several tiers', () => {
    const state = createMockState({ clips: 2000n, trust: 2 });
    const result = checkTrustMilestone(state);
    expect(result.trust).toBe(4);
    expect(result.purchasedProjectIds.has('trust_milestone_1000')).toBe(true);
    expect(result.purchasedProjectIds.has('trust_milestone_2000')).toBe(true);
  });

  it('pushes a message for each awarded milestone', () => {
    const state = createMockState({ clips: 1000n, trust: 2 });
    const result = checkTrustMilestone(state);
    expect(result.messages.some((m) => m.includes('1000'))).toBe(true);
  });

  it('does not mutate the input purchasedProjectIds set', () => {
    const state = createMockState({ clips: 1000n, trust: 2 });
    const originalSet = state.purchasedProjectIds;
    checkTrustMilestone(state);
    expect(state.purchasedProjectIds).toBe(originalSet);
    expect(originalSet.has('trust_milestone_1000')).toBe(false);
  });

  it('awards every milestone when clips exceed 1M', () => {
    const state = createMockState({ clips: 1_000_000n, trust: 0 });
    const result = checkTrustMilestone(state);
    expect(result.trust).toBe(10);
  });
});
