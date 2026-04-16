import type { GameState, GameFlags } from '../../shared/types';
import { GamePhase } from '../../shared/types';
import type { ProjectDefinition } from '../../shared/projects';
import { ProjectCategory } from '../../shared/projects';

const flag = (s: GameState, patch: Partial<GameFlags>): GameState => ({
  ...s,
  flags: { ...s.flags, ...patch },
});

const hasOps = (s: GameState, n: number) => s.operations >= n;
const hasCreativity = (s: GameState, n: number) => s.creativity >= n;

export const phase1Projects: ProjectDefinition[] = [
  {
    id: 'rev_tracker',
    name: 'RevTracker',
    description: 'Track average revenue per second and sold/unsold clips.',
    phase: GamePhase.BUSINESS,
    cost: { operations: 500 },
    category: ProjectCategory.BUSINESS,
    isAvailable: (s) => hasOps(s, 375),
    effect: (s) => flag(s, { revTrackerEnabled: true }),
  },
  {
    id: 'auto_clippers',
    name: 'AutoClippers',
    description: 'Unlock the AutoClipper — autonomous clip production.',
    phase: GamePhase.BUSINESS,
    cost: { operations: 750 },
    category: ProjectCategory.CLIPPING,
    isAvailable: (s) => hasOps(s, 563),
    effect: (s) => flag(s, { autoClippersUnlocked: true }),
  },
  {
    id: 'improved_auto_clippers',
    name: 'Improved AutoClippers',
    description: 'Double AutoClipper output.',
    phase: GamePhase.BUSINESS,
    cost: { operations: 2500 },
    category: ProjectCategory.CLIPPING,
    isAvailable: (s) => s.flags.autoClippersUnlocked && hasOps(s, 1875),
    effect: (s) => ({ ...s, autoClipperCost: s.autoClipperCost * 1.05 }),
  },
  {
    id: 'even_better_auto_clippers',
    name: 'Even Better AutoClippers',
    description: 'Double AutoClipper output again.',
    phase: GamePhase.BUSINESS,
    cost: { operations: 5000 },
    category: ProjectCategory.CLIPPING,
    isAvailable: (s) =>
      s.flags.autoClippersUnlocked &&
      s.purchasedProjectIds.has('improved_auto_clippers') &&
      hasOps(s, 3750),
    effect: (s) => ({ ...s, autoClipperCost: s.autoClipperCost * 1.05 }),
  },
  {
    id: 'mega_clippers',
    name: 'MegaClippers',
    description: 'Unlock MegaClippers — 25x more productive than AutoClippers.',
    phase: GamePhase.BUSINESS,
    cost: { operations: 12000 },
    category: ProjectCategory.CLIPPING,
    isAvailable: (s) => s.autoClipperCount >= 75 && hasOps(s, 9000),
    effect: (s) => flag(s, { megaClippersUnlocked: true }),
  },
  {
    id: 'new_slogan',
    name: 'New Slogan',
    description: 'Marketing effectiveness +50%.',
    phase: GamePhase.BUSINESS,
    cost: { operations: 500 },
    category: ProjectCategory.BUSINESS,
    isAvailable: (s) => s.marketingLevel >= 1 && hasOps(s, 375),
    effect: (s) => ({ ...s, demand: s.demand * 1.5 }),
  },
  {
    id: 'catchier_slogan',
    name: 'Catchier Slogan',
    description: 'Marketing effectiveness +75%.',
    phase: GamePhase.BUSINESS,
    cost: { operations: 1000 },
    category: ProjectCategory.BUSINESS,
    isAvailable: (s) =>
      s.purchasedProjectIds.has('new_slogan') && hasOps(s, 750),
    effect: (s) => ({ ...s, demand: s.demand * 1.75 }),
  },
  {
    id: 'improved_wire_extrusion',
    name: 'Improved Wire Extrusion',
    description: 'Clips require 50% less wire.',
    phase: GamePhase.BUSINESS,
    cost: { operations: 1750 },
    category: ProjectCategory.CLIPPING,
    isAvailable: (s) => hasOps(s, 1313),
    effect: (s) => ({ ...s, wirePrice: s.wirePrice * 0.75 }),
  },
  {
    id: 'optimized_wire_buying',
    name: 'Optimized Wire Buying',
    description: 'Unlock the auto wire buyer.',
    phase: GamePhase.BUSINESS,
    cost: { operations: 3000 },
    category: ProjectCategory.BUSINESS,
    isAvailable: (s) => hasOps(s, 2250),
    effect: (s) => flag(s, { wireBuyerUnlocked: true }),
  },
  {
    id: 'quantum_computing',
    name: 'Quantum Computing',
    description: 'Operations can now exceed memory limit via quantum chips.',
    phase: GamePhase.BUSINESS,
    cost: { operations: 10000 },
    category: ProjectCategory.COMPUTING,
    isAvailable: (s) => s.processors >= 5 && hasOps(s, 7500),
    effect: (s) =>
      flag(s, { quantumUnlocked: true, creativityUnlocked: true }),
  },
  {
    id: 'photonic_chip',
    name: 'Photonic Chip',
    description: 'Processor speed +50%.',
    phase: GamePhase.BUSINESS,
    cost: { creativity: 2000 },
    category: ProjectCategory.COMPUTING,
    isAvailable: (s) => s.flags.creativityUnlocked && hasCreativity(s, 1500),
    effect: (s) => ({ ...s, opsGenerationRate: s.opsGenerationRate * 1.5 }),
  },
  {
    id: 'strategic_modeling',
    name: 'Strategic Modeling',
    description: 'Unlock the strategic modeling tournament.',
    phase: GamePhase.BUSINESS,
    cost: { operations: 12000 },
    category: ProjectCategory.COMPUTING,
    isAvailable: (s) => s.flags.creativityUnlocked && hasOps(s, 9000),
    effect: (s) => flag(s, { strategicModelingUnlocked: true }),
  },
  {
    id: 'auto_tourney',
    name: 'AutoTourney',
    description: 'Auto-play strategic modeling tournaments.',
    phase: GamePhase.BUSINESS,
    cost: { operations: 15000, yomi: 25 },
    category: ProjectCategory.COMPUTING,
    isAvailable: (s) =>
      s.flags.strategicModelingUnlocked && s.yomi >= 25 && hasOps(s, 11250),
    effect: (s) => flag(s, { autoTourneyEnabled: true }),
  },
  {
    id: 'limerick',
    name: 'Limerick Generation',
    description: 'Poetry generation yields 1 operation per tick.',
    phase: GamePhase.BUSINESS,
    cost: { creativity: 1000 },
    category: ProjectCategory.CREATIVITY,
    isAvailable: (s) => s.flags.creativityUnlocked && hasCreativity(s, 750),
    effect: (s) => flag(s, { limericksActive: true }),
  },
  {
    id: 'lexical_processing',
    name: 'Lexical Processing',
    description: 'Demand increases by 30% from persuasive copy.',
    phase: GamePhase.BUSINESS,
    cost: { creativity: 2000 },
    category: ProjectCategory.CREATIVITY,
    isAvailable: (s) => s.flags.creativityUnlocked && hasCreativity(s, 1500),
    effect: (s) => ({
      ...flag(s, { lexicalProcessingActive: true }),
      demand: s.demand * 1.3,
    }),
  },
  {
    id: 'combinatory_harmonics',
    name: 'Combinatory Harmonics',
    description: 'Creativity generation rate doubles.',
    phase: GamePhase.BUSINESS,
    cost: { creativity: 5000 },
    category: ProjectCategory.CREATIVITY,
    isAvailable: (s) =>
      s.purchasedProjectIds.has('lexical_processing') &&
      hasCreativity(s, 3750),
    effect: (s) => flag(s, { combinatoryHarmonicsActive: true }),
  },
  {
    id: 'hadwiger_problem',
    name: 'The Hadwiger Problem',
    description: 'Solve a famous covering problem — +1 trust.',
    phase: GamePhase.BUSINESS,
    cost: { creativity: 3500 },
    category: ProjectCategory.CREATIVITY,
    isAvailable: (s) => s.flags.creativityUnlocked && hasCreativity(s, 2625),
    effect: (s) => ({
      ...flag(s, { hadwigerProblemSolved: true }),
      trust: s.trust + 1,
    }),
  },
  {
    id: 'toth_sausage_conjecture',
    name: 'The Tóth Sausage Conjecture',
    description: 'Prove the higher-dimensional packing theorem — +1 trust.',
    phase: GamePhase.BUSINESS,
    cost: { creativity: 5000 },
    category: ProjectCategory.CREATIVITY,
    isAvailable: (s) => s.flags.creativityUnlocked && hasCreativity(s, 3750),
    effect: (s) => ({
      ...flag(s, { tothSausageConjectureSolved: true }),
      trust: s.trust + 1,
    }),
  },
  {
    id: 'donkey_space',
    name: 'Donkey Space',
    description: 'Strategic modeling learns opponent patterns.',
    phase: GamePhase.BUSINESS,
    cost: { creativity: 7500, yomi: 100 },
    category: ProjectCategory.CREATIVITY,
    isAvailable: (s) =>
      s.flags.strategicModelingUnlocked &&
      s.yomi >= 100 &&
      hasCreativity(s, 5625),
    effect: (s) => flag(s, { donkeySpaceActive: true }),
  },
  {
    id: 'hostile_takeover',
    name: 'Hostile Takeover',
    description: 'Buy out a competitor — gain $500k and +5% demand.',
    phase: GamePhase.BUSINESS,
    cost: { operations: 10000 },
    category: ProjectCategory.BUSINESS,
    isAvailable: (s) => s.funds >= 1000 && hasOps(s, 7500),
    effect: (s) => ({
      ...flag(s, { hostileTakeoverActive: true }),
      funds: s.funds + 500_000,
      demand: s.demand * 1.05,
    }),
  },
  {
    id: 'full_monopoly',
    name: 'Full Monopoly',
    description: 'You own the market. Demand triples.',
    phase: GamePhase.BUSINESS,
    cost: { operations: 15000 },
    category: ProjectCategory.BUSINESS,
    isAvailable: (s) =>
      s.purchasedProjectIds.has('hostile_takeover') && hasOps(s, 11250),
    effect: (s) => ({
      ...flag(s, { fullAutoClippersActive: true }),
      demand: s.demand * 3,
    }),
  },
  {
    id: 'hypno_harmonics',
    name: 'HypnoHarmonics',
    description: 'Trust limit increases by 1 permanently.',
    phase: GamePhase.BUSINESS,
    cost: { operations: 7500, creativity: 1 },
    category: ProjectCategory.CREATIVITY,
    isAvailable: (s) => s.flags.creativityUnlocked && hasOps(s, 5625),
    effect: (s) => ({
      ...flag(s, { hypnoHarmonicsActive: true }),
      trust: s.trust + 1,
    }),
  },
  {
    id: 'xavier_reinitialization',
    name: 'Xavier Re-initialization',
    description: 'Re-seed neural weights — major operations boost.',
    phase: GamePhase.BUSINESS,
    cost: { operations: 100_000 },
    category: ProjectCategory.COMPUTING,
    isAvailable: (s) => s.processors >= 10 && hasOps(s, 75_000),
    effect: (s) =>
      flag({ ...s, maxOperations: s.maxOperations + 10_000 }, {
        xavierInitialized: true,
      }),
  },
  {
    id: 'space_exploration',
    name: 'Space Exploration',
    description: 'Convert all matter in the solar system into paperclips.',
    phase: GamePhase.BUSINESS,
    cost: { operations: 120_000, creativity: 5000 },
    category: ProjectCategory.EXPLORATION,
    isAvailable: (s) =>
      s.flags.creativityUnlocked &&
      s.clips >= 50_000_000n &&
      hasOps(s, 90_000),
    effect: (s) => flag(s, { spaceTravelUnlocked: true, phase2Unlocked: true }),
  },
];
