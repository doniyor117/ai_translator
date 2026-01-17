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

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function HistorySidebar({ isOpen, onClose, onSelect, refreshTrigger }: HistorySidebarProps) {
    const [history, setHistory] = useState<TranslationEntry[]>([]);
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        setHistory(getHistory());
    }, [refreshTrigger]);

    // Listen for PWA install prompt
    useEffect(() => {
        const handleBeforeInstall = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setDeferredPrompt(null);
        };

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstall);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setIsInstalled(true);
        }
        setDeferredPrompt(null);
    };

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
                className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-[var(--background)] border-l border-[var(--border)] shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
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

                <div className="flex-1 overflow-y-auto">
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

                {/* PWA Install Button - at bottom */}
                {!isInstalled && (
                    <div className="p-4 border-t border-[var(--border)]">
                        <button
                            onClick={handleInstall}
                            disabled={!deferredPrompt}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${deferredPrompt
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg'
                                : 'bg-[var(--surface)] text-[var(--text-muted)] cursor-not-allowed'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            {deferredPrompt ? 'Install App' : 'Open in browser to install'}
                        </button>
                        <p className="text-xs text-center text-[var(--text-muted)] mt-2">
                            Install LumenAI on your device
                        </p>
                    </div>
                )}

                {isInstalled && (
                    <div className="p-4 border-t border-[var(--border)]">
                        <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-500/10 text-green-600">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="font-medium">App Installed</span>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
