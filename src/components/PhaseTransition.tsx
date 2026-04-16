import { useEffect, useRef, useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { GamePhase } from '../shared/types';

const PHASE_LABEL: Record<GamePhase, string> = {
  [GamePhase.BUSINESS]: 'PHASE 1 — TERMINAL ALPHA',
  [GamePhase.EARTH]: 'PHASE 2 — EARTH OPERATIONS',
  [GamePhase.UNIVERSE]: 'PHASE 3 — GALACTIC EXPANSION',
};

export function PhaseTransition() {
  const state = useGameState();
  const prevPhaseRef = useRef<GamePhase>(state.phase);
  const [shownPhase, setShownPhase] = useState<GamePhase | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (state.phase !== prevPhaseRef.current) {
      prevPhaseRef.current = state.phase;
      setShownPhase(state.phase);
      setVisible(true);
      const fadeOut = window.setTimeout(() => setVisible(false), 2000);
      const clear = window.setTimeout(() => setShownPhase(null), 2500);
      return () => {
        window.clearTimeout(fadeOut);
        window.clearTimeout(clear);
      };
    }
    return undefined;
  }, [state.phase]);

  if (shownPhase == null) return null;

  return (
    <div
      data-testid="phase-transition"
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 500ms ease-in-out',
      }}
    >
      <h2
        className="text-white font-mono font-bold uppercase"
        style={{ fontSize: 28, letterSpacing: 2 }}
      >
        {PHASE_LABEL[shownPhase]}
      </h2>
    </div>
  );
}
