export interface Language {
    code: string;
    name: string;
    nativeName: string;
}

export const languages: Language[] = [
    { code: 'auto', name: 'Auto Detect', nativeName: 'Auto' },
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'uz', name: 'Uzbek', nativeName: "O'zbek" },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
    { code: 'pl', name: 'Polish', nativeName: 'Polski' },
    { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
    { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
    { code: 'da', name: 'Danish', nativeName: 'Dansk' },
    { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
    { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
    { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
    { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
    { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
    { code: 'th', name: 'Thai', nativeName: 'ไทย' },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
    { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
    { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
    { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
    { code: 'ro', name: 'Romanian', nativeName: 'Română' },
    { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
    { code: 'bg', name: 'Bulgarian', nativeName: 'Български' },
    { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski' },
    { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina' },
    { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina' },
    { code: 'sr', name: 'Serbian', nativeName: 'Српски' },
    { code: 'fa', name: 'Persian', nativeName: 'فارسی' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
    { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
    { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ' },
    { code: 'kk', name: 'Kazakh', nativeName: 'Қазақша' },
    { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan' },
    { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча' },
    { code: 'tk', name: 'Turkmen', nativeName: 'Türkmençe' },
];

export function getLanguageByCode(code: string): Language | undefined {
    return languages.find((lang) => lang.code === code);
}

export function searchLanguages(query: string): Language[] {
    const lowerQuery = query.toLowerCase();
    return languages.filter(
        (lang) =>
            lang.name.toLowerCase().includes(lowerQuery) ||
            lang.nativeName.toLowerCase().includes(lowerQuery) ||
            lang.code.toLowerCase().includes(lowerQuery)
    );
}
