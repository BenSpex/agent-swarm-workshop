import { useGameState } from '../hooks/useGameState';
import { formatBigInt } from '../shared/engine';
import { GamePhase } from '../shared/types';
import { Panel } from './Panel';

export function ExplorationDisplay() {
  const state = useGameState();

  if (state.phase < GamePhase.UNIVERSE && !state.flags.phase3Unlocked) {
    return null;
  }

  return (
    <Panel title="Exploration" testId="exploration-display" id="section-exploration">
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between border-b border-[#D4D4D0] pb-2">
          <span className="text-[12px] text-[#7A7A75] uppercase tracking-[1px]">
            Sectors explored
          </span>
          <span className="font-data text-[18px]">
            {formatBigInt(state.exploredSectors ?? 0n)}
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] text-[#7A7A75] uppercase tracking-[1px]">
            Drifters
          </span>
          <span className="font-data text-[14px]">
            {formatBigInt(state.drifterCount ?? 0n)}
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] text-[#7A7A75] uppercase tracking-[1px]">
            Probe descendants
          </span>
          <span className="font-data text-[14px]">
            {formatBigInt(state.probeDescendants ?? 0n)}
          </span>
        </div>
      </div>
    </Panel>
  );
}
