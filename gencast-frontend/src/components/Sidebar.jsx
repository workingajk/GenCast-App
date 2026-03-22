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

    return (
        <aside
            className={clsx(
                "bg-slate-950 flex flex-col h-screen text-slate-300 relative z-20 transition-all duration-300 ease-in-out border-r border-white/5",
                isCollapsed ? "w-[80px]" : "w-[280px]"
            )}
        >
            {/* Header / Branding */}
            <div className={clsx("px-6 py-8 flex items-center transition-all", isCollapsed ? "justify-center" : "justify-between")}>
                {!isCollapsed && (
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-primary/10 flex items-center justify-center text-primary font-black rounded-xl border border-primary/20 shadow-glow">
                            GC
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">GenCast</span>
                    </div>
                )}

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="size-8 flex items-center justify-center rounded-lg hover:bg-white/5 hover:text-white transition-all text-slate-500"
                >
                    <span className="material-symbols-outlined text-[20px]">
                        {isCollapsed ? 'dock_to_right' : 'dock_to_left'}
                    </span>
                </button>
            </div>

            {/* New Podcast Button */}
            <div className="px-4 mb-8">
                <Link
                    to="/"
                    className={clsx(
                        "flex items-center gap-3 py-3.5 bg-primary text-[#0a0c0e] hover:bg-white transition-all rounded-2xl shadow-glow hover:shadow-[0_10px_30px_rgba(0,240,255,0.3)] group active:scale-[0.98]",
                        isCollapsed ? "justify-center px-0" : "px-5"
                    )}
                >
                    <span className="material-symbols-outlined text-[24px]">add_circle</span>
                    {!isCollapsed && <span className="text-sm font-bold tracking-tight">New Episode</span>}
                </Link>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
                {!isCollapsed && (
                    <div className="flex flex-col gap-8">
                        {historyGroups.map((group) => (
                            <div key={group.label}>
                                <div className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{group.label}</div>
                                <div className="flex flex-col gap-1">
                                    {group.items.map((item) => (
                                        <div key={item.id} className="relative w-full group/item">
                                            <button
                                                onClick={() => {
                                                    navigate(`/podcast/${item.id}`);
                                                }}
                                                className={clsx(
                                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all overflow-hidden w-full text-left pr-10",
                                                    location.pathname === `/podcast/${item.id}`
                                                        ? "bg-white/10 text-white shadow-sm"
                                                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                                                )}
                                            >
                                                <div className={clsx("size-1.5 rounded-full shrink-0", item.status === 'completed' ? 'bg-primary' : 'bg-slate-700')}></div>
                                                <span className="text-sm font-medium truncate flex-1 tracking-tight">
                                                    {item.title || item.topic}
                                                </span>
                                            </button>
                                            <button
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    if (window.confirm('Are you sure you want to delete this podcast?')) {
                                                        try {
                                                            await podcastService.delete(item.id);
                                                            if (location.pathname === `/podcast/${item.id}`) {
                                                                navigate('/');
                                                            }
                                                            loadHistory();
                                                        } catch (err) {
                                                            console.error("Failed to delete podcast", err);
                                                            alert("Failed to delete podcast");
                                                        }
                                                    }
                                                }}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-red-500/80 opacity-0 group-hover/item:opacity-100 transition-all flex items-center justify-center z-10"
                                                title="Delete Podcast"
                                            >
                                                <span className="material-symbols-outlined text-[16px] block">delete</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {historyGroups.length === 0 && (
                            <div className="text-center text-xs text-slate-600 py-4 italic">No history yet</div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer / Settings */}
            <div className="p-4 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className={clsx(
                        "flex items-center gap-3 py-3.5 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all font-medium text-sm group",
                        isCollapsed ? "justify-center px-0" : "px-4"
                    )}
                >
                    <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">logout</span>
                    {!isCollapsed && <span className="flex-1 text-left">Log out</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
