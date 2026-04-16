import { useEffect, useRef } from 'react';
import { useGameState } from '../hooks/useGameState';
import { Panel } from './Panel';

export function ActivityLog() {
  const state = useGameState();
  const messages = state.messages ?? [];
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const lastLengthRef = useRef<number>(messages.length);

  useEffect(() => {
    if (messages.length !== lastLengthRef.current) {
      lastLengthRef.current = messages.length;
      const el = scrollRef.current;
      if (el) el.scrollTop = 0;
    }
  }, [messages.length]);

  // Newest first — render reversed copy so we don't mutate state.
  const ordered = [...messages].reverse();

  return (
    <Panel title="Activity Log" testId="activity-log" id="section-activity-log">
      <div
        ref={scrollRef}
        className="flex flex-col gap-1 max-h-[400px] overflow-y-auto pr-1"
      >
        {ordered.length === 0 ? (
          <p className="text-[#7A7A75] text-[12px]">No activity yet.</p>
        ) : (
          ordered.map((msg, idx) => {
            // idx 0 is newest. Use a stable key combining position-from-end + content snippet.
            const trueIdx = messages.length - 1 - idx;
            const key = `${trueIdx}-${msg.slice(0, 24)}`;
            const isWarning = /warn|alert|error|crit/i.test(msg);
            return (
              <div
                key={key}
                data-testid={`activity-entry-${trueIdx}`}
                className="flex flex-col border-b border-[#F0F0EC] pb-1"
              >
                <span className="text-[10px] text-[#7A7A75] uppercase tracking-[1px]">
                  T+{trueIdx}
                </span>
                <span
                  className={
                    isWarning
                      ? 'text-[12px] text-[#D4A843] leading-snug'
                      : 'text-[12px] leading-snug'
                  }
                >
                  {msg}
                </span>
              </div>
            );
          })
        )}
      </div>
    </Panel>
  );
}
