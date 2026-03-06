'use client';

import { useEffect, useRef } from 'react';
import type { TranscriptEntry } from '@/types/interview';

interface TranscriptProps {
  entries: TranscriptEntry[];
}

export default function Transcript({ entries }: TranscriptProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center h-7 px-3 bg-bg-secondary border-b border-border-primary flex-shrink-0">
        <span className="font-mono text-[10px] text-text-dim uppercase tracking-widest">Transcript</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {entries.length === 0 && (
          <div className="text-text-dim font-mono text-xs text-center mt-6">
            Waiting for interview to begin...
          </div>
        )}
        {entries.map((entry) => (
          <div
            key={entry.id}
            className={`animate-fade-in ${
              entry.speaker === 'agent' ? 'pr-4' : 'pl-4'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`font-mono text-[10px] uppercase tracking-wider ${
                  entry.speaker === 'agent' ? 'text-red-primary' : 'text-green-terminal'
                }`}
              >
                {entry.speaker === 'agent' ? 'Interviewer' : 'You'}
              </span>
            </div>
            <p
              className={`text-sm leading-relaxed ${
                entry.speaker === 'agent'
                  ? 'text-text-primary font-medium'
                  : 'text-text-secondary'
              }`}
            >
              {entry.text}
            </p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
