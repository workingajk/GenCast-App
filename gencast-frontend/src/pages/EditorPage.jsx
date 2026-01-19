import React from 'react';

const EditorPage = () => {
    return (
        <div className="bg-background-dark text-slate-200 font-display overflow-hidden h-screen w-full flex">
            <aside className="w-72 flex-shrink-0 bg-sidebar-dark border-r border-white/5 flex flex-col h-full z-20 relative" id="sidebar">
                <div className="sidebar-content flex flex-col h-full w-full">
                    <div className="p-6 pb-2">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="relative size-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined text-white text-xl">graphic_eq</span>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-white text-lg font-bold leading-none font-mono tracking-tight">PodcastGen</h1>
                                <p className="text-slate-500 text-xs font-medium mt-1">v1.0.4 Beta</p>
                            </div>
                        </div>
                        <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition-all duration-200 group border border-primary/20 hover:border-primary/50">
                            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">add_circle</span>
                            <span className="text-sm font-bold">New Project</span>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 scrollbar-hide">
                        <div className="px-2 py-2">
                            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3 pl-2">Recent Projects</p>
                            <div className="group flex items-center gap-3 px-3 py-3 rounded-lg bg-white/5 border border-primary/30 shadow-[0_0_15px_-5px_rgba(0,189,199,0.2)] cursor-pointer">
                                <span className="material-symbols-outlined text-primary text-[20px] fill-1">mic</span>
                                <div className="flex flex-col overflow-hidden">
                                    <p className="text-white text-sm font-medium leading-tight truncate">Tech Trends Ep. 4</p>
                                    <p className="text-slate-500 text-xs truncate mt-0.5">Last edited 2m ago</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors text-slate-500 hover:text-slate-300 mt-1">
                                <span className="material-symbols-outlined text-[20px]">newspaper</span>
                                <p className="text-sm font-medium leading-normal truncate">Morning News Brief</p>
                            </div>
                            <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors text-slate-500 hover:text-slate-300">
                                <span className="material-symbols-outlined text-[20px]">lightbulb</span>
                                <p className="text-sm font-medium leading-normal truncate">Startup Story #12</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-t border-white/5">
                        <div className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-white cursor-pointer transition-colors">
                            <span className="material-symbols-outlined">settings</span>
                            <p className="text-sm font-medium">Settings</p>
                        </div>
                        <div className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-white cursor-pointer transition-colors mt-1">
                            <div className="size-8 rounded-full bg-slate-800 overflow-hidden ring-1 ring-white/10">
                                <div className="w-full h-full bg-gradient-to-tr from-purple-500/80 to-orange-400/80"></div>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-sm font-medium text-white">Alex Designer</p>
                                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Pro Plan</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
            <main className="flex-1 flex flex-col relative h-full min-w-0 bg-background-dark overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,189,199,0.05),transparent_50%)] pointer-events-none"></div>
                <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-background-dark/80 backdrop-blur-md z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center" id="toggleSidebar">
                            <span className="material-symbols-outlined" id="toggleIcon">menu_open</span>
                        </button>
                        <nav className="flex items-center text-sm font-medium text-slate-500">
                            <a className="hover:text-primary transition-colors" href="#">Projects</a>
                            <span className="mx-2 text-slate-700">/</span>
                            <span className="text-slate-200 flex items-center gap-2">
                                Tech Trends Ep. 4
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/20 text-primary font-bold uppercase tracking-wider">Draft</span>
                            </span>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                            <div className="size-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            AUTO-SAVED
                        </div>
                        <div className="h-6 w-px bg-white/10"></div>
                        <button className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="Export Script">
                            <span className="material-symbols-outlined text-[20px]">ios_share</span>
                        </button>
                        <button className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="Script Settings">
                            <span className="material-symbols-outlined text-[20px]">tune</span>
                        </button>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto script-scroll relative pb-40">
                    <div className="max-w-4xl mx-auto py-12 px-8 transition-all duration-300">
                        <div className="mb-12 border-b border-white/5 pb-8">
                            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Tech Trends Ep. 4</h1>
                            <div className="flex gap-6 text-slate-500 text-sm font-medium">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary/70 text-lg">timer</span>
                                    <span>Est. Duration: 2m 15s</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary/70 text-lg">group</span>
                                    <span>2 Speakers</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-6">
                            <div className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all duration-300 focus-within:bg-white/[0.04] focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
                                <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                                    <button className="p-2 text-slate-500 hover:text-primary rounded-lg hover:bg-white/10" title="Regenerate Line">
                                        <span className="material-symbols-outlined text-lg">refresh</span>
                                    </button>
                                    <button className="p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-white/10" title="Delete Block">
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="size-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,189,199,0.5)]"></span>
                                                <label className="text-primary font-mono text-xs font-bold uppercase tracking-widest">HOST</label>
                                            </div>
                                            <div className="relative flex items-center group/voice">
                                                <select className="bg-card-dark border border-white/10 text-slate-300 text-[11px] font-semibold rounded-lg pl-9 pr-8 py-1.5 appearance-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 hover:bg-white/10 transition-colors cursor-pointer min-w-[150px]">
                                                    <option>Warm Male</option>
                                                    <option>Professional Female</option>
                                                    <option>Energetic</option>
                                                    <option>Calm Narrator</option>
                                                </select>
                                                <button className="absolute left-2.5 flex items-center text-primary/60 hover:text-primary transition-colors cursor-pointer" title="Preview Voice">
                                                    <span className="material-symbols-outlined text-[18px]">play_circle</span>
                                                </button>
                                                <span className="material-symbols-outlined absolute right-2 text-[16px] text-slate-500 pointer-events-none">expand_more</span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-slate-600 bg-white/5 px-2 py-0.5 rounded font-mono">0:00</span>
                                    </div>
                                    <textarea className="w-full bg-transparent border-none p-0 text-slate-100 text-lg leading-relaxed resize-none focus:ring-0 placeholder:text-slate-700 rounded selection:bg-primary/30" rows="1" spellCheck="false" defaultValue="Welcome back to the show. Today we are discussing the future of AI and how it's reshaping creative industries."></textarea>
                                </div>
                            </div>
                            <div className="group relative p-6 rounded-2xl bg-accent-purple/5 border border-accent-purple/10 hover:border-accent-purple/30 transition-all duration-300 focus-within:bg-accent-purple/[0.08] focus-within:border-accent-purple/50 focus-within:ring-1 focus-within:ring-accent-purple/20">
                                <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                                    <button className="p-2 text-slate-500 hover:text-accent-purple rounded-lg hover:bg-white/10">
                                        <span className="material-symbols-outlined text-lg">refresh</span>
                                    </button>
                                    <button className="p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-white/10">
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="size-2 rounded-full bg-accent-purple shadow-[0_0_8px_rgba(168,85,247,0.5)]"></span>
                                                <label className="text-accent-purple font-mono text-xs font-bold uppercase tracking-widest">GUEST</label>
                                            </div>
                                            <div className="relative flex items-center group/voice">
                                                <select className="bg-card-dark border border-white/10 text-slate-300 text-[11px] font-semibold rounded-lg pl-9 pr-8 py-1.5 appearance-none focus:ring-1 focus:ring-accent-purple/50 focus:border-accent-purple/50 hover:bg-white/10 transition-colors cursor-pointer min-w-[150px]">
                                                    <option>Professional Female</option>
                                                    <option>Warm Male</option>
                                                    <option>Energetic</option>
                                                    <option>Cheerful Adult</option>
                                                </select>
                                                <button className="absolute left-2.5 flex items-center text-accent-purple/60 hover:text-accent-purple transition-colors cursor-pointer" title="Preview Voice">
                                                    <span className="material-symbols-outlined text-[18px]">play_circle</span>
                                                </button>
                                                <span className="material-symbols-outlined absolute right-2 text-[16px] text-slate-500 pointer-events-none">expand_more</span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-slate-600 bg-white/5 px-2 py-0.5 rounded font-mono">0:12</span>
                                    </div>
                                    <textarea className="w-full bg-transparent border-none p-0 text-slate-100 text-lg leading-relaxed resize-none focus:ring-0 placeholder:text-slate-700 rounded selection:bg-accent-purple/30" rows="1" spellCheck="false" defaultValue="Thanks for having me, Alex. It's a fascinating time to be building in this space. The pace of innovation is unlike anything we've seen before."></textarea>
                                    <div className="flex gap-2 mt-2">
                                        <button className="text-[10px] font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-slate-400 px-3 py-1.5 rounded-lg border border-white/5 transition-all flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[14px]">speed</span> Slower
                                        </button>
                                        <button className="text-[10px] font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-slate-400 px-3 py-1.5 rounded-lg border border-white/5 transition-all flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[14px]">sentiment_satisfied</span> Excited
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all duration-300 focus-within:bg-white/[0.04] focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
                                <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                                    <button className="p-2 text-slate-500 hover:text-primary rounded-lg hover:bg-white/10">
                                        <span className="material-symbols-outlined text-lg">refresh</span>
                                    </button>
                                    <button className="p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-white/10">
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="size-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,189,199,0.5)]"></span>
                                                <label className="text-primary font-mono text-xs font-bold uppercase tracking-widest">HOST</label>
                                            </div>
                                            <div className="relative flex items-center group/voice">
                                                <select className="bg-card-dark border border-white/10 text-slate-300 text-[11px] font-semibold rounded-lg pl-9 pr-8 py-1.5 appearance-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 hover:bg-white/10 transition-colors cursor-pointer min-w-[150px]">
                                                    <option>Warm Male</option>
                                                    <option>Professional Female</option>
                                                    <option>Energetic</option>
                                                </select>
                                                <button className="absolute left-2.5 flex items-center text-primary/60 hover:text-primary transition-colors cursor-pointer" title="Preview Voice">
                                                    <span className="material-symbols-outlined text-[18px]">play_circle</span>
                                                </button>
                                                <span className="material-symbols-outlined absolute right-2 text-[16px] text-slate-500 pointer-events-none">expand_more</span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-slate-600 bg-white/5 px-2 py-0.5 rounded font-mono">0:24</span>
                                    </div>
                                    <textarea className="w-full bg-transparent border-none p-0 text-slate-100 text-lg leading-relaxed resize-none focus:ring-0 placeholder:text-slate-700 rounded selection:bg-primary/30" rows="1" spellCheck="false" defaultValue="Absolutely. Let's dive into the new models released yesterday. I heard they have multimodal capabilities now?"></textarea>
                                </div>
                            </div>
                            <div className="flex justify-center pt-8">
                                <button className="flex items-center gap-2 text-slate-500 hover:text-primary transition-all px-6 py-2.5 rounded-full hover:bg-primary/5 border border-dashed border-slate-800 hover:border-primary/50 group">
                                    <span className="material-symbols-outlined text-lg group-hover:rotate-90 transition-transform">add</span>
                                    <span className="text-sm font-bold uppercase tracking-wider">Add Dialogue Block</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
                    <div className="h-40 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent"></div>
                    <div className="absolute bottom-0 w-full flex justify-center pb-10 pointer-events-auto">
                        <button className="group relative flex items-center gap-4 bg-primary text-slate-900 px-10 py-5 rounded-full font-bold text-lg shadow-[0_10px_40px_-10px_rgba(0,189,199,0.5)] hover:shadow-[0_15px_50px_-5px_rgba(0,189,199,0.6)] transition-all transform hover:-translate-y-1 active:scale-95">
                            <span className="material-symbols-outlined text-2xl">graphic_eq</span>
                            <span>Generate Audio</span>
                            <span className="bg-black/10 px-2 py-0.5 rounded text-xs font-mono font-bold">~2 MIN</span>
                            <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none"></div>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EditorPage;
