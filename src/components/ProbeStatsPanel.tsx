import { Panel } from './Panel';
import { useGameState, useDispatch } from '../hooks/useGameState';
import type { ProbeStat } from '../shared/actions';

const OUTLINE_BTN =
  'bg-white border border-[#D4D4D0] h-9 w-9 font-mono text-[12px] font-bold uppercase';

interface StatRow {
  label: string;
  stat: ProbeStat;
  value: number;
}

export function ProbeStatsPanel() {
  const state = useGameState();
  const dispatch = useDispatch();

  const rows: StatRow[] = [
    { label: 'Speed', stat: 'speed', value: state.probeSpeed },
    { label: 'Exploration', stat: 'exploration', value: state.probeExploration },
    { label: 'Self-Replication', stat: 'selfReplication', value: state.probeSelfReplication },
    { label: 'Combat', stat: 'combat', value: state.probeCombat },
    { label: 'Hazard Remediation', stat: 'hazardRemediation', value: state.probeHazardRemediation },
    { label: 'Factory Production', stat: 'factoryProd', value: state.probeFactoryProd },
    { label: 'Harvester Production', stat: 'harvesterProd', value: state.probeHarvesterProd },
    { label: 'Wire Drone Production', stat: 'wireDroneProd', value: state.probeWireDroneProd },
  ];

  return (
    <Panel title="Probe Configuration" testId="probe-stats-panel">
      <div className="flex justify-between items-center text-[12px]">
        <span className="uppercase text-[#7A7A75] tracking-[1px]">
          Trust Available
        </span>
        <span className="font-data font-bold">{state.probeTrust}</span>
      </div>

      <div className="flex flex-col gap-2 border-t border-[#D4D4D0] pt-3">
        {rows.map((row) => (
          <div
            key={row.stat}
            className="flex items-center justify-between text-[12px] gap-2"
          >
            <span className="uppercase text-[#7A7A75] tracking-[1px] flex-1">
              {row.label}
            </span>
            <span className="font-data font-bold w-10 text-right">
              {row.value}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  dispatch({ type: 'ADJUST_PROBE', stat: row.stat, delta: -1 })
                }
                className={OUTLINE_BTN}
                style={{ letterSpacing: '1px' }}
                aria-label={`Decrease ${row.label}`}
              >
                −
              </button>
              <button
                type="button"
                onClick={() =>
                  dispatch({ type: 'ADJUST_PROBE', stat: row.stat, delta: 1 })
                }
                className={OUTLINE_BTN}
                style={{ letterSpacing: '1px' }}
                aria-label={`Increase ${row.label}`}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
