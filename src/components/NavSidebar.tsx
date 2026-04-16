import { useGameState } from '../hooks/useGameState';
import { GamePhase } from '../shared/types';

interface NavItem {
  id: string;
  label: string;
  sectionId: string;
  phase: GamePhase;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'terminal-alpha', label: 'Terminal Alpha', sectionId: 'section-terminal-alpha', phase: GamePhase.BUSINESS },
  { id: 'computational-resources', label: 'Computational Resources', sectionId: 'section-computing', phase: GamePhase.BUSINESS },
  { id: 'strategic-projects', label: 'Strategic Projects', sectionId: 'section-projects', phase: GamePhase.BUSINESS },
  { id: 'earth-operations', label: 'Earth Operations', sectionId: 'section-earth', phase: GamePhase.EARTH },
  { id: 'galactic-expansion', label: 'Galactic Expansion', sectionId: 'section-galactic', phase: GamePhase.UNIVERSE },
];

function WeylandLogo() {
  return (
    <div
      aria-hidden
      className="w-8 h-8 border border-black flex items-center justify-center font-mono font-bold text-[14px] bg-white"
    >
      WY
    </div>
  );
}

export function NavSidebar() {
  const state = useGameState();
  const activePhase = state.phase;

  const handleClick = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <aside
      data-testid="nav-sidebar"
      className="w-[260px] shrink-0 bg-white border-r border-[#D4D4D0] flex flex-col"
      style={{ maxHeight: '100vh', overflowY: 'auto' }}
    >
      <div className="px-5 py-5 border-b border-[#D4D4D0] flex items-center gap-3">
        <WeylandLogo />
        <div className="flex flex-col leading-tight">
          <span className="font-mono font-bold text-[13px]" style={{ letterSpacing: '1px' }}>
            WEYLAND CORP
          </span>
          <span className="text-[10px] text-[#7A7A75] font-mono" style={{ letterSpacing: '0.5px' }}>
            AI INIT: MU-TH-UR 6000
          </span>
        </div>
      </div>

      <div className="px-5 py-3 border-b border-[#D4D4D0]">
        <span
          className="inline-block bg-[#D4A843] text-black font-mono font-bold text-[10px] uppercase px-2 py-[3px]"
          style={{ letterSpacing: '1px' }}
        >
          COMPUTING
        </span>
      </div>

      <nav className="flex-1 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = item.phase === activePhase;
          return (
            <button
              key={item.id}
              type="button"
              data-nav-id={item.id}
              data-active={isActive ? 'true' : 'false'}
              onClick={() => handleClick(item.sectionId)}
              className={[
                'w-full text-left px-5 py-3 font-mono text-[12px] block bg-white hover:bg-[#F5F5F0] transition-colors',
                isActive
                  ? 'font-bold border-l-[3px] border-[#D4A843] pl-[17px] bg-[#FAFAF5]'
                  : 'font-normal border-l-[3px] border-transparent text-[#1A1A1A]',
              ].join(' ')}
              style={{ letterSpacing: '0.5px' }}
            >
              {item.label.toUpperCase()}
            </button>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-[#D4D4D0] flex items-center gap-2">
        <span
          aria-hidden
          className="inline-block w-2 h-2 rounded-full bg-[#2D8A4E]"
        />
        <span className="font-mono text-[10px] text-[#1A1A1A]" style={{ letterSpacing: '0.5px' }}>
          SYS.STATUS NOMINAL
        </span>
      </div>
    </aside>
  );
}
