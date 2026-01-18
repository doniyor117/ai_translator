// Groq models for vocabulary (1-4 words)
const GROQ_MODELS = [
    'openai/gpt-oss-120b',
    'llama-3.1-70b-versatile',   // Primary - Best Accuracy
    'openai/gpt-oss-20b',
    'qwen-qwq-32b',              // Fallback 1 - Good for reasoning
    'llama-3.1-8b-instant',      // Fallback 2 - Fastest
];

// API endpoints
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Language code to flag emoji mapping
const FLAGS: Record<string, string> = {
    en: '🇬🇧', uz: '🇺🇿', ru: '🇷🇺', de: '🇩🇪', fr: '🇫🇷', es: '🇪🇸',
    it: '🇮🇹', pt: '🇵🇹', zh: '🇨🇳', ja: '🇯🇵', ko: '🇰🇷', ar: '🇸🇦',
    tr: '🇹🇷', hi: '🇮🇳', pl: '🇵🇱', nl: '🇳🇱', sv: '🇸🇪', cs: '🇨🇿',
    uk: '🇺🇦', fa: '🇮🇷', he: '🇮🇱', th: '🇹🇭', vi: '🇻🇳', id: '🇮🇩',
    kk: '🇰🇿', az: '🇦🇿', tg: '🇹🇯', ky: '🇰🇬', tk: '🇹🇲', da: '🇩🇰',
    no: '🇳🇴', fi: '🇫🇮', el: '🇬🇷', hu: '🇭🇺', ro: '🇷🇴', bg: '🇧🇬',
    hr: '🇭🇷', sk: '🇸🇰', sl: '🇸🇮', sr: '🇷🇸', bn: '🇧🇩', ta: '🇮🇳',
    ms: '🇲🇾', sw: '🇰🇪', af: '🇿🇦',
};

// Language code to full name mapping
const LANG_NAMES: Record<string, string> = {
    en: 'English', uz: 'Uzbek', ru: 'Russian', de: 'German', fr: 'French',
    es: 'Spanish', it: 'Italian', pt: 'Portuguese', zh: 'Chinese', ja: 'Japanese',
    ko: 'Korean', ar: 'Arabic', tr: 'Turkish', hi: 'Hindi', pl: 'Polish',
    nl: 'Dutch', sv: 'Swedish', cs: 'Czech', uk: 'Ukrainian', fa: 'Persian',
    he: 'Hebrew', th: 'Thai', vi: 'Vietnamese', id: 'Indonesian', kk: 'Kazakh',
    az: 'Azerbaijani', tg: 'Tajik', ky: 'Kyrgyz', tk: 'Turkmen', da: 'Danish',
    no: 'Norwegian', fi: 'Finnish', el: 'Greek', hu: 'Hungarian', ro: 'Romanian',
    bg: 'Bulgarian', hr: 'Croatian', sk: 'Slovak', sl: 'Slovenian', sr: 'Serbian',
    bn: 'Bengali', ta: 'Tamil', ms: 'Malay', sw: 'Swahili', af: 'Afrikaans',
};

export type OutputMode = 'vocabulary' | 'sentence';

export interface TranslateRequest {
    text: string;
    sourceLang: string;
    targetLang: string;
    context?: string;
}

export interface TranslateResponse {
    translation: string;
    model: string;
    mode: OutputMode;
}

/**
 * Detect if input is vocabulary (1-4 words) or sentence (5+ words)
 */
export function detectOutputMode(text: string): OutputMode {
    const trimmed = text.trim();
    const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
    return wordCount <= 4 ? 'vocabulary' : 'sentence';
}

/**
 * Get flag emoji for a language code
 */
export function getFlag(langCode: string): string {
    return FLAGS[langCode] || '🌐';
}

/**
 * Get language name from code
 */
export function getLangName(langCode: string): string {
    return LANG_NAMES[langCode] || langCode;
}

/**
 * Build the translation prompt for vocabulary (1-4 words)
 */
function buildVocabularyPrompt(
    text: string,
    sourceLang: string,
    targetLang: string,
    context: string | undefined
): string {
    const targetName = LANG_NAMES[targetLang] || targetLang;
    const targetFlag = FLAGS[targetLang] || '🌐';
    const sourceName = LANG_NAMES[sourceLang] || sourceLang;
    const isAuto = sourceLang === 'auto';

    return `You are an expert linguist translator. Translate a word/phrase to ${targetName}.

FORMAT YOUR RESPONSE EXACTLY LIKE THIS (no markdown, no ** symbols):

Detected Language: [Full Language Name] [flag emoji from this list: 🇬🇧🇺🇿🇷🇺🇩🇪🇫🇷🇪🇸🇮🇹🇵🇹🇨🇳🇯🇵🇰🇷🇸🇦🇹🇷🇮🇳🇵🇱🇳🇱🇸🇪🇨🇿🇺🇦🇮🇷🇮🇱🇹🇭🇻🇳🇮🇩🇰🇿🇦🇿🇹🇯🇰🇬🇹🇲]

[Corrected Word if typo, or Original Word] [pronunciation]

1. [visual emoji] [Translation in ${targetName}] [part of speech like noun, verb, adj., etc.]
   [One line explanation in ${targetName} about when/how to use this meaning]
   Example: [A short example sentence in detected language of the word using the original word]

2. [visual emoji] [Alternative Translation] [part of speech]
   [One line explanation in ${targetName}]
   Example: [Example sentence in in detected language of the word]

(continue numbering if more meanings exist)

📝 Note: [Any special tips, cultural notes, or grammar tips - write in ${targetName}]

IMPORTANT RULES:
${!isAuto ? `- CRITICAL: The user has EXPLICITLY set the source language to ${sourceName}. You MUST interpret the input as ${sourceName}, even if it looks like another language (e.g. 'Gift' in German = Poison, not Present).` : ''}
- Use visual emojis that represent the meaning (🏦 for bank/money, 🌊 for river bank, 👋 for hello, 📚 for book, etc.)
- Put pronunciation in [brackets] right after the word
- Write ALL explanations in ${targetName} language! EXAMPLE LANG IS IN THE LANG OF THE WORD SEARCHED
- If the input has typos like "helo" or "bitte", correct it and show the proper spelling
- Include articles if important (der/die/das for German, etc.) and note them in the note section
- Keep it clean - NO asterisks **, NO markdown formatting
- Be concise but informative

${context ? `User context: ${context}\n` : ''}
Word to translate: "${text}"
Target language: ${targetName} ${targetFlag}`;
}

/**
 * Build the translation prompt for sentences (5+ words)
 */
function buildSentencePrompt(
    text: string,
    sourceLang: string,
    targetLang: string,
    context: string | undefined
): string {
    const targetName = LANG_NAMES[targetLang] || targetLang;
    const targetFlag = FLAGS[targetLang] || '🌐';
    const sourceName = LANG_NAMES[sourceLang] || sourceLang;
    const isAuto = sourceLang === 'auto';

    return `You are an expert translator. Translate text to ${targetName}.

FORMAT YOUR RESPONSE EXACTLY LIKE THIS (no markdown, no ** symbols):

Detected Language: [Language Name] [flag emoji]

[Your accurate, natural translation in ${targetName}]

RULES:
${!isAuto ? `- CRITICAL: The user has EXPLICITLY set the source language to ${sourceName}. Treat the input as ${sourceName}, even if it looks like another language.` : ''}
- Provide ONLY the translation after the detected language line
- Use natural, native-sounding ${targetName}
- Preserve the original meaning, tone, and style
- NO explanations, NO alternatives, NO notes
- NO asterisks **, NO markdown formatting
- Just the clean translation

${context ? `Context: ${context}\n` : ''}
Text to translate: "${text}"
Target language: ${targetName} ${targetFlag}`;
}

/**
 * Custom error class for rate limiting
 */
class RateLimitError extends Error {
    constructor(model: string, status: number, message: string) {
        super(`Rate limit hit for ${model}: ${status} - ${message}`);
        this.name = 'RateLimitError';
    }
}

/**
 * Translate with Groq API (for vocabulary)
 */
async function translateWithGroq(
    model: string,
    prompt: string,
    apiKey: string
): Promise<string> {
    const response = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
            max_tokens: 2000,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 429 || response.status === 503 || response.status === 529) {
            throw new RateLimitError(model, response.status, errorText);
        }
        throw new Error(`Groq ${model} failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
}

/**
 * Translate with Gemini API (for sentences)
 */
async function translateWithGemini(
    prompt: string,
    apiKey: string
): Promise<string> {
    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 2000,
            },
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 429 || response.status === 503) {
            throw new RateLimitError('gemini-1.5-flash', response.status, errorText);
        }
        throw new Error(`Gemini failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

/**
 * Main translation function
 * - Uses Groq for vocabulary (1-4 words)
 * - Uses Gemini Flash for sentences (5+ words)
 */
export async function translate(
    request: TranslateRequest,
    groqApiKey: string,
    geminiApiKey?: string
): Promise<TranslateResponse> {
    const mode = detectOutputMode(request.text);

    // For sentences (5+ words), use Gemini Flash
    if (mode === 'sentence' && geminiApiKey) {
        const prompt = buildSentencePrompt(
            request.text,
            request.sourceLang,
            request.targetLang,
            request.context
        );

        try {
            const translation = await translateWithGemini(prompt, geminiApiKey);
            return {
                translation,
                model: 'gemini-1.5-flash',
                mode,
            };
        } catch (error) {
            // If Gemini fails, fall back to Groq
            console.warn('Gemini failed, falling back to Groq:', error);
        }
    }

    // For vocabulary (1-4 words) or Gemini fallback, use Groq
    const prompt = mode === 'vocabulary'
        ? buildVocabularyPrompt(request.text, request.sourceLang, request.targetLang, request.context)
        : buildSentencePrompt(request.text, request.sourceLang, request.targetLang, request.context);

    let lastRateLimitError: Error | null = null;

    for (const model of GROQ_MODELS) {
        try {
            const translation = await translateWithGroq(model, prompt, groqApiKey);
            return {
                translation,
                model,
                mode,
            };
        } catch (error) {
            if (error instanceof RateLimitError) {
                lastRateLimitError = error;
                console.warn(`Rate limit hit for ${model}, trying next model...`);
                continue;
            }
            throw error;
        }
    }

    throw lastRateLimitError || new Error('All models hit rate limits');
}

/**
 * Get the display name for a model
 */
export function getModelDisplayName(model: string): string {
    const names: Record<string, string> = {
        'openai/gpt-oss-120b': 'GPT-OSS 120B',
        'openai/gpt-oss-20b': 'GPT-OSS 20B',
        'llama-3.1-70b-versatile': 'Llama 3.1 70B',
        'qwen-qwq-32b': 'Qwen QwQ 32B',
        'llama-3.1-8b-instant': 'Llama 3.1 8B',
        'gemini-1.5-flash': 'Gemini Flash',
    };
    return names[model] || model;
}
