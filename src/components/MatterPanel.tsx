import { Panel } from './Panel';
import { useGameState } from '../hooks/useGameState';
import { formatNumber } from '../shared/engine';

export function MatterPanel() {
  const state = useGameState();

  return (
    <Panel title="Matter" testId="matter-panel">
      <div className="flex justify-between items-center text-[12px]">
        <span className="uppercase text-[#7A7A75] tracking-[1px]">Matter</span>
        <span className="font-data font-bold">
          {formatNumber(state.matter)}
        </span>
      </div>
      <div className="flex justify-between items-center text-[12px] border-t border-[#D4D4D0] pt-3">
        <span className="uppercase text-[#7A7A75] tracking-[1px]">
          Acquired Matter
        </span>
        <span className="font-data font-bold">
          {formatNumber(state.acquiredMatter)}
        </span>
      </div>
    </Panel>
  );
}
