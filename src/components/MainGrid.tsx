import type { ReactNode } from 'react';
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
import { PhaseTransition } from './PhaseTransition';
import { NotificationToast } from './NotificationToast';

export function MainGrid() {
  const state = useGameState();
  const phase = state.phase;

  const p1: ReactNode[] = [
    <ManufacturingPanel key="mfg" />,
    <BusinessPanel key="biz" />,
    <ManufacturingControls key="ctrl" />,
  ];
  const p1Sec: ReactNode[] = [
    <ComputingPanel key="comp" />,
    <StratModelingPanel key="strat" />,
    <InvestmentPanel key="inv" />,
  ];
  const p2: ReactNode[] = [
    <DronePanel key="drone" />,
    <FactoryPanel key="factory" />,
    <PowerPanel key="power" />,
    <MatterPanel key="matter" />,
  ];
  const p3: ReactNode[] = [
    <ProbePanel key="probe" />,
    <ProbeStatsPanel key="probeStats" />,
    <ExplorationDisplay key="explore" />,
    <CombatDisplay key="combat" />,
  ];

  let leftCol: ReactNode[];
  let rightCol: ReactNode[];

  if (phase === GamePhase.BUSINESS) {
    leftCol = [...p1];
    rightCol = [
      ...p1Sec,
      <ProjectList key="projects" />,
      <ActivityLog key="log" />,
    ];
  } else if (phase === GamePhase.EARTH) {
    leftCol = [...p2, ...p1];
    rightCol = [
      ...p1Sec,
      <ProjectList key="projects" />,
      <ActivityLog key="log" />,
    ];
  } else {
    leftCol = [...p3, ...p2];
    rightCol = [
      ...p1,
      ...p1Sec,
      <ProjectList key="projects" />,
      <ActivityLog key="log" />,
    ];
  }

  return (
    <>
      <div
        data-testid="main-grid"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="flex flex-col gap-4">{leftCol}</div>
        <div className="flex flex-col gap-4">{rightCol}</div>
      </div>
      <PhaseTransition />
      <NotificationToast />
    </>
  );
}
