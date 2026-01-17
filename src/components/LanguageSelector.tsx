'use client';

import { useState, useRef, useEffect } from 'react';
import { languages, searchLanguages, Language } from '@/lib/languages';

interface LanguageSelectorProps {
    value: string;
    onChange: (code: string) => void;
    excludeAuto?: boolean;
    label: string;
}

export function LanguageSelector({ value, onChange, excludeAuto, label }: LanguageSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const availableLangs = excludeAuto
        ? languages.filter((l) => l.code !== 'auto')
        : languages;

    const filteredLangs = search ? searchLanguages(search).filter((l) => !excludeAuto || l.code !== 'auto') : availableLangs;
    const selectedLang = languages.find((l) => l.code === value);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearch('');
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSelect = (lang: Language) => {
        onChange(lang.code);
        setIsOpen(false);
        setSearch('');
    };

    return (
        <div className="relative" ref={containerRef}>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                {label}
            </label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors text-left"
            >
                <span className="flex items-center gap-2">
                    <span className="font-medium">{selectedLang?.name || 'Select'}</span>
                    {selectedLang && selectedLang.code !== 'auto' && (
                        <span className="text-sm text-[var(--text-muted)]">
                            ({selectedLang.nativeName})
                        </span>
                    )}
                </span>
                <svg
                    className={`w-5 h-5 text-[var(--text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''
                        }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-xl max-h-72 overflow-hidden">
                    <div className="p-2 border-b border-[var(--border)]">
                        <input
                            ref={inputRef}
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search languages..."
                            className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--surface)] text-sm focus:ring-2 focus:ring-[var(--primary)]"
                        />
                    </div>
                    <div className="overflow-y-auto max-h-52">
                        {filteredLangs.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleSelect(lang)}
                                className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-[var(--surface-hover)] transition-colors text-left ${lang.code === value ? 'bg-[var(--surface)]' : ''
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    <span className="font-medium">{lang.name}</span>
                                    {lang.code !== 'auto' && (
                                        <span className="text-sm text-[var(--text-muted)]">
                                            ({lang.nativeName})
                                        </span>
                                    )}
                                </span>
                                {lang.code === value && (
                                    <svg className="w-5 h-5 text-[var(--primary)]" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                            </button>
                        ))}
                        {filteredLangs.length === 0 && (
                            <div className="px-4 py-3 text-sm text-[var(--text-muted)]">
                                No languages found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
