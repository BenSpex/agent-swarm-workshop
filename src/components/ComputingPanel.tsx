import { Panel } from './Panel';
import { useGameState, useDispatch } from '../hooks/useGameState';
import { formatNumber } from '../shared/engine';

const PRIMARY_BTN =
  'bg-black text-white h-10 px-5 font-mono text-[11px] font-bold uppercase tracking-[1px]';
const GOLD_BTN =
  'bg-[#D4A843] text-black h-10 px-5 font-mono text-[11px] font-bold uppercase tracking-[1px]';

export function ComputingPanel() {
  const state = useGameState();
  const dispatch = useDispatch();

  const opsPct =
    state.maxOperations > 0
      ? Math.min(100, (state.operations / state.maxOperations) * 100)
      : 0;

  return (
    <Panel title="Computing" statusBadge="COMPUTING" testId="computing-panel">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-[12px]">
          <span className="uppercase text-[#7A7A75] tracking-[1px]">
            Processors
          </span>
          <span className="font-data font-bold">
            {formatNumber(state.processors)}
          </span>
        </div>
        <button
          type="button"
          onClick={() => dispatch({ type: 'ADD_PROCESSOR' })}
          className={PRIMARY_BTN + ' self-start'}
        >
          Allocate Processor
        </button>
        <span className="text-[10px] text-[#7A7A75] uppercase tracking-[1px]">
          Ops Gen Rate:{' '}
          <span className="font-data text-black">
            +{formatNumber(state.opsGenerationRate)}/sec
          </span>
        </span>
      </div>

      <div className="flex flex-col gap-2 border-t border-[#D4D4D0] pt-3">
        <div className="flex justify-between items-center text-[12px]">
          <span className="uppercase text-[#7A7A75] tracking-[1px]">Memory</span>
          <span className="font-data font-bold">
            {formatNumber(state.memory)}
          </span>
        </div>
        <button
          type="button"
          onClick={() => dispatch({ type: 'ADD_MEMORY' })}
          className={PRIMARY_BTN + ' self-start'}
        >
          Allocate Memory
        </button>
        <span className="text-[10px] text-[#7A7A75] uppercase tracking-[1px]">
          Max Ops Cap:{' '}
          <span className="font-data text-black">
            {formatNumber(state.maxOperations)}
          </span>
        </span>
      </div>

      <div className="flex flex-col gap-2 border-t border-[#D4D4D0] pt-3">
        <div className="flex justify-between items-center text-[12px]">
          <span className="uppercase text-[#7A7A75] tracking-[1px]">
            Operations
          </span>
          <span className="font-data font-bold">
            {formatNumber(state.operations)} / {formatNumber(state.maxOperations)}
          </span>
        </div>
        <div className="bg-[#F5F5F0] h-2 rounded overflow-hidden">
          <div
            className="bg-[#D4A843] h-full"
            style={{ width: `${opsPct}%` }}
          />
        </div>
        <span className="text-[10px] text-[#7A7A75] uppercase tracking-[1px]">
          Generation Rate:{' '}
          <span className="font-data text-black">
            +{formatNumber(state.opsGenerationRate)}/sec
          </span>
        </span>
      </div>

      {state.flags.creativityUnlocked && (
        <div className="flex justify-between items-center text-[12px] border-t border-[#D4D4D0] pt-3">
          <span className="uppercase text-[#7A7A75] tracking-[1px]">
            Creativity
          </span>
          <span className="font-data font-bold">
            {formatNumber(state.creativity)}
          </span>
        </div>
      )}

      {state.flags.quantumUnlocked && (
        <button
          type="button"
          onClick={() => dispatch({ type: 'COMPUTE' })}
          className={GOLD_BTN + ' self-start'}
        >
          10 Ops → 1 Creativity
        </button>
      )}
    </Panel>
  );
}
