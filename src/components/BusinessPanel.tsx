import { Panel } from './Panel';
import { useGameState, useDispatch } from '../hooks/useGameState';
import {
  formatBigInt,
  formatMoney,
  formatNumber,
  formatPercent,
} from '../shared/engine';

const PRIMARY_BTN =
  'bg-black text-white h-10 px-5 font-mono text-[11px] font-bold uppercase tracking-[1px]';
const OUTLINE_BTN =
  'bg-white border border-[#D4D4D0] h-9 px-4 font-mono text-[10px] font-bold uppercase tracking-[1px]';

export function BusinessPanel() {
  const state = useGameState();
  const dispatch = useDispatch();

  const lowerPrice = () =>
    dispatch({ type: 'SET_PRICE', price: Math.max(0.01, state.price - 0.01) });
  const raisePrice = () =>
    dispatch({ type: 'SET_PRICE', price: state.price + 0.01 });

  return (
    <Panel title="Business" testId="business-panel">
      <div
        data-testid="funds-display"
        className="font-data flex justify-between items-center text-[13px]"
      >
        <span className="uppercase text-[#7A7A75] tracking-[1px]">
          Available Funds
        </span>
        <span className="font-bold">{formatMoney(state.funds)}</span>
      </div>

      {state.flags.revTrackerEnabled && (
        <div className="flex flex-col gap-1 text-[12px] border-t border-[#D4D4D0] pt-3">
          <div className="flex justify-between">
            <span className="uppercase text-[#7A7A75] tracking-[1px]">
              Avg Rev / sec
            </span>
            <span className="font-data">{formatMoney(state.revenuePerSecond)}</span>
          </div>
          <div className="flex justify-between">
            <span className="uppercase text-[#7A7A75] tracking-[1px]">
              Avg Clips Sold / sec
            </span>
            <span className="font-data">
              {formatNumber(state.clipsSoldPerSecond)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="uppercase text-[#7A7A75] tracking-[1px]">
              Unsold Inventory
            </span>
            <span className="font-data">{formatBigInt(state.unsoldClips)}</span>
          </div>
        </div>
      )}

      <div
        data-testid="price-display"
        className="flex items-center gap-3 border-t border-[#D4D4D0] pt-3"
      >
        <span className="text-[12px] uppercase text-[#7A7A75] tracking-[1px]">
          Price
        </span>
        <span className="font-data font-bold text-[14px]">
          ${state.price.toFixed(2)}
        </span>
        <button type="button" onClick={lowerPrice} className={OUTLINE_BTN}>
          Lower
        </button>
        <button type="button" onClick={raisePrice} className={OUTLINE_BTN}>
          Raise
        </button>
      </div>

      <div className="flex justify-between items-center text-[12px]">
        <span className="uppercase text-[#7A7A75] tracking-[1px]">
          Public Demand
        </span>
        <span className="font-data font-bold">{formatPercent(state.demand)}</span>
      </div>

      <div className="flex flex-col gap-2 border-t border-[#D4D4D0] pt-3">
        <div className="flex justify-between items-center text-[12px]">
          <span className="uppercase text-[#7A7A75] tracking-[1px]">
            Marketing
          </span>
          <span className="font-data font-bold">
            Level {state.marketingLevel}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => dispatch({ type: 'UPGRADE_MARKETING' })}
            className={PRIMARY_BTN}
          >
            Marketing
          </button>
          <span className="text-[11px] text-[#7A7A75] uppercase tracking-[1px]">
            Cost:{' '}
            <span className="font-data text-black">
              {formatMoney(state.marketingCost)}
            </span>
          </span>
        </div>
      </div>
    </Panel>
  );
}
