// Systems barrel — MANDATORY (per team-systems.md "Barrel Export Contract").
// Run 11: Systems team did not ship this; orchestrator created it post-merge.
export { updateInvestment } from './investment';
export { updateCreativity } from './quantum';
export { checkTrustMilestone } from './trust';
export { updateStratModeling, resolveRound } from './stratModeling';
export { updateWireBuyer } from './wireBuyer';
export { updateMatter } from './matter';
export { updateSwarm } from './swarm';
export { updateProbes } from './probes';
export {
  getAllProjects,
  getAvailableProjects,
  getProjectById,
  getPurchasedProjects,
} from './projects';
