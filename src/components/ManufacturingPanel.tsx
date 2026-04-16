import { useGameState } from '../hooks/useGameState';
import { formatBigInt, formatNumber } from '../shared/engine';
import { Panel } from './Panel';

export function ManufacturingPanel() {
  const state = useGameState();
  const cps = Number.isFinite(state.clipsPerSecond) ? state.clipsPerSecond : 0;
  const unsold = state.unsoldClips ?? 0n;

  return (
    <Panel title="Manufacturing" testId="manufacturing-panel" id="section-manufacturing">
      <div className="flex flex-col gap-3">
        <p className="text-[#7A7A75] text-[11px] uppercase tracking-[1px]">
          Production metrics
        </p>

        {state.flags.autoClippersUnlocked ? (
          <div className="flex items-baseline justify-between border-b border-[#D4D4D0] pb-2">
            <span className="text-[12px] text-[#7A7A75] uppercase tracking-[1px]">
              Clips / sec
            </span>
            <span className="font-data text-[20px]">{formatNumber(cps)}</span>
          </div>
        ) : (
          <p className="text-[#7A7A75] text-[12px]">
            Clips/sec metric unlocks after first AutoClippers project.
          </p>
        )}

        {state.flags.revTrackerEnabled ? (
          <div className="flex items-baseline justify-between">
            <span className="text-[12px] text-[#7A7A75] uppercase tracking-[1px]">
              Unsold inventory
            </span>
            <span className="font-data text-[14px]">{formatBigInt(unsold)}</span>
          </div>
        ) : null}

        <p className="text-[#7A7A75] text-[11px] mt-1">
          Make-paperclip control + autoclipper buy live in the persistent strip above.
        </p>
      </div>
    </Panel>
  );
}
