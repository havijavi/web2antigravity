
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Users, Plus, Search, Building2, Mail } from 'lucide-react';
import { useState } from 'react';
import { trpc } from '../lib/trpc';
import { toast } from 'sonner';

export function ClientsPage() {
    const [projectId] = useState<number>(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newClient, setNewClient] = useState({ name: '', email: '', industry: '' });

    const utils = trpc.useContext();
    const { data: clients, isLoading } = trpc.clientProfiles.list.useQuery({ projectId });

    const createMutation = trpc.clientProfiles.create.useMutation({
        onSuccess: () => {
            toast.success('Client added successfully');
            setIsCreateModalOpen(false);
            setNewClient({ name: '', email: '', industry: '' });
            utils.clientProfiles.list.invalidate();
        },
        onError: (err) => {
            toast.error(`Error: ${err.message}`);
        }
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate({
            projectId,
            name: newClient.name,
            email: newClient.email || undefined,
            industry: newClient.industry || undefined,
        });
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Clients</h1>
                    <p className="text-neutral-400">Manage client profiles and assets.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={18} />
                    Add Client
                </button>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-neutral-800 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search clients..."
                            className="w-full bg-neutral-800 border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-8 text-center text-neutral-500">Loading clients...</div>
                ) : clients?.length === 0 ? (
                    <div className="p-12 flex flex-col items-center justify-center text-neutral-500">
                        <Users size={48} className="mb-4 opacity-50" />
                        <p className="text-lg font-medium text-white">No clients found</p>
                        <p className="mb-4">Get started by adding your first client.</p>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                            Add New Client
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                        {clients?.map((client) => (
                            <div key={client.id} className="bg-neutral-800/50 border border-neutral-700/50 rounded-lg p-5 hover:border-blue-500/50 transition-colors group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                        {client.name.charAt(0)}
                                    </div>
                                    <button className="text-neutral-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        Manage
                                    </button>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-1">{client.name}</h3>
                                {client.industry && (
                                    <div className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
                                        <Building2 size={14} />
                                        {client.industry}
                                    </div>
                                )}
                                {client.email && (
                                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                                        <Mail size={14} />
                                        {client.email}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Simple Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Add New Client</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Company Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-neutral-800 border-neutral-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    value={newClient.name}
                                    onChange={e => setNewClient({ ...newClient, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Industry</label>
                                <input
                                    type="text"
                                    className="w-full bg-neutral-800 border-neutral-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    value={newClient.industry}
                                    onChange={e => setNewClient({ ...newClient, industry: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Contact Email</label>
                                <input
                                    type="email"
                                    className="w-full bg-neutral-800 border-neutral-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    value={newClient.email}
                                    onChange={e => setNewClient({ ...newClient, email: e.target.value })}
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
                                    {createMutation.isPending ? 'Adding...' : 'Add Client'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
