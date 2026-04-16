/**
 * PersistentP1Strip — renders the 5 iconic Phase-1 controls that MUST remain
 * visible in all 3 phases (OG Universal Paperclips reference).
 *
 * Shipped by the scaffold to prevent Run-10-style P1 panel deletion. UI team
 * may restyle and reposition but MUST NOT hide or phase-gate this component.
 *
 * Chrome MCP L6 Persistence verifies the 5 testids render in P1, P2, and P3:
 *   clip-counter, clip-button, autoclipper-panel, wire-panel, price-display
 */
import { useGameState, useDispatch } from '../hooks/useGameState';
import { formatBigInt, formatMoney } from '../shared/engine';

export function PersistentP1Strip() {
  const state = useGameState();
  const dispatch = useDispatch();

  return (
    <div
      data-testid="persistent-p1-strip"
      className="border border-[#D4D4D0] bg-white px-5 py-3 mb-4 flex flex-wrap items-center gap-6 text-[12px]"
    >
      <div>
        Paperclips:{' '}
        <span data-testid="clip-counter" className="font-data font-bold text-[16px]">
          {formatBigInt(state.clips)}
        </span>
      </div>

      <button
        type="button"
        data-testid="clip-button"
        onClick={() => dispatch({ type: 'MAKE_CLIP' })}
        className="bg-black text-white h-9 px-4 font-mono text-[11px] font-bold tracking-[1px] uppercase"
      >
        Make Paperclip
      </button>

      <div data-testid="autoclipper-panel" className="flex items-center gap-2">
        <span>
          AutoClippers: <span className="font-data font-bold">{state.autoClipperCount}</span>
        </span>
        <span className="text-[#7A7A75]">
          (${state.autoClipperCost.toFixed(2)})
        </span>
        <button
          type="button"
          onClick={() => dispatch({ type: 'BUY_AUTOCLIPPER' })}
          className="bg-[#D4A843] text-black h-7 px-3 font-mono text-[10px] font-bold tracking-[1px] uppercase"
        >
          Buy
        </button>
      </div>

      <div data-testid="wire-panel" className="flex items-center gap-2">
        <span>
          Wire: <span className="font-data font-bold">{state.wire}</span>
        </span>
        <span className="text-[#7A7A75]">({formatMoney(state.wirePrice)})</span>
        <button
          type="button"
          onClick={() => dispatch({ type: 'BUY_WIRE' })}
          className="bg-[#D4A843] text-black h-7 px-3 font-mono text-[10px] font-bold tracking-[1px] uppercase"
        >
          Buy
        </button>
      </div>

      <div data-testid="price-display" className="flex items-center gap-2">
        <span>
          Price:{' '}
          <span className="font-data font-bold">${state.price.toFixed(2)}</span>
        </span>
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_PRICE', price: Math.max(0.01, state.price - 0.01) })}
          className="bg-white border border-[#D4D4D0] h-7 px-2 font-mono text-[10px] font-bold tracking-[1px] uppercase"
        >
          Lower
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_PRICE', price: state.price + 0.01 })}
          className="bg-white border border-[#D4D4D0] h-7 px-2 font-mono text-[10px] font-bold tracking-[1px] uppercase"
        >
          Raise
        </button>
      </div>
    </div>
  );
}
