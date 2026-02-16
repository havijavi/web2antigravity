
import { Home, LayoutGrid, FileText, Users, Calendar, Settings, BarChart2, Zap } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import clsx from 'clsx';

const NAV_ITEMS = [
    { label: 'Dashboard', icon: Home, href: '/' },
    { label: 'Projects', icon: LayoutGrid, href: '/projects' },
    { label: 'Content', icon: FileText, href: '/content' },
    { label: 'Clients', icon: Users, href: '/clients' },
    { label: 'Campaigns', icon: Calendar, href: '/campaigns' },
    { label: 'Automation', icon: Zap, href: '/automation' },
    { label: 'Analytics', icon: BarChart2, href: '/analytics' },
    { label: 'Team', icon: Users, href: '/users' },
    { label: 'Settings', icon: Settings, href: '/settings' },
];

export function Sidebar() {
    const [location] = useLocation();

    return (
        <div className="w-64 bg-neutral-900 border-r border-neutral-800 h-screen flex flex-col fixed left-0 top-0">
            <div className="p-6 border-b border-neutral-800">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    ORM Platform
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {NAV_ITEMS.map((item) => {
                    const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
                    return (
                        <Link key={item.href} href={item.href}>
                            <a className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-blue-600/10 text-blue-400 border border-blue-600/20"
                                    : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
                            )}>
                                <item.icon size={18} />
                                {item.label}
                            </a>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-neutral-800">
                <div className="flex items-center gap-3 px-4 py-2 text-neutral-400 text-sm">
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center">
                        User
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-medium">Admin User</span>
                        <span className="text-xs">admin@example.com</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
