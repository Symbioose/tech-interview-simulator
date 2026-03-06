'use client';

import type { AgentState, TranscriptEntry } from '@/types/interview';
import AgentAvatar from './AgentAvatar';
import WebcamFeed from './WebcamFeed';
import Transcript from './Transcript';
import Controls from './Controls';

interface InterviewerPanelProps {
  agentState: AgentState;
  transcript: TranscriptEntry[];
  onEndInterview: () => void;
  onFrameCapture?: (imageData: string) => void;
}

export default function InterviewerPanel({
  agentState,
  transcript,
  onEndInterview,
  onFrameCapture,
}: InterviewerPanelProps) {
  return (
    <div className="flex flex-col h-full bg-bg-primary">
      {/* Webcam */}
      <div className="px-3 pt-3 flex-shrink-0">
        <WebcamFeed onFrameCapture={onFrameCapture} />
      </div>

      {/* Agent Avatar */}
      <div className="flex-shrink-0 flex items-center justify-center py-4 border-b border-border-primary">
        <AgentAvatar state={agentState} />
      </div>

      {/* Transcript */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <Transcript entries={transcript} />
      </div>

      {/* Controls */}
      <Controls onEndInterview={onEndInterview} />
    </div>
  );
}
