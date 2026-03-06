'use client';

import { useState } from 'react';

interface ControlsProps {
  onEndInterview: () => void;
}

export default function Controls({ onEndInterview }: ControlsProps) {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [confirmEnd, setConfirmEnd] = useState(false);

  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2 bg-bg-secondary border-t border-border-primary">
      <div className="flex items-center gap-2">
        {/* Mic toggle */}
        <button
          onClick={() => setMicOn((v) => !v)}
          className={`flex items-center justify-center w-9 h-9 rounded transition-colors ${
            micOn
              ? 'bg-bg-tertiary text-green-terminal border border-green-terminal/20'
              : 'bg-red-dark text-red-primary border border-red-primary/30'
          }`}
          title={micOn ? 'Mute mic' : 'Unmute mic'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {micOn ? (
              <>
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </>
            ) : (
              <>
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .28-.02.56-.06.83" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </>
            )}
          </svg>
        </button>

        {/* Camera toggle */}
        <button
          onClick={() => setCamOn((v) => !v)}
          className={`flex items-center justify-center w-9 h-9 rounded transition-colors ${
            camOn
              ? 'bg-bg-tertiary text-green-terminal border border-green-terminal/20'
              : 'bg-red-dark text-red-primary border border-red-primary/30'
          }`}
          title={camOn ? 'Turn off camera' : 'Turn on camera'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {camOn ? (
              <>
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </>
            ) : (
              <>
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* End Interview */}
      {!confirmEnd ? (
        <button
          onClick={() => setConfirmEnd(true)}
          className="px-4 py-1.5 rounded text-xs font-mono text-red-primary border border-red-primary/30 bg-red-dim hover:bg-red-primary/20 transition-colors"
        >
          End Interview
        </button>
      ) : (
        <div className="flex items-center gap-2 animate-fade-in">
          <span className="text-xs text-text-secondary font-mono">Sure?</span>
          <button
            onClick={() => {
              setConfirmEnd(false);
              onEndInterview();
            }}
            className="px-3 py-1.5 rounded text-xs font-mono text-white bg-red-primary hover:bg-red-600 transition-colors"
          >
            Yes, end
          </button>
          <button
            onClick={() => setConfirmEnd(false)}
            className="px-3 py-1.5 rounded text-xs font-mono text-text-secondary border border-border-primary hover:bg-bg-tertiary transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
