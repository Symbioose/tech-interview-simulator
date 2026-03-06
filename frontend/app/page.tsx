'use client';

import { useInterview } from '@/hooks/useInterview';
import SetupScreen from '@/components/setup/SetupScreen';
import InterviewSession from '@/components/interview/InterviewSession';
import DebriefScreen from '@/components/debrief/DebriefScreen';

export default function Home() {
  const {
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
  } = useInterview();

  return (
    <>
      {/* CRT effects overlay */}
      <div className="scanlines" />
      <div className="grain" />

      {screen === 'setup' && <SetupScreen onStart={startInterview} />}

      {screen === 'interview' && setupData && (
        <InterviewSession
          code={code}
          language={language}
          agentState={agentState}
          transcript={transcript}
          consoleEntries={consoleEntries}
          elapsedSeconds={elapsedSeconds}
          difficulty={setupData.difficulty}
          interviewType={setupData.interviewType}
          onCodeChange={handleCodeChange}
          onLanguageChange={setLanguage}
          onRunCode={handleRunCode}
          onEndInterview={endInterview}
        />
      )}

      {screen === 'debrief' && debriefData && setupData && (
        <DebriefScreen
          data={debriefData}
          candidateName={setupData.name}
          onRestart={restartInterview}
        />
      )}
    </>
  );
}
