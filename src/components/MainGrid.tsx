import { useGameState } from '../hooks/useGameState';
import { GamePhase } from '../shared/types';
import { ManufacturingPanel } from './ManufacturingPanel';
import { BusinessPanel } from './BusinessPanel';
import { ManufacturingControls } from './ManufacturingControls';
import { ComputingPanel } from './ComputingPanel';
import { StratModelingPanel } from './StratModelingPanel';
import { InvestmentPanel } from './InvestmentPanel';
import { ProjectList } from './ProjectList';
import { DronePanel } from './DronePanel';
import { FactoryPanel } from './FactoryPanel';
import { PowerPanel } from './PowerPanel';
import { MatterPanel } from './MatterPanel';
import { ProbePanel } from './ProbePanel';
import { ProbeStatsPanel } from './ProbeStatsPanel';
import { ExplorationDisplay } from './ExplorationDisplay';
import { CombatDisplay } from './CombatDisplay';
import { ActivityLog } from './ActivityLog';

/**
 * MainGrid — 2-column responsive grid. Phase reorganizes ORDER, never gates P1.
 * Rules:
 *   - P1 panels render in EVERY phase (Run 10 regression).
 *   - P2 panels render in Phase 2 AND Phase 3.
 *   - P3 panels render in Phase 3 only.
 *   - ActivityLog always renders.
 */
export function MainGrid() {
  const state = useGameState();

  const p1Production = (
    <>
      <ManufacturingPanel />
      <BusinessPanel />
      <ManufacturingControls />
    </>
  );

  const p1Tooling = (
    <>
      <ComputingPanel />
      <StratModelingPanel />
      <InvestmentPanel />
      <ProjectList />
    </>
  );

  const p2Panels = (
    <>
      <DronePanel />
      <FactoryPanel />
      <PowerPanel />
      <MatterPanel />
    </>
  );

  const p3Panels = (
    <>
      <ProbePanel />
      <ProbeStatsPanel />
      <ExplorationDisplay />
      <CombatDisplay />
    </>
  );

  let leftColumn;
  let rightColumn;
  if (state.phase === GamePhase.UNIVERSE) {
    leftColumn = <>{p3Panels}</>;
    rightColumn = (
      <>
        {p2Panels}
        {p1Production}
        {p1Tooling}
        <ActivityLog />
      </>
    );
  } else if (state.phase === GamePhase.EARTH) {
    leftColumn = <>{p2Panels}</>;
    rightColumn = (
      <>
        {p1Production}
        {p1Tooling}
        <ActivityLog />
      </>
    );
  } else {
    leftColumn = <>{p1Production}</>;
    rightColumn = (
      <>
        {p1Tooling}
        <ActivityLog />
      </>
    );
  }

  return (
    <div
      data-testid="main-grid"
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div className="flex flex-col gap-4">{leftColumn}</div>
      <div className="flex flex-col gap-4">{rightColumn}</div>
    </div>
  );
}
