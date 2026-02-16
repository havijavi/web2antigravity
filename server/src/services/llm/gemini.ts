
import { GoogleGenerativeAI } from '@google/generative-ai';
import { LLMProvider, LLMRequest, LLMResponse } from './types';

export class GeminiProvider implements LLMProvider {
    id = 'gemini';
    name = 'Google Gemini 1.5 Pro';
    private client: GoogleGenerativeAI;
    private model = 'gemini-1.5-pro';

    constructor() {
        this.client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    }

    async generate(request: LLMRequest): Promise<LLMResponse> {
        const model = this.client.getGenerativeModel({
            model: this.model,
            systemInstruction: request.systemPrompt
        });

        const result = await model.generateContent(request.prompt);
        const response = await result.response;
        const content = response.text();

        return {
            content,
            // Gemini doesn't always return precise token usage in standard response, defaulting to 0 for now
            usage: {
                inputTokens: 0,
                outputTokens: 0
            }
        };
    }
}
