import React from 'react';

const PlayerPage = () => {
    return (
        <div className="bg-bg-main text-text-main font-display min-h-full w-full flex flex-col transition-colors duration-500 relative">
            <div className="absolute inset-x-0 top-0 h-[50vh] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>

            <header className="flex items-center justify-between mb-16 relative z-10 pt-4">
                <nav className="flex items-center text-sm font-bold text-text-muted">
                    <a className="hover:text-primary transition-colors" href="#">Library</a>
                    <span className="mx-3 opacity-30">/</span>
                    <span className="dark:text-white text-text-main">Tech Trends Ep. 4</span>
                </nav>
                <div className="flex items-center gap-3">
                    <button className="size-10 rounded-full bg-bg-surface border border-border-main flex items-center justify-center text-text-muted hover:text-primary transition-all">
                        <span className="material-symbols-outlined text-[22px]">download</span>
                    </button>
                    <button className="size-10 rounded-full bg-bg-surface border border-border-main flex items-center justify-center text-text-muted hover:text-primary transition-all">
                        <span className="material-symbols-outlined text-[22px]">share</span>
                    </button>
                </div>
            </header>

            <div className="max-w-4xl mx-auto w-full relative z-10 flex flex-col items-center">
                <div className="size-64 md:size-80 rounded-[3rem] bg-gradient-to-br from-primary/20 to-blue-600/20 p-1 mb-12 shadow-2xl relative group">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="w-full h-full bg-bg-surface rounded-[2.8rem] flex items-center justify-center border border-border-main overflow-hidden relative">
                         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop')] bg-cover opacity-20 filter grayscale"></div>
                         <span className="material-symbols-outlined text-[80px] text-primary drop-shadow-glow relative z-10">graphic_eq</span>
                    </div>
                </div>

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black dark:text-white tracking-tighter mb-4 font-heading">The Future of AI</h1>
                    <p className="text-lg text-text-muted font-bold tracking-tight">Tech Trends • Season 1, Episode 4</p>
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-2xl mb-12">
                    <div className="flex items-center justify-between text-[11px] font-black text-text-muted uppercase tracking-[0.2em] mb-4">
                        <span>04:20</span>
                        <span>12:45</span>
                    </div>
                    <div className="h-3 bg-bg-surface rounded-full border border-border-main relative overflow-hidden shadow-inner cursor-pointer group">
                        <div className="absolute top-0 left-0 h-full w-1/3 bg-primary shadow-glow transition-all duration-300"></div>
                        <div className="absolute top-1/2 -translate-y-1/2 left-1/3 size-5 bg-white dark:bg-primary rounded-full shadow-glow opacity-0 group-hover:opacity-100 transition-opacity scale-125 border-4 border-bg-main"></div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-12 mb-16">
                    <button className="text-text-muted hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[32px]">replay_10</span>
                    </button>
                    <button className="size-24 rounded-[2.5rem] bg-primary text-[#0a0c0e] flex items-center justify-center shadow-glow hover:shadow-[0_20px_50px_rgba(0,189,199,0.4)] transition-all transform hover:-translate-y-1 hover:scale-105 active:scale-95">
                        <span className="material-symbols-outlined text-[48px] fill-1">play_arrow</span>
                    </button>
                    <button className="text-text-muted hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[32px]">forward_10</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlayerPage;
