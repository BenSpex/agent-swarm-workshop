import { useSyncExternalStore } from 'react';
import type { GameState } from '../shared/types';
import type { GameAction } from '../shared/actions';
import { createMockState } from './mockState';

let cachedMock: GameState | null = null;

function subscribe(cb: () => void): () => void {
  return window.__engine?.subscribe(cb) ?? (() => {});
}

function getSnapshot(): GameState {
  if (window.__engine) return window.__engine.getState();
  if (!cachedMock) cachedMock = createMockState();
  return cachedMock;
}

export function useGameState(): GameState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useDispatch(): (action: GameAction) => void {
  return (action) => {
    window.__engine?.dispatch(action);
  };
}
