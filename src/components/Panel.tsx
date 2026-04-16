import type { ReactNode } from 'react';

interface PanelProps {
  title: string;
  statusBadge?: string;
  testId?: string;
  children: ReactNode;
}

export function Panel({ title, statusBadge, testId, children }: PanelProps) {
  return (
    <section
      data-testid={testId}
      className="bg-white border border-[#D4D4D0] rounded-[4px] overflow-hidden"
    >
      <header
        className="bg-black text-white h-12 px-5 flex items-center justify-between"
        style={{ letterSpacing: '1px' }}
      >
        <span className="font-mono font-bold text-[14px] uppercase">
          {title}
        </span>
        {statusBadge && (
          <span
            className="bg-[#D4A843] text-black font-mono font-bold text-[10px] uppercase px-2 py-[2px]"
            style={{ letterSpacing: '1px' }}
          >
            {statusBadge}
          </span>
        )}
      </header>
      <div className="p-5 flex flex-col gap-4">{children}</div>
    </section>
  );
}
