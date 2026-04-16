import { useEffect, useRef, useState } from 'react';
import { useGameState } from '../hooks/useGameState';

const TIMESTAMP_RE = /^\d{2}:\d{2}:\d{2}\s+(.*)$/;

function stripTimestamp(raw: string): string {
  const match = raw.match(TIMESTAMP_RE);
  return match ? match[1] : raw;
}

export function NotificationToast() {
  const state = useGameState();
  const prevLenRef = useRef<number>(state.messages.length);
  const [visible, setVisible] = useState(false);
  const [currentMsg, setCurrentMsg] = useState<string>('');

  useEffect(() => {
    const len = state.messages.length;
    if (len > prevLenRef.current && len > 0) {
      const latest = state.messages[len - 1];
      setCurrentMsg(stripTimestamp(latest));
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 3000);
      prevLenRef.current = len;
      return () => clearTimeout(t);
    }
    prevLenRef.current = len;
  }, [state.messages]);

  return (
    <div
      data-testid="notification-toast"
      className={
        'fixed top-4 right-4 z-40 bg-white border border-[#D4D4D0] border-l-4 border-l-[#D4A843] px-4 py-3 font-mono text-[12px] min-w-[240px] max-w-[360px] shadow-md transition-all duration-300 ' +
        (visible
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 translate-x-4 pointer-events-none')
      }
    >
      {currentMsg}
    </div>
  );
}
