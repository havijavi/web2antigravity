
import { DashboardLayout } from '../layouts/DashboardLayout';
import { trpc } from '../lib/trpc';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

export function ProjectsPage() {
    const [search, setSearch] = useState('');
    const { data: projects, isLoading } = trpc.projects.list.useQuery();
    const createProject = trpc.projects.create.useMutation({
        onSuccess: () => {
            // Invalidate queries to refetch
        }
    });

    const handleCreate = () => {
        // In real app, open a modal
        createProject.mutate({ name: 'New Project ' + Date.now() });
    };

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
                    <p className="text-neutral-400">Manage your client reputation projects.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus size={18} />
                    New Project
                </button>
            </div>

            <div className="mb-6 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                <input
                    type="text"
                    placeholder="Search projects..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div className="text-center py-12 text-neutral-500">Loading projects...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects?.map((project) => (
                        <div key={project.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400 font-bold text-xl">
                                    {project.name.charAt(0)}
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${project.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-neutral-800 text-neutral-400'
                                    }`}>
                                    {project.status}
                                </span>
                            </div>
                            <h3 className="font-semibold text-lg text-white mb-1 group-hover:text-blue-400 transition-colors">{project.name}</h3>
                            <p className="text-neutral-500 text-sm mb-4 line-clamp-2">{project.description || 'No description provided.'}</p>
                            <div className="pt-4 border-t border-neutral-800 flex justify-between text-sm text-neutral-500">
                                <span>{project.clientName || 'Unknown Client'}</span>
                                <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
