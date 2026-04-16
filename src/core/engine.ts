import type { GameState } from '../shared/types';
import type { GameAction } from '../shared/actions';
import type { GameEngine } from '../shared/engine';
import { createInitialState } from './initialState';
import { saveToLocalStorage, loadFromLocalStorage, clearLocalStorage } from './save';
import { tickReducer } from './tickHandler';
import { actionReducer } from './actionHandlers';

const TICK_INTERVAL_MS = 100;
const AUTO_SAVE_EVERY_N_TICKS = 250;
const MAX_MESSAGES = 50;

export function createEngine(): GameEngine {
  let state: GameState = createInitialState();
  const subscribers = new Set<(s: GameState) => void>();
  let intervalRef: ReturnType<typeof setInterval> | null = null;

  function notify(): void {
    for (const fn of subscribers) {
      try {
        fn(state);
      } catch (err) {
        pushError('subscriber threw: ' + errMsg(err));
      }
    }
  }

  function pushError(msg: string): void {
    state = {
      ...state,
      messages: [`[engine] error: ${msg}`, ...state.messages].slice(0, MAX_MESSAGES),
    };
  }

  function reduce(action: GameAction): GameState {
    if (action.type === 'LOAD_SAVE') return action.state;
    if (action.type === 'RESET') return createInitialState();
    if (action.type === 'TICK') return tickReducer(state);
    return actionReducer(state, action);
  }

  function dispatch(action: GameAction): void {
    try {
      const next = reduce(action);
      state = next;
      if (action.type === 'TICK' && state.tick > 0 && state.tick % AUTO_SAVE_EVERY_N_TICKS === 0) {
        try {
          saveToLocalStorage(state);
        } catch (err) {
          pushError('auto-save failed: ' + errMsg(err));
        }
      }
      notify();
    } catch (err) {
      pushError('dispatch ' + action.type + ': ' + errMsg(err));
      notify();
    }
  }

  return {
    getState: () => state,
    dispatch,
    subscribe(listener) {
      subscribers.add(listener);
      return () => {
        subscribers.delete(listener);
      };
    },
    start() {
      if (intervalRef !== null) return;
      intervalRef = setInterval(() => dispatch({ type: 'TICK' }), TICK_INTERVAL_MS);
    },
    stop() {
      if (intervalRef === null) return;
      clearInterval(intervalRef);
      intervalRef = null;
    },
    save() {
      try {
        saveToLocalStorage(state);
      } catch (err) {
        pushError('save failed: ' + errMsg(err));
        notify();
      }
    },
    load() {
      try {
        const loaded = loadFromLocalStorage();
        if (!loaded) return false;
        state = loaded;
        notify();
        return true;
      } catch (err) {
        pushError('load failed: ' + errMsg(err));
        notify();
        return false;
      }
    },
    reset() {
      state = createInitialState();
      try {
        clearLocalStorage();
      } catch {
        // ignore
      }
      notify();
    },
    getMessages: () => state.messages,
  };
}

function errMsg(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}
