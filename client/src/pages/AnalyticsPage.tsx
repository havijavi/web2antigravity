
import { DashboardLayout } from '../layouts/DashboardLayout';
import { BarChart2, TrendingUp, Users, Activity } from 'lucide-react';
import { useState } from 'react';
import { trpc } from '../lib/trpc';

export function AnalyticsPage() {
    const [projectId] = useState<number>(1);
    const { data: stats, isLoading } = trpc.analytics.getOverview.useQuery({ projectId });

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
                <p className="text-neutral-400">Platform performance and growth metrics.</p>
            </div>

            {isLoading ? (
                <div className="text-neutral-500">Loading analytics...</div>
            ) : (
                <div className="space-y-8">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                                    <Activity size={20} />
                                </div>
                                <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded">+12%</span>
                            </div>
                            <h3 className="text-neutral-400 text-sm mb-1">Total Posts</h3>
                            <p className="text-2xl font-bold text-white max-w-full overflow-hidden text-ellipsis">{stats?.totalPosts}</p>
                        </div>

                        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg">
                                    <TrendingUp size={20} />
                                </div>
                                <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded">+5%</span>
                            </div>
                            <h3 className="text-neutral-400 text-sm mb-1">Active Campaigns</h3>
                            <p className="text-2xl font-bold text-white max-w-full overflow-hidden text-ellipsis">{stats?.activeCampaigns}</p>
                        </div>

                        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg">
                                    <Users size={20} />
                                </div>
                                <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded">+8%</span>
                            </div>
                            <h3 className="text-neutral-400 text-sm mb-1">Total Engagements</h3>
                            <p className="text-2xl font-bold text-white max-w-full overflow-hidden text-ellipsis">{stats?.totalEngagements}</p>
                        </div>

                        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
                                    <BarChart2 size={20} />
                                </div>
                                <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded">+24%</span>
                            </div>
                            <h3 className="text-neutral-400 text-sm mb-1">Audience Growth</h3>
                            <p className="text-2xl font-bold text-white max-w-full overflow-hidden text-ellipsis">1,204</p>
                        </div>
                    </div>

                    {/* Placeholder Chart Area */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 h-96 flex items-center justify-center">
                        <div className="text-center text-neutral-500">
                            <BarChart2 size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Detailed engagement charts coming soon.</p>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
