import { useState } from 'react';
import { useGameState, useDispatch } from '../hooks/useGameState';
import { formatBigInt } from '../shared/engine';
import { GamePhase } from '../shared/types';
import { Panel } from './Panel';

const COUNT_OPTIONS = [1, 10, 100] as const;
type Count = (typeof COUNT_OPTIONS)[number];

export function FactoryPanel() {
  const state = useGameState();
  const dispatch = useDispatch();
  const [count, setCount] = useState<Count>(1);

  if (state.phase < GamePhase.EARTH && !state.flags.phase2Unlocked) {
    return null;
  }

  return (
    <Panel title="Clip Factories" testId="factory-panel" id="section-factories">
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between border-b border-[#D4D4D0] pb-2">
          <span className="text-[12px] text-[#7A7A75] uppercase tracking-[1px]">
            Factories
          </span>
          <span className="font-data text-[20px]">
            {formatBigInt(state.clipFactories ?? 0n)}
          </span>
        </div>

        <div className="flex items-center gap-2">
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

        <button
          type="button"
          data-testid="buy-factory"
          onClick={() => dispatch({ type: 'BUY_FACTORY', count })}
          className="bg-[#D4A843] text-black h-9 px-3 font-mono text-[11px] font-bold tracking-[1px] uppercase"
        >
          Build Factory ×{count}
        </button>
      </div>
    </Panel>
  );
}
