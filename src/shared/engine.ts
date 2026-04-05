import type { GameState } from './types';
import type { GameAction } from './actions';

/**
 * GameEngine interface — Core team implements this.
 * Observable pattern: subscribe, dispatch, start/stop tick.
 */
export interface GameEngine {
  getState(): GameState;
  dispatch(action: GameAction): void;
  subscribe(listener: (state: GameState) => void): () => void;
  start(): void;
  stop(): void;
  save(): void;
  load(): boolean;
  reset(): void;
  getMessages(): string[];
}

/** Format a number with K/M/B/T suffixes */
export function formatNumber(n: number): string {
  if (n < 1000) return n.toFixed(n % 1 === 0 ? 0 : 1);
  if (n < 1_000_000) return (n / 1_000).toFixed(1) + 'K';
  if (n < 1_000_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n < 1_000_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
  return (n / 1_000_000_000_000).toFixed(1) + 'T';
}

/** Format money with $ prefix and K/M/B/T suffixes */
export function formatMoney(n: number): string {
  return '$' + formatNumber(n);
}

/** Format a decimal as percentage */
export function formatPercent(n: number): string {
  return (n * 100).toFixed(1) + '%';
}

/** Format a bigint with K/M/B/T suffixes */
export function formatBigInt(n: bigint): string {
  if (n < 1000n) return n.toString();
  if (n < 1_000_000n) return (Number(n) / 1_000).toFixed(1) + 'K';
  if (n < 1_000_000_000n) return (Number(n) / 1_000_000).toFixed(1) + 'M';
  if (n < 1_000_000_000_000n) return (Number(n) / 1_000_000_000).toFixed(1) + 'B';
  if (n < 1_000_000_000_000_000n) return (Number(n) / 1_000_000_000_000).toFixed(1) + 'T';
  // Beyond T, use exponential to avoid precision loss
  const str = n.toString();
  return str.slice(0, 3) + '...' + ' (10^' + (str.length - 1) + ')';
}
