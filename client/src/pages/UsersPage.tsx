
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Users, Plus, Shield, ShieldAlert, Ban, CheckCircle, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { trpc } from '../lib/trpc';
import { toast } from 'sonner';

export function UsersPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user' as 'admin' | 'user'
    });

    const utils = trpc.useContext();
    const { data: users, isLoading } = trpc.users.list.useQuery();

    const createMutation = trpc.users.create.useMutation({
        onSuccess: () => {
            toast.success('User created successfully');
            setIsCreateModalOpen(false);
            setNewUser({ name: '', email: '', password: '', role: 'user' });
            utils.users.list.invalidate();
        },
        onError: (err) => {
            toast.error(`Error: ${err.message}`);
        }
    });

    const toggleStatusMutation = trpc.users.toggleStatus.useMutation({
        onSuccess: () => {
            toast.success('User status updated');
            utils.users.list.invalidate();
        },
        onError: (err) => {
            toast.error(`Error: ${err.message}`);
        }
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(newUser);
    };

    const handleToggleStatus = (id: number, currentStatus: boolean) => {
        toggleStatusMutation.mutate({ id, isActive: !currentStatus });
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Team Members</h1>
                    <p className="text-neutral-400">Manage user access and roles.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={18} />
                    Add Member
                </button>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-neutral-500">Loading team members...</div>
                ) : users?.length === 0 ? (
                    <div className="p-12 flex flex-col items-center justify-center text-neutral-500">
                        <Users size={48} className="mb-4 opacity-50" />
                        <p className="text-lg font-medium text-white">No team members found</p>
                        <p className="mb-4">Start by adding your first team member.</p>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                            Add Member
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-800/50 text-neutral-400 text-sm">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Name</th>
                                    <th className="px-6 py-3 font-medium">Email</th>
                                    <th className="px-6 py-3 font-medium">Role</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium">Joined</th>
                                    <th className="px-6 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                {users?.map((user) => (
                                    <tr key={user.id} className="hover:bg-neutral-800/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                                        <td className="px-6 py-4 text-neutral-300">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium inline-flex items-center gap-1 ${user.role === 'admin'
                                                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                }`}>
                                                {user.role === 'admin' ? <ShieldAlert size={12} /> : <Shield size={12} />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium inline-flex items-center gap-1 ${user.isActive
                                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                }`}>
                                                {user.isActive ? <CheckCircle size={12} /> : <Ban size={12} />}
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-neutral-400">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <button
                                                onClick={() => handleToggleStatus(user.id, user.isActive)}
                                                className={`p-1 rounded hover:bg-neutral-700 transition-colors ${user.isActive ? 'text-red-400' : 'text-green-400'}`}
                                                title={user.isActive ? 'Deactivate' : 'Activate'}
                                            >
                                                {user.isActive ? <Ban size={18} /> : <CheckCircle size={18} />}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create User Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Add Team Member</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-neutral-800 border-neutral-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    value={newUser.name}
                                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-neutral-800 border-neutral-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    value={newUser.email}
                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    className="w-full bg-neutral-800 border-neutral-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    value={newUser.password}
                                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Role</label>
                                <select
                                    className="w-full bg-neutral-800 border-neutral-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    value={newUser.role}
                                    onChange={e => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'user' })}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
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
                                    {createMutation.isPending ? 'Adding...' : 'Add Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
