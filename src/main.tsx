import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createEngine } from './core/engine';
import './styles/global.css';
import type { GameEngine } from './shared/engine';

declare global {
  interface Window {
    __engine?: GameEngine;
  }
}

function bootstrap() {
  const engine = createEngine();
  engine.load();
  engine.start();
  window.__engine = engine;
  window.addEventListener('beforeunload', () => {
    engine.save();
    engine.stop();
  });

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

void bootstrap();
