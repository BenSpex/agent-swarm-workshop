import { useGameState, useDispatch } from '../hooks/useGameState';
import { formatNumber } from '../shared/engine';
import { GamePhase } from '../shared/types';
import type { ProbeStat } from '../shared/actions';
import { Panel } from './Panel';

const STATS: { stat: ProbeStat; label: string; key: keyof ProbeStateSubset }[] = [
  { stat: 'speed', label: 'Speed', key: 'probeSpeed' },
  { stat: 'exploration', label: 'Exploration', key: 'probeExploration' },
  { stat: 'selfReplication', label: 'Self-Replication', key: 'probeSelfReplication' },
  { stat: 'combat', label: 'Combat', key: 'probeCombat' },
  { stat: 'hazardRemediation', label: 'Hazard Rem.', key: 'probeHazardRemediation' },
  { stat: 'factoryProd', label: 'Factory Prod', key: 'probeFactoryProd' },
  { stat: 'harvesterProd', label: 'Harvester Prod', key: 'probeHarvesterProd' },
  { stat: 'wireDroneProd', label: 'Wire Drone Prod', key: 'probeWireDroneProd' },
];

interface ProbeStateSubset {
  probeSpeed: number;
  probeExploration: number;
  probeSelfReplication: number;
  probeCombat: number;
  probeHazardRemediation: number;
  probeFactoryProd: number;
  probeHarvesterProd: number;
  probeWireDroneProd: number;
}

export function ProbeStatsPanel() {
  const state = useGameState();
  const dispatch = useDispatch();

  if (state.phase < GamePhase.UNIVERSE && !state.flags.phase3Unlocked) {
    return null;
  }

  const trustRemaining = state.probeTrust ?? 0;

  return (
    <Panel title="Probe Trust Allocation" testId="probe-stats-panel" id="section-probe-stats">
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between border-b border-[#D4D4D0] pb-2">
          <span className="text-[12px] text-[#7A7A75] uppercase tracking-[1px]">
            Trust remaining
          </span>
          <span className="font-data text-[16px]">{formatNumber(trustRemaining)}</span>
        </div>

        {STATS.map(({ stat, label, key }) => {
          const value = (state as unknown as ProbeStateSubset)[key] ?? 0;
          return (
            <div
              key={stat}
              data-testid={`probe-stat-${stat}`}
              className="flex items-center justify-between gap-2"
            >
              <span className="text-[11px] text-[#7A7A75] uppercase tracking-[1px] flex-1">
                {label}
              </span>
              <span className="font-data text-[13px] w-10 text-right">
                {formatNumber(value)}
              </span>
              <button
                type="button"
                data-testid={`probe-stat-${stat}-dec`}
                disabled={value <= 1}
                onClick={() => dispatch({ type: 'ADJUST_PROBE', stat, delta: -1 })}
                className="bg-white border border-[#D4D4D0] h-7 w-7 font-mono text-[12px] font-bold disabled:opacity-40"
              >
                −
              </button>
              <button
                type="button"
                data-testid={`probe-stat-${stat}-inc`}
                disabled={trustRemaining <= 0}
                onClick={() => dispatch({ type: 'ADJUST_PROBE', stat, delta: +1 })}
                className="bg-[#D4A843] text-black h-7 w-7 font-mono text-[12px] font-bold disabled:opacity-40"
              >
                +
              </button>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
