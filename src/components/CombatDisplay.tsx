import { Panel } from './Panel';
import { useGameState } from '../hooks/useGameState';
import { formatBigInt, formatNumber } from '../shared/engine';

export function CombatDisplay() {
  const state = useGameState();

  const combatMessages = state.messages
    .filter((m) => /COMBAT|LOSS|HONOR/i.test(m))
    .slice(0, 3);

  return (
    <Panel title="Combat" testId="combat-display">
      <div className="flex justify-between items-center text-[12px]">
        <span className="uppercase text-[#7A7A75] tracking-[1px]">Honor</span>
        <span className="font-data font-bold">{formatNumber(state.honor)}</span>
      </div>
      <div className="flex justify-between items-center text-[12px] border-t border-[#D4D4D0] pt-3">
        <span className="uppercase text-[#7A7A75] tracking-[1px]">
          Probe Losses
        </span>
        <span className="font-data font-bold">
          {formatBigInt(state.probeLosses)}
        </span>
      </div>

      {combatMessages.length > 0 && (
        <div className="flex flex-col gap-1 border-t border-[#D4D4D0] pt-3">
          <span className="text-[10px] uppercase text-[#7A7A75] tracking-[1px]">
            Recent Combat
          </span>
          {combatMessages.map((m, i) => (
            <span key={i} className="font-data text-[11px] text-[#7A7A75]">
              {m}
            </span>
          ))}
        </div>
      )}
    </Panel>
  );
}
