import { Panel } from './Panel';
import { useGameState, useDispatch } from '../hooks/useGameState';
import { formatMoney, formatNumber } from '../shared/engine';

const PRIMARY_BTN =
  'bg-black text-white h-10 px-5 font-mono text-[11px] font-bold uppercase tracking-[1px]';
const GOLD_BTN =
  'bg-[#D4A843] text-black h-10 px-5 font-mono text-[11px] font-bold uppercase tracking-[1px]';
const OFF_BTN =
  'bg-white border border-[#D4D4D0] h-10 px-5 font-mono text-[11px] font-bold uppercase tracking-[1px]';

export function ManufacturingControls() {
  const state = useGameState();
  const dispatch = useDispatch();

  return (
    <Panel title="Manufacturing Controls" testId="manufacturing-controls">
      <div data-testid="wire-panel" className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-[12px]">
          <span className="uppercase text-[#7A7A75] tracking-[1px]">Wire</span>
          <span className="font-data font-bold">
            {formatNumber(state.wire)} inches
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => dispatch({ type: 'BUY_WIRE' })}
            className={PRIMARY_BTN}
          >
            Wire
          </button>
          <span className="text-[11px] text-[#7A7A75] uppercase tracking-[1px]">
            Cost:{' '}
            <span className="font-data text-black">
              {formatMoney(state.wirePrice)}
            </span>
          </span>
        </div>
      </div>

      {state.flags.wireBuyerUnlocked && (
        <div className="flex items-center justify-between border-t border-[#D4D4D0] pt-3">
          <span className="text-[11px] uppercase text-[#7A7A75] tracking-[1px]">
            Auto-purchase wire
          </span>
          <button
            type="button"
            onClick={() => dispatch({ type: 'TOGGLE_WIRE_BUYER' })}
            className={state.wireBuyerEnabled ? GOLD_BTN : OFF_BTN}
          >
            Wire Buyer: {state.wireBuyerEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2 border-t border-[#D4D4D0] pt-3">
        <div className="flex justify-between items-center text-[12px]">
          <span className="uppercase text-[#7A7A75] tracking-[1px]">
            AutoClippers
          </span>
          <span className="font-data font-bold">
            {formatNumber(state.autoClipperCount)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => dispatch({ type: 'BUY_AUTOCLIPPER' })}
            className={PRIMARY_BTN}
          >
            AutoClippers
          </button>
          <span className="text-[11px] text-[#7A7A75] uppercase tracking-[1px]">
            Cost:{' '}
            <span className="font-data text-black">
              {formatMoney(state.autoClipperCost)}
            </span>
          </span>
        </div>
      </div>

      {state.flags.megaClippersUnlocked && (
        <div className="flex flex-col gap-2 border-t border-[#D4D4D0] pt-3">
          <div className="flex justify-between items-center text-[12px]">
            <span className="uppercase text-[#7A7A75] tracking-[1px]">
              MegaClippers
            </span>
            <span className="font-data font-bold">
              {formatNumber(state.megaClipperCount)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => dispatch({ type: 'BUY_MEGACLIPPER' })}
              className={PRIMARY_BTN}
            >
              MegaClippers
            </button>
            <span className="text-[11px] text-[#7A7A75] uppercase tracking-[1px]">
              Cost:{' '}
              <span className="font-data text-black">
                {formatMoney(state.megaClipperCost)}
              </span>
            </span>
          </div>
        </div>
      )}
    </Panel>
  );
}
