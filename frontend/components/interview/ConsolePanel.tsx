'use client';

import { useEffect, useRef } from 'react';
import type { ConsoleEntry } from '@/types/interview';

interface ConsolePanelProps {
  entries: ConsoleEntry[];
}

const TYPE_STYLES: Record<ConsoleEntry['type'], string> = {
  log: 'text-text-primary',
  error: 'text-red-primary',
  warn: 'text-yellow-400',
  info: 'text-text-dim',
};

export default function ConsolePanel({ entries }: ConsolePanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center h-7 px-3 bg-bg-secondary border-t border-b border-border-primary flex-shrink-0">
        <span className="font-mono text-[10px] text-text-dim uppercase tracking-widest">Console</span>
      </div>
      <div className="flex-1 overflow-y-auto bg-bg-primary p-3 font-mono text-xs leading-5">
        {entries.length === 0 && (
          <span className="text-text-dim">&gt; Waiting for output...</span>
        )}
        {entries.map((entry) => (
          <div key={entry.id} className={`${TYPE_STYLES[entry.type]} whitespace-pre-wrap break-all`}>
            {entry.type === 'error' && <span className="text-red-primary/60">[ERR] </span>}
            {entry.type === 'warn' && <span className="text-yellow-400/60">[WARN] </span>}
            {entry.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
