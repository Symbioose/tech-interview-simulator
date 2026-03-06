'use client';

import type { DebriefData } from '@/types/interview';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

interface DebriefScreenProps {
  data: DebriefData;
  candidateName: string;
  onRestart: () => void;
}

function ScoreGauge({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#00FF41' : score >= 60 ? '#FFD700' : '#FF2D2D';

  return (
    <div className="relative w-36 h-36">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#1A1A2A" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold font-mono" style={{ color }}>
          {score}
        </span>
        <span className="text-[10px] text-text-dim font-mono uppercase tracking-wider">/ 100</span>
      </div>
    </div>
  );
}

function TimelineDot({ type }: { type: string }) {
  const colors: Record<string, string> = {
    stress: 'bg-yellow-400',
    error: 'bg-red-primary',
    success: 'bg-green-terminal',
    hint: 'bg-blue-400',
  };
  return <div className={`w-2.5 h-2.5 rounded-full ${colors[type] || 'bg-text-dim'} flex-shrink-0`} />;
}

export default function DebriefScreen({ data, candidateName, onRestart }: DebriefScreenProps) {
  const radarData = [
    { subject: 'Code Quality', value: data.categories.codeQuality },
    { subject: 'Problem Solving', value: data.categories.problemSolving },
    { subject: 'Communication', value: data.categories.communication },
    { subject: 'Stress Mgmt', value: data.categories.stressManagement },
  ];

  return (
    <div className="h-screen w-screen bg-bg-primary overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10 animate-slide-up">
          <div className="font-mono text-red-primary text-xs tracking-[0.3em] uppercase mb-3">
            // interview complete
          </div>
          <h1 className="font-sans text-4xl font-bold text-text-primary mb-2">
            Performance Report
          </h1>
          <p className="text-text-secondary text-sm">
            Candidate: <span className="text-text-primary font-medium">{candidateName}</span>
          </p>
        </div>

        {/* Score + Radar */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Overall Score */}
          <div className="bg-bg-secondary border border-border-primary rounded-lg p-6 flex flex-col items-center justify-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="font-mono text-[10px] text-text-dim uppercase tracking-widest mb-4">
              Overall Score
            </div>
            <ScoreGauge score={data.overallScore} />
            <div className="mt-4 font-mono text-xs text-text-secondary">
              {data.overallScore >= 80
                ? 'Strong performance'
                : data.overallScore >= 60
                ? 'Decent, but room to improve'
                : 'Needs significant work'}
            </div>
          </div>

          {/* Radar Chart */}
          <div className="bg-bg-secondary border border-border-primary rounded-lg p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="font-mono text-[10px] text-text-dim uppercase tracking-widest mb-4 text-center">
              Category Breakdown
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="#1A1A2A" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#8888A0', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                />
                <Radar
                  dataKey="value"
                  stroke="#FF2D2D"
                  fill="#FF2D2D"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Bars */}
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-6 mb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="font-mono text-[10px] text-text-dim uppercase tracking-widest mb-5">
            Detailed Scores
          </div>
          <div className="space-y-4">
            {radarData.map((cat) => (
              <div key={cat.subject}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm text-text-secondary">{cat.subject}</span>
                  <span className="font-mono text-sm text-text-primary">{cat.value}%</span>
                </div>
                <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${cat.value}%`,
                      background:
                        cat.value >= 80
                          ? '#00FF41'
                          : cat.value >= 60
                          ? '#FFD700'
                          : '#FF2D2D',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-6 mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="font-mono text-[10px] text-text-dim uppercase tracking-widest mb-5">
            Session Timeline
          </div>
          <div className="space-y-3">
            {data.timeline.map((event, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="font-mono text-xs text-text-dim w-12 text-right flex-shrink-0">
                  {Math.floor(event.time / 60)}:{(event.time % 60).toString().padStart(2, '0')}
                </span>
                <TimelineDot type={event.type} />
                <span className="text-sm text-text-secondary">{event.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Improvements */}
        <div className="grid grid-cols-2 gap-6 mb-10">
          <div className="bg-bg-secondary border border-border-primary rounded-lg p-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="font-mono text-[10px] text-green-terminal uppercase tracking-widest mb-4">
              + Strengths
            </div>
            <ul className="space-y-2">
              {data.strengths.map((s, i) => (
                <li key={i} className="text-sm text-text-secondary flex gap-2">
                  <span className="text-green-terminal flex-shrink-0">&gt;</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-bg-secondary border border-border-primary rounded-lg p-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="font-mono text-[10px] text-red-primary uppercase tracking-widest mb-4">
              - Areas to Improve
            </div>
            <ul className="space-y-2">
              {data.improvements.map((s, i) => (
                <li key={i} className="text-sm text-text-secondary flex gap-2">
                  <span className="text-red-primary flex-shrink-0">&gt;</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 pb-12 animate-slide-up" style={{ animationDelay: '0.7s' }}>
          <button
            onClick={onRestart}
            className="px-8 py-3 rounded font-semibold text-sm bg-red-primary text-white hover:bg-red-600 glow-red-subtle transition-all"
          >
            Try Again
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: 'Tech Interviewer from Hell — My Results', text: `I scored ${data.overallScore}/100!` });
              }
            }}
            className="px-8 py-3 rounded font-semibold text-sm border border-border-primary text-text-secondary hover:bg-bg-tertiary transition-colors"
          >
            Share Results
          </button>
        </div>
      </div>
    </div>
  );
}
