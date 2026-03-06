'use client';

import { useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { Language } from '@/types/interview';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface CodeEditorProps {
  code: string;
  language: Language;
  onCodeChange: (value: string) => void;
  onLanguageChange: (lang: Language) => void;
  onRun: () => void;
}

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
];

export default function CodeEditor({ code, language, onCodeChange, onLanguageChange, onRun }: CodeEditorProps) {
  const handleChange = useCallback(
    (value: string | undefined) => {
      onCodeChange(value ?? '');
    },
    [onCodeChange]
  );

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between h-9 px-3 bg-bg-secondary border-b border-border-primary flex-shrink-0">
        <div className="flex items-center gap-1">
          {LANGUAGES.map((l) => (
            <button
              key={l.value}
              onClick={() => onLanguageChange(l.value)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                language === l.value
                  ? 'bg-red-dim text-red-primary'
                  : 'text-text-dim hover:text-text-secondary'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <button
          onClick={onRun}
          className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono bg-green-dim text-green-terminal hover:bg-green-terminal/20 transition-colors"
        >
          <span>&#9654;</span> Run
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <MonacoEditor
          height="100%"
          language={language}
          value={code}
          onChange={handleChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 12 },
            lineNumbers: 'on',
            renderLineHighlight: 'line',
            cursorBlinking: 'smooth',
            smoothScrolling: true,
            contextmenu: false,
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            overviewRulerLanes: 0,
            scrollbar: {
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
            },
          }}
        />
      </div>
    </div>
  );
}
