'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  AppScreen,
  SetupData,
  AgentState,
  Language,
  TranscriptEntry,
  ConsoleEntry,
  DebriefData,
  TimelineEvent,
} from '@/types/interview';

const MOCK_AGENT_MESSAGES = [
  "Alright, let's see what you've got. The problem is on screen. You have 45 minutes. Don't waste my time.",
  "Interesting approach... but have you considered the edge cases?",
  "Your time complexity is concerning. Can you do better?",
  "I see you hesitating. Talk me through your thought process.",
  "That's a runtime error waiting to happen. Fix it.",
  "Not bad. But I've seen better. Let's move on to the next part.",
  "You seem stressed. Take a breath, then explain your solution.",
  "Why did you choose that data structure? Convince me.",
];

const MOCK_DEBRIEF: DebriefData = {
  overallScore: 72,
  categories: {
    codeQuality: 78,
    problemSolving: 65,
    communication: 80,
    stressManagement: 60,
  },
  strengths: [
    'Clear verbal communication when explaining approach',
    'Good instinct for choosing appropriate data structures',
    'Maintained composure during follow-up questions',
  ],
  improvements: [
    'Consider edge cases before diving into implementation',
    'Time complexity analysis needs more rigor',
    'Practice handling pressure — visible stress when challenged',
    'Test your code mentally before running it',
  ],
  timeline: [
    { time: 30, label: 'Started coding', type: 'success' },
    { time: 120, label: 'First runtime error', type: 'error' },
    { time: 180, label: 'Stress detected — long pause', type: 'stress' },
    { time: 240, label: 'Hint provided by agent', type: 'hint' },
    { time: 360, label: 'Working solution submitted', type: 'success' },
    { time: 420, label: 'Struggled with optimization question', type: 'stress' },
    { time: 540, label: 'Code refactored successfully', type: 'success' },
  ],
};

export function useInterview() {
  const [screen, setScreen] = useState<AppScreen>('setup');
  const [agentState, setAgentState] = useState<AgentState>('idle');
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [language, setLanguage] = useState<Language>('javascript');
  const [code, setCode] = useState('// Start coding here...\n');
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [debriefData, setDebriefData] = useState<DebriefData | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mockIndexRef = useRef(0);
  const mockIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const addTranscriptEntry = useCallback((speaker: 'agent' | 'candidate', text: string) => {
    setTranscript((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, speaker, text, timestamp: Date.now() },
    ]);
  }, []);

  const addConsoleEntry = useCallback((type: ConsoleEntry['type'], text: string) => {
    setConsoleEntries((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, type, text, timestamp: Date.now() },
    ]);
  }, []);

  const simulateAgentBehavior = useCallback(() => {
    const states: AgentState[] = ['listening', 'analyzing', 'thinking', 'speaking'];
    let stateIndex = 0;

    mockIntervalRef.current = setInterval(() => {
      const newState = states[stateIndex % states.length];
      setAgentState(newState);

      if (newState === 'speaking') {
        const msg = MOCK_AGENT_MESSAGES[mockIndexRef.current % MOCK_AGENT_MESSAGES.length];
        addTranscriptEntry('agent', msg);
        mockIndexRef.current++;
      }

      stateIndex++;
    }, 4000);
  }, [addTranscriptEntry]);

  const startInterview = useCallback(
    (data: SetupData) => {
      setSetupData(data);
      setScreen('interview');
      setElapsedSeconds(0);
      setTranscript([]);
      setConsoleEntries([]);

      timerRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);

      // Initial agent greeting
      setTimeout(() => {
        setAgentState('speaking');
        addTranscriptEntry(
          'agent',
          `Welcome, ${data.name}. I'm your interviewer today. This is a ${data.difficulty} ${data.interviewType.replace('-', ' ')} interview. Let's begin.`
        );
        setTimeout(() => {
          simulateAgentBehavior();
        }, 3000);
      }, 1500);

      // Mock initial console
      setTimeout(() => {
        addConsoleEntry('info', '> Session initialized');
        addConsoleEntry('info', `> Language: ${data.interviewType}`);
        addConsoleEntry('info', '> Ready.');
      }, 500);
    },
    [addTranscriptEntry, addConsoleEntry, simulateAgentBehavior]
  );

  const endInterview = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mockIntervalRef.current) clearInterval(mockIntervalRef.current);
    setAgentState('idle');
    setDebriefData(MOCK_DEBRIEF);
    setScreen('debrief');
  }, []);

  const restartInterview = useCallback(() => {
    setScreen('setup');
    setSetupData(null);
    setDebriefData(null);
    setTranscript([]);
    setConsoleEntries([]);
    setElapsedSeconds(0);
    setCode('// Start coding here...\n');
    setAgentState('idle');
    mockIndexRef.current = 0;
  }, []);

  const handleCodeChange = useCallback((value: string) => {
    setCode(value);
  }, []);

  const handleRunCode = useCallback(() => {
    addConsoleEntry('info', '> Running...');
    // Mock code execution
    setTimeout(() => {
      if (code.includes('console.log')) {
        addConsoleEntry('log', 'Hello, World!');
      }
      if (code.includes('error') || code.includes('undefined')) {
        addConsoleEntry('error', 'TypeError: Cannot read properties of undefined');
      }
      addConsoleEntry('info', '> Execution complete.');
    }, 800);
  }, [code, addConsoleEntry]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mockIntervalRef.current) clearInterval(mockIntervalRef.current);
    };
  }, []);

  return {
    screen,
    agentState,
    transcript,
    consoleEntries,
    elapsedSeconds,
    language,
    setLanguage,
    code,
    setupData,
    debriefData,
    startInterview,
    endInterview,
    restartInterview,
    handleCodeChange,
    handleRunCode,
    addTranscriptEntry,
    addConsoleEntry,
  };
}
