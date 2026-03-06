'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { SetupData, InterviewType, Difficulty } from '@/types/interview';

const INTERVIEW_TYPES: { value: InterviewType; label: string; icon: string }[] = [
  { value: 'algorithms', label: 'Algorithms & DS', icon: '{ }' },
  { value: 'system-design', label: 'System Design', icon: '[=]' },
  { value: 'frontend', label: 'Frontend', icon: '</>' },
  { value: 'backend', label: 'Backend', icon: '>>>' },
];

const DIFFICULTIES: { value: Difficulty; label: string; color: string }[] = [
  { value: 'easy', label: 'Easy', color: 'text-green-terminal' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-400' },
  { value: 'hard', label: 'Hard', color: 'text-red-primary' },
];

export default function SetupScreen({ onStart }: { onStart: (data: SetupData) => void }) {
  const [name, setName] = useState('');
  const [interviewType, setInterviewType] = useState<InterviewType>('algorithms');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [cameraReady, setCameraReady] = useState(false);
  const [micReady, setMicReady] = useState(false);
  const [permissionError, setPermissionError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const requestPermissions = useCallback(async () => {
    try {
      setPermissionError('');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraReady(true);
      setMicReady(true);
    } catch {
      setPermissionError('Camera & microphone access required. Please allow permissions.');
    }
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const canStart = name.trim().length > 0;

  const handleStart = () => {
    if (!canStart) return;
    onStart({ name: name.trim(), interviewType, difficulty, cameraReady, micReady });
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-bg-primary relative py-12">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-primary/5 blur-[150px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl px-6 animate-slide-up">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="font-mono text-red-primary text-sm tracking-[0.3em] uppercase mb-3">
            // initiating protocol
          </div>
          <h1 className="font-sans text-5xl font-bold text-text-primary tracking-tight mb-2">
            The Tech Interviewer
            <span className="text-red-primary text-glow-red"> from Hell</span>
          </h1>
          <p className="text-text-secondary text-base mt-4 max-w-md mx-auto">
            Prepare yourself. This AI interviewer doesn&apos;t care about your feelings.
            It cares about your code.
          </p>
        </div>

        {/* Form */}
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-8 space-y-7">
          {/* Name */}
          <div>
            <label className="block text-text-secondary text-sm font-mono mb-2 uppercase tracking-wider">
              Candidate Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="w-full bg-bg-tertiary border border-border-primary rounded px-4 py-3 text-text-primary font-mono text-sm focus:outline-none focus:border-red-primary/50 transition-colors placeholder:text-text-dim"
              maxLength={30}
            />
          </div>

          {/* Interview Type */}
          <div>
            <label className="block text-text-secondary text-sm font-mono mb-3 uppercase tracking-wider">
              Interview Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {INTERVIEW_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setInterviewType(t.value)}
                  className={`flex items-center gap-3 px-4 py-3 rounded border text-left transition-all ${
                    interviewType === t.value
                      ? 'border-red-primary/60 bg-red-dim text-text-primary'
                      : 'border-border-primary bg-bg-tertiary text-text-secondary hover:border-border-primary hover:bg-bg-elevated'
                  }`}
                >
                  <span className="font-mono text-red-primary text-sm w-8">{t.icon}</span>
                  <span className="text-sm font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-text-secondary text-sm font-mono mb-3 uppercase tracking-wider">
              Difficulty
            </label>
            <div className="flex gap-3">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDifficulty(d.value)}
                  className={`flex-1 px-4 py-3 rounded border text-center text-sm font-semibold transition-all ${
                    difficulty === d.value
                      ? `border-red-primary/60 bg-red-dim ${d.color}`
                      : 'border-border-primary bg-bg-tertiary text-text-secondary hover:bg-bg-elevated'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Camera / Mic */}
          <div>
            <label className="block text-text-secondary text-sm font-mono mb-3 uppercase tracking-wider">
              Permissions
            </label>
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                {!cameraReady ? (
                  <button
                    onClick={requestPermissions}
                    className="w-full px-4 py-3 rounded border border-border-primary bg-bg-tertiary text-text-secondary text-sm font-mono hover:border-red-primary/40 hover:text-text-primary transition-all"
                  >
                    [ Enable Camera & Mic ]
                  </button>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 rounded border border-green-terminal/30 bg-green-dim">
                    <div className="w-2 h-2 rounded-full bg-green-terminal animate-pulse" />
                    <span className="font-mono text-green-terminal text-sm">Camera & Mic Active</span>
                  </div>
                )}
                {permissionError && (
                  <p className="text-red-primary text-xs font-mono mt-2">{permissionError}</p>
                )}
              </div>
              {/* Camera preview */}
              <div className="w-24 h-18 rounded border border-border-primary bg-bg-tertiary overflow-hidden flex-shrink-0">
                {cameraReady ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-dim text-xs font-mono">
                    CAM
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            disabled={!canStart}
            className={`w-full py-4 rounded font-semibold text-base tracking-wide transition-all ${
              canStart
                ? 'bg-red-primary text-white hover:bg-red-600 glow-red-subtle cursor-pointer'
                : 'bg-bg-tertiary text-text-dim border border-border-primary cursor-not-allowed'
            }`}
          >
            {canStart ? 'START INTERVIEW' : 'ENTER YOUR NAME TO BEGIN'}
          </button>
        </div>

        <div className="text-center mt-6 font-mono text-text-dim text-xs">
          &gt; All sessions are analyzed in real-time. There is no hiding.
        </div>
      </div>
    </div>
  );
}
