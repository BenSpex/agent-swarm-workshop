import { useGameState, useDispatch } from '../hooks/useGameState';
import { formatBigInt } from '../shared/engine';
import { GamePhase } from '../shared/types';
import { Panel } from './Panel';

const PROBE_LAUNCH_COST = 1000;

export function ProbePanel() {
  const state = useGameState();
  const dispatch = useDispatch();

  if (state.phase < GamePhase.UNIVERSE && !state.flags.phase3Unlocked) {
    return null;
  }

  return (
    <Panel title="Probe Launcher" testId="probe-panel" id="section-probes">
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between border-b border-[#D4D4D0] pb-2">
          <span className="text-[12px] text-[#7A7A75] uppercase tracking-[1px]">
            Probes
          </span>
          <span className="font-data text-[20px]">{formatBigInt(state.probes ?? 0n)}</span>
        </div>

        <p className="text-[11px] text-[#7A7A75]">
          Launch cost: <span className="font-data">{formatBigInt(BigInt(PROBE_LAUNCH_COST))}</span> matter.
        </p>

        <button
          type="button"
          data-testid="launch-probe"
          onClick={() => dispatch({ type: 'LAUNCH_PROBE' })}
          className="bg-[#D4A843] text-black h-10 px-4 font-mono text-[12px] font-bold tracking-[1px] uppercase"
        >
          Launch Probe
        </button>
      </div>
    </Panel>
  );
}
