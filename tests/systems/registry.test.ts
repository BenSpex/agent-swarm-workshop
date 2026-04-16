import { describe, expect, it } from 'vitest';
import {
  getAllProjects,
  getAvailableProjects,
  getProjectById,
  getPurchasedProjects,
} from '../../src/systems';
import { GamePhase } from '../../src/shared/types';
import { createMockState } from './_fixtures/mockState';

describe('project registry', () => {
  it('getAllProjects returns a non-trivial registry (>= 25 across 3 phases)', () => {
    const all = getAllProjects();
    expect(all.length).toBeGreaterThanOrEqual(25);

    const byPhase = {
      [GamePhase.BUSINESS]: all.filter((p) => p.phase === GamePhase.BUSINESS)
        .length,
      [GamePhase.EARTH]: all.filter((p) => p.phase === GamePhase.EARTH).length,
      [GamePhase.UNIVERSE]: all.filter((p) => p.phase === GamePhase.UNIVERSE)
        .length,
    };
    expect(byPhase[GamePhase.BUSINESS]).toBeGreaterThanOrEqual(15);
    expect(byPhase[GamePhase.EARTH]).toBeGreaterThanOrEqual(5);
    expect(byPhase[GamePhase.UNIVERSE]).toBeGreaterThanOrEqual(5);
  });

  it('every project has the required shape', () => {
    for (const p of getAllProjects()) {
      expect(p.id, 'id must be non-empty string').toMatch(/\S/);
      expect(p.name, 'name must be non-empty').toMatch(/\S/);
      expect(p.description, 'description must be non-empty').toMatch(/\S/);
      expect([GamePhase.BUSINESS, GamePhase.EARTH, GamePhase.UNIVERSE]).toContain(
        p.phase,
      );
      expect(typeof p.isAvailable).toBe('function');
      expect(typeof p.effect).toBe('function');
      expect(p.cost).toBeTypeOf('object');
      expect(p.category).toBeTypeOf('string');
    }
  });

  it('project IDs are unique', () => {
    const ids = getAllProjects().map((p) => p.id);
    const uniq = new Set(ids);
    expect(uniq.size).toBe(ids.length);
  });

  it('getProjectById finds by exact id, returns undefined for unknown', () => {
    const all = getAllProjects();
    if (all.length === 0) return;
    const first = all[0];
    expect(getProjectById(first.id)?.id).toBe(first.id);
    expect(getProjectById('__not_a_real_project__')).toBeUndefined();
  });

  it('getAvailableProjects filters out purchased ids', () => {
    const all = getAllProjects();
    if (all.length === 0) return;
    const target = all[0];
    const state = createMockState({
      purchasedProjectIds: new Set([target.id]),
    });
    const avail = getAvailableProjects(state);
    expect(avail.find((p) => p.id === target.id)).toBeUndefined();
  });

  it('getPurchasedProjects returns only purchased projects', () => {
    const all = getAllProjects();
    if (all.length < 2) return;
    const [a, b] = all;
    const state = createMockState({
      purchasedProjectIds: new Set([a.id, b.id]),
    });
    const purchased = getPurchasedProjects(state);
    const ids = purchased.map((p) => p.id).sort();
    expect(ids).toEqual([a.id, b.id].sort());
  });

  it('known canonical project IDs exist', () => {
    const canonical = [
      'quantum_computing',
      'space_exploration',
      'auto_tourney',
    ];
    for (const id of canonical) {
      expect(getProjectById(id), `missing canonical project: ${id}`).toBeDefined();
    }
  });
});
