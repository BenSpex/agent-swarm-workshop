import type { GameState } from '../shared/types';

const MATTER_PER_HARVESTER = 0.1;
const MATTER_PER_WIRE_DRONE = 0.05;
const WIRE_PER_MATTER = 100;
const CLIPS_PER_FACTORY = 10n;

export function updateMatter(state: GameState): GameState {
  if (!state.flags.matterHarvestingActive) return state;

  const harvested = state.harvesterDrones * MATTER_PER_HARVESTER;
  let nextMatter = state.matter + harvested;
  const nextAcquired = state.acquiredMatter + harvested;

  const wireCapacity = state.wireDrones * MATTER_PER_WIRE_DRONE;
  const wireConverted = Math.min(nextMatter, wireCapacity);
  nextMatter -= wireConverted;
  const nextWire = state.wire + wireConverted * WIRE_PER_MATTER;

  const factoryClips = state.clipFactories * CLIPS_PER_FACTORY;
  const nextClips = state.clips + factoryClips;

  return {
    ...state,
    matter: nextMatter,
    acquiredMatter: nextAcquired,
    wire: nextWire,
    clips: nextClips,
  };
}
