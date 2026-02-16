
import { DashboardLayout } from '../layouts/DashboardLayout';
import { trpc } from '../lib/trpc';
import { useState } from 'react';
import { Sparkles, Loader2, Bot } from 'lucide-react';
import { toast } from 'sonner';

const PROVIDERS = {
    anthropic: { name: 'Anthropic', models: [{ id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' }] },
    openai: { name: 'OpenAI', models: [{ id: 'gpt-4o', name: 'GPT-4o' }] },
    gemini: { name: 'Google Gemini', models: [{ id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' }] },
    perplexity: { name: 'Perplexity', models: [{ id: 'sonar-pro', name: 'Sonar Pro' }] },
};

export function ContentPage() {
    const [projectId] = useState<number>(1);
    const [platform, setPlatform] = useState('linkedin');
    const [provider, setProvider] = useState<keyof typeof PROVIDERS>('anthropic');
    const [model, setModel] = useState(PROVIDERS.anthropic.models[0].id);
    const [prompt, setPrompt] = useState('');

    const generateMutation = trpc.content.generate.useMutation({
        onSuccess: () => {
            toast.success('Content generated successfully!');
        },
        onError: (error) => {
            toast.error(`Error: ${error.message}`);
        }
    });

    const handleGenerate = () => {
        if (!prompt) return;
        generateMutation.mutate({
            projectId,
            platform,
            prompt,
            provider,
            model,
        });
    };

    const handleProviderChange = (newProvider: string) => {
        setProvider(newProvider as keyof typeof PROVIDERS);
        setModel(PROVIDERS[newProvider as keyof typeof PROVIDERS].models[0].id);
    };

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Content Studio</h1>
                <p className="text-neutral-400">Generate AI-powered content using multiple LLMs.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                        <h3 className="font-semibold mb-4 text-white flex items-center gap-2">
                            <Bot size={18} className="text-blue-500" />
                            Model Settings
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">AI Provider</label>
                                <select
                                    className="w-full bg-neutral-800 border-neutral-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    value={provider}
                                    onChange={(e) => handleProviderChange(e.target.value)}
                                >
                                    {Object.entries(PROVIDERS).map(([key, value]) => (
                                        <option key={key} value={key}>{value.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Model</label>
                                <input
                                    type="text"
                                    list="model-suggestions"
                                    className="w-full bg-neutral-800 border-neutral-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    placeholder="e.g. gpt-4o, claude-3-5-sonnet-20241022"
                                />
                                <datalist id="model-suggestions">
                                    {PROVIDERS[provider].models.map((m) => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </datalist>
                                <p className="text-xs text-neutral-500 mt-1">
                                    Select a default or type a specific model ID.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                        <h3 className="font-semibold mb-4 text-white">Platform Settings</h3>
                        <div>
                            <label className="block text-sm text-neutral-400 mb-1">Target Platform</label>
                            <select
                                className="w-full bg-neutral-800 border-neutral-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value)}
                            >
                                <option value="linkedin">LinkedIn</option>
                                <option value="twitter">Twitter</option>
                                <option value="medium">Medium</option>
                                <option value="instagram">Instagram</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                        <h3 className="font-semibold mb-4 text-white flex items-center gap-2">
                            <Sparkles className="text-yellow-500" size={18} />
                            Prompt
                        </h3>
                        <textarea
                            className="w-full h-40 bg-neutral-800 border-neutral-700 rounded-lg p-3 text-white mb-4 focus:ring-2 focus:ring-blue-600 focus:outline-none resize-none"
                            placeholder="Describe the content you want to generate..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={generateMutation.isPending}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {generateMutation.isPending ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={18} />
                                    Generate Content
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 h-full min-h-[500px]">
                        <h3 className="font-semibold mb-4 text-white">Output</h3>
                        {generateMutation.data ? (
                            <div className="prose prose-invert max-w-none">
                                <div className="bg-neutral-800 p-4 rounded-lg mb-4 text-sm text-neutral-400">
                                    Generated by <strong>{PROVIDERS[provider].name}</strong> ({model})
                                </div>
                                <pre className="whitespace-pre-wrap font-sans text-neutral-300">
                                    {generateMutation.data.content}
                                </pre>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-neutral-500">
                                <Sparkles size={48} className="mb-4 text-neutral-800" />
                                <p>Generated content will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
