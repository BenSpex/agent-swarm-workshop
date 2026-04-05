import React from 'react';

/**
 * App shell — teams will replace this with the real game UI.
 * UI team owns this file and src/components/.
 */
export default function App() {
  return (
    <div data-testid="app" className="min-h-screen bg-wy-bg font-mono text-wy-text">
      <header data-testid="page-header" className="bg-wy-header text-wy-text-light p-4">
        <h1 className="text-xl font-bold tracking-wider">
          WEYLAND-YUTANI — UNIVERSAL PAPERCLIP INITIATIVE
        </h1>
        <p className="text-wy-muted text-sm">TERMINAL ALPHA — PHASE 1: BUSINESS</p>
      </header>
      <main className="p-4">
        <p className="text-wy-muted">Scaffold loaded. Awaiting team implementations...</p>
      </main>
    </div>
  );
}
