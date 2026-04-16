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

const P1_TESTIDS = [
  'manufacturing-panel',
  'business-panel',
  'manufacturing-controls',
  'computing-panel',
  'clip-button',
  'clip-counter',
  'autoclipper-panel',
  'wire-panel',
  'price-display',
];

function extractTestIds(html: string): Set<string> {
  const ids = new Set<string>();
  const re = /data-testid="([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) ids.add(m[1]);
  return ids;
}

describe('P1 panel persistence across phases (Run 10 regression)', () => {
  beforeEach(() => {
    stateRef.current = createMockState();
  });

  it('Phase 2 still renders every P1 testid', () => {
    const state = createMockState();
    state.phase = GamePhase.EARTH;
    state.flags.phase2Unlocked = true;
    stateRef.current = state;
    const ids = extractTestIds(renderToString(<App />));
    const missing = P1_TESTIDS.filter((id) => !ids.has(id));
    expect(missing, `P1 panels missing in Phase 2: ${missing.join(', ')}`).toEqual([]);
  });

  it('Phase 3 still renders every P1 testid', () => {
    const state = createMockState();
    state.phase = GamePhase.UNIVERSE;
    state.flags.phase2Unlocked = true;
    state.flags.phase3Unlocked = true;
    stateRef.current = state;
    const ids = extractTestIds(renderToString(<App />));
    const missing = P1_TESTIDS.filter((id) => !ids.has(id));
    expect(missing, `P1 panels missing in Phase 3: ${missing.join(', ')}`).toEqual([]);
  });
});
