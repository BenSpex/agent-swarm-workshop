import { useEffect, useRef, useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { GamePhase } from '../shared/types';

function subtitleFor(phase: GamePhase): string {
  switch (phase) {
    case GamePhase.EARTH:
      return 'EARTH OPERATIONS';
    case GamePhase.UNIVERSE:
      return 'GALACTIC EXPANSION';
    case GamePhase.BUSINESS:
    default:
      return 'TERMINAL ALPHA';
  }
}

export function PhaseTransition() {
  const state = useGameState();
  const prevPhaseRef = useRef<GamePhase>(state.phase);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (prevPhaseRef.current !== state.phase) {
      prevPhaseRef.current = state.phase;
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 2000);
      return () => clearTimeout(t);
    }
  }, [state.phase]);

  return (
    <div
      data-testid="phase-transition"
      className={
        'fixed inset-0 z-50 bg-black flex flex-col items-center justify-center transition-opacity duration-500 ' +
        (visible
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none')
      }
    >
      <h1
        className="text-white font-mono font-bold text-[48px]"
        style={{ letterSpacing: '4px' }}
      >
        PHASE {state.phase}
      </h1>
      <p
        className="text-[#D4A843] font-mono text-[14px] mt-4"
        style={{ letterSpacing: '2px' }}
      >
        {subtitleFor(state.phase)}
      </p>
    </div>
  );
}
