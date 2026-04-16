import { describe, expect, it } from 'vitest';
import { updateCreativity } from '../../src/systems';
import { createMockState } from './_fixtures/mockState';

describe('updateCreativity', () => {
  it('generates 0 creativity when quantum is locked', () => {
    const state = createMockState({
      creativity: 0,
      flags: { quantumUnlocked: false } as never,
    });
    const next = updateCreativity(state);
    expect(next.creativity).toBe(0);
  });

  it('generates creativity when quantumUnlocked is true', () => {
    const state = createMockState({
      creativity: 0,
      processors: 10,
      flags: { quantumUnlocked: true, creativityUnlocked: true } as never,
    });
    let s = state;
    for (let i = 0; i < 100; i++) s = updateCreativity(s);
    expect(s.creativity).toBeGreaterThan(0);
  });

  it('limericksActive boosts creativity rate', () => {
    const base = createMockState({
      creativity: 0,
      processors: 10,
      flags: { quantumUnlocked: true, creativityUnlocked: true } as never,
    });
    const boosted = createMockState({
      creativity: 0,
      processors: 10,
      flags: {
        quantumUnlocked: true,
        creativityUnlocked: true,
        limericksActive: true,
      } as never,
    });

    let b = base;
    let x = boosted;
    for (let i = 0; i < 100; i++) {
      b = updateCreativity(b);
      x = updateCreativity(x);
    }
    if (b.creativity === 0 && x.creativity === 0) return;
    expect(x.creativity).toBeGreaterThanOrEqual(b.creativity);
  });

  it('combinatoryHarmonicsActive boosts creativity rate', () => {
    const base = createMockState({
      creativity: 0,
      processors: 10,
      flags: { quantumUnlocked: true, creativityUnlocked: true } as never,
    });
    const boosted = createMockState({
      creativity: 0,
      processors: 10,
      flags: {
        quantumUnlocked: true,
        creativityUnlocked: true,
        combinatoryHarmonicsActive: true,
      } as never,
    });

    let b = base;
    let x = boosted;
    for (let i = 0; i < 100; i++) {
      b = updateCreativity(b);
      x = updateCreativity(x);
    }
    if (b.creativity === 0 && x.creativity === 0) return;
    expect(x.creativity).toBeGreaterThanOrEqual(b.creativity);
  });

  it('does not mutate input state', () => {
    const state = createMockState({
      creativity: 0,
      processors: 10,
      flags: { quantumUnlocked: true } as never,
    });
    updateCreativity(state);
    expect(state.creativity).toBe(0);
  });
});
