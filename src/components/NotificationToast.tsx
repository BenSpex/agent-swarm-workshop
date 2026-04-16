import { useEffect, useRef, useState } from 'react';
import { useGameState } from '../hooks/useGameState';

export function NotificationToast() {
  const state = useGameState();
  const messages = state.messages ?? [];
  const lastLengthRef = useRef<number>(messages.length);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (messages.length > lastLengthRef.current) {
      const newest = messages[messages.length - 1];
      setActiveMessage(newest ?? null);
      lastLengthRef.current = messages.length;
      const dismiss = window.setTimeout(() => setActiveMessage(null), 3000);
      return () => window.clearTimeout(dismiss);
    }
    if (messages.length < lastLengthRef.current) {
      lastLengthRef.current = messages.length;
    }
    return undefined;
  }, [messages.length, messages]);

  if (activeMessage == null) return null;

  return (
    <div
      data-testid="notification-toast"
      className="fixed z-40 bg-white border font-mono"
      style={{
        top: 24,
        right: 24,
        borderColor: '#D4A843',
        borderWidth: 1,
        padding: 16,
        fontSize: 12,
        maxWidth: 320,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      }}
    >
      <span className="text-[10px] text-[#7A7A75] uppercase tracking-[1px] block mb-1">
        Activity
      </span>
      <span className="text-[12px] leading-snug">{activeMessage}</span>
    </div>
  );
}
