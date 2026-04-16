import { useSyncExternalStore } from 'react';
import type { GameState } from '../shared/types';
import type { GameAction } from '../shared/actions';
import { MOCK_STATE } from './mockState';

function subscribe(cb: () => void): () => void {
  const engine = typeof window !== 'undefined' ? window.__engine : undefined;
  if (!engine) return () => {};
  return engine.subscribe(cb);
}

function getSnapshot(): GameState {
  const engine = typeof window !== 'undefined' ? window.__engine : undefined;
  return engine?.getState() ?? MOCK_STATE;
}

function getServerSnapshot(): GameState {
  return MOCK_STATE;
}

export function useGameState(): GameState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useDispatch(): (action: GameAction) => void {
  return (action) => {
    const engine = typeof window !== 'undefined' ? window.__engine : undefined;
    engine?.dispatch(action);
  };
}
