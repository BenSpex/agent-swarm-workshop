import { PersistentP1Strip } from './components/PersistentP1Strip';

/**
 * App shell — UI team replaces the main-content area with the real game UI,
 * but MUST keep <PersistentP1Strip /> rendered in all phases (Run 11 rule
 * enforced by Chrome MCP L6 Persistence check). See spec-ui.md P1-persistence
 * requirements.
 */
export default function App() {
  return (
    <div
      data-testid="app"
      className="min-h-screen flex bg-[#F5F5F0] text-black font-mono"
    >
      <main className="flex-1 p-6 overflow-x-hidden">
        <header data-testid="page-header" className="mb-6">
          <h1 className="text-[28px] font-bold tracking-[1px] leading-tight">
            WEYLAND-YUTANI — UNIVERSAL PAPERCLIP INITIATIVE
          </h1>
          <p className="text-[#7A7A75] text-[13px] mt-1">
            Scaffold loaded. Awaiting team implementations...
          </p>
        </header>

        {/* PersistentP1Strip MUST render in ALL phases — do not phase-gate. */}
        <PersistentP1Strip />
      </main>
    </div>
  );
}
