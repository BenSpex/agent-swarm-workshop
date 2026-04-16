import { useGameState } from '../hooks/useGameState';
import { formatNumber } from '../shared/engine';
import { GamePhase } from '../shared/types';
import { Panel } from './Panel';

export function MatterPanel() {
  const state = useGameState();

  if (state.phase < GamePhase.EARTH && !state.flags.phase2Unlocked) {
    return null;
  }

  return (
    <Panel title="Matter" testId="matter-panel" id="section-matter">
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between border-b border-[#D4D4D0] pb-2">
          <span className="text-[12px] text-[#7A7A75] uppercase tracking-[1px]">
            Available matter
          </span>
          <span className="font-data text-[18px]">{formatNumber(state.matter ?? 0)}</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] text-[#7A7A75] uppercase tracking-[1px]">
            Acquired
          </span>
          <span className="font-data text-[14px]">
            {formatNumber(state.acquiredMatter ?? 0)}
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] text-[#7A7A75] uppercase tracking-[1px]">
            Swarm sync
          </span>
          <span className="font-data text-[14px]">
            {formatNumber(state.swarmSyncLevel ?? 0)}
          </span>
        </div>
      </div>
    </Panel>
  );
}
