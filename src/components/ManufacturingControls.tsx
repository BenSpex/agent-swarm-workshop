import { useGameState, useDispatch } from '../hooks/useGameState';
import { formatMoney, formatNumber } from '../shared/engine';
import { Panel } from './Panel';

export function ManufacturingControls() {
  const state = useGameState();
  const dispatch = useDispatch();

  const megaCount = state.megaClipperCount ?? 0;
  const megaCost = Number.isFinite(state.megaClipperCost) ? state.megaClipperCost : 0;
  const funds = Number.isFinite(state.funds) ? state.funds : 0;
  const canAffordMega = funds >= megaCost;

  return (
    <Panel
      title="Manufacturing Controls"
      testId="manufacturing-controls"
      id="section-manufacturing-controls"
    >
      <div className="flex flex-col gap-3">
        <p className="text-[#7A7A75] text-[11px] uppercase tracking-[1px]">
          Production tier expansion
        </p>

        {state.flags.megaClippersUnlocked ? (
          <div className="flex items-center justify-between gap-3 border-t border-[#D4D4D0] pt-3">
            <div className="flex flex-col">
              <span className="text-[11px] text-[#7A7A75] uppercase tracking-[1px]">
                MegaClippers
              </span>
              <span className="text-[12px]">
                Owned <span className="font-data">{formatNumber(megaCount)}</span> ·{' '}
                <span className="text-[#7A7A75]">cost {formatMoney(megaCost)}</span>
              </span>
            </div>
            <button
              type="button"
              data-testid="megaclipper-buy"
              disabled={!canAffordMega}
              onClick={() => dispatch({ type: 'BUY_MEGACLIPPER' })}
              className="bg-[#D4A843] text-black h-9 px-4 font-mono text-[11px] font-bold tracking-[1px] uppercase disabled:opacity-40"
            >
              Buy MegaClipper
            </button>
          </div>
        ) : (
          <p className="text-[#7A7A75] text-[12px]">
            MegaClippers tier locked — buy the MegaClippers project to unlock.
          </p>
        )}

        <p className="text-[#7A7A75] text-[11px] mt-1">
          AutoClippers buy + wire purchase live in the persistent strip above.
        </p>
      </div>
    </Panel>
  );
}
