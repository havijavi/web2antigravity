
import OpenAI from 'openai'; // Perplexity uses OpenAI-compatible API
import { LLMProvider, LLMRequest, LLMResponse } from './types';

export class PerplexityProvider implements LLMProvider {
    id = 'perplexity';
    name = 'Perplexity Sonar Pro';
    private client: OpenAI;
    private model = 'sonar-pro'; // or 'sonar' / 'llama-3.1-sonar-large-128k-online' - defaulting to user request name

    constructor() {
        this.client = new OpenAI({
            apiKey: process.env.PERPLEXITY_API_KEY || '',
            baseURL: 'https://api.perplexity.ai'
        });
    }

    async generate(request: LLMRequest): Promise<LLMResponse> {
        const completion = await this.client.chat.completions.create({
            model: this.model,
            messages: [
                { role: 'system', content: request.systemPrompt || '' },
                { role: 'user', content: request.prompt }
            ],
            max_tokens: request.maxTokens, // Perplexity might have specific limits
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
