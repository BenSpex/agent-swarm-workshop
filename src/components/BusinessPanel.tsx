import { useGameState, useDispatch } from '../hooks/useGameState';
import { formatMoney, formatNumber, formatPercent } from '../shared/engine';
import { Panel } from './Panel';

export function BusinessPanel() {
  const state = useGameState();
  const dispatch = useDispatch();

  const funds = Number.isFinite(state.funds) ? state.funds : 0;
  const revPerSec = Number.isFinite(state.revenuePerSecond) ? state.revenuePerSecond : 0;
  const soldPerSec = Number.isFinite(state.clipsSoldPerSecond) ? state.clipsSoldPerSecond : 0;
  const demand = Number.isFinite(state.demand) ? state.demand : 0;
  const marketingLevel = state.marketingLevel ?? 0;
  const marketingCost = Number.isFinite(state.marketingCost) ? state.marketingCost : 0;
  const canAffordMarketing = funds >= marketingCost;

  return (
    <Panel title="Business" testId="business-panel" id="section-business">
      <div className="flex flex-col gap-3">
        <div data-testid="funds-display" className="flex items-baseline justify-between border-b border-[#D4D4D0] pb-2">
          <span className="text-[12px] text-[#7A7A75] uppercase tracking-[1px]">
            Available funds
          </span>
          <span className="font-data text-[18px]">{formatMoney(funds)}</span>
        </div>

        {state.flags.revTrackerEnabled ? (
          <>
            <div className="flex items-baseline justify-between">
              <span className="text-[12px] text-[#7A7A75]">Avg rev / sec</span>
              <span className="font-data text-[13px]">{formatMoney(revPerSec)}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-[12px] text-[#7A7A75]">Avg clips sold / sec</span>
              <span className="font-data text-[13px]">{formatNumber(soldPerSec)}</span>
            </div>
          </>
        ) : null}

        <div className="flex items-baseline justify-between">
          <span className="text-[12px] text-[#7A7A75]">Public demand</span>
          <span className="font-data text-[13px]">{formatPercent(demand)}</span>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[#D4D4D0] pt-3">
          <div className="flex flex-col">
            <span className="text-[11px] text-[#7A7A75] uppercase tracking-[1px]">
              Marketing
            </span>
            <span className="text-[12px]">
              Level <span className="font-data">{marketingLevel}</span> ·{' '}
              <span className="text-[#7A7A75]">cost {formatMoney(marketingCost)}</span>
            </span>
          </div>
          <button
            type="button"
            disabled={!canAffordMarketing}
            onClick={() => dispatch({ type: 'UPGRADE_MARKETING' })}
            className="bg-black text-white h-9 px-4 font-mono text-[11px] font-bold tracking-[1px] uppercase disabled:opacity-40"
          >
            Marketing
          </button>
        </div>

        {state.flags.wireBuyerUnlocked ? (
          <div className="flex items-center justify-between border-t border-[#D4D4D0] pt-3">
            <span className="text-[12px] text-[#7A7A75] uppercase tracking-[1px]">
              Wire buyer
            </span>
            <button
              type="button"
              data-testid="wire-buyer-toggle"
              onClick={() => dispatch({ type: 'TOGGLE_WIRE_BUYER' })}
              className={
                state.wireBuyerEnabled
                  ? 'bg-[#D4A843] text-black h-8 px-4 font-mono text-[11px] font-bold tracking-[1px] uppercase'
                  : 'bg-white border border-[#D4D4D0] text-black h-8 px-4 font-mono text-[11px] font-bold tracking-[1px] uppercase'
              }
            >
              {state.wireBuyerEnabled ? 'On' : 'Off'}
            </button>
          </div>
        ) : null}
      </div>
    </Panel>
  );
}
