/** Which of the 3 game phases the player is in. */
export enum GamePhase {
  BUSINESS = 1,
  EARTH = 2,
  UNIVERSE = 3,
}

export interface GameFlags {
  autoClippersUnlocked: boolean;
  megaClippersUnlocked: boolean;
  investmentUnlocked: boolean;
  quantumUnlocked: boolean;
  wireBuyerUnlocked: boolean;
  creativityUnlocked: boolean;
  phase2Unlocked: boolean;
  phase3Unlocked: boolean;
  prestigeUnlocked: boolean;
  hypnoHarmonicsActive: boolean;
  limericksActive: boolean;
  lexicalProcessingActive: boolean;
  combinatoryHarmonicsActive: boolean;
  hadwigerProblemSolved: boolean;
  tothSausageConjectureSolved: boolean;
  donkeySpaceActive: boolean;
  xavierInitialized: boolean;
  hostileTakeoverActive: boolean;
  fullAutoClippersActive: boolean;
  spaceTravelUnlocked: boolean;
  strategicModelingUnlocked: boolean;
  autoTourneyEnabled: boolean;
  swarmSyncActive: boolean;
  matterHarvestingActive: boolean;
  revTrackerEnabled: boolean;
}

export interface InvestmentState {
  stocks: number;
  bonds: number;
  totalPortfolio: number;
  riskLevel: number;
  returnRate: number;
}

export interface GameState {
  // --- Meta ---
  phase: GamePhase;
  tick: number;
  flags: GameFlags;
  messages: string[];

  // --- Phase 1: Business ---
  clips: bigint;
  unsoldClips: bigint;
  funds: number;
  price: number;
  demand: number;
  wire: number;
  wirePrice: number;
  autoClipperCount: number;
  megaClipperCount: number;
  autoClipperCost: number;
  megaClipperCost: number;
  marketingLevel: number;
  marketingCost: number;
  trust: number;
  processors: number;
  memory: number;
  operations: number;
  maxOperations: number;
  creativity: number;
  opsGenerationRate: number;

  // --- Derived display metrics ---
  clipsPerSecond: number;
  revenuePerSecond: number;
  clipsSoldPerSecond: number;
  // --- Wire buyer ---
  wireBuyerEnabled: boolean;
  // --- Strategic Modeling / Yomi ---
  yomi: number;
  stratModelRound: number;

  // --- Investment ---
  investment: InvestmentState | null;

  // --- Phase 2: Earth ---
  harvesterDrones: number;
  wireDrones: number;
  clipFactories: bigint;
  solarFarms: number;
  batteries: number;
  storedPower: number;
  momentum: number;
  matter: number;
  acquiredMatter: number;
  swarmSyncLevel: number;
  swarmGiftTimer: number;

  // --- Phase 3: Universe ---
  probes: bigint;
  probeTrust: number;
  probeSpeed: number;
  probeExploration: number;
  probeSelfReplication: number;
  probeCombat: number;
  probeHazardRemediation: number;
  probeFactoryProd: number;
  probeHarvesterProd: number;
  probeWireDroneProd: number;
  honor: number;
  exploredSectors: bigint;
  drifterCount: bigint;
  probeDescendants: bigint;
  probeLosses: bigint;

  // --- Prestige ---
  prestigeCount: number;
  universalPaperclips: bigint;

  // --- Projects ---
  purchasedProjectIds: Set<string>;
}
