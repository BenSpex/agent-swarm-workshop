import { useGameState, useDispatch } from '../hooks/useGameState';
import { formatMoney, formatPercent } from '../shared/engine';
import { Panel } from './Panel';

const TIER_AMOUNTS: Record<'low' | 'med' | 'high', number> = {
  low: 100,
  med: 1000,
  high: 10000,
};

export function InvestmentPanel() {
  const state = useGameState();
  const dispatch = useDispatch();

  const unlocked = state.flags.investmentUnlocked && state.investment != null;
  const inv = state.investment;
  const portfolio = inv && Number.isFinite(inv.totalPortfolio) ? inv.totalPortfolio : 0;
  const stocks = inv && Number.isFinite(inv.stocks) ? inv.stocks : 0;
  const bonds = inv && Number.isFinite(inv.bonds) ? inv.bonds : 0;
  const risk = inv && Number.isFinite(inv.riskLevel) ? inv.riskLevel : 0;
  const ret = inv && Number.isFinite(inv.returnRate) ? inv.returnRate : 0;

  const tierRow = (tier: 'low' | 'med' | 'high', label: string) => {
    const amt = TIER_AMOUNTS[tier];
    return (
      <div key={tier} className="flex items-center justify-between gap-2">
        <span className="text-[12px] text-[#7A7A75] uppercase tracking-[1px] w-16">
          {label}
        </span>
        <span className="font-data text-[12px] flex-1 text-right pr-2">
          {formatMoney(amt)}
        </span>
        <button
          type="button"
          data-testid={`invest-deposit-${tier}`}
          onClick={() => dispatch({ type: 'DEPOSIT', amount: amt, tier })}
          className="bg-black text-white h-8 px-3 font-mono text-[10px] font-bold tracking-[1px] uppercase"
        >
          Deposit
        </button>
        <button
          type="button"
          data-testid={`invest-withdraw-${tier}`}
          onClick={() => dispatch({ type: 'WITHDRAW', amount: amt, tier })}
          className="bg-white border border-[#D4D4D0] text-black h-8 px-3 font-mono text-[10px] font-bold tracking-[1px] uppercase"
        >
          Withdraw
        </button>
      </div>
    );
  };

  return (
    <Panel title="Investment" testId="investment-panel" id="section-investment">
      {!unlocked ? (
        <p className="text-[#7A7A75] text-[12px]">
          Locked — requires Investment project.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between border-b border-[#D4D4D0] pb-2">
            <span className="text-[12px] text-[#7A7A75] uppercase tracking-[1px]">
              Portfolio
            </span>
            <span className="font-data text-[18px]">{formatMoney(portfolio)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[12px]">
            <div className="flex justify-between">
              <span className="text-[#7A7A75]">Stocks</span>
              <span className="font-data">{formatMoney(stocks)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7A7A75]">Bonds</span>
              <span className="font-data">{formatMoney(bonds)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7A7A75]">Risk</span>
              <span className="font-data">{risk}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7A7A75]">Return</span>
              <span className="font-data">{formatPercent(ret)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-[#D4D4D0] pt-3">
            {tierRow('low', 'Low')}
            {tierRow('med', 'Med')}
            {tierRow('high', 'High')}
          </div>
        </div>
      )}
    </Panel>
  );
}
