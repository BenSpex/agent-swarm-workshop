import type { GameState } from '../../shared/types';
import type { ProjectDefinition } from '../../shared/projects';

export const getAllProjects = (): ProjectDefinition[] => [];

export const getProjectById = (_id: string): ProjectDefinition | undefined =>
  undefined;

export const getAvailableProjects = (
  _state: GameState,
): ProjectDefinition[] => [];

export const getPurchasedProjects = (
  _state: GameState,
): ProjectDefinition[] => [];
