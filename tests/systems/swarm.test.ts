import { describe, it, expect } from 'vitest';
import { createMockState } from './_helpers';
import { updateSwarm } from '../../src/systems/swarm';

describe('updateSwarm', () => {
  it('gated by swarmSyncActive', () => {
    const state = createMockState({
      flags: { swarmSyncActive: false },
      swarmGiftTimer: 5,
    });
    const result = updateSwarm(state);
    expect(result).toBe(state);
  });

  it('decrements swarmGiftTimer while >1', () => {
    const state = createMockState({
      flags: { swarmSyncActive: true },
      swarmSyncLevel: 1,
      momentum: 1,
      swarmGiftTimer: 10,
    });
    const result = updateSwarm(state);
    expect(result.swarmGiftTimer).toBe(9);
    expect(result.operations).toBe(state.operations);
    expect(result.creativity).toBe(state.creativity);
  });

  it('fires a gift when timer reaches 0 and resets to 100', () => {
    const state = createMockState({
      flags: { swarmSyncActive: true },
      swarmSyncLevel: 1,
      momentum: 1,
      swarmGiftTimer: 1,
      operations: 100,
      creativity: 0,
      maxOperations: 1_000_000,
    });
    const result = updateSwarm(state);
    expect(result.swarmGiftTimer).toBe(100);
    const gotOps = result.operations > state.operations;
    const gotCreativity = result.creativity > state.creativity;
    expect(gotOps || gotCreativity).toBe(true);
  });

  it('pushes a gift message', () => {
    const state = createMockState({
      flags: { swarmSyncActive: true },
      swarmSyncLevel: 1,
      momentum: 1,
      swarmGiftTimer: 1,
      maxOperations: 1_000_000,
    });
    const result = updateSwarm(state);
    expect(result.messages.some((m) => m.toLowerCase().includes('swarm gift'))).toBe(true);
  });

  it('higher swarmSyncLevel produces larger gifts over many iterations', () => {
    function meanGift(level: number): number {
      let total = 0;
      for (let i = 0; i < 30; i++) {
        const state = createMockState({
          flags: { swarmSyncActive: true },
          swarmSyncLevel: level,
          momentum: 1,
          swarmGiftTimer: 1,
          operations: 0,
          creativity: 0,
          maxOperations: 1_000_000_000,
        });
        const result = updateSwarm(state);
        total += (result.operations - state.operations) + (result.creativity - state.creativity);
      }
      return total / 30;
    }
    expect(meanGift(5)).toBeGreaterThan(meanGift(1));
  });

  it('does not mutate input', () => {
    const state = createMockState({
      flags: { swarmSyncActive: true },
      swarmSyncLevel: 1,
      momentum: 1,
      swarmGiftTimer: 1,
    });
    const originalMessages = state.messages;
    updateSwarm(state);
    expect(state.messages).toBe(originalMessages);
    expect(state.swarmGiftTimer).toBe(1);
  });
});
