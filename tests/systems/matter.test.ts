import { describe, expect, it } from 'vitest';
import { updateMatter } from '../../src/systems';
import { createMockState } from './_fixtures/mockState';

describe('updateMatter', () => {
  it('is a no-op when matterHarvestingActive is false', () => {
    const state = createMockState({
      harvesterDrones: 100,
      wireDrones: 100,
      matter: 0,
      acquiredMatter: 0,
      wire: 0,
      flags: { matterHarvestingActive: false } as never,
    });
    const next = updateMatter(state);
    expect(next.matter).toBe(0);
    expect(next.acquiredMatter).toBe(0);
    expect(next.wire).toBe(0);
  });

  it('harvesters generate matter each tick when active', () => {
    const state = createMockState({
      harvesterDrones: 10,
      wireDrones: 0,
      matter: 0,
      acquiredMatter: 0,
      flags: { matterHarvestingActive: true } as never,
    });
    const next = updateMatter(state);
    expect(next.matter).toBeGreaterThan(0);
  });

  it('acquiredMatter tracks lifetime total harvested', () => {
    let state = createMockState({
      harvesterDrones: 10,
      wireDrones: 0,
      matter: 0,
      acquiredMatter: 0,
      flags: { matterHarvestingActive: true } as never,
    });
    for (let i = 0; i < 5; i++) state = updateMatter(state);
    expect(state.acquiredMatter).toBeGreaterThanOrEqual(state.matter);
    expect(state.acquiredMatter).toBeGreaterThan(0);
  });

  it('wire drones convert matter into wire', () => {
    const state = createMockState({
      harvesterDrones: 0,
      wireDrones: 10,
      matter: 1000,
      wire: 0,
      flags: { matterHarvestingActive: true } as never,
    });
    const next = updateMatter(state);
    expect(next.wire).toBeGreaterThan(0);
    expect(next.matter).toBeLessThan(1000);
  });

  it('does not mutate input state', () => {
    const state = createMockState({
      harvesterDrones: 10,
      matter: 0,
      acquiredMatter: 0,
      flags: { matterHarvestingActive: true } as never,
    });
    updateMatter(state);
    expect(state.matter).toBe(0);
    expect(state.acquiredMatter).toBe(0);
  });
});
