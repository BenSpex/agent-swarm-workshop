import type { GameState } from '../../shared/types';
import type { ProjectDefinition } from '../../shared/projects';
import { PHASE_1_PROJECTS } from './phase1';
import { PHASE_2_PROJECTS } from './phase2';
import { PHASE_3_PROJECTS } from './phase3';

export const ALL_PROJECTS: ProjectDefinition[] = [
  ...PHASE_1_PROJECTS,
  ...PHASE_2_PROJECTS,
  ...PHASE_3_PROJECTS,
];

export function getAllProjects(): ProjectDefinition[] {
  return ALL_PROJECTS;
}

export function getProjectById(id: string): ProjectDefinition | undefined {
  return ALL_PROJECTS.find((p) => p.id === id);
}

export function getAvailableProjects(state: GameState): ProjectDefinition[] {
  return ALL_PROJECTS.filter(
    (p) => !state.purchasedProjectIds.has(p.id) && p.isAvailable(state),
  );
}

export function getPurchasedProjects(state: GameState): ProjectDefinition[] {
  return ALL_PROJECTS.filter((p) => state.purchasedProjectIds.has(p.id));
}

export { PHASE_1_PROJECTS, PHASE_2_PROJECTS, PHASE_3_PROJECTS };
