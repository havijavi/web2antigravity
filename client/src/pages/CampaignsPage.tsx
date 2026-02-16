
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Calendar, Plus, Play, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { trpc } from '../lib/trpc';
import { toast } from 'sonner';

export function CampaignsPage() {
    const [projectId] = useState<number>(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newCampaign, setNewCampaign] = useState({
        name: '',
        period: 'monthly' as const,
        startDate: '',
        clientProfileId: 0
    });

    const utils = trpc.useContext();
    const { data: campaigns, isLoading } = trpc.campaigns.list.useQuery({ projectId });
    const { data: clients } = trpc.clientProfiles.list.useQuery({ projectId });

    const createMutation = trpc.campaigns.create.useMutation({
        onSuccess: () => {
            toast.success('Campaign created successfully');
            setIsCreateModalOpen(false);
            setNewCampaign({ name: '', period: 'monthly', startDate: '', clientProfileId: 0 });
            utils.campaigns.list.invalidate();
        },
        onError: (err) => {
            toast.error(`Error: ${err.message}`);
        }
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCampaign.clientProfileId) {
            toast.error('Please select a client');
            return;
        }

        createMutation.mutate({
            projectId,
            clientProfileId: newCampaign.clientProfileId,
            name: newCampaign.name,
            period: newCampaign.period,
            startDate: newCampaign.startDate,
        });
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Campaigns</h1>
                    <p className="text-neutral-400">Manage batched content schedules.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={18} />
                    New Campaign
                </button>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-neutral-500">Loading campaigns...</div>
                ) : campaigns?.length === 0 ? (
                    <div className="p-12 flex flex-col items-center justify-center text-neutral-500">
                        <Calendar size={48} className="mb-4 opacity-50" />
                        <p className="text-lg font-medium text-white">No campaigns found</p>
                        <p className="mb-4">Start by creating a new content campaign.</p>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                            Create Campaign
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-800/50 text-neutral-400 text-sm">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Name</th>
                                    <th className="px-6 py-3 font-medium">Client</th>
                                    <th className="px-6 py-3 font-medium">Period</th>
                                    <th className="px-6 py-3 font-medium">Starts</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                {campaigns?.map((campaign: any) => (
                                    <tr key={campaign.id} className="hover:bg-neutral-800/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{campaign.name}</td>
                                        <td className="px-6 py-4 text-neutral-300">
                                            {/* @ts-ignore relationship */}
                                            {campaign.clientProfile?.name || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 text-neutral-400 capitalize">{campaign.period}</td>
                                        <td className="px-6 py-4 text-neutral-400">
                                            {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${campaign.status === 'in_progress' || campaign.status === 'approved'
                                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                : 'bg-neutral-700/50 text-neutral-400 border border-neutral-700'
                                                }`}>
                                                {campaign.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-neutral-500 hover:text-white">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Simple Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">New Campaign</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Campaign Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-neutral-800 border-neutral-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    value={newCampaign.name}
                                    onChange={e => setNewCampaign({ ...newCampaign, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Client</label>
                                <select
                                    required
                                    className="w-full bg-neutral-800 border-neutral-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    value={newCampaign.clientProfileId}
                                    onChange={e => setNewCampaign({ ...newCampaign, clientProfileId: Number(e.target.value) })}
                                >
                                    <option value={0}>Select a client...</option>
                                    {clients?.map((c: any) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-neutral-400 mb-1">Period</label>
                                    <select
                                        className="w-full bg-neutral-800 border-neutral-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                        value={newCampaign.period}
                                        onChange={e => setNewCampaign({ ...newCampaign, period: e.target.value as any })}
                                    >
                                        <option value="weekly">Weekly</option>
                                        <option value="biweekly">Bi-Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="quarterly">Quarterly</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-neutral-400 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-neutral-800 border-neutral-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                        value={newCampaign.startDate}
                                        onChange={e => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                                    />
                                </div>
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
                                    {createMutation.isPending ? 'Creating...' : 'Create Campaign'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
