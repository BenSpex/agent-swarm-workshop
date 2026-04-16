import { useEffect, useState } from 'react';
import { Panel } from './Panel';
import { useGameState, useDispatch } from '../hooks/useGameState';
import { formatMoney, formatNumber } from '../shared/engine';
import type { GameState } from '../shared/types';
import type { ProjectDefinition, ProjectCost } from '../shared/projects';

type GetAvailableProjects = (s: GameState) => ProjectDefinition[];

let cached: GetAvailableProjects | null | undefined;

async function loadProjects(): Promise<GetAvailableProjects | null> {
  if (cached !== undefined) return cached;
  // TODO-INTEGRATION: systems barrel not shipped yet. Variable indirection
  // defeats Vite's static import-analysis so the try/catch can catch
  // ModuleNotFound at runtime when Systems hasn't shipped.
  const systemsPath = '../systems';
  try {
    const mod = await import(/* @vite-ignore */ systemsPath);
    cached = (mod.getAvailableProjects as GetAvailableProjects | undefined) ?? null;
  } catch {
    cached = null;
  }
  return cached;
}

function canAfford(state: GameState, cost: ProjectCost): boolean {
  if (cost.operations !== undefined && state.operations < cost.operations) return false;
  if (cost.creativity !== undefined && state.creativity < cost.creativity) return false;
  if (cost.funds !== undefined && state.funds < cost.funds) return false;
  if (cost.trust !== undefined && state.trust < cost.trust) return false;
  if (cost.yomi !== undefined && state.yomi < cost.yomi) return false;
  if (cost.honor !== undefined && state.honor < cost.honor) return false;
  return true;
}

function formatCost(cost: ProjectCost): string {
  const parts: string[] = [];
  if (cost.operations !== undefined)
    parts.push(`${formatNumber(cost.operations)} OPS`);
  if (cost.creativity !== undefined)
    parts.push(`${formatNumber(cost.creativity)} CREATIVITY`);
  if (cost.funds !== undefined) parts.push(formatMoney(cost.funds));
  if (cost.trust !== undefined) parts.push(`${cost.trust} TRUST`);
  if (cost.yomi !== undefined) parts.push(`${formatNumber(cost.yomi)} YOMI`);
  if (cost.honor !== undefined) parts.push(`${formatNumber(cost.honor)} HONOR`);
  return parts.join(' · ') || 'FREE';
}

export function ProjectList() {
  const state = useGameState();
  const dispatch = useDispatch();
  const [resolver, setResolver] = useState<GetAvailableProjects | null | undefined>(
    undefined,
  );

  useEffect(() => {
    let active = true;
    loadProjects().then((r) => {
      if (active) setResolver(r);
    });
    return () => {
      active = false;
    };
  }, []);

  let body;
  if (resolver === undefined) {
    body = (
      <div className="p-4 text-[#7A7A75] text-[11px] uppercase tracking-[1px]">
        Loading projects…
      </div>
    );
  } else if (resolver === null) {
    body = (
      <div className="p-4 text-[#CC3314] font-bold text-[12px] uppercase tracking-[1px]">
        ⚠ Systems not integrated — TODO-INTEGRATION
      </div>
    );
  } else {
    let projects: ProjectDefinition[] = [];
    try {
      projects = resolver(state);
    } catch {
      return (
        <Panel title="Projects" testId="project-list">
          <div className="p-4 text-[#CC3314] font-bold text-[12px] uppercase tracking-[1px]">
            ⚠ Systems not integrated — TODO-INTEGRATION
          </div>
        </Panel>
      );
    }

    if (projects.length === 0) {
      body = (
        <div className="p-4 text-[#7A7A75] text-[11px] uppercase tracking-[1px]">
          No projects available
        </div>
      );
    } else {
      body = (
        <div className="flex flex-col gap-3 max-h-[360px] overflow-y-auto">
          {projects.map((p) => {
            const affordable = canAfford(state, p.cost);
            return (
              <div
                key={p.id}
                className="border border-[#D4D4D0] rounded-[3px] p-3 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-[13px]">{p.name}</span>
                  <button
                    type="button"
                    disabled={!affordable}
                    onClick={() =>
                      dispatch({ type: 'BUY_PROJECT', projectId: p.id })
                    }
                    className={
                      affordable
                        ? 'bg-black text-white h-8 px-3 font-mono text-[10px] font-bold uppercase tracking-[1px]'
                        : 'bg-[#F5F5F0] text-[#7A7A75] h-8 px-3 font-mono text-[10px] font-bold uppercase tracking-[1px] cursor-not-allowed'
                    }
                  >
                    Buy
                  </button>
                </div>
                <div className="text-[11px] text-[#7A7A75]">{p.description}</div>
                <div className="font-data text-[10px] uppercase tracking-[1px] text-[#7A7A75]">
                  {formatCost(p.cost)}
                </div>
              </div>
            );
          })}
        </div>
      );
    }
  }

  return (
    <Panel title="Projects" testId="project-list">
      {body}
    </Panel>
  );
}
