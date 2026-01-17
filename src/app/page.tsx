'use client';

import { useState, useCallback } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { TranslatorPanel } from '@/components/TranslatorPanel';
import { HistorySidebar } from '@/components/HistorySidebar';
import { TranslationEntry } from '@/lib/history';

export default function Home() {
    const [historyOpen, setHistoryOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [restoredEntry, setRestoredEntry] = useState<TranslationEntry | null>(null);

    const handleTranslationComplete = useCallback(() => {
        setRefreshTrigger((prev) => prev + 1);
    }, []);

    const handleSelectHistory = useCallback((entry: TranslationEntry) => {
        setRestoredEntry(entry);
        setHistoryOpen(false);
    }, []);

    return (
        <main className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                            LumenAI
                        </h1>
                        <p className="text-xs text-[var(--text-muted)] hidden sm:block">
                            Smart translations with context
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                    <ThemeToggle />

                    <button
                        onClick={() => setHistoryOpen(true)}
                        className="p-2.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors relative"
                        aria-label="View history"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
                <TranslatorPanel
                    onTranslationComplete={handleTranslationComplete}
                    restoredEntry={restoredEntry}
                />
            </div>

            {/* History Sidebar */}
            <HistorySidebar
                isOpen={historyOpen}
                onClose={() => setHistoryOpen(false)}
                onSelect={handleSelectHistory}
                refreshTrigger={refreshTrigger}
            />

            {/* Footer */}
            <footer className="px-4 py-3 border-t border-[var(--border)] text-center text-sm text-[var(--text-muted)]">
                <p>
                    Powered by: GPT-OSS 120B • Llama 3.1 70B • Gemini 1.5 Flash
                </p>
            </footer>
        </main>
    );
}
