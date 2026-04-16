import type { GameState, GameFlags } from '../shared/types';

export const AUTOCLIPPER_BASE_COST = 5;
export const AUTOCLIPPER_COST_GROWTH = 1.1;
export const MEGACLIPPER_BASE_COST = 500;
export const MEGACLIPPER_COST_GROWTH = 1.07;
export const MARKETING_BASE_COST = 100;

export const AUTOCLIPPER_RATE_PER_TICK = 0.1;
export const MEGACLIPPER_MULTIPLIER = 500;

export const WIRE_SPOOL_SIZE = 1000;
export const WIRE_PRICE_MIN = 10;
export const WIRE_PRICE_MAX = 35;

export const DEMAND_BASE = 1.1;
export const DEMAND_PRICE_EXPONENT = 1.15;
export const DEMAND_FLAG_MULTIPLIER = 1.5;

/**
 * Demand curve: base / price^exp, scaled by marketing and active flags.
 * Higher price → lower demand. Marketing and hypno/limericks flags boost it.
 * Returns per-tick demand (clips that would sell this tick at current price).
 */
export function calculateDemand(
  price: number,
  marketingLevel: number,
  flags: GameFlags,
): number {
  if (!isFinite(price) || price <= 0) return 0;
  const safeMarketing = Math.max(1, marketingLevel);
  let demand =
    (DEMAND_BASE * safeMarketing) /
    Math.pow(price, DEMAND_PRICE_EXPONENT);
  if (flags.hypnoHarmonicsActive) demand *= DEMAND_FLAG_MULTIPLIER;
  if (flags.limericksActive) demand *= DEMAND_FLAG_MULTIPLIER;
  return Math.max(0, demand);
}

/** Cost of next autoclipper. Exponential: 5 * 1.1^count, rounded up. */
export function calculateAutoClipperCost(count: number): number {
  const safe = Math.max(0, Math.floor(count));
  return Math.ceil(
    AUTOCLIPPER_BASE_COST * Math.pow(AUTOCLIPPER_COST_GROWTH, safe),
  );
}

/** Cost of next megaclipper. Exponential: 500 * 1.07^count, rounded up. */
export function calculateMegaClipperCost(count: number): number {
  const safe = Math.max(0, Math.floor(count));
  return Math.ceil(
    MEGACLIPPER_BASE_COST * Math.pow(MEGACLIPPER_COST_GROWTH, safe),
  );
}

/**
 * Cost to upgrade marketing to next level.
 * marketingLevel=1 (starting level) → next upgrade costs 100.
 * Doubles each level.
 */
export function calculateMarketingCost(level: number): number {
  const safe = Math.max(1, Math.floor(level));
  return MARKETING_BASE_COST * Math.pow(2, safe - 1);
}

/**
 * Sell clips from unsoldClips inventory.
 * Sells min(unsoldClips, floor(demand)) at current price.
 * Pure: returns a new state object.
 */
export function sellClips(state: GameState): GameState {
  if (state.unsoldClips <= 0n) return state;
  const demandInt = Math.max(0, Math.floor(state.demand));
  if (demandInt <= 0) return state;
  const desired = BigInt(demandInt);
  const sellAmount =
    state.unsoldClips < desired ? state.unsoldClips : desired;
  if (sellAmount <= 0n) return state;
  const revenue = Number(sellAmount) * state.price;
  return {
    ...state,
    unsoldClips: state.unsoldClips - sellAmount,
    funds: state.funds + revenue,
  };
}

/**
 * Auto-clippers produce clips. Consumes 1 wire per clip.
 * Rate: AUTOCLIPPER_RATE_PER_TICK clips per clipper per tick.
 * Bounded by available wire and integer-floored.
 */
export function produceAutoClips(state: GameState): GameState {
  if (state.autoClipperCount <= 0) return state;
  if (state.wire <= 0) return state;
  const desired = Math.floor(
    state.autoClipperCount * AUTOCLIPPER_RATE_PER_TICK,
  );
  if (desired <= 0) return state;
  const produced = Math.min(desired, state.wire);
  if (produced <= 0) return state;
  const producedBig = BigInt(produced);
  return {
    ...state,
    clips: state.clips + producedBig,
    unsoldClips: state.unsoldClips + producedBig,
    wire: state.wire - produced,
  };
}

/**
 * Mega-clippers: 500× the rate of autoclippers per unit.
 * Same wire gating as autoclippers.
 */
export function produceMegaClips(state: GameState): GameState {
  if (state.megaClipperCount <= 0) return state;
  if (state.wire <= 0) return state;
  const desired = Math.floor(
    state.megaClipperCount *
      AUTOCLIPPER_RATE_PER_TICK *
      MEGACLIPPER_MULTIPLIER,
  );
  if (desired <= 0) return state;
  const produced = Math.min(desired, state.wire);
  if (produced <= 0) return state;
  const producedBig = BigInt(produced);
  return {
    ...state,
    clips: state.clips + producedBig,
    unsoldClips: state.unsoldClips + producedBig,
    wire: state.wire - produced,
  };
}

/**
 * Random walk on wirePrice, clamped to [WIRE_PRICE_MIN, WIRE_PRICE_MAX].
 * Uses Math.random — isolated per spec ("wire price random walk is fine").
 * Pure w.r.t. state but reads RNG; only the engine should call this.
 */
export function fluctuateWirePrice(state: GameState): GameState {
  const delta = (Math.random() - 0.5) * 2;
  const next = Math.min(
    WIRE_PRICE_MAX,
    Math.max(WIRE_PRICE_MIN, state.wirePrice + delta),
  );
  if (next === state.wirePrice) return state;
  return { ...state, wirePrice: next };
}
