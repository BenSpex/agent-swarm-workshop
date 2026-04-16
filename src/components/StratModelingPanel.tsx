import { useGameState, useDispatch } from '../hooks/useGameState';
import { formatNumber } from '../shared/engine';
import { Panel } from './Panel';

export function StratModelingPanel() {
  const state = useGameState();
  const dispatch = useDispatch();

  const unlocked = state.flags.strategicModelingUnlocked;
  const yomi = Number.isFinite(state.yomi) ? state.yomi : 0;
  const round = state.stratModelRound ?? 0;
  const auto = state.flags.autoTourneyEnabled;

  const pickButton = (choice: 'A' | 'B' | 'RANDOM', label: string) => (
    <button
      type="button"
      data-testid={`strat-pick-${choice.toLowerCase()}`}
      onClick={() => dispatch({ type: 'STRAT_PICK', choice })}
      className="flex-1 bg-white border border-[#D4D4D0] h-10 px-3 font-mono text-[11px] font-bold tracking-[1px] uppercase hover:bg-[#F5F5F0]"
    >
      {label}
    </button>
  );

  return (
    <Panel
      title="Strategic Modeling"
      testId="strat-modeling-panel"
      id="section-strat-modeling"
      badge={unlocked && auto ? 'Auto' : undefined}
    >
      {!unlocked ? (
        <p className="text-[#7A7A75] text-[12px]">
          Locked — requires Strategic Modeling project.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between border-b border-[#D4D4D0] pb-2">
            <span className="text-[12px] text-[#7A7A75] uppercase tracking-[1px]">
              Yomi
            </span>
            <span data-testid="yomi-display" className="font-data text-[20px]">
              {formatNumber(yomi)}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-[11px] text-[#7A7A75] uppercase tracking-[1px]">
              Tournament round
            </span>
            <span className="font-data text-[13px]">{formatNumber(round)}</span>
          </div>

          <div className="flex gap-2 pt-1">
            {pickButton('A', 'Pick A')}
            {pickButton('B', 'Pick B')}
            {pickButton('RANDOM', 'Random')}
          </div>

          <button
            type="button"
            onClick={() => dispatch({ type: 'STRAT_NEW_TOURNAMENT' })}
            className="bg-black text-white h-9 px-4 font-mono text-[11px] font-bold tracking-[1px] uppercase"
          >
            New Tournament
          </button>

          {auto ? (
            <p className="text-[#2D8A4E] text-[11px]">Auto-tournament active.</p>
          ) : null}
        </div>
      )}
    </Panel>
  );
}
