import { Panel } from './Panel';
import { useGameState } from '../hooks/useGameState';

const TIMESTAMP_RE = /^(\d{2}:\d{2}:\d{2})\s+(.*)$/;
const WARN_RE = /WARN|WARNING|ERROR/i;

interface ParsedMessage {
  timestamp: string;
  text: string;
  isWarn: boolean;
}

function parseMessage(raw: string): ParsedMessage {
  const match = raw.match(TIMESTAMP_RE);
  if (match) {
    return {
      timestamp: match[1],
      text: match[2],
      isWarn: WARN_RE.test(match[2]),
    };
  }
  return {
    timestamp: '—',
    text: raw,
    isWarn: WARN_RE.test(raw),
  };
}

export function ActivityLog() {
  const state = useGameState();
  const reversed = [...state.messages].reverse();

  return (
    <Panel title="Activity Log" testId="activity-log">
      <div className="max-h-[260px] overflow-y-auto flex flex-col">
        {reversed.length === 0 ? (
          <div className="text-[#7A7A75] text-[12px] font-mono py-[2px]">
            — no activity —
          </div>
        ) : (
          reversed.map((msg, idx) => {
            const parsed = parseMessage(msg);
            return (
              <div
                key={idx}
                className={
                  'text-[12px] font-mono py-[2px] ' +
                  (parsed.isWarn ? 'text-[#D4A843]' : 'text-[#1A1A1A]')
                }
              >
                <span className="text-[#7A7A75] text-[10px] mr-2">
                  {parsed.timestamp}
                </span>
                {parsed.text}
              </div>
            );
          })
        )}
      </div>
    </Panel>
  );
}
