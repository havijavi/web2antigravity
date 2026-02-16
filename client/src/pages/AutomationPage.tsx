
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Zap, Plus, Play, Pause, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { trpc } from '../lib/trpc';
import { toast } from 'sonner';

export function AutomationPage() {
    const [projectId] = useState<number>(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newAutomation, setNewAutomation] = useState({
        name: '',
        platform: 'twitter',
        targetType: 'hashtag' as const,
        target: '',
    });

    const utils = trpc.useContext();
    const { data: campaigns, isLoading } = trpc.automation.listCampaigns.useQuery({ projectId });

    const createMutation = trpc.automation.createCampaign.useMutation({
        onSuccess: () => {
            toast.success('Automation rule created');
            setIsCreateModalOpen(false);
            setNewAutomation({ name: '', platform: 'twitter', targetType: 'hashtag', target: '' });
            utils.automation.listCampaigns.invalidate();
        },
        onError: (err) => {
            toast.error(`Error: ${err.message}`);
        }
    });

    const toggleMutation = trpc.automation.toggleCampaign.useMutation({
        onSuccess: () => {
            utils.automation.listCampaigns.invalidate();
        }
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate({
            projectId,
            name: newAutomation.name,
            platform: newAutomation.platform,
            targetType: newAutomation.targetType,
            targets: [newAutomation.target], // Single target for now for simplicity
            actions: ['like'], // Default action
        });
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Automation</h1>
                    <p className="text-neutral-400">Configure engagement rules and workflows.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={18} />
                    New Rule
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full text-center text-neutral-500 py-12">Loading automation rules...</div>
                ) : campaigns?.length === 0 ? (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-neutral-500">
                        <Zap size={48} className="mb-4 opacity-50" />
                        <p className="text-lg font-medium text-white">No automation rules active</p>
                        <p className="mb-4">Create a rule to automate engagement.</p>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                            Create First Rule
                        </button>
                    </div>
                ) : (
                    campaigns?.map((campaign) => (
                        <div key={campaign.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-blue-500/30 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2 rounded-lg ${campaign.platform === 'twitter' ? 'bg-blue-500/10 text-blue-400' :
                                        campaign.platform === 'linkedin' ? 'bg-blue-700/10 text-blue-500' :
                                            'bg-purple-500/10 text-purple-400'
                                    }`}>
                                    <Zap size={20} />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => toggleMutation.mutate({ id: campaign.id, isActive: !campaign.isActive })}
                                        className={`p-1.5 rounded-lg transition-colors ${campaign.isActive
                                                ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                                : 'bg-neutral-800 text-neutral-400 hover:text-white'
                                            }`}
                                        title={campaign.isActive ? 'Pause' : 'Resume'}
                                    >
                                        {campaign.isActive ? <Pause size={16} /> : <Play size={16} />}
                                    </button>
                                </div>
                            </div>

                            <h3 className="font-semibold text-white mb-1">{campaign.name}</h3>
                            <div className="text-sm text-neutral-400 mb-4 capitalize">
                                {campaign.platform} • {campaign.targetType}
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {(campaign.targets as string[]).map((target, i) => (
                                    <span key={i} className="text-xs bg-neutral-800 px-2 py-1 rounded text-neutral-300">
                                        {target}
                                    </span>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-neutral-800 flex justify-between items-center text-sm">
                                <span className={campaign.isActive ? 'text-green-400' : 'text-neutral-500'}>
                                    {campaign.isActive ? 'Running' : 'Paused'}
                                </span>
                                <span className="text-neutral-500">
                                    0 actions today
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Simple Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">New Automation Rule</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Rule Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-neutral-800 border-neutral-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    value={newAutomation.name}
                                    onChange={e => setNewAutomation({ ...newAutomation, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-neutral-400 mb-1">Platform</label>
                                    <select
                                        className="w-full bg-neutral-800 border-neutral-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                        value={newAutomation.platform}
                                        onChange={e => setNewAutomation({ ...newAutomation, platform: e.target.value })}
                                    >
                                        <option value="twitter">Twitter</option>
                                        <option value="linkedin">LinkedIn</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-neutral-400 mb-1">Target Type</label>
                                    <select
                                        className="w-full bg-neutral-800 border-neutral-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                        value={newAutomation.targetType}
                                        onChange={e => setNewAutomation({ ...newAutomation, targetType: e.target.value as any })}
                                    >
                                        <option value="hashtag">Hashtag</option>
                                        <option value="keyword">Keyword</option>
                                        <option value="user">User Account</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Target Value</label>
                                <input
                                    type="text"
                                    required
                                    placeholder={newAutomation.targetType === 'hashtag' ? '#example' : 'Example'}
                                    className="w-full bg-neutral-800 border-neutral-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    value={newAutomation.target}
                                    onChange={e => setNewAutomation({ ...newAutomation, target: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 text-neutral-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createMutation.isPending}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                                >
                                    {createMutation.isPending ? 'Creating...' : 'Create Rule'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
