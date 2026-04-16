import { Panel } from './Panel';
import { useGameState, useDispatch } from '../hooks/useGameState';
import { formatMoney, formatNumber } from '../shared/engine';

const OUTLINE_BTN =
  'bg-white border border-[#D4D4D0] h-8 px-3 font-mono text-[10px] font-bold uppercase tracking-[1px]';

type Tier = 'low' | 'med' | 'high';
const TIERS: Tier[] = ['low', 'med', 'high'];
const TIER_LABEL: Record<Tier, string> = {
  low: 'Low',
  med: 'Medium',
  high: 'High',
};

export function InvestmentPanel() {
  const state = useGameState();
  const dispatch = useDispatch();

  if (!state.flags.investmentUnlocked || state.investment === null) return null;

  const investment = state.investment;

  return (
    <Panel title="Investment" testId="investment-panel">
      <div className="flex justify-between items-center">
        <span className="text-[12px] uppercase text-[#7A7A75] tracking-[1px]">
          Portfolio Value
        </span>
        <span className="font-data font-bold text-[16px]">
          {formatMoney(investment.totalPortfolio)}
        </span>
      </div>

      <div className="flex justify-between items-center text-[12px] border-t border-[#D4D4D0] pt-3">
        <span className="uppercase text-[#7A7A75] tracking-[1px]">
          Risk Level
        </span>
        <span className="font-data font-bold">
          {formatNumber(investment.riskLevel)}
        </span>
      </div>

      <div className="flex flex-col gap-2 border-t border-[#D4D4D0] pt-3">
        {TIERS.map((tier) => (
          <div key={tier} className="flex items-center justify-between gap-2">
            <span className="text-[11px] uppercase text-[#7A7A75] tracking-[1px] w-20">
              {TIER_LABEL[tier]}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  dispatch({ type: 'DEPOSIT', amount: 100, tier })
                }
                className={OUTLINE_BTN}
              >
                +100
              </button>
              <button
                type="button"
                onClick={() =>
                  dispatch({ type: 'WITHDRAW', amount: 100, tier })
                }
                className={OUTLINE_BTN}
              >
                -100
              </button>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
