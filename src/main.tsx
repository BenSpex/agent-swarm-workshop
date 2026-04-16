import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import type { GameEngine } from './shared/engine';

declare global {
  interface Window {
    __engine?: GameEngine;
  }
}

/**
 * Engine bootstrap — shipped by the scaffold (Run 11 forcing function).
 * Core team ships `src/core/engine.ts` exporting `createEngine()`; until then
 * this file fails to compile, which is the intended signal that Core hasn't
 * shipped yet. Do not stub out the import.
 *
 * UI team owns this file but MUST NOT remove the engine bootstrap.
 */
async function bootstrap() {
  try {
    // @ts-expect-error TODO-INTEGRATION: Core team ships src/core/engine.ts exporting createEngine
    const { createEngine } = await import('./core/engine');
    const engine = createEngine();
    engine.load();
    engine.start();
    window.__engine = engine;
    window.addEventListener('beforeunload', () => {
      engine.save();
      engine.stop();
    });
  } catch (err) {
    // Core engine not shipped yet — scaffold renders with mock state.
    // Once `src/core/engine.ts` lands, this catch clause becomes unreachable.
    // eslint-disable-next-line no-console
    console.warn('[bootstrap] core/engine.ts not shipped yet:', err);
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

void bootstrap();
