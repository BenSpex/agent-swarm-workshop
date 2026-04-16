import { describe, expect, it } from 'vitest';
import { GamePhase } from '../../../src/shared/types';
import { createMockState } from './mockState';

describe('createMockState', () => {
  it('returns a fully-populated GameState with UP defaults', () => {
    const s = createMockState();
    expect(s.phase).toBe(GamePhase.BUSINESS);
    expect(s.tick).toBe(0);
    expect(s.clips).toBe(0n);
    expect(s.wire).toBe(1000);
    expect(s.price).toBe(0.25);
    expect(s.trust).toBe(2);
    expect(s.processors).toBe(1);
    expect(s.memory).toBe(1);
    expect(s.probeSpeed).toBe(1);
    expect(s.probeHazardRemediation).toBe(1);
    expect(s.investment).toBeNull();
    expect(s.purchasedProjectIds).toBeInstanceOf(Set);
    expect(s.purchasedProjectIds.size).toBe(0);
  });

  it('shallow-overrides top-level fields', () => {
    const s = createMockState({ clips: 5000n, funds: 200 });
    expect(s.clips).toBe(5000n);
    expect(s.funds).toBe(200);
    expect(s.wire).toBe(1000);
  });

  it('deep-merges flags so absent flags keep defaults', () => {
    const s = createMockState({ flags: { quantumUnlocked: true } as never });
    expect(s.flags.quantumUnlocked).toBe(true);
    expect(s.flags.autoClippersUnlocked).toBe(false);
    expect(s.flags.revTrackerEnabled).toBe(false);
  });

  it('fills investment defaults when overridden with partial', () => {
    const s = createMockState({
      investment: { stocks: 100, bonds: 50 } as never,
    });
    expect(s.investment).not.toBeNull();
    expect(s.investment!.stocks).toBe(100);
    expect(s.investment!.bonds).toBe(50);
    expect(s.investment!.riskLevel).toBe(1);
  });

  it('does not share mutable state between calls', () => {
    const a = createMockState();
    const b = createMockState();
    a.purchasedProjectIds.add('x');
    a.messages.push('hi');
    a.flags.quantumUnlocked = true;
    expect(b.purchasedProjectIds.has('x')).toBe(false);
    expect(b.messages.length).toBe(0);
    expect(b.flags.quantumUnlocked).toBe(false);
  });

  it('accepts purchasedProjectIds as an override Set', () => {
    const s = createMockState({
      purchasedProjectIds: new Set(['quantum_computing']),
    });
    expect(s.purchasedProjectIds.has('quantum_computing')).toBe(true);
  });
});
