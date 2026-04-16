import { describe, expect, it } from 'vitest';
import * as barrel from '../../src/systems';

const REQUIRED_EXPORTS = [
  'updateInvestment',
  'updateCreativity',
  'checkTrustMilestone',
  'updateStratModeling',
  'resolveRound',
  'updateWireBuyer',
  'updateMatter',
  'updateSwarm',
  'updateProbes',
  'getAllProjects',
  'getAvailableProjects',
  'getProjectById',
  'getPurchasedProjects',
] as const;

describe('src/systems barrel', () => {
  it.each(REQUIRED_EXPORTS)('exports %s as a function', (name) => {
    const value = (barrel as unknown as Record<string, unknown>)[name];
    expect(value, `missing export: ${name}`).toBeDefined();
    expect(typeof value, `${name} is not a function`).toBe('function');
  });

  it('exports at least 12 symbols (Run 11 regression guard)', () => {
    const exported = Object.keys(barrel).filter(
      (k) => typeof (barrel as Record<string, unknown>)[k] === 'function',
    );
    expect(exported.length).toBeGreaterThanOrEqual(12);
  });
});
