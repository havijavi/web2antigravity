
export interface LLMRequest {
    prompt: string;
    systemPrompt?: string;
    maxTokens?: number;
    temperature?: number;
}

export interface LLMResponse {
    content: string;
    usage?: {
        inputTokens: number;
        outputTokens: number;
    };
}

export interface LLMProvider {
    id: string;
    name: string;
    generate(request: LLMRequest): Promise<LLMResponse>;
}
