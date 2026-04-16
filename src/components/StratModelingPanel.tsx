import { Panel } from './Panel';
import { useGameState, useDispatch } from '../hooks/useGameState';
import { formatNumber } from '../shared/engine';

const OUTLINE_BTN =
  'bg-white border border-[#D4D4D0] h-10 px-4 font-mono text-[10px] font-bold uppercase tracking-[1px] flex-1';

export function StratModelingPanel() {
  const state = useGameState();
  const dispatch = useDispatch();

  if (!state.flags.strategicModelingUnlocked) return null;

  return (
    <Panel title="Strategic Modeling" testId="strat-modeling-panel">
      <div className="flex justify-between items-center">
        <span className="text-[12px] uppercase text-[#7A7A75] tracking-[1px]">
          Yomi
        </span>
        <span className="font-data font-bold text-[20px]">
          {formatNumber(state.yomi)}
        </span>
      </div>

      <div className="flex justify-between items-center text-[12px] border-t border-[#D4D4D0] pt-3">
        <span className="uppercase text-[#7A7A75] tracking-[1px]">
          Tournament Round
        </span>
        <span className="font-data font-bold">
          {formatNumber(state.stratModelRound)}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => dispatch({ type: 'STRAT_PICK', choice: 'A' })}
          className={OUTLINE_BTN}
        >
          Pick A
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'STRAT_PICK', choice: 'B' })}
          className={OUTLINE_BTN}
        >
          Pick B
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'STRAT_PICK', choice: 'RANDOM' })}
          className={OUTLINE_BTN}
        >
          Pick Random
        </button>
      </div>

      {state.flags.autoTourneyEnabled && (
        <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#D4A843]">
          Auto-Tourney Active
        </div>
      )}
    </Panel>
  );
}
