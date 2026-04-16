import { Panel } from './Panel';
import { useGameState, useDispatch } from '../hooks/useGameState';
import { formatBigInt } from '../shared/engine';

const OUTLINE_BTN =
  'bg-white border border-[#D4D4D0] h-9 px-3 font-mono text-[10px] font-bold uppercase';

export function FactoryPanel() {
  const state = useGameState();
  const dispatch = useDispatch();

  return (
    <Panel title="Clip Factories" testId="factory-panel">
      <div className="flex flex-col gap-1">
        <span className="text-[11px] uppercase text-[#7A7A75] tracking-[1px]">
          Factories
        </span>
        <span className="font-data font-bold text-[18px]">
          {formatBigInt(state.clipFactories)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => dispatch({ type: 'BUY_FACTORY', count: 1 })}
          className={OUTLINE_BTN}
          style={{ letterSpacing: '1px' }}
        >
          Buy 1
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'BUY_FACTORY', count: 10 })}
          className={OUTLINE_BTN}
          style={{ letterSpacing: '1px' }}
        >
          Buy 10
        </button>
      </div>
    </Panel>
  );
}
