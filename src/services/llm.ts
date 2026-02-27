import type { Message, Source } from '../types';
import type { LLMProvider } from '../components/SettingsModal';

export interface LLMRequest {
    provider: LLMProvider;
    apiKey: string;
    model?: string;
    messages: Message[];
    sources: Source[];
}

export const generateAIResponse = async (request: LLMRequest): Promise<string> => {
    const { provider, apiKey, model, messages, sources } = request;

    if (!apiKey) {
        return `Error: No API key provided for ${provider}. Please check your settings.`;
    }

    // Prepare context from sources
    const contextString = sources.length > 0
        ? sources.map(s => `--- SOURCE: ${s.name} ---\n${s.content}`).join('\n\n')
        : "No sources provided.";

    const systemPrompt = `You are a helpful research assistant. Use the following sources to answer the user's question. 
Answer based ONLY on the provided context. If the answer is not in the sources, say you don't know based on the current sources.

SOURCES:
${contextString}

END OF SOURCES`;

    if (provider === 'gemini') {
        const modelName = model || 'gemini-1.5-flash-latest';
        try {
            // Using v1beta as it's often more permissive with newer models
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [
                            {
                                role: 'user',
                                parts: [{ text: `${systemPrompt}\n\nUSER QUESTION: ${messages[messages.length - 1].content}` }]
                            }
                        ],
                        generationConfig: {
                            temperature: 0.1,
                            maxOutputTokens: 2048,
                        }
                    })
                }
            );

            const data = await response.json();
            if (data.error) {
                return `Gemini API Error: ${data.error.message}`;
            }

            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            }
            return "Gemini Error: No response generated. Check your API key and model permissions.";
        } catch (error) {
            return `Fetch Error: ${error instanceof Error ? error.message : String(error)}`;
        }
    }

    return `[${provider}] Grounded Chat is only fully implemented for Gemini in this prototype.`;
};
