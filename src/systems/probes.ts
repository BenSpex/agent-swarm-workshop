import type { GameState } from '../shared/types';

const DRIFTER_BASE_STRENGTH = 1.5;
const DRIFTER_SPAWN_PER_SECTOR = 1e-7;
const DRIFTER_SPAWN_MAX = 0.25;
const REPLICATION_PER_PROBE_PER_POINT = 0.0001;
const MAX_SAFE = Number.MAX_SAFE_INTEGER;

function bigIntToNumberSafe(b: bigint): number {
  if (b > BigInt(MAX_SAFE)) return MAX_SAFE;
  if (b < -BigInt(MAX_SAFE)) return -MAX_SAFE;
  return Number(b);
}

export function updateProbes(state: GameState): GameState {
  // Phase 3 only
  if (state.phase < 3 && !state.flags.phase3Unlocked) return state;
  if (state.probes <= 0n) return state;

  // Project buffs (read-only — projects only flip purchasedProjectIds)
  const hasDiplomacy = state.purchasedProjectIds.has('drifter_diplomacy');
  const hasOoda = state.purchasedProjectIds.has('ooda_loop');
  const hasNamed = state.purchasedProjectIds.has('name_the_probe');

  const effectiveCombat = state.probeCombat + (hasOoda ? 1 : 0);
  const effectiveSpeed = state.probeSpeed + (hasNamed ? 1 : 0);
  const effectiveDrifterStrength =
    DRIFTER_BASE_STRENGTH * (hasDiplomacy ? 0.5 : 1);

  const probesNum = bigIntToNumberSafe(state.probes);

  // 1) Exploration: probes * exploration * speed
  const explorePerTick = probesNum * state.probeExploration * effectiveSpeed;
  const exploredDelta = BigInt(Math.max(0, Math.floor(explorePerTick)));
  let exploredSectors = state.exploredSectors + exploredDelta;

  // 2) Self-replication
  const newProbesFloat =
    probesNum * state.probeSelfReplication * REPLICATION_PER_PROBE_PER_POINT;
  const newProbes = BigInt(Math.max(0, Math.floor(newProbesFloat)));
  let probes = state.probes + newProbes;
  const probeDescendants = state.probeDescendants + newProbes;

  // 3) Drifter spawn — chance scales with explored sectors, capped
  let drifterCount = state.drifterCount;
  const exploredNum = bigIntToNumberSafe(exploredSectors);
  const spawnChance = Math.min(
    DRIFTER_SPAWN_MAX,
    exploredNum * DRIFTER_SPAWN_PER_SECTOR,
  );
  if (Math.random() < spawnChance) {
    drifterCount += BigInt(1 + Math.floor(Math.random() * 5));
  }

  // 4) Combat
  let honor = state.honor;
  let probeLosses = state.probeLosses;
  if (drifterCount > 0n && probesNum > 0) {
    const drifterCountNum = bigIntToNumberSafe(drifterCount);
    const probeForce = effectiveCombat * probesNum;
    const drifterForce = drifterCountNum * effectiveDrifterStrength;
    const total = probeForce + drifterForce;
    const winProb = total > 0 ? probeForce / total : 0;
    if (Math.random() < winProb) {
      honor += 1;
      drifterCount = 0n;
    } else {
      const baseLoss = drifterCountNum * effectiveDrifterStrength;
      const mitigated = baseLoss / (1 + state.probeHazardRemediation);
      const lossNum = Math.min(probesNum, Math.max(0, Math.floor(mitigated)));
      const lossBig = BigInt(lossNum);
      probes = probes - lossBig;
      if (probes < 0n) probes = 0n;
      probeLosses = probeLosses + lossBig;
    }
  }

  return {
    ...state,
    probes,
    probeDescendants,
    exploredSectors,
    drifterCount,
    honor,
    probeLosses,
  };
}
