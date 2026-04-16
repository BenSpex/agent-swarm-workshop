import type { GameState } from '../shared/types';

export function updateInvestment(state: GameState): GameState {
  if (state.investment == null) return state;
  const inv = state.investment;
  const variance = inv.riskLevel * 0.005;
  const stockChange = (Math.random() * 2 - 1) * variance;
  const bondChange = (Math.random() * 2 - 1) * variance * 0.3;
  const stocks = Math.max(0, inv.stocks * (1 + stockChange));
  const bonds = Math.max(0, inv.bonds * (1 + bondChange));
  const totalPortfolio = stocks + bonds;
  const prevTotal = inv.totalPortfolio > 0 ? inv.totalPortfolio : 1;
  const returnRate = (totalPortfolio - inv.totalPortfolio) / prevTotal;
  return {
    ...state,
    investment: { ...inv, stocks, bonds, totalPortfolio, returnRate },
  };
}
