import { PersistentP1Strip } from './components/PersistentP1Strip';
import { NavSidebar } from './components/NavSidebar';
import { MainGrid } from './components/MainGrid';
import { PhaseTransition } from './components/PhaseTransition';
import { NotificationToast } from './components/NotificationToast';
import { useGameState } from './hooks/useGameState';
import { GamePhase } from './shared/types';

const PHASE_TITLE: Record<GamePhase, { title: string; subtitle: string }> = {
  [GamePhase.BUSINESS]: {
    title: 'TERMINAL ALPHA',
    subtitle: 'Manufacturing Interface',
  },
  [GamePhase.EARTH]: {
    title: 'EARTH OPERATIONS',
    subtitle: 'Planetary Production Network',
  },
  [GamePhase.UNIVERSE]: {
    title: 'GALACTIC EXPANSION',
    subtitle: 'Universal Probe Initiative',
  },
};

export default function App() {
  const state = useGameState();
  const { title, subtitle } = PHASE_TITLE[state.phase];

  return (
    <div
      data-testid="app"
      className="min-h-screen flex bg-[#F5F5F0] text-black font-mono"
    >
      <NavSidebar phase={state.phase} />

      <main className="flex-1 p-6 overflow-x-hidden">
        <header data-testid="page-header" className="mb-6">
          <h1 className="text-[28px] font-bold tracking-[1px] leading-tight">
            {title}
          </h1>
          <p className="text-[#7A7A75] text-[13px] mt-1">{subtitle}</p>
        </header>

        {/* PersistentP1Strip MUST render in ALL phases, OUTSIDE MainGrid. */}
        <PersistentP1Strip />

        <MainGrid />
      </main>

      <PhaseTransition />
      <NotificationToast />
    </div>
  );
}
