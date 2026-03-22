import React from 'react';

const EditorPage = () => {
    return (
        <div className="bg-[#f4f4f4] dark:bg-bg-main text-text-main font-display min-h-screen w-full flex flex-col transition-colors duration-500 relative pb-20 overflow-x-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 pattern-grid opacity-[0.05] dark:opacity-[0.1] pointer-events-none"></div>
            
            <header className="flex items-center justify-between mb-12 relative z-10 pt-4">
                <div className="flex items-center gap-6">
                    <nav className="flex items-center text-xs font-black uppercase tracking-widest text-[#0a0c0e]/40 dark:text-text-muted">
                        <a className="hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary" href="#">Projects</a>
                        <span className="mx-3 opacity-30 text-xl">/</span>
                        <span className="dark:text-white text-[#0a0c0e] flex items-center gap-3">
                            <span className="text-xl font-black tracking-tighter">Tech Trends Ep. 4</span>
                            <span className="px-3 py-1 bg-primary/20 text-primary border-2 border-primary font-black uppercase tracking-widest">Draft</span>
                        </span>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-[#0a0c0e] dark:text-text-muted px-4 py-2 bg-white dark:bg-bg-surface border-4 border-[#0a0c0e] dark:border-border-main shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                        <div className="size-2 bg-green-500 animate-pulse border border-black/20"></div>
                        AUTO-SAVED
                    </div>
                </div>
            </header>

            <div className="relative z-10">
                <div className="mb-12">
                    <h1 className="text-7xl font-black dark:text-white tracking-tighter mb-4 font-heading uppercase text-[#0a0c0e] drop-shadow-[4px_4px_0px_#00f0ff]">Tech Trends Ep. 4</h1>
                    <div className="flex gap-8 text-[#0a0c0e]/60 dark:text-text-muted text-xs font-black uppercase tracking-[0.2em]">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-[24px] font-black">timer</span>
                            <span>Est. Duration: 2m 15s</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-[24px] font-black">group</span>
                            <span>2 Speakers</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Placeholder for actual editor components if needed or just styling demonstration */}
                    <div className="p-8 bg-white dark:bg-[#12171d] border-4 border-[#0a0c0e] dark:border-primary shadow-brutal dark:shadow-[8px_8px_0px_rgba(0,0,0,1)] group hover:-translate-y-1 transition-all">
                         <div className="flex items-start gap-8">
                            <div className="shrink-0">
                                <div className="size-16 bg-primary/20 border-4 border-primary/40 flex items-center justify-center text-primary shadow-[2px_2px_0px_#0a0c0e]">
                                    <span className="material-symbols-outlined text-[32px] font-black">mic</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">Host</span>
                                    <span className="text-xs font-black text-[#0a0c0e]/30 dark:text-text-muted font-mono tracking-widest bg-[#0a0c0e]/5 dark:bg-white/5 px-2 py-1">00:00 - 00:15</span>
                                </div>
                                <p className="text-2xl text-[#0a0c0e] dark:text-white font-black leading-tight tracking-tight">
                                    "Welcome back to another episode of Tech Trends. Today, we're diving deep into the world of AI-generated content."
                                </p>
                            </div>
                         </div>
                    </div>

                    <div className="p-8 bg-white dark:bg-[#12171d] border-4 border-[#0a0c0e] dark:border-primary shadow-brutal dark:shadow-[8px_8px_0px_rgba(0,0,0,1)] group hover:-translate-y-1 transition-all">
                         <div className="flex items-start gap-8">
                            <div className="shrink-0">
                                <div className="size-16 bg-accent-purple/20 border-4 border-accent-purple/40 flex items-center justify-center text-accent-purple shadow-[2px_2px_0px_#0a0c0e]">
                                    <span className="material-symbols-outlined text-[32px] font-black">person</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black text-accent-purple uppercase tracking-[0.3em]">Guest</span>
                                    <span className="text-xs font-black text-[#0a0c0e]/30 dark:text-text-muted font-mono tracking-widest bg-[#0a0c0e]/5 dark:bg-white/5 px-2 py-1">00:15 - 00:45</span>
                                </div>
                                <p className="text-2xl text-[#0a0c0e] dark:text-white font-black leading-tight tracking-tight">
                                    "It's great to be here! AI is truly changing how we think about creativity and production."
                                </p>
                            </div>
                         </div>
                    </div>
                </div>

                <div className="mt-16 flex justify-center">
                    <button className="flex items-center gap-4 bg-primary hover:bg-[#0a0c0e] text-[#0a0c0e] hover:text-primary px-12 py-6 border-4 border-[#0a0c0e] font-black text-xl uppercase tracking-[0.2em] shadow-[10px_10px_0px_#0a0c0e] dark:shadow-[10px_10px_0px_#00f0ff] transition-all transform hover:-translate-y-1 active:translate-y-1 active:shadow-none">
                        <span className="material-symbols-outlined text-[32px] font-black">graphic_eq</span>
                        GENERATE AUDIO
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditorPage;
