import { describe, expect, it } from 'vitest';
import { updateSwarm } from '../../src/systems';
import { createMockState } from './_fixtures/mockState';

describe('updateSwarm', () => {
  it('is a no-op when swarmSyncActive is false', () => {
    const state = createMockState({
      momentum: 100,
      swarmSyncLevel: 5,
      swarmGiftTimer: 0,
      operations: 0,
      creativity: 0,
      flags: { swarmSyncActive: false } as never,
    });
    const next = updateSwarm(state);
    expect(next.operations).toBe(0);
    expect(next.creativity).toBe(0);
  });

  it('decrements swarmGiftTimer each tick while active', () => {
    const state = createMockState({
      swarmGiftTimer: 10,
      swarmSyncLevel: 1,
      momentum: 10,
      flags: { swarmSyncActive: true } as never,
    });
    const next = updateSwarm(state);
    expect(next.swarmGiftTimer).toBeLessThan(10);
  });

  it('delivers a gift (ops or creativity) when timer hits 0', () => {
    const state = createMockState({
      swarmGiftTimer: 1,
      swarmSyncLevel: 3,
      momentum: 100,
      operations: 0,
      creativity: 0,
      flags: { swarmSyncActive: true } as never,
    });

    let s = state;
    for (let i = 0; i < 5; i++) s = updateSwarm(s);

    const gotOps = s.operations > 0;
    const gotCreativity = s.creativity > 0;
    expect(gotOps || gotCreativity).toBe(true);
  });

  it('resets swarmGiftTimer after a gift fires', () => {
    const state = createMockState({
      swarmGiftTimer: 0,
      swarmSyncLevel: 3,
      momentum: 50,
      flags: { swarmSyncActive: true } as never,
    });
    const next = updateSwarm(state);
    expect(next.swarmGiftTimer).toBeGreaterThan(0);
  });

  it('does not mutate input state', () => {
    const state = createMockState({
      swarmGiftTimer: 5,
      swarmSyncLevel: 3,
      momentum: 10,
      flags: { swarmSyncActive: true } as never,
    });
    updateSwarm(state);
    expect(state.swarmGiftTimer).toBe(5);
  });
});
