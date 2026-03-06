export type InterviewType = 'algorithms' | 'system-design' | 'frontend' | 'backend';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type AgentState = 'idle' | 'listening' | 'speaking' | 'analyzing' | 'thinking';
export type Language = 'javascript' | 'typescript' | 'python';
export type AppScreen = 'setup' | 'interview' | 'debrief';

export interface SetupData {
  name: string;
  interviewType: InterviewType;
  difficulty: Difficulty;
  cameraReady: boolean;
  micReady: boolean;
}

export interface TranscriptEntry {
  id: string;
  speaker: 'agent' | 'candidate';
  text: string;
  timestamp: number;
}

export interface ConsoleEntry {
  id: string;
  type: 'log' | 'error' | 'warn' | 'info';
  text: string;
  timestamp: number;
}

export interface TimelineEvent {
  time: number;
  label: string;
  type: 'stress' | 'error' | 'success' | 'hint';
}

export interface DebriefData {
  overallScore: number;
  categories: {
    codeQuality: number;
    problemSolving: number;
    communication: number;
    stressManagement: number;
  };
  strengths: string[];
  improvements: string[];
  timeline: TimelineEvent[];
}

export interface InterviewCallbacks {
  onCodeChange?: (code: string, language: Language) => void;
  onConsoleOutput?: (entry: ConsoleEntry) => void;
  onFrameCapture?: (imageData: string) => void;
  onAudioStateChange?: (state: 'started' | 'stopped') => void;
  onInterviewEnd?: () => void;
}
