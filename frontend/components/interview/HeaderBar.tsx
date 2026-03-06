'use client';

import type { AgentState, Difficulty } from '@/types/interview';

interface HeaderBarProps {
  elapsedSeconds: number;
  agentState: AgentState;
  difficulty: Difficulty;
  interviewType: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const STATE_LABELS: Record<AgentState, string> = {
  idle: 'Idle',
  listening: 'Listening...',
  speaking: 'Speaking...',
  analyzing: 'Analyzing your code...',
  thinking: 'Thinking...',
};

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  easy: 'text-green-terminal border-green-terminal/30',
  medium: 'text-yellow-400 border-yellow-400/30',
  hard: 'text-red-primary border-red-primary/30',
};

export default function HeaderBar({ elapsedSeconds, agentState, difficulty, interviewType }: HeaderBarProps) {
  return (
    <header className="flex items-center justify-between h-12 px-5 bg-bg-secondary border-b border-border-primary flex-shrink-0">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-red-primary glow-red-subtle" />
        <span className="font-sans font-bold text-sm text-text-primary tracking-tight">
          TECH INTERVIEWER
          <span className="text-red-primary"> FROM HELL</span>
        </span>
        <span className="text-text-dim text-xs font-mono ml-2 hidden sm:inline">
          // {interviewType.replace('-', ' ')}
        </span>
      </div>

      {/* Center: Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              agentState === 'speaking'
                ? 'bg-red-primary animate-pulse'
                : agentState === 'listening'
                ? 'bg-green-terminal animate-pulse'
                : agentState === 'analyzing' || agentState === 'thinking'
                ? 'bg-yellow-400 animate-pulse'
                : 'bg-text-dim'
            }`}
          />
          <span className="font-mono text-xs text-text-secondary">{STATE_LABELS[agentState]}</span>
        </div>
      </div>

      {/* Right: Timer + Difficulty */}
      <div className="flex items-center gap-4">
        <span className={`font-mono text-xs px-2 py-0.5 rounded border uppercase ${DIFFICULTY_STYLES[difficulty]}`}>
          {difficulty}
        </span>
        <div className="font-mono text-sm text-text-primary tabular-nums tracking-wider">
          {formatTime(elapsedSeconds)}
        </div>
        <div className="w-2 h-2 rounded-full bg-red-primary animate-pulse" title="Recording" />
      </div>
    </header>
  );
}
