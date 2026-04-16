import { Panel } from './Panel';
import { useGameState, useDispatch } from '../hooks/useGameState';
import { formatBigInt, formatNumber } from '../shared/engine';

const PRIMARY_BTN =
  'bg-black text-white h-10 px-4 font-mono text-[11px] font-bold uppercase';

export function ProbePanel() {
  const state = useGameState();
  const dispatch = useDispatch();

  return (
    <Panel title="Probe Launcher" testId="probe-panel">
      <div className="flex flex-col gap-1">
        <span className="text-[11px] uppercase text-[#7A7A75] tracking-[1px]">
          Probes
        </span>
        <span className="font-data font-bold text-[18px]">
          {formatBigInt(state.probes)}
        </span>
      </div>

      <button
        type="button"
        onClick={() => dispatch({ type: 'LAUNCH_PROBE' })}
        className={`${PRIMARY_BTN} self-start`}
        style={{ letterSpacing: '1px' }}
      >
        Launch Probe
      </button>

      <div className="text-[11px] text-[#7A7A75] uppercase tracking-[1px] border-t border-[#D4D4D0] pt-3">
        Cost:{' '}
        <span className="font-data text-black">
          {formatNumber(state.matter)}
        </span>{' '}
        matter ·{' '}
        <span className="font-data text-black">
          {formatNumber(state.operations)}
        </span>{' '}
        ops available
      </div>
    </Panel>
  );
}
