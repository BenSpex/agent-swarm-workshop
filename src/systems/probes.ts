import type { GameState } from '../shared/types';
import { GamePhase } from '../shared/types';

const DRIFTER_STRENGTH = 1;
const DRIFTER_CHANCE_COEFFICIENT = 1e-9;
const DRIFTER_CHANCE_MAX = 0.9;
const LOSS_RATIO = 0.01;
const FACTORY_PROD_DIVISOR = 10000n;
const HARVESTER_PROD_DIVISOR = 10000;
const WIRE_DRONE_PROD_DIVISOR = 10000;

function exploreSectors(probes: bigint, exploration: number, speed: number): bigint {
  if (probes <= 0n) return 0n;
  const perProbe = Math.max(0, Math.floor(exploration * speed));
  if (perProbe <= 0) return 0n;
  return probes * BigInt(perProbe);
}

function replicate(probes: bigint, rate: number): bigint {
  if (probes <= 0n || rate <= 0) return 0n;
  const rateInt = BigInt(Math.max(0, Math.floor(rate)));
  if (rateInt === 0n) return 0n;
  return (probes * rateInt) / 1000n;
}

function drifterChance(exploredSectors: bigint, probes: bigint): number {
  if (probes <= 0n) return 0;
  const scalar = Math.min(Number(exploredSectors > BigInt(Number.MAX_SAFE_INTEGER) ? BigInt(Number.MAX_SAFE_INTEGER) : exploredSectors), Number.MAX_SAFE_INTEGER);
  const raw = scalar * DRIFTER_CHANCE_COEFFICIENT;
  return Math.min(DRIFTER_CHANCE_MAX, raw);
}

function spawnDrifters(probes: bigint): bigint {
  if (probes <= 0n) return 0n;
  const bound = probes / 10n + 1n;
  const boundNum = bound > BigInt(Number.MAX_SAFE_INTEGER) ? Number.MAX_SAFE_INTEGER : Number(bound);
  const rolled = Math.floor(Math.random() * boundNum);
  return BigInt(Math.max(0, rolled));
}

function probesToNumberClamped(probes: bigint): number {
  if (probes > BigInt(Number.MAX_SAFE_INTEGER)) return Number.MAX_SAFE_INTEGER;
  return Number(probes);
}

export function updateProbes(state: GameState): GameState {
  if (state.phase !== GamePhase.UNIVERSE) return state;
  if (state.probes <= 0n) return state;

  let probes = state.probes;
  let exploredSectors = state.exploredSectors;
  let drifterCount = state.drifterCount;
  let probeDescendants = state.probeDescendants;
  let probeLosses = state.probeLosses;
  let honor = state.honor;
  let clipFactories = state.clipFactories;
  let harvesterDrones = state.harvesterDrones;
  let wireDrones = state.wireDrones;
  const messages = [...state.messages];

  const newSectors = exploreSectors(probes, state.probeExploration, state.probeSpeed);
  exploredSectors = exploredSectors + newSectors;

  const newProbes = replicate(probes, state.probeSelfReplication);
  if (newProbes > 0n) {
    probes = probes + newProbes;
    probeDescendants = probeDescendants + newProbes;
  }

  if (state.probeFactoryProd > 0) {
    const factoriesGained = (probes * BigInt(state.probeFactoryProd)) / FACTORY_PROD_DIVISOR;
    if (factoriesGained > 0n) clipFactories = clipFactories + factoriesGained;
  }
  if (state.probeHarvesterProd > 0) {
    const harvestersGained = probesToNumberClamped(probes) * state.probeHarvesterProd / HARVESTER_PROD_DIVISOR;
    if (harvestersGained > 0) harvesterDrones = harvesterDrones + harvestersGained;
  }
  if (state.probeWireDroneProd > 0) {
    const wireDronesGained = probesToNumberClamped(probes) * state.probeWireDroneProd / WIRE_DRONE_PROD_DIVISOR;
    if (wireDronesGained > 0) wireDrones = wireDrones + wireDronesGained;
  }

  const encounterProb = drifterChance(exploredSectors, probes);
  if (encounterProb > 0 && Math.random() < encounterProb) {
    drifterCount = drifterCount + spawnDrifters(probes);
  }

  if (drifterCount > 0n) {
    const probeCount = probesToNumberClamped(probes);
    const drifterCountNum = probesToNumberClamped(drifterCount);
    const power = state.probeCombat * probeCount;
    const drifterPower = drifterCountNum * DRIFTER_STRENGTH;
    const total = power + drifterPower;
    const winProb = total > 0 ? power / total : 0;

    if (Math.random() < winProb) {
      honor = honor + 1;
      messages.push(`Combat: defeated ${drifterCount.toString()} drifters (+1 honor)`);
      drifterCount = 0n;
    } else {
      const baseLosses = BigInt(Math.floor(drifterCountNum * LOSS_RATIO));
      const mitigator = BigInt(1 + Math.max(0, Math.floor(state.probeHazardRemediation)));
      const probesLost = baseLosses / mitigator;
      if (probesLost > 0n) {
        const actualLost = probesLost > probes ? probes : probesLost;
        probes = probes - actualLost;
        probeLosses = probeLosses + actualLost;
        messages.push(`Combat loss: ${actualLost.toString()} probes destroyed by drifters`);
      }
    }
  }

  return {
    ...state,
    probes,
    exploredSectors,
    drifterCount,
    probeDescendants,
    probeLosses,
    honor,
    clipFactories,
    harvesterDrones,
    wireDrones,
    messages,
  };
}
