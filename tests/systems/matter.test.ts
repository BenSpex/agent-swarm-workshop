import { describe, it, expect } from 'vitest';
import { createMockState } from './_helpers';
import { updateMatter } from '../../src/systems/matter';

describe('updateMatter', () => {
  it('gated by matterHarvestingActive', () => {
    const state = createMockState({
      flags: { matterHarvestingActive: false },
      harvesterDrones: 10,
    });
    const result = updateMatter(state);
    expect(result).toBe(state);
  });

  it('harvester drones produce matter (when no wire drones consume it)', () => {
    const state = createMockState({
      flags: { matterHarvestingActive: true },
      harvesterDrones: 10,
      wireDrones: 0,
      matter: 0,
      acquiredMatter: 0,
    });
    const result = updateMatter(state);
    expect(result.matter).toBeGreaterThan(0);
    expect(result.acquiredMatter).toBeGreaterThan(0);
  });

  it('acquiredMatter tracks lifetime total even as matter gets consumed', () => {
    let state = createMockState({
      flags: { matterHarvestingActive: true },
      harvesterDrones: 10,
      wireDrones: 10,
    });
    for (let i = 0; i < 5; i++) {
      state = updateMatter(state);
    }
    expect(state.acquiredMatter).toBeGreaterThan(state.matter);
  });

  it('wire drones convert matter → wire', () => {
    const state = createMockState({
      flags: { matterHarvestingActive: true },
      harvesterDrones: 100,
      wireDrones: 10,
      matter: 0,
      wire: 0,
    });
    const result = updateMatter(state);
    expect(result.wire).toBeGreaterThan(0);
  });

  it('factory → clips conversion runs', () => {
    const state = createMockState({
      flags: { matterHarvestingActive: true },
      harvesterDrones: 0,
      clipFactories: 5n,
      clips: 0n,
    });
    const result = updateMatter(state);
    expect(result.clips).toBeGreaterThan(0n);
  });

  it('end-to-end chain: matter → wire → clips grows over 10 ticks', () => {
    let state = createMockState({
      flags: { matterHarvestingActive: true },
      harvesterDrones: 100,
      wireDrones: 10,
      clipFactories: 3n,
      matter: 0,
      wire: 0,
      clips: 0n,
    });
    for (let i = 0; i < 10; i++) {
      state = updateMatter(state);
    }
    expect(state.wire).toBeGreaterThan(0);
    expect(state.clips).toBeGreaterThan(0n);
    expect(state.acquiredMatter).toBeGreaterThan(0);
  });

  it('does not mutate input', () => {
    const state = createMockState({
      flags: { matterHarvestingActive: true },
      harvesterDrones: 10,
      matter: 0,
    });
    const originalMatter = state.matter;
    updateMatter(state);
    expect(state.matter).toBe(originalMatter);
  });
});
