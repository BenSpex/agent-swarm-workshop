import { Panel } from './Panel';
import { useGameState, useDispatch } from '../hooks/useGameState';
import { formatNumber } from '../shared/engine';

const OUTLINE_BTN =
  'bg-white border border-[#D4D4D0] h-9 px-3 font-mono text-[10px] font-bold uppercase';

export function DronePanel() {
  const state = useGameState();
  const dispatch = useDispatch();

  return (
    <Panel title="Drone Fleet" testId="drone-panel">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-[12px]">
          <span className="uppercase text-[#7A7A75] tracking-[1px]">
            Harvester Drones
          </span>
          <span className="font-data font-bold">
            {formatNumber(state.harvesterDrones)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => dispatch({ type: 'BUY_HARVESTER', count: 1 })}
            className={OUTLINE_BTN}
            style={{ letterSpacing: '1px' }}
          >
            Buy 1
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'BUY_HARVESTER', count: 10 })}
            className={OUTLINE_BTN}
            style={{ letterSpacing: '1px' }}
          >
            Buy 10
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-[#D4D4D0] pt-3">
        <div className="flex justify-between items-center text-[12px]">
          <span className="uppercase text-[#7A7A75] tracking-[1px]">
            Wire Drones
          </span>
          <span className="font-data font-bold">
            {formatNumber(state.wireDrones)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => dispatch({ type: 'BUY_WIRE_DRONE', count: 1 })}
            className={OUTLINE_BTN}
            style={{ letterSpacing: '1px' }}
          >
            Buy 1
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'BUY_WIRE_DRONE', count: 10 })}
            className={OUTLINE_BTN}
            style={{ letterSpacing: '1px' }}
          >
            Buy 10
          </button>
        </div>
      </div>
    </Panel>
  );
}
