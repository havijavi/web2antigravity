
import Anthropic from '@anthropic-ai/sdk';
import { LLMProvider, LLMRequest, LLMResponse } from './types';

export class AnthropicProvider implements LLMProvider {
    id = 'anthropic';
    name = 'Anthropic Claude';
    private client: Anthropic;
    private model = 'claude-3-5-sonnet-20241022';

    constructor() {
        this.client = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY || '',
        });
    }

    async generate(request: LLMRequest): Promise<LLMResponse> {
        const message = await this.client.messages.create({
            model: this.model,
            max_tokens: request.maxTokens || 4096,
            system: request.systemPrompt,
            messages: [{ role: 'user', content: request.prompt }],
        });

        const content = message.content[0].type === 'text' ? message.content[0].text : '';

        return {
            content,
            usage: {
                inputTokens: message.usage.input_tokens,
                outputTokens: message.usage.output_tokens
            }
        };
    }
}
