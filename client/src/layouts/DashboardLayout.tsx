
import { ReactNode } from 'react';
import { Sidebar } from '../components/Sidebar';

export function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-50 pl-64">
            <Sidebar />
            <main className="p-8 max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
}
