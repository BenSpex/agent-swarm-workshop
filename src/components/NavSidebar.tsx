import { GamePhase } from '../shared/types';

interface NavItem {
  id: string;
  label: string;
  targetSection: string;
  /** If set, item highlights ONLY when state.phase === activePhase. Plain scroll-links omit this. */
  activePhase?: GamePhase;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'nav-terminal-alpha', label: 'Terminal Alpha', targetSection: 'section-manufacturing', activePhase: GamePhase.BUSINESS },
  { id: 'nav-computational', label: 'Computational Resources', targetSection: 'section-computing' },
  { id: 'nav-strategic', label: 'Strategic Modeling', targetSection: 'section-strat-modeling' },
  { id: 'nav-earth-ops', label: 'Earth Operations', targetSection: 'section-drones', activePhase: GamePhase.EARTH },
  { id: 'nav-galactic', label: 'Galactic Expansion', targetSection: 'section-probes', activePhase: GamePhase.UNIVERSE },
];

const PHASE_BADGE: Record<GamePhase, string> = {
  [GamePhase.BUSINESS]: 'COMPUTING',
  [GamePhase.EARTH]: 'EXPANDING',
  [GamePhase.UNIVERSE]: 'EXPLORING',
};

interface NavSidebarProps {
  phase: GamePhase;
}

export function NavSidebar({ phase }: NavSidebarProps) {
  const handleClick = (sectionId: string) => () => {
    if (typeof document === 'undefined') return;
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      data-testid="nav-sidebar"
      className="w-[260px] shrink-0 bg-white border-r border-[#D4D4D0] flex flex-col font-mono"
      style={{ maxHeight: '100vh', overflowY: 'auto' }}
    >
      <div className="px-5 pt-6 pb-4 border-b border-[#D4D4D0]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-black" aria-hidden="true" />
          <span className="text-[14px] font-bold tracking-[1px]">WEYLAND CORP</span>
        </div>
        <div className="text-[10px] text-[#7A7A75] mt-1 tracking-[1px] uppercase">
          AI INIT: MU-TH-UR 6000
        </div>
        <div className="mt-3">
          <span className="bg-[#D4A843] text-black text-[10px] font-bold tracking-[1px] uppercase px-2 py-[2px]">
            {PHASE_BADGE[phase]}
          </span>
        </div>
      </div>

      <ul className="flex-1 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = item.activePhase !== undefined && item.activePhase === phase;
          return (
            <li key={item.id}>
              <button
                type="button"
                data-testid={item.id}
                data-active={isActive ? 'true' : 'false'}
                onClick={handleClick(item.targetSection)}
                className={[
                  'w-full text-left h-11 px-5 flex items-center text-[13px]',
                  'border-l-[3px] transition-colors',
                  isActive
                    ? 'border-[#D4A843] bg-[#F5F5F5] font-bold text-black'
                    : 'border-transparent text-[#7A7A75] hover:bg-[#F5F5F5]',
                ].join(' ')}
              >
                <span className="mr-2 text-[10px]">{isActive ? '▸' : '·'}</span>
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="px-5 py-4 border-t border-[#D4D4D0] flex items-center gap-2 text-[10px] text-[#7A7A75]">
        <span className="inline-block w-2 h-2 rounded-full bg-[#2D8A4E]" aria-hidden="true" />
        <span className="tracking-[1px] uppercase">SYS.STATUS</span>
        <span className="ml-auto text-[#2D8A4E] font-bold tracking-[1px] uppercase">NOMINAL</span>
      </div>
    </nav>
  );
}
