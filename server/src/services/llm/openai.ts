
import OpenAI from 'openai';
import { LLMProvider, LLMRequest, LLMResponse } from './types';

export class OpenAIProvider implements LLMProvider {
    id = 'openai';
    name = 'OpenAI GPT-4o';
    private client: OpenAI;
    private model = 'gpt-4o';

    constructor() {
        this.client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY || '',
        });
    }

    async generate(request: LLMRequest): Promise<LLMResponse> {
        const completion = await this.client.chat.completions.create({
            model: this.model,
            messages: [
                { role: 'system', content: request.systemPrompt || '' },
                { role: 'user', content: request.prompt }
            ],
            max_tokens: request.maxTokens || 4096,
            temperature: request.temperature,
        });

        const content = completion.choices[0]?.message?.content || '';

        return {
            content,
            usage: {
                inputTokens: completion.usage?.prompt_tokens || 0,
                outputTokens: completion.usage?.completion_tokens || 0
            }
        };
    }
}
