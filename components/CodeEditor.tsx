'use client';
import { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Editor } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { motion } from 'framer-motion';
import { Play, Copy, Download, Eye, EyeOff } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  className?: string;
  readOnly?: boolean;
  theme?: 'dark' | 'light';
  showControls?: boolean;
  onRun?: () => void;
  isRunning?: boolean;
  showLineNumbers?: boolean;
  fontSize?: number;
  cursorPosition?: { line: number; ch: number };
  onCursorChange?: (position: { line: number; ch: number }) => void;
  revealPercentage?: number; // For spectator peek mode (0-100)
  spectatorMode?: boolean;
  placeholder?: string;
  height?: string;
}

export interface CodeEditorRef {
  getEditor: () => editor.IStandaloneCodeEditor | null;
  focus: () => void;
}

export const CodeEditor = forwardRef<CodeEditorRef, CodeEditorProps>(({ 
  value, 
  onChange, 
  language, 
  className = '',
  readOnly = false,
  showControls = true,
  onRun,
  isRunning = false,
  showLineNumbers = true,
  fontSize = 14,
  onCursorChange,
  revealPercentage = 100,
  spectatorMode = false,
  height = '100%'
}, ref) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [copied, setCopied] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  // Expose ref methods
  useImperativeHandle(ref, () => ({
    getEditor: () => editorRef.current,
    focus: () => editorRef.current?.focus()
  }), []);

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    
    // Add cursor position tracking
    if (onCursorChange) {
      editor.onDidChangeCursorPosition((e: editor.ICursorPositionChangedEvent) => {
        onCursorChange({
          line: e.position.lineNumber,
          ch: e.position.column
        });
      });
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (!readOnly && !spectatorMode) {
      onChange(value || '');
    }
  };

  // Map our language names to Monaco language IDs
  const getMonacoLanguage = (lang: string) => {
    switch (lang) {
      case 'javascript':
        return 'javascript';
      case 'python':
        return 'python';
      case 'java':
        return 'java';
      case 'cpp':
        return 'cpp';
      default:
        return 'javascript';
    }
  };

  const getLanguageColor = () => {
    switch (language) {
      case 'python':
        return '#44FF88'; // Neon green
      case 'cpp':
        return '#00AAFF'; // Neon blue
      case 'javascript':
        return '#FFD700'; // Gold
      case 'java':
        return '#FF6B35'; // Orange
      default:
        return '#AA00FF'; // Neon purple
    }
  };

  const processValueForSpectator = (text: string) => {
    if (!spectatorMode || revealPercentage >= 100 || isRevealed) return text;
    
    const lines = text.split('\n');
    const revealLines = Math.ceil((lines.length * revealPercentage) / 100);
    const hiddenLines = lines.length - revealLines;
    
    return [
      ...lines.slice(0, revealLines),
      ...Array(hiddenLines).fill('// 🔒 Hidden code... Use power-ups to reveal!'),
    ].join('\n');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const extension = language === 'cpp' ? 'cpp' : 
                    language === 'java' ? 'java' : 
                    language === 'python' ? 'py' : 'js';
    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const displayValue = processValueForSpectator(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-gray-900 border border-gray-800 rounded-lg overflow-hidden ${className}`}
      style={{
        boxShadow: `0 0 20px ${getLanguageColor()}20`,
        borderColor: `${getLanguageColor()}40`
      }}
    >
      {/* Header */}
      {showControls && (
        <div 
          className="flex items-center justify-between px-4 py-2 border-b border-gray-800"
          style={{ backgroundColor: `${getLanguageColor()}10` }}
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: getLanguageColor() }}
            />
            <span 
              className="text-sm font-mono font-medium"
              style={{ color: getLanguageColor() }}
            >
              {language.toUpperCase()}
              {spectatorMode && revealPercentage < 100 && !isRevealed && (
                <span className="ml-2 text-xs opacity-70">
                  ({revealPercentage}% visible)
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {spectatorMode && revealPercentage < 100 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsRevealed(!isRevealed)}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
              >
                {isRevealed ? <EyeOff size={12} /> : <Eye size={12} />}
                {isRevealed ? 'Hide' : 'Reveal'}
              </motion.button>
            )}
            
            {onRun && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRun}
                disabled={isRunning || readOnly}
                className="flex items-center gap-1 px-3 py-1 text-xs bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-md transition-colors"
              >
                <Play size={12} className={isRunning ? 'animate-spin' : ''} />
                {isRunning ? 'Running...' : 'Run'}
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              title="Copy code"
            >
              <Copy size={14} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              title="Download code"
            >
              <Download size={14} />
            </motion.button>
          </div>
        </div>
      )}

      {/* Copy feedback */}
      {copied && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-12 right-4 bg-green-600 text-white px-2 py-1 rounded text-xs z-10"
        >
          Copied!
        </motion.div>
      )}

      {/* Editor */}
      <div className={`${height === '100%' ? 'h-full' : `h-[${height}]`}`}>
        <Editor
          height={height}
          language={getMonacoLanguage(language)}
          value={displayValue}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            fontSize: fontSize,
            fontFamily: 'JetBrains Mono, var(--font-geist-mono), Monaco, Consolas, "Courier New", monospace',
            lineNumbers: showLineNumbers ? 'on' : 'off',
            readOnly: readOnly || (spectatorMode && !isRevealed && revealPercentage < 100),
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            mouseWheelZoom: true,
            glyphMargin: false,
            folding: true,
            renderWhitespace: 'boundary',
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true
            }
          }}
        />
      </div>

      {/* Spectator overlay */}
      {spectatorMode && revealPercentage < 100 && !isRevealed && (
        <div className="absolute inset-0 bg-black bg-opacity-20 pointer-events-none">
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-80 text-white px-3 py-1 rounded-md text-sm">
            🔒 Limited View ({revealPercentage}%)
          </div>
        </div>
      )}

      {/* Line count indicator */}
      {showLineNumbers && value && (
        <div className="absolute top-2 left-2 text-xs text-gray-500 bg-black bg-opacity-50 px-2 py-1 rounded">
          {value.split('\n').length} lines
        </div>
      )}

      {/* Real-time typing indicator */}
      {!readOnly && !spectatorMode && (
        <div className="absolute bottom-2 left-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live
          </div>
        </div>
      )}
    </motion.div>
  );
});

CodeEditor.displayName = 'CodeEditor';
