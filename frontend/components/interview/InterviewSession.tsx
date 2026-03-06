'use client';

import type { AgentState, Language, TranscriptEntry, ConsoleEntry, Difficulty } from '@/types/interview';
import HeaderBar from './HeaderBar';
import CodeEditor from './CodeEditor';
import ConsolePanel from './ConsolePanel';
import InterviewerPanel from './InterviewerPanel';

interface InterviewSessionProps {
  code: string;
  language: Language;
  agentState: AgentState;
  transcript: TranscriptEntry[];
  consoleEntries: ConsoleEntry[];
  elapsedSeconds: number;
  difficulty: Difficulty;
  interviewType: string;
  onCodeChange: (value: string) => void;
  onLanguageChange: (lang: Language) => void;
  onRunCode: () => void;
  onEndInterview: () => void;
  onFrameCapture?: (imageData: string) => void;
}

export default function InterviewSession({
  code,
  language,
  agentState,
  transcript,
  consoleEntries,
  elapsedSeconds,
  difficulty,
  interviewType,
  onCodeChange,
  onLanguageChange,
  onRunCode,
  onEndInterview,
  onFrameCapture,
}: InterviewSessionProps) {
  return (
    <div className="flex flex-col h-screen w-screen bg-bg-primary overflow-hidden">
      <HeaderBar
        elapsedSeconds={elapsedSeconds}
        agentState={agentState}
        difficulty={difficulty}
        interviewType={interviewType}
      />

      <div className="flex flex-1 min-h-0">
        {/* Left: IDE */}
        <div className="flex flex-col w-[60%] border-r border-border-primary">
          {/* Code Editor */}
          <div className="flex-[3] min-h-0">
            <CodeEditor
              code={code}
              language={language}
              onCodeChange={onCodeChange}
              onLanguageChange={onLanguageChange}
              onRun={onRunCode}
            />
          </div>
          {/* Console */}
          <div className="flex-[1] min-h-0 max-h-[200px]">
            <ConsolePanel entries={consoleEntries} />
          </div>
        </div>

        {/* Right: Interviewer */}
        <div className="w-[40%]">
          <InterviewerPanel
            agentState={agentState}
            transcript={transcript}
            onEndInterview={onEndInterview}
            onFrameCapture={onFrameCapture}
          />
        </div>
      </div>
    </div>
  );
}
