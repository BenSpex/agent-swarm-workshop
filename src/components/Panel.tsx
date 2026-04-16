import type { ReactNode } from 'react';

interface PanelProps {
  title: string;
  testId?: string;
  badge?: string;
  id?: string;
  children: ReactNode;
  className?: string;
}

export function Panel({ title, testId, badge, id, children, className = '' }: PanelProps) {
  return (
    <section
      id={id}
      data-testid={testId}
      className={`bg-white border border-[#D4D4D0] rounded-[4px] overflow-hidden ${className}`}
    >
      <header className="bg-black h-12 px-5 flex items-center justify-between">
        <h2 className="text-white font-mono text-[14px] font-bold tracking-[1px] uppercase">
          {title}
        </h2>
        {badge ? (
          <span className="bg-[#D4A843] text-black font-mono text-[10px] font-bold tracking-[1px] uppercase px-2 py-[2px]">
            {badge}
          </span>
        ) : null}
      </header>
      <div className="p-5 flex flex-col gap-4 text-[13px]">{children}</div>
    </section>
  );
}
