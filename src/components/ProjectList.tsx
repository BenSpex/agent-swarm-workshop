import { useGameState, useDispatch } from '../hooks/useGameState';
import { formatNumber } from '../shared/engine';
import type { ProjectDefinition, ProjectCost } from '../shared/projects';
import { Panel } from './Panel';

// TODO-INTEGRATION: replace with `import { getAvailableProjects } from '../systems'`
// once the Systems team ships the projects registry. Until then, render a visible
// "Systems not ready" placeholder per Constitution Article 10 (no silent empty list).
const getAvailableProjects: ((state: unknown) => ProjectDefinition[]) | null = null;

function costSummary(cost: ProjectCost): string {
  const parts: string[] = [];
  if (cost.operations) parts.push(`${formatNumber(cost.operations)} ops`);
  if (cost.creativity) parts.push(`${formatNumber(cost.creativity)} creativity`);
  if (cost.funds) parts.push(`$${formatNumber(cost.funds)}`);
  if (cost.trust) parts.push(`${cost.trust} trust`);
  if (cost.yomi) parts.push(`${formatNumber(cost.yomi)} yomi`);
  if (cost.honor) parts.push(`${formatNumber(cost.honor)} honor`);
  return parts.length ? parts.join(' · ') : 'no cost';
}

export function ProjectList() {
  const state = useGameState();
  const dispatch = useDispatch();

  const projects: ProjectDefinition[] =
    getAvailableProjects != null ? getAvailableProjects(state) : [];
  const systemsReady = getAvailableProjects != null;

  return (
    <Panel title="Projects" testId="project-list" id="section-projects">
      <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-1">
        {!systemsReady ? (
          <p
            data-testid="project-list-placeholder"
            className="text-[#CC3314] text-[12px] border border-[#CC3314] bg-[#FFF5F5] p-3 rounded-[2px]"
          >
            Systems not ready — projects list will populate after integration.
          </p>
        ) : projects.length === 0 ? (
          <p className="text-[#7A7A75] text-[12px]">
            No available projects right now — earn more ops or trust.
          </p>
        ) : (
          projects.map((p) => (
            <div
              key={p.id}
              data-testid={`project-${p.id}`}
              className="border border-[#D4D4D0] p-3 flex flex-col gap-1 bg-[#FAFAF7]"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-[13px] font-bold tracking-[0.5px]">
                  {p.name}
                </span>
                <button
                  type="button"
                  data-testid={`project-buy-${p.id}`}
                  onClick={() => dispatch({ type: 'BUY_PROJECT', projectId: p.id })}
                  className="bg-[#D4A843] text-black h-7 px-3 font-mono text-[10px] font-bold tracking-[1px] uppercase"
                >
                  Buy
                </button>
              </div>
              <p className="text-[12px] text-[#7A7A75] leading-snug">{p.description}</p>
              <p className="text-[11px] text-[#7A7A75] uppercase tracking-[1px]">
                Cost: <span className="font-data normal-case tracking-normal">{costSummary(p.cost)}</span>
              </p>
            </div>
          ))
        )}
      </div>
    </Panel>
  );
}
