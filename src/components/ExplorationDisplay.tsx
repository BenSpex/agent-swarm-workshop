import { Panel } from './Panel';
import { useGameState } from '../hooks/useGameState';
import { formatBigInt } from '../shared/engine';

export function ExplorationDisplay() {
  const state = useGameState();

  return (
    <Panel title="Exploration" testId="exploration-display">
      <div className="flex justify-between items-center text-[12px]">
        <span className="uppercase text-[#7A7A75] tracking-[1px]">
          Sectors Explored
        </span>
        <span className="font-data font-bold">
          {formatBigInt(state.exploredSectors)}
        </span>
      </div>
      <div className="flex justify-between items-center text-[12px] border-t border-[#D4D4D0] pt-3">
        <span className="uppercase text-[#7A7A75] tracking-[1px]">
          Drifters
        </span>
        <span className="font-data font-bold">
          {formatBigInt(state.drifterCount)}
        </span>
      </div>
      <div className="flex justify-between items-center text-[12px] border-t border-[#D4D4D0] pt-3">
        <span className="uppercase text-[#7A7A75] tracking-[1px]">
          Probe Descendants
        </span>
        <span className="font-data font-bold">
          {formatBigInt(state.probeDescendants)}
        </span>
      </div>
    </Panel>
  );
}
