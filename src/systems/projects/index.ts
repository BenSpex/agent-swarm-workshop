import type { GameState } from '../../shared/types';
import type { ProjectDefinition } from '../../shared/projects';
import { phase1Projects } from './phase1';
import { phase2Projects } from './phase2';
import { phase3Projects } from './phase3';

const allProjects: ProjectDefinition[] = [
  ...phase1Projects,
  ...phase2Projects,
  ...phase3Projects,
];

const byId: Map<string, ProjectDefinition> = new Map(
  allProjects.map((p) => [p.id, p]),
);

export const getAllProjects = (): ProjectDefinition[] => allProjects;

export const getProjectById = (id: string): ProjectDefinition | undefined =>
  byId.get(id);

export const getAvailableProjects = (
  state: GameState,
): ProjectDefinition[] =>
  allProjects.filter(
    (p) => !state.purchasedProjectIds.has(p.id) && p.isAvailable(state),
  );

export const getPurchasedProjects = (
  state: GameState,
): ProjectDefinition[] =>
  allProjects.filter((p) => state.purchasedProjectIds.has(p.id));
