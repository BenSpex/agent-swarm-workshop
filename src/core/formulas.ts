import type { GameState, GameFlags } from '../shared/types';

export function calculateDemand(
  price: number,
  marketingLevel: number,
  flags: GameFlags,
): number {
  const pricePenalty = Math.max(0.1, 2 - price * 4);
  let demand = marketingLevel * 1.1 * pricePenalty;
  if (flags.hypnoHarmonicsActive) demand *= 2;
  return Math.max(0, demand);
}

export function calculateAutoClipperCost(count: number): number {
  return Math.floor(5 * Math.pow(1.1, count));
}

export function calculateMegaClipperCost(count: number): number {
  return Math.floor(500 * Math.pow(1.08, count));
}

export function calculateMarketingCost(level: number): number {
  return Math.floor(100 * Math.pow(2, level - 1));
}

export function fluctuateWirePrice(price: number, rnd: number): number {
  const next = price + (rnd - 0.5) * 2;
  return Math.max(10, Math.min(35, next));
}

export function sellClips(state: GameState): GameState {
  if (state.unsoldClips <= 0n) return state;
  const demandPerTick = Math.max(0, state.demand / 10);
  if (demandPerTick <= 0) return state;
  const unsoldNum = Number(state.unsoldClips);
  const soldNum = Math.min(unsoldNum, demandPerTick);
  const soldFloor = Math.floor(soldNum);
  if (soldFloor <= 0) return state;
  const revenue = soldFloor * state.price;
  return {
    ...state,
    unsoldClips: state.unsoldClips - BigInt(soldFloor),
    funds: state.funds + revenue,
  };
}

export function produceAutoClips(state: GameState): GameState {
  if (state.autoClipperCount <= 0) return state;
  if (state.wire <= 0) return state;
  const produce = Math.floor(state.autoClipperCount / 10);
  if (produce <= 0) return state;
  const capped = Math.min(produce, state.wire);
  if (capped <= 0) return state;
  const cappedBig = BigInt(capped);
  return {
    ...state,
    clips: state.clips + cappedBig,
    unsoldClips: state.unsoldClips + cappedBig,
    wire: state.wire - capped,
  };
}

export function produceMegaClips(state: GameState): GameState {
  if (state.megaClipperCount <= 0) return state;
  if (state.wire <= 0) return state;
  const perTick = (state.megaClipperCount * 50) / 10;
  const produce = Math.floor(perTick);
  if (produce <= 0) return state;
  const capped = Math.min(produce, state.wire);
  if (capped <= 0) return state;
  const cappedBig = BigInt(capped);
  return {
    ...state,
    clips: state.clips + cappedBig,
    unsoldClips: state.unsoldClips + cappedBig,
    wire: state.wire - capped,
  };
}
