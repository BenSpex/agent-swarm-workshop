import type { GameState } from '../shared/types';
import type { GameAction } from '../shared/actions';
import type { GameEngine } from '../shared/engine';
import { rootReducer } from './tickHandler';
import { createInitialState } from './initialState';
import { saveToLocalStorage, loadFromLocalStorage, clearSave } from './save';

type Listener = (state: GameState) => void;

interface Snapshot {
  clips: bigint;
  funds: number;
  clipsSold: bigint;
}

const TICK_MS = 100;
const BUFFER_SIZE = 10;
const AUTO_SAVE_EVERY = 250;

export function createEngine(): GameEngine {
  let state: GameState = createInitialState();
  const listeners: Set<Listener> = new Set();
  let intervalHandle: ReturnType<typeof setInterval> | null = null;
  const buffer: Snapshot[] = [];

  function notify(): void {
    listeners.forEach((l) => l(state));
  }

  function applyDerivedMetrics(s: GameState): GameState {
    const clipsSold = s.clips - s.unsoldClips;
    buffer.push({ clips: s.clips, funds: s.funds, clipsSold });
    while (buffer.length > BUFFER_SIZE) buffer.shift();
    if (buffer.length < BUFFER_SIZE) return s;
    const oldest = buffer[0];
    return {
      ...s,
      clipsPerSecond: Number(s.clips - oldest.clips),
      revenuePerSecond: s.funds - oldest.funds,
      clipsSoldPerSecond: Number(clipsSold - oldest.clipsSold),
    };
  }

  function dispatch(action: GameAction): void {
    state = rootReducer(state, action);
    if (action.type === 'TICK') {
      state = applyDerivedMetrics(state);
      if (state.tick > 0 && state.tick % AUTO_SAVE_EVERY === 0) {
        saveToLocalStorage(state);
      }
    } else if (action.type === 'PRESTIGE') {
      buffer.length = 0;
    } else if (action.type === 'RESET') {
      buffer.length = 0;
      clearSave();
    }
    notify();
  }

  return {
    getState: () => state,
    dispatch,
    subscribe(listener: Listener): () => void {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    start(): void {
      if (intervalHandle !== null) return;
      intervalHandle = setInterval(() => dispatch({ type: 'TICK' }), TICK_MS);
    },
    stop(): void {
      if (intervalHandle !== null) {
        clearInterval(intervalHandle);
        intervalHandle = null;
      }
    },
    save(): void {
      saveToLocalStorage(state);
    },
    load(): boolean {
      const loaded = loadFromLocalStorage();
      if (loaded === null) return false;
      state = loaded;
      buffer.length = 0;
      notify();
      return true;
    },
    reset(): void {
      state = createInitialState();
      buffer.length = 0;
      clearSave();
      notify();
    },
    getMessages: () => state.messages,
  };
}
