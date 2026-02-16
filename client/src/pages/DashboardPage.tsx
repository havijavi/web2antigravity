import { DashboardLayout } from '../layouts/DashboardLayout';
import { Activity, Users, FileText, CheckCircle } from 'lucide-react';

function StatCard({ title, value, icon: Icon, trend }: any) {
    return (
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-neutral-400 text-sm font-medium">{title}</h3>
                <div className="p-2 bg-neutral-800 rounded-lg text-neutral-400">
                    <Icon size={20} />
                </div>
            </div>
            <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-white">{value}</span>
                {trend && (
                    <span className={`text-sm mb-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                )}
            </div>
        </div>
    );
}

export function DashboardPage() {
    // Mock data for now, real data comes from tRPC
    const stats = [
        { title: 'Total Clients', value: '124', icon: Users, trend: 12 },
        { title: 'Active Projects', value: '45', icon: Activity, trend: 5 },
        { title: 'Content Generated', value: '1,284', icon: FileText, trend: 24 },
        { title: 'Published Posts', value: '892', icon: CheckCircle, trend: 18 },
    ];

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-neutral-400">Welcome back, here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 h-96">
                    <h3 className="font-semibold mb-4">Recent Activity</h3>
                    <div className="flex items-center justify-center h-full text-neutral-500">
                        Chart Placeholder
                    </div>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 h-96">
                    <h3 className="font-semibold mb-4">Upcoming Schedule</h3>
                    <div className="flex items-center justify-center h-full text-neutral-500">
                        List Placeholder
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
