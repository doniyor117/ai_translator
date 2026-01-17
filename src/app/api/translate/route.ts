import { NextRequest, NextResponse } from 'next/server';
import { translate, getModelDisplayName } from '@/lib/translate-service';

const MAX_CHARS = 5000;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { text, sourceLang, targetLang, context } = body;

        // Validation
        if (!text || typeof text !== 'string') {
            return NextResponse.json(
                { error: 'Text is required' },
                { status: 400 }
            );
        }

        if (text.length > MAX_CHARS) {
            return NextResponse.json(
                { error: `Text exceeds maximum length of ${MAX_CHARS} characters` },
                { status: 400 }
            );
        }

        if (!targetLang) {
            return NextResponse.json(
                { error: 'Target language is required' },
                { status: 400 }
            );
        }

        // Get API keys
        const groqApiKey = process.env.GROQ_API_KEY;
        const geminiApiKey = process.env.GEMINI_API_KEY;

        if (!groqApiKey) {
            return NextResponse.json(
                { error: 'GROQ_API_KEY not configured in .env.local' },
                { status: 500 }
            );
        }

        const result = await translate(
            {
                text: text.trim(),
                sourceLang: sourceLang || 'auto',
                targetLang,
                context,
            },
            groqApiKey,
            geminiApiKey // Optional: used for sentences (5+ words)
        );

        return NextResponse.json({
            translation: result.translation,
            model: getModelDisplayName(result.model),
            mode: result.mode,
        });
    } catch (error) {
        console.error('Translation error:', error);
        return NextResponse.json(
            { error: 'Translation failed. Please try again.' },
            { status: 500 }
        );
    }
}
