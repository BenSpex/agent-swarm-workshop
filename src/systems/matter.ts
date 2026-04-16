import type { GameState } from '../shared/types';

const HARVESTER_BASE_RATE = 0.1;
const WIRE_DRONE_BASE_RATE = 0.5;
const FACTORY_BASE_CLIPS_PER_TICK = 10;

export function updateMatter(state: GameState): GameState {
  if (!state.flags.matterHarvestingActive) return state;

  // 1) Harvesters generate matter
  const matterGenerated =
    state.harvesterDrones * HARVESTER_BASE_RATE * (1 + state.probeHarvesterProd);
  let matter = state.matter + matterGenerated;
  const acquiredMatter = state.acquiredMatter + matterGenerated;

  // 2) Wire drones convert matter -> wire
  const wireCapacity =
    state.wireDrones * WIRE_DRONE_BASE_RATE * (1 + state.probeWireDroneProd);
  const wireConverted = Math.min(matter, wireCapacity);
  matter -= wireConverted;
  let wire = state.wire + wireConverted;

  // 3) Factories convert wire -> clips (bigint-safe for arbitrary factory counts)
  const baseRate = Math.max(
    1,
    Math.floor(FACTORY_BASE_CLIPS_PER_TICK * (1 + state.probeFactoryProd)),
  );
  const factoryDemand = state.clipFactories * BigInt(baseRate);
  const wireAvailable = BigInt(Math.floor(Math.max(0, wire)));
  const clipsMade = factoryDemand < wireAvailable ? factoryDemand : wireAvailable;
  wire -= Number(clipsMade);
  const clips = state.clips + clipsMade;
  const unsoldClips = state.unsoldClips + clipsMade;

  return {
    ...state,
    matter,
    acquiredMatter,
    wire,
    clips,
    unsoldClips,
  };
}
