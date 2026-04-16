import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderToString } from 'react-dom/server';
import { GamePhase } from '../../src/shared/types';
import type { GameState } from '../../src/shared/types';

const { stateRef } = vi.hoisted(() => ({
  stateRef: { current: null as GameState | null },
}));

vi.mock('../../src/hooks/useGameState', () => ({
  useGameState: () => stateRef.current,
  useDispatch: () => () => {},
}));

import App from '../../src/App';
import { createMockState } from '../../src/hooks/mockState';

function extractTestIds(html: string): Set<string> {
  const ids = new Set<string>();
  const re = /data-testid="([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) ids.add(m[1]);
  return ids;
}

const P1_REQUIRED = [
  'app',
  'page-header',
  'nav-sidebar',
  'clip-button',
  'clip-counter',
  'autoclipper-panel',
  'wire-panel',
  'price-display',
  'manufacturing-panel',
  'business-panel',
  'manufacturing-controls',
  'computing-panel',
  'funds-display',
  'project-list',
  'activity-log',
];

const P2_EXTRA = ['drone-panel', 'factory-panel', 'power-panel', 'matter-panel'];
const P3_EXTRA = [
  'probe-panel',
  'probe-stats-panel',
  'exploration-display',
  'combat-display',
];

function renderPhase(phase: GamePhase): Set<string> {
  const state = createMockState();
  state.phase = phase;
  if (phase >= GamePhase.EARTH) state.flags.phase2Unlocked = true;
  if (phase >= GamePhase.UNIVERSE) state.flags.phase3Unlocked = true;
  stateRef.current = state;
  const html = renderToString(<App />);
  return extractTestIds(html);
}

describe('required data-testids', () => {
  beforeEach(() => {
    stateRef.current = createMockState();
  });

  for (const phase of [GamePhase.BUSINESS, GamePhase.EARTH, GamePhase.UNIVERSE]) {
    it(`renders all P1 testids in phase ${phase}`, () => {
      const ids = renderPhase(phase);
      const missing = P1_REQUIRED.filter((id) => !ids.has(id));
      expect(missing, `missing P1 testids in phase ${phase}: ${missing.join(', ')}`).toEqual([]);
    });
  }

  it('Phase 2 renders P2 testids', () => {
    const ids = renderPhase(GamePhase.EARTH);
    const missing = P2_EXTRA.filter((id) => !ids.has(id));
    expect(missing, `missing P2 testids: ${missing.join(', ')}`).toEqual([]);
  });

  it('Phase 3 renders P1 + P2 + P3 testids', () => {
    const ids = renderPhase(GamePhase.UNIVERSE);
    const expected = [...P1_REQUIRED, ...P2_EXTRA, ...P3_EXTRA];
    const missing = expected.filter((id) => !ids.has(id));
    expect(missing, `missing testids in phase 3: ${missing.join(', ')}`).toEqual([]);
  });
});
