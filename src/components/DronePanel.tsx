import { useState } from 'react';
import { useGameState, useDispatch } from '../hooks/useGameState';
import { formatNumber } from '../shared/engine';
import { GamePhase } from '../shared/types';
import { Panel } from './Panel';

const COUNT_OPTIONS = [1, 10, 100] as const;
type Count = (typeof COUNT_OPTIONS)[number];

export function DronePanel() {
  const state = useGameState();
  const dispatch = useDispatch();
  const [count, setCount] = useState<Count>(1);

  if (state.phase < GamePhase.EARTH && !state.flags.phase2Unlocked) {
    return null;
  }

  return (
    <Panel title="Drone Fleet" testId="drone-panel" id="section-drones">
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] text-[#7A7A75] uppercase tracking-[1px]">
            Harvester drones
          </span>
          <span className="font-data text-[16px]">{formatNumber(state.harvesterDrones ?? 0)}</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] text-[#7A7A75] uppercase tracking-[1px]">
            Wire drones
          </span>
          <span className="font-data text-[16px]">{formatNumber(state.wireDrones ?? 0)}</span>
        </div>
        <div className="flex items-baseline justify-between border-t border-[#D4D4D0] pt-2">
          <span className="text-[11px] text-[#7A7A75] uppercase tracking-[1px]">
            Momentum
          </span>
          <span className="font-data text-[13px]">{formatNumber(state.momentum ?? 0)}</span>
        </div>

        <div className="flex items-center gap-2 border-t border-[#D4D4D0] pt-3">
          <span className="text-[11px] text-[#7A7A75] uppercase tracking-[1px]">Buy</span>
          {COUNT_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCount(c)}
              className={
                count === c
                  ? 'bg-black text-white h-7 px-3 font-mono text-[10px] font-bold tracking-[1px]'
                  : 'bg-white border border-[#D4D4D0] text-black h-7 px-3 font-mono text-[10px] font-bold tracking-[1px]'
              }
            >
              x{c}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            data-testid="buy-harvester"
            onClick={() => dispatch({ type: 'BUY_HARVESTER', count })}
            className="flex-1 bg-[#D4A843] text-black h-9 px-3 font-mono text-[11px] font-bold tracking-[1px] uppercase"
          >
            Harvester ×{count}
          </button>
          <button
            type="button"
            data-testid="buy-wire-drone"
            onClick={() => dispatch({ type: 'BUY_WIRE_DRONE', count })}
            className="flex-1 bg-[#D4A843] text-black h-9 px-3 font-mono text-[11px] font-bold tracking-[1px] uppercase"
          >
            Wire Drone ×{count}
          </button>
        </div>
      </div>
    </Panel>
  );
}
