import { PersistentP1Strip } from './components/PersistentP1Strip';
import { NavSidebar } from './components/NavSidebar';
import { MainGrid } from './components/MainGrid';
import { useGameState } from './hooks/useGameState';
import { GamePhase } from './shared/types';

function titleForPhase(phase: GamePhase): string {
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

function subtitleForPhase(phase: GamePhase): string {
  switch (phase) {
    case GamePhase.EARTH:
      return 'Drone Swarm & Factory Uplink';
    case GamePhase.UNIVERSE:
      return 'Probe Launch & Combat';
    case GamePhase.BUSINESS:
    default:
      return 'Manufacturing Interface';
  }
}

export default function App() {
  const state = useGameState();

  return (
    <div
      data-testid="app"
      className="min-h-screen flex bg-[#F5F5F0] text-black font-mono"
    >
      <NavSidebar />
      <main className="flex-1 p-6 overflow-x-auto">
        <header data-testid="page-header" className="mb-6">
          <h1
            className="text-[28px] font-bold leading-tight"
            style={{ letterSpacing: '1px' }}
          >
            {titleForPhase(state.phase)}
          </h1>
          <p className="text-[#7A7A75] text-[13px] mt-1">
            {subtitleForPhase(state.phase)}
          </p>
        </header>

        {/* PersistentP1Strip MUST render in ALL phases — do not phase-gate. */}
        <PersistentP1Strip />

        <MainGrid />
      </main>
    </div>
  );
}
