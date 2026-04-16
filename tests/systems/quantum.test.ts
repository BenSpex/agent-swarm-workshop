import { describe, it, expect } from 'vitest';
import { createMockState } from './_helpers';
import { updateCreativity } from '../../src/systems/quantum';

describe('updateCreativity', () => {
  it('returns state unchanged when quantumUnlocked is false', () => {
    const state = createMockState({ operations: 500, maxOperations: 1000 });
    const result = updateCreativity(state);
    expect(result).toBe(state);
  });

  it('increases creativity when unlocked', () => {
    const state = createMockState({
      flags: { quantumUnlocked: true },
      operations: 1000,
      maxOperations: 1000,
      creativity: 0,
    });
    const result = updateCreativity(state);
    expect(result.creativity).toBeGreaterThan(0);
  });

  it('limericksActive boosts creativity rate vs baseline', () => {
    const base = createMockState({
      flags: { quantumUnlocked: true },
      operations: 1000,
      maxOperations: 1000,
    });
    const boosted = createMockState({
      flags: { quantumUnlocked: true, limericksActive: true },
      operations: 1000,
      maxOperations: 1000,
    });
    const baseDelta = updateCreativity(base).creativity - base.creativity;
    const boostedDelta = updateCreativity(boosted).creativity - boosted.creativity;
    expect(boostedDelta).toBeGreaterThan(baseDelta);
  });

  it('lexicalProcessingActive stacks on top of limericks', () => {
    const limericks = createMockState({
      flags: { quantumUnlocked: true, limericksActive: true },
      operations: 1000,
      maxOperations: 1000,
    });
    const lexical = createMockState({
      flags: {
        quantumUnlocked: true,
        limericksActive: true,
        lexicalProcessingActive: true,
      },
      operations: 1000,
      maxOperations: 1000,
    });
    const lDelta = updateCreativity(limericks).creativity - limericks.creativity;
    const lxDelta = updateCreativity(lexical).creativity - lexical.creativity;
    expect(lxDelta).toBeGreaterThan(lDelta);
  });

  it('combinatoryHarmonics multiplier is largest', () => {
    const lexical = createMockState({
      flags: {
        quantumUnlocked: true,
        limericksActive: true,
        lexicalProcessingActive: true,
      },
      operations: 1000,
      maxOperations: 1000,
    });
    const combinatory = createMockState({
      flags: {
        quantumUnlocked: true,
        limericksActive: true,
        lexicalProcessingActive: true,
        combinatoryHarmonicsActive: true,
      },
      operations: 1000,
      maxOperations: 1000,
    });
    const lxDelta = updateCreativity(lexical).creativity - lexical.creativity;
    const cDelta = updateCreativity(combinatory).creativity - combinatory.creativity;
    expect(cDelta).toBeGreaterThan(lxDelta);
  });

  it('does not mutate the input state', () => {
    const state = createMockState({
      flags: { quantumUnlocked: true },
      operations: 1000,
      maxOperations: 1000,
    });
    const originalCreativity = state.creativity;
    updateCreativity(state);
    expect(state.creativity).toBe(originalCreativity);
  });
});
