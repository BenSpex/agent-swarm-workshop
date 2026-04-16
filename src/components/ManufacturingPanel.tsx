import { Panel } from './Panel';
import { useGameState, useDispatch } from '../hooks/useGameState';
import { formatBigInt, formatNumber } from '../shared/engine';

export function ManufacturingPanel() {
  const state = useGameState();
  const dispatch = useDispatch();

  return (
    <Panel title="Manufacturing" testId="manufacturing-panel">
      <div className="flex flex-col gap-1">
        <span className="text-[11px] uppercase text-[#7A7A75] tracking-[1px]">
          Paperclips
        </span>
        <div
          data-testid="clip-counter"
          className="font-data font-bold text-[22px]"
        >
          {formatBigInt(state.clips)}
        </div>
      </div>

      <button
        type="button"
        data-testid="clip-button"
        onClick={() => dispatch({ type: 'MAKE_CLIP' })}
        className="bg-black text-white h-12 px-6 font-mono text-[12px] font-bold uppercase self-start"
        style={{ letterSpacing: '1px' }}
      >
        Make Paperclip
      </button>

      {state.flags.autoClippersUnlocked && (
        <div className="flex justify-between items-center text-[12px]">
          <span className="uppercase text-[#7A7A75] tracking-[1px]">
            Clips / sec
          </span>
          <span className="font-data font-bold">
            {formatNumber(state.clipsPerSecond)}/s
          </span>
        </div>
      )}

      {state.flags.revTrackerEnabled && (
        <div className="flex justify-between items-center text-[12px]">
          <span className="uppercase text-[#7A7A75] tracking-[1px]">
            Unsold Inventory
          </span>
          <span className="font-data font-bold">
            {formatBigInt(state.unsoldClips)}
          </span>
        </div>
      )}
    </Panel>
  );
}
