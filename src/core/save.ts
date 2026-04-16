import type { GameState } from '../shared/types';

export const SAVE_KEY = 'wy-paperclips-save';

interface BigIntEnvelope { __bigint: string }
interface SetEnvelope { __set: string[] }

function isBigIntEnvelope(v: unknown): v is BigIntEnvelope {
  return (
    !!v &&
    typeof v === 'object' &&
    typeof (v as { __bigint?: unknown }).__bigint === 'string'
  );
}

function isSetEnvelope(v: unknown): v is SetEnvelope {
  if (!v || typeof v !== 'object') return false;
  const raw = (v as { __set?: unknown }).__set;
  return Array.isArray(raw) && raw.every((s) => typeof s === 'string');
}

export function bigIntReplacer(_key: string, value: unknown): unknown {
  if (typeof value === 'bigint') {
    return { __bigint: value.toString() };
  }
  if (value instanceof Set) {
    const items: string[] = [];
    value.forEach((item) => {
      if (typeof item === 'string') items.push(item);
    });
    return { __set: items };
  }
  return value;
}

export function bigIntReviver(_key: string, value: unknown): unknown {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    if (isBigIntEnvelope(value)) {
      return BigInt(value.__bigint);
    }
    if (isSetEnvelope(value)) {
      return new Set<string>(value.__set);
    }
  }
  return value;
}

export function serializeState(state: GameState): string {
  return JSON.stringify(state, bigIntReplacer);
}

export function deserializeState(json: string): GameState {
  return JSON.parse(json, bigIntReviver) as GameState;
}

function getStorage(): Storage | null {
  try {
    if (typeof globalThis === 'undefined') return null;
    const g = globalThis as { localStorage?: Storage };
    return g.localStorage ?? null;
  } catch {
    return null;
  }
}

export function saveToLocalStorage(state: GameState): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(SAVE_KEY, serializeState(state));
  } catch {
    // Quota exceeded, storage blocked, or serialization failed — swallow.
  }
}

export function loadFromLocalStorage(): GameState | null {
  const storage = getStorage();
  if (!storage) return null;
  let raw: string | null;
  try {
    raw = storage.getItem(SAVE_KEY);
  } catch {
    return null;
  }
  if (raw === null) return null;
  try {
    return deserializeState(raw);
  } catch {
    return null;
  }
}

export function clearSave(): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(SAVE_KEY);
  } catch {
    // ignore
  }
}
