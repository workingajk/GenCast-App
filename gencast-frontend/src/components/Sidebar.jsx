import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { podcastService, authService } from '../services/api';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [historyGroups, setHistoryGroups] = useState([]);

    useEffect(() => {
        loadHistory();
    }, [isCollapsed]); // Reload when toggled, or could depend on a global refresh trigger

    const loadHistory = async () => {
        if (!authService.isAuthenticated()) return;
        
        try {
            const podcasts = await podcastService.list();
            const groups = groupPodcastsByDate(podcasts);
            setHistoryGroups(groups);
        } catch (e) {
            console.error("Failed to load history", e);
        }
    };

    const groupPodcastsByDate = (podcasts) => {
        const groups = {
            'Today': [],
            'Yesterday': [],
            'Previous 7 Days': [],
            'Older': []
        };

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);

        podcasts.forEach(podcast => {
            const date = new Date(podcast.created_at);
            date.setHours(0, 0, 0, 0);
            
            if (date.getTime() === today.getTime()) {
                groups['Today'].push(podcast);
            } else if (date.getTime() === yesterday.getTime()) {
                groups['Yesterday'].push(podcast);
            } else if (date > lastWeek) {
                groups['Previous 7 Days'].push(podcast);
            } else {
                groups['Older'].push(podcast);
            }
        });

        return Object.entries(groups)
            .filter(([_, items]) => items.length > 0)
            .map(([label, items]) => ({ label, items }));
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const devItems = [
        { path: '/editor', label: 'Editor', icon: 'edit_note' },
        { path: '/player', label: 'Player', icon: 'play_circle' },
    ];

    return (
        <aside 
            className={clsx(
                "bg-[#000000] flex flex-col h-screen text-[#ECECF1] relative z-20 transition-all duration-300 ease-in-out border-r border-white/10",
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
                                <div className="flex flex-col gap-1">
                                    {group.items.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                navigate(`/podcast/${item.id}`);
                                            }}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-[#2A2B32] group transition-colors overflow-hidden w-full text-left"
                                        >
                                            <span className={clsx("size-2 rounded-full flex-shrink-0", item.status === 'completed' ? 'bg-green-500' : 'bg-gray-500')}></span>
                                            <span className="text-[14px] truncate flex-1 text-[#ECECF1] group-hover:text-white">
                                                {item.title || item.topic}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {historyGroups.length === 0 && (
                             <div className="text-center text-xs text-white/30 py-4">No history yet</div>
                        )}
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
                    onClick={handleLogout}
                    className={clsx(
                        "flex items-center gap-3 py-3 w-full rounded-md hover:bg-[#2A2B32] transition-colors text-left group",
                        isCollapsed ? "justify-center px-0" : "px-3"
                    )}
                >
                    <span className="material-symbols-outlined text-[20px] text-white/70 group-hover:text-red-400">logout</span>
                    {!isCollapsed && <span className="text-[14px] text-[#ECECF1] group-hover:text-red-400">Log out</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
