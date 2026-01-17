'use client';

import { useEffect, useState } from 'react';
import { TranslationEntry, getHistory, deleteHistoryEntry, clearHistory, formatTimestamp } from '@/lib/history';
import { getLanguageByCode } from '@/lib/languages';

interface HistorySidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (entry: TranslationEntry) => void;
    refreshTrigger?: number;
}

export function HistorySidebar({ isOpen, onClose, onSelect, refreshTrigger }: HistorySidebarProps) {
    const [history, setHistory] = useState<TranslationEntry[]>([]);

    useEffect(() => {
        setHistory(getHistory());
    }, [refreshTrigger]);

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        deleteHistoryEntry(id);
        setHistory(getHistory());
    };

    const handleClear = () => {
        if (confirm('Clear all translation history?')) {
            clearHistory();
            setHistory([]);
        }
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-[var(--background)] border-l border-[var(--border)] shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                    <h2 className="text-lg font-semibold">History</h2>
                    <div className="flex items-center gap-2">
                        {history.length > 0 && (
                            <button
                                onClick={handleClear}
                                className="text-sm text-red-500 hover:text-red-600 transition-colors"
                            >
                                Clear all
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-[var(--surface-hover)] rounded-lg transition-colors"
                            aria-label="Close history"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto h-[calc(100%-65px)]">
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)] px-4">
                            <svg className="w-12 h-12 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm">No translations yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[var(--border)]">
                            {history.map((entry) => (
                                <button
                                    key={entry.id}
                                    onClick={() => onSelect(entry)}
                                    className="w-full p-4 text-left hover:bg-[var(--surface-hover)] transition-colors group"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-1">
                                                <span>{getLanguageByCode(entry.sourceLang)?.name || entry.sourceLang}</span>
                                                <span>→</span>
                                                <span>{getLanguageByCode(entry.targetLang)?.name || entry.targetLang}</span>
                                                <span className="ml-auto">{formatTimestamp(entry.timestamp)}</span>
                                            </div>
                                            <p className="text-sm font-medium truncate mb-1">{entry.sourceText}</p>
                                            <p className="text-sm text-[var(--text-muted)] truncate">{entry.translatedText.substring(0, 80)}</p>
                                        </div>
                                        <button
                                            onClick={(e) => handleDelete(entry.id, e)}
                                            className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-[var(--surface)] rounded transition-all"
                                            aria-label="Delete entry"
                                        >
                                            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
