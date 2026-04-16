import type { GameState, InvestmentState } from '../shared/types';

const MIN_FLOOR = 1;

export function updateInvestment(state: GameState): GameState {
  if (state.investment === null) return state;

  const inv: InvestmentState = state.investment;
  const risk = Math.max(0, Math.min(100, inv.riskLevel));

  const stockVariance = (Math.random() - 0.48) * (risk / 1000);
  const bondVariance = (Math.random() - 0.49) * (risk / 5000);

  const nextStocks = Math.max(MIN_FLOOR, inv.stocks * (1 + stockVariance));
  const nextBonds = Math.max(MIN_FLOOR, inv.bonds * (1 + bondVariance));
  const nextTotal = nextStocks + nextBonds;

  const prevTotal = Math.max(inv.totalPortfolio, nextTotal, 1);
  const ratio = nextTotal / prevTotal;
  const nextReturnRate = Math.max(0, Math.min(1, ratio));

  const nextInvestment: InvestmentState = {
    stocks: nextStocks,
    bonds: nextBonds,
    totalPortfolio: nextTotal,
    riskLevel: inv.riskLevel,
    returnRate: nextReturnRate,
  };

  return { ...state, investment: nextInvestment };
}
