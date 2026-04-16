import { useGameState } from '../hooks/useGameState';
import { formatBigInt, formatNumber } from '../shared/engine';
import { GamePhase } from '../shared/types';
import { Panel } from './Panel';

export function CombatDisplay() {
  const state = useGameState();

  if (state.phase < GamePhase.UNIVERSE && !state.flags.phase3Unlocked) {
    return null;
  }

  return (
    <Panel title="Combat" testId="combat-display" id="section-combat">
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between border-b border-[#D4D4D0] pb-2">
          <span className="text-[12px] text-[#7A7A75] uppercase tracking-[1px]">
            Honor
          </span>
          <span className="font-data text-[18px]">{formatNumber(state.honor ?? 0)}</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] text-[#7A7A75] uppercase tracking-[1px]">
            Probe losses
          </span>
          <span className="font-data text-[14px]">
            {formatBigInt(state.probeLosses ?? 0n)}
          </span>
        </div>
      </div>
    </Panel>
  );
}
