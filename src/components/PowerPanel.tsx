import { Panel } from './Panel';
import { useGameState, useDispatch } from '../hooks/useGameState';
import { formatNumber } from '../shared/engine';

const OUTLINE_BTN =
  'bg-white border border-[#D4D4D0] h-9 px-3 font-mono text-[10px] font-bold uppercase';

export function PowerPanel() {
  const state = useGameState();
  const dispatch = useDispatch();

  return (
    <Panel title="Power Grid" testId="power-panel">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-[12px]">
          <span className="uppercase text-[#7A7A75] tracking-[1px]">
            Solar Farms
          </span>
          <span className="font-data font-bold">
            {formatNumber(state.solarFarms)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => dispatch({ type: 'BUY_SOLAR_FARM', count: 1 })}
            className={OUTLINE_BTN}
            style={{ letterSpacing: '1px' }}
          >
            Buy 1
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'BUY_SOLAR_FARM', count: 10 })}
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
            Batteries
          </span>
          <span className="font-data font-bold">
            {formatNumber(state.batteries)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => dispatch({ type: 'BUY_BATTERY', count: 1 })}
            className={OUTLINE_BTN}
            style={{ letterSpacing: '1px' }}
          >
            Buy 1
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'BUY_BATTERY', count: 10 })}
            className={OUTLINE_BTN}
            style={{ letterSpacing: '1px' }}
          >
            Buy 10
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center text-[12px] border-t border-[#D4D4D0] pt-3">
        <span className="uppercase text-[#7A7A75] tracking-[1px]">
          Stored Power
        </span>
        <span className="font-data font-bold">
          {formatNumber(state.storedPower)}
        </span>
      </div>
    </Panel>
  );
}
