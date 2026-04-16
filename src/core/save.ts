import type { GameState } from '../shared/types';

const STORAGE_KEY = 'wy-paperclips-save';

type BigIntMarker = { __bigint: string };
type SetMarker = { __set: unknown[] };

function isBigIntMarker(v: unknown): v is BigIntMarker {
  return typeof v === 'object' && v !== null && typeof (v as BigIntMarker).__bigint === 'string';
}

function isSetMarker(v: unknown): v is SetMarker {
  return typeof v === 'object' && v !== null && Array.isArray((v as SetMarker).__set);
}

export function serializeState(state: GameState): string {
  return JSON.stringify(state, (_key, value) => {
    if (typeof value === 'bigint') {
      return { __bigint: value.toString() };
    }
    if (value instanceof Set) {
      return { __set: Array.from(value) };
    }
    return value;
  });
}

export function deserializeState(json: string): GameState {
  return JSON.parse(json, (_key, value) => {
    if (isBigIntMarker(value)) return BigInt(value.__bigint);
    if (isSetMarker(value)) return new Set(value.__set);
    return value;
  }) as GameState;
}

function hasLocalStorage(): boolean {
  return typeof globalThis !== 'undefined'
    && typeof (globalThis as { localStorage?: Storage }).localStorage !== 'undefined';
}

export function saveToLocalStorage(state: GameState): void {
  if (!hasLocalStorage()) return;
  try {
    const json = serializeState(state);
    localStorage.setItem(STORAGE_KEY, json);
  } catch (err) {
    // QuotaExceededError or serialization failure — swallow gracefully.
    const name = (err as { name?: string })?.name;
    if (name === 'QuotaExceededError' || name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      return;
    }
    // Non-quota errors: also swallow — save must never crash the game loop.
    return;
  }
}

export function loadFromLocalStorage(): GameState | null {
  if (!hasLocalStorage()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw == null) return null;
    return deserializeState(raw);
  } catch {
    return null;
  }
}

export function clearLocalStorage(): void {
  if (!hasLocalStorage()) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
