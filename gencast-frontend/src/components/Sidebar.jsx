import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';

const Sidebar = () => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    // Mock data for history
    const historyGroups = [
        {
            label: 'Today',
            items: [
                { id: 1, title: 'The Future of AI', path: '/player' },
                { id: 2, title: 'History of Rome', path: '/player' },
            ]
        },
        {
            label: 'Yesterday',
            items: [
                { id: 3, title: 'Quantum Computing 101', path: '/player' },
            ]
        },
        {
            label: 'Previous 7 Days',
            items: [
                { id: 4, title: 'Meditations on First Philosophy', path: '/player' },
                { id: 5, title: 'Learn Spanish in 30 Days', path: '/player' },
            ]
        }
    ];

    const devItems = [
        { path: '/editor', label: 'Editor', icon: 'edit_note' },
        { path: '/player', label: 'Player', icon: 'play_circle' },
    ];

    return (
        <aside 
            className={clsx(
                "bg-[#000000] flex flex-col h-screen text-[#ECECF1] relative z-20 transition-all duration-300 ease-in-out",
                isCollapsed ? "w-[80px]" : "w-[260px]"
            )}
        >
            {/* Header / Branding */}
            <div className={clsx("px-4 py-3 mb-2 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
                 {!isCollapsed && (
                     <div className="flex items-center gap-2">
                        <div className="size-8 rounded-sm bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                            GC
                        </div>
                        <span className="text-[16px] font-bold text-white tracking-tight">GenCast</span>
                     </div>
                 )}
                 
                 <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-[#2A2B32] rounded-md transition-colors text-white/70 hover:text-white"
                 >
                    <span className="material-symbols-outlined text-[20px]">
                        {isCollapsed ? 'dock_to_right' : 'dock_to_left'}
                    </span>
                 </button>
            </div>

            {/* New Podcast Button */}
            <div className="px-3 mb-4">
                <Link 
                    to="/" 
                    className={clsx(
                        "flex items-center gap-2 py-3 rounded-md hover:bg-[#2A2B32] transition-colors border border-white/20 cursor-pointer group",
                        isCollapsed ? "justify-center px-0" : "px-3"
                    )}
                >
                    <span className="material-symbols-outlined text-[18px] text-white group-hover:text-white transition-colors">add_circle</span>
                    {!isCollapsed && <span className="text-[14px] flex-1 text-left text-white">New Podcast</span>}
                </Link>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {!isCollapsed && (
                    <div className="flex flex-col gap-6">
                        {historyGroups.map((group) => (
                            <div key={group.label}>
                                <div className="px-3 text-[12px] font-medium text-[#c5c5d0] mb-2">{group.label}</div>
                                <div className="flex flex-col">
                                    {group.items.map((item) => (
                                        <Link
                                            key={item.id}
                                            to={item.path}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-[#2A2B32] group transition-colors overflow-hidden"
                                        >
                                            <span className="text-[14px] truncate flex-1 text-[#ECECF1] group-hover:text-white">
                                                {item.title}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer / Settings / Dev */}
            <div className="p-2 border-t border-white/10">
                {/* Dev Links (Temporary) */}
                <div className="mb-2 px-2">
                    {!isCollapsed && <div className="text-[10px] uppercase text-white/30 font-bold mb-1">Dev Tools</div>}
                    {devItems.map((item) => (
                         <Link
                            key={item.path}
                            to={item.path}
                            className={clsx(
                                "flex items-center gap-3 py-2 rounded-md hover:bg-[#2A2B32] transition-colors text-[#ECECF1]",
                                location.pathname === item.path && "bg-[#343541]",
                                isCollapsed ? "justify-center px-0" : "px-2"
                            )}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <span className="material-symbols-outlined text-[18px] text-white/70">{item.icon}</span>
                            {!isCollapsed && <span className="text-[13px]">{item.label}</span>}
                        </Link>
                    ))}
                </div>

                <button 
                    className={clsx(
                        "flex items-center gap-3 py-3 w-full rounded-md hover:bg-[#2A2B32] transition-colors text-left group",
                        isCollapsed ? "justify-center px-0" : "px-3"
                    )}
                >
                    <span className="material-symbols-outlined text-[20px] text-white/70 group-hover:text-white">settings</span>
                    {!isCollapsed && <span className="text-[14px] text-[#ECECF1] group-hover:text-white">Settings</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
