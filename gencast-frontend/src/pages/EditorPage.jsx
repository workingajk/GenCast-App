import React from 'react';

const EditorPage = () => {
    return (
        <div className="bg-bg-main text-text-main font-display min-h-full w-full flex flex-col transition-colors duration-500 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,189,199,0.05),transparent_50%)] pointer-events-none"></div>
            
            <header className="flex items-center justify-between mb-12 relative z-10 pt-4">
                <div className="flex items-center gap-6">
                    <nav className="flex items-center text-sm font-bold text-text-muted">
                        <a className="hover:text-primary transition-colors" href="#">Projects</a>
                        <span className="mx-3 opacity-30">/</span>
                        <span className="dark:text-white text-text-main flex items-center gap-2">
                            Tech Trends Ep. 4
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-primary/20 text-primary font-black uppercase tracking-widest border border-primary/20">Draft</span>
                        </span>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-text-muted px-4 py-1.5 bg-bg-surface rounded-full border border-border-main">
                        <div className="size-1.5 rounded-full bg-green-500 animate-pulse"></div>
                        AUTO-SAVED
                    </div>
                </div>
            </header>

            <div className="relative z-10">
                <div className="mb-12">
                    <h1 className="text-5xl font-black dark:text-white tracking-tighter mb-4 font-heading">Tech Trends Ep. 4</h1>
                    <div className="flex gap-8 text-text-muted text-xs font-bold uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[20px]">timer</span>
                            <span>Est. Duration: 2m 15s</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[20px]">group</span>
                            <span>2 Speakers</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {/* Placeholder for actual editor components if needed or just styling demonstration */}
                    <div className="p-8 rounded-[2.5rem] bg-bg-surface border border-border-main shadow-xl dark:shadow-2xl group hover:border-primary/20 transition-all">
                         <div className="flex items-start gap-6">
                            <div className="shrink-0">
                                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                    <span className="material-symbols-outlined">mic</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">Host</span>
                                    <span className="text-[10px] font-bold text-text-muted font-mono">00:00 - 00:15</span>
                                </div>
                                <p className="text-lg text-text-main leading-relaxed">
                                    "Welcome back to another episode of Tech Trends. Today, we're diving deep into the world of AI-generated content."
                                </p>
                            </div>
                         </div>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-bg-surface border border-border-main shadow-xl dark:shadow-2xl group hover:border-primary/20 transition-all">
                         <div className="flex items-start gap-6">
                            <div className="shrink-0">
                                <div className="size-12 rounded-2xl bg-accent-purple/10 flex items-center justify-center text-accent-purple border border-accent-purple/20">
                                    <span className="material-symbols-outlined">person</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-black text-accent-purple uppercase tracking-[0.2em]">Guest</span>
                                    <span className="text-[10px] font-bold text-text-muted font-mono">00:15 - 00:45</span>
                                </div>
                                <p className="text-lg text-text-main leading-relaxed">
                                    "It's great to be here! AI is truly changing how we think about creativity and production."
                                </p>
                            </div>
                         </div>
                    </div>
                </div>

                <div className="mt-12 flex justify-center">
                    <button className="flex items-center gap-3 bg-primary text-[#0a0c0e] px-10 py-5 rounded-[2rem] font-black text-lg shadow-glow hover:shadow-[0_20px_50px_rgba(0,189,199,0.3)] transition-all transform hover:-translate-y-1 active:scale-95">
                        <span className="material-symbols-outlined text-[24px]">graphic_eq</span>
                        GENERATE AUDIO
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditorPage;
