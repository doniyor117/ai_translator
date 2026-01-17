'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { LanguageSelector } from './LanguageSelector';
import { saveTranslation, TranslationEntry } from '@/lib/history';

const MAX_CHARS = 5000;

interface TranslatorPanelProps {
    onTranslationComplete?: () => void;
    restoredEntry?: TranslationEntry | null;
}

export function TranslatorPanel({ onTranslationComplete, restoredEntry }: TranslatorPanelProps) {
    const [sourceText, setSourceText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [sourceLang, setSourceLang] = useState('auto');
    const [targetLang, setTargetLang] = useState('uz');
    const [context, setContext] = useState('');
    const [showContext, setShowContext] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [modelUsed, setModelUsed] = useState('');
    const [outputMode, setOutputMode] = useState<'vocabulary' | 'sentence'>('sentence');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Restore entry from history
    useEffect(() => {
        if (restoredEntry) {
            setSourceText(restoredEntry.sourceText);
            setTranslatedText(restoredEntry.translatedText);
            setSourceLang(restoredEntry.sourceLang);
            setTargetLang(restoredEntry.targetLang);
            setContext(restoredEntry.context || '');
            setShowContext(!!restoredEntry.context);
            setError('');
            setModelUsed('From History');
            // Detect output mode from word count
            const wordCount = restoredEntry.sourceText.trim().split(/\s+/).filter(Boolean).length;
            setOutputMode(wordCount <= 4 ? 'vocabulary' : 'sentence');
        }
    }, [restoredEntry]);

    const charCount = sourceText.length;
    const isOverLimit = charCount > MAX_CHARS;

    const handleTranslate = useCallback(async () => {
        if (!sourceText.trim() || isOverLimit || isLoading) return;

        setIsLoading(true);
        setError('');
        setTranslatedText('');
        setModelUsed('');

        try {
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: sourceText,
                    sourceLang,
                    targetLang,
                    context: context.trim() || undefined,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Translation failed');
            }

            setTranslatedText(data.translation);
            setModelUsed(data.model);
            setOutputMode(data.mode);

            // Save to history
            saveTranslation({
                sourceText: sourceText.trim(),
                translatedText: data.translation,
                sourceLang,
                targetLang,
                context: context.trim() || undefined,
            });

            onTranslationComplete?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Translation failed');
        } finally {
            setIsLoading(false);
        }
    }, [sourceText, sourceLang, targetLang, context, isOverLimit, isLoading, onTranslationComplete]);

    const handleSwapLanguages = () => {
        if (sourceLang === 'auto') return;
        const temp = sourceLang;
        setSourceLang(targetLang);
        setTargetLang(temp);
        setSourceText(translatedText);
        setTranslatedText(sourceText);
    };

    const handleCopy = async () => {
        if (!translatedText) return;
        try {
            await navigator.clipboard.writeText(translatedText);
        } catch {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = translatedText;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
    };

    const handleClear = () => {
        setSourceText('');
        setTranslatedText('');
        setError('');
        setModelUsed('');
        textareaRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handleTranslate();
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Language Selectors */}
            <div className="flex items-end gap-2 md:gap-4 mb-4">
                <div className="flex-1 min-w-0">
                    <LanguageSelector
                        value={sourceLang}
                        onChange={setSourceLang}
                        label="From"
                    />
                </div>

                <button
                    onClick={handleSwapLanguages}
                    disabled={sourceLang === 'auto'}
                    className={`p-2.5 rounded-lg border border-[var(--border)] transition-all mb-0.5 ${sourceLang === 'auto'
                        ? 'opacity-40 cursor-not-allowed'
                        : 'hover:bg-[var(--surface-hover)] hover:border-[var(--primary)]'
                        }`}
                    title="Swap languages"
                    aria-label="Swap languages"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                </button>

                <div className="flex-1 min-w-0">
                    <LanguageSelector
                        value={targetLang}
                        onChange={setTargetLang}
                        excludeAuto
                        label="To"
                    />
                </div>
            </div>

            {/* Translation Panels */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
                {/* Source Panel */}
                <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden min-h-[200px] lg:min-h-0">
                    <div className="flex-1 relative">
                        <textarea
                            ref={textareaRef}
                            value={sourceText}
                            onChange={(e) => setSourceText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter text to translate..."
                            className="w-full h-full p-4 pb-12 bg-transparent resize-none focus:outline-none text-lg"
                            autoFocus
                        />
                        {sourceText && (
                            <button
                                onClick={handleClear}
                                className="absolute top-3 right-3 p-1.5 hover:bg-[var(--surface-hover)] rounded-lg transition-colors text-[var(--text-muted)]"
                                aria-label="Clear text"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--border)] bg-[var(--background)]/50">
                        <div className="flex items-center gap-3">
                            <span className={`text-sm ${isOverLimit ? 'text-red-500 font-medium' : 'text-[var(--text-muted)]'}`}>
                                {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
                            </span>
                            <button
                                onClick={() => setShowContext(!showContext)}
                                className={`text-sm flex items-center gap-1 transition-colors ${showContext || context ? 'text-[var(--primary)]' : 'text-[var(--text-muted)] hover:text-[var(--foreground)]'
                                    }`}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Context
                            </button>
                        </div>

                        <button
                            onClick={handleTranslate}
                            disabled={!sourceText.trim() || isOverLimit || isLoading}
                            className={`px-5 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${!sourceText.trim() || isOverLimit || isLoading
                                ? 'bg-[var(--surface)] text-[var(--text-muted)] cursor-not-allowed'
                                : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-lg shadow-blue-500/25'
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Translating...
                                </>
                            ) : (
                                <>
                                    Translate
                                    <span className="text-xs opacity-70">⌘↵</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Context Input */}
                    {showContext && (
                        <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--background)]/50">
                            <input
                                type="text"
                                value={context}
                                onChange={(e) => setContext(e.target.value)}
                                placeholder="Add context (e.g., 'formal email', 'technical documentation')"
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm focus:ring-2 focus:ring-[var(--primary)]"
                            />
                        </div>
                    )}
                </div>

                {/* Target Panel */}
                <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden min-h-[200px] lg:min-h-0">
                    <div className="flex-1 relative p-4 overflow-y-auto">
                        {error ? (
                            <div className="flex items-start gap-3 text-red-500">
                                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        ) : isLoading ? (
                            <div className="space-y-3 animate-pulse-slow">
                                <div className="h-4 bg-[var(--border)] rounded w-3/4" />
                                <div className="h-4 bg-[var(--border)] rounded w-1/2" />
                                <div className="h-4 bg-[var(--border)] rounded w-5/6" />
                            </div>
                        ) : translatedText ? (
                            <div className="translation-output text-lg whitespace-pre-wrap">
                                {translatedText}
                            </div>
                        ) : (
                            <p className="text-[var(--text-muted)]">Translation will appear here...</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--border)] bg-[var(--background)]/50">
                        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                            {modelUsed && (
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-green-500" />
                                    {modelUsed}
                                </span>
                            )}
                            {outputMode && translatedText && (
                                <span className="px-2 py-0.5 rounded bg-[var(--surface)] text-xs">
                                    {outputMode === 'vocabulary' ? 'Multi-meaning' : 'Direct'}
                                </span>
                            )}
                        </div>

                        {translatedText && (
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] rounded-lg transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Copy
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
