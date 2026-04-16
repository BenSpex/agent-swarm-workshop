import { useGameState, useDispatch } from '../hooks/useGameState';
import { formatNumber } from '../shared/engine';
import { Panel } from './Panel';

export function ComputingPanel() {
  const state = useGameState();
  const dispatch = useDispatch();

  const ops = Number.isFinite(state.operations) ? state.operations : 0;
  const maxOps = Number.isFinite(state.maxOperations) && state.maxOperations > 0
    ? state.maxOperations
    : 1;
  const opsPct = Math.min(1, Math.max(0, ops / maxOps));
  const trust = state.trust ?? 0;
  const processors = state.processors ?? 0;
  const memory = state.memory ?? 0;
  const opsRate = Number.isFinite(state.opsGenerationRate) ? state.opsGenerationRate : 0;

  return (
    <Panel title="Computing" testId="computing-panel" id="section-computing">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[11px] text-[#7A7A75] uppercase tracking-[1px]">
              Processors
            </span>
            <span className="font-data text-[16px]">{formatNumber(processors)}</span>
          </div>
          <button
            type="button"
            disabled={trust <= processors + memory}
            onClick={() => dispatch({ type: 'ADD_PROCESSOR' })}
            className="bg-black text-white h-9 px-4 font-mono text-[11px] font-bold tracking-[1px] uppercase disabled:opacity-40"
          >
            Add Processor
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[#D4D4D0] pt-3">
          <div className="flex flex-col">
            <span className="text-[11px] text-[#7A7A75] uppercase tracking-[1px]">
              Memory
            </span>
            <span className="font-data text-[16px]">{formatNumber(memory)}</span>
          </div>
          <button
            type="button"
            disabled={trust <= processors + memory}
            onClick={() => dispatch({ type: 'ADD_MEMORY' })}
            className="bg-black text-white h-9 px-4 font-mono text-[11px] font-bold tracking-[1px] uppercase disabled:opacity-40"
          >
            Add Memory
          </button>
        </div>

        <div className="flex flex-col gap-1 border-t border-[#D4D4D0] pt-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] text-[#7A7A75] uppercase tracking-[1px]">
              Operations
            </span>
            <span className="text-[12px]">
              <span className="font-data">{formatNumber(ops)}</span>
              <span className="text-[#7A7A75]"> / {formatNumber(maxOps)}</span>
            </span>
          </div>
          <div
            data-testid="operations-bar"
            className="h-2 w-full bg-[#F5F5F0] border border-[#D4D4D0] overflow-hidden rounded-[2px]"
          >
            <div
              className="h-full bg-[#D4A843]"
              style={{ width: `${(opsPct * 100).toFixed(1)}%` }}
            />
          </div>
          <span className="text-[11px] text-[#7A7A75]">
            +<span className="font-data">{formatNumber(opsRate)}</span> ops/sec ·{' '}
            trust <span className="font-data">{trust}</span>
          </span>
        </div>

        {state.flags.creativityUnlocked ? (
          <div className="flex items-baseline justify-between border-t border-[#D4D4D0] pt-3">
            <span className="text-[11px] text-[#7A7A75] uppercase tracking-[1px]">
              Creativity
            </span>
            <span className="font-data text-[14px]">{formatNumber(state.creativity ?? 0)}</span>
          </div>
        ) : null}

        {state.flags.quantumUnlocked ? (
          <button
            type="button"
            data-testid="compute-button"
            onClick={() => dispatch({ type: 'COMPUTE' })}
            className="bg-black text-white h-10 px-4 font-mono text-[11px] font-bold tracking-[1px] uppercase"
          >
            Compute · 10 ops → 1 creativity
          </button>
        ) : null}
      </div>
    </Panel>
  );
}
