export interface TranslationEntry {
    id: string;
    sourceText: string;
    translatedText: string;
    sourceLang: string;
    targetLang: string;
    context?: string;
    timestamp: number;
}

const HISTORY_KEY = 'translation_history';
const MAX_HISTORY = 50;

export function saveTranslation(entry: Omit<TranslationEntry, 'id' | 'timestamp'>): TranslationEntry {
    const history = getHistory();

    const newEntry: TranslationEntry = {
        ...entry,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
    };

    // Add to beginning and limit to MAX_HISTORY
    const updated = [newEntry, ...history].slice(0, MAX_HISTORY);

    if (typeof window !== 'undefined') {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    }

    return newEntry;
}

export function getHistory(): TranslationEntry[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(HISTORY_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

export function deleteHistoryEntry(id: string): void {
    const history = getHistory();
    const filtered = history.filter((entry) => entry.id !== id);

    if (typeof window !== 'undefined') {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
    }
}

export function clearHistory(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(HISTORY_KEY);
    }
}

export function formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
}
