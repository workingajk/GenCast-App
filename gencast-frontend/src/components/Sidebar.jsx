import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <aside className="w-72 h-full bg-bg-sidebar flex flex-col border-r border-white/5 shadow-2xl z-20 relative transition-all duration-300" id="sidebar">
            <button className="sidebar-toggle-btn absolute top-6 right-[-14px] size-7 bg-bg-surface border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-primary transition-all z-50 shadow-lg" onClick={() => document.getElementById('sidebar').classList.toggle('sidebar-collapsed')}>
                <span className="material-symbols-outlined text-[18px] sidebar-expanded-icon block">chevron_left</span>
            </button>
            <div className="p-6 pb-2">
                <div className="flex items-center gap-3">
                    <div className="size-8 min-w-[32px] rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-black">
                        <span className="material-symbols-outlined text-[20px] font-bold">graphic_eq</span>
                    </div>
                    <h1 className="text-xl font-heading font-bold tracking-tight text-white sidebar-full-content">PodAI</h1>
                </div>
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="px-6 py-6 flex justify-center">
                    <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-[#0a0c0e] font-bold py-3 px-2 rounded-xl transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:scale-[1.02] active:scale-[0.98] group overflow-hidden">
                        <span className="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-90">add</span>
                        <span className="sidebar-full-content whitespace-nowrap">New Podcast</span>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-4 pb-4">
                    <h3 className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.1em] mb-4 mt-2 sidebar-full-content">Navigation</h3>
                    <div className="flex flex-col gap-1.5 mb-6">
                        <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-gray-300 hover:text-white">
                            <span className="material-symbols-outlined text-[20px]">home</span>
                            <span className="text-sm font-semibold sidebar-full-content">Home</span>
                        </Link>
                        <Link to="/editor" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-gray-300 hover:text-white">
                            <span className="material-symbols-outlined text-[20px]">edit_note</span>
                            <span className="text-sm font-semibold sidebar-full-content">Editor</span>
                        </Link>
                        <Link to="/player" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-gray-300 hover:text-white">
                            <span className="material-symbols-outlined text-[20px]">play_circle</span>
                            <span className="text-sm font-semibold sidebar-full-content">Player</span>
                        </Link>
                    </div>

                    <h3 className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.1em] mb-4 mt-2 sidebar-full-content">Recent Generation</h3>
                    <div className="flex flex-col gap-1.5 items-center">
                        <a className="w-full flex flex-col gap-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 group transition-all" href="#">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary text-[20px] sidebar-mini-content hidden">neurology</span>
                                    <span className="text-sm font-semibold text-white truncate sidebar-full-content w-32">The Future of AI</span>
                                </div>
                                <span className="material-symbols-outlined text-primary text-[16px] sidebar-full-content">equalizer</span>
                            </div>
                            <span className="text-[11px] text-gray-400 sidebar-full-content">Oct 24 • 12:45 mins</span>
                        </a>
                        {/* More items could be mapped here */}
                    </div>
                </div>
            </div>
            <div className="p-4 border-t border-white/5">
                <button className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-white/5 transition-colors text-left group">
                    <div className="size-9 min-w-[36px] rounded-full bg-cover bg-center ring-2 ring-white/10 group-hover:ring-primary/50 transition-all" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDoNEyfqmjziEedpVoaqSRsTI-cTj7HVr9IS0NEejeRCu3F_1hNDDA5aIbFftmmYu_D4q8I2UXynCtBEa668gIsGgnQQxIx7uP16SefuJylYZJxVizHHtBlnm4CQPpJI_IqE-rgiTtFMawp9p1bvXxmp-CoP224O2G_kS50hao340mpbtDd3GDEbDke8-wH4ccZdIz2LCnWeD__HBdH-4YRfkHwEKsmgSzVpIv8ekyBpfubOIt5ROPjq7BbR3DuYgXrsRvsVKmQp8QP")' }}></div>
                    <div className="flex-1 min-w-0 sidebar-full-content">
                        <p className="text-sm font-semibold text-white truncate">Elena R.</p>
                        <p className="text-[11px] text-gray-500 font-medium truncate uppercase tracking-wider">Pro Tier</p>
                    </div>
                    <span className="material-symbols-outlined text-gray-500 group-hover:text-white transition-colors sidebar-full-content">settings</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
