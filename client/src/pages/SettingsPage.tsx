
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Save } from 'lucide-react';

export function SettingsPage() {
    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                    <p className="text-neutral-400">Manage your account and platform preferences.</p>
                </div>

                <div className="space-y-6">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Profile Settings</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    defaultValue="Admin User"
                                    className="w-full bg-neutral-800 border-neutral-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    defaultValue="admin@example.com"
                                    className="w-full bg-neutral-800 border-neutral-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">API Configuration</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">OpenAI API Key</label>
                                <input
                                    type="password"
                                    placeholder="sk-..."
                                    className="w-full bg-neutral-800 border-neutral-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Anthropic API Key</label>
                                <input
                                    type="password"
                                    placeholder="sk-ant-..."
                                    className="w-full bg-neutral-800 border-neutral-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors">
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
