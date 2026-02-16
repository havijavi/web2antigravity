
import { LLMProvider, LLMRequest } from './llm/types';
import { AnthropicProvider } from './llm/anthropic';
import { OpenAIProvider } from './llm/openai';
import { GeminiProvider } from './llm/gemini';
import { PerplexityProvider } from './llm/perplexity';

export class AIService {
    private static instance: AIService;
    private providers: Record<string, LLMProvider> = {};
    private defaultProvider = 'anthropic';

    private constructor() {
        this.registerProvider(new AnthropicProvider());
        this.registerProvider(new OpenAIProvider());
        this.registerProvider(new GeminiProvider());
        this.registerProvider(new PerplexityProvider());
    }

    public static getInstance(): AIService {
        if (!AIService.instance) {
            AIService.instance = new AIService();
        }
        return AIService.instance;
    }

    private registerProvider(provider: LLMProvider) {
        this.providers[provider.id] = provider;
    }

    public async generateContent(prompt: string, context?: any, options?: { provider?: string, model?: string }): Promise<string> {
        try {
            const providerId = options?.provider || this.defaultProvider;
            const provider = this.providers[providerId];

            if (!provider) {
                throw new Error(`Provider ${providerId} not found`);
            }

            const systemPrompt = `You are an expert content creator for ORM (Online Reputation Management).
      Context: ${JSON.stringify(context || {})}
      Generate content based on the user prompt. ensure it aligns with the brand voice if provided.`;

            const response = await provider.generate({
                prompt,
                systemPrompt,
                maxTokens: 4096,
                temperature: 0.7
            });

            return response.content;
        } catch (error) {
            console.error("AI Generation Error:", error);
            throw new Error(`Failed to generate content: ${String(error)}`);
        }
    }

    public async interpretTask(prompt: string): Promise<any> {
        // Default to Anthropic for complex task interpretation for now
        const response = await this.generateContent(`Interpret this task and output JSON only: ${prompt}`);
        try {
            // Basic cleanup for JSON parsing if model returns markdown ticks
            const cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanResponse);
        } catch (e) {
            return { action: "unknown", raw: response };
        }
    }

    public getAvailableProviders() {
        return Object.values(this.providers).map(p => ({ id: p.id, name: p.name }));
    }
}
