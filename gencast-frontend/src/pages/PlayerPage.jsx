import React from 'react';

const PlayerPage = () => {
    return (
        <div className="bg-background-dark text-white font-display overflow-hidden h-screen flex">
            <input className="hidden peer" id="sidebar-toggle" type="checkbox"/>
            <aside className="w-72 bg-surface-darker border-r border-border-dark flex flex-col flex-shrink-0 h-full">
                <div className="p-6 pb-2">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="size-8 rounded bg-primary flex items-center justify-center text-black">
                            <span className="material-symbols-outlined text-[20px]">graphic_eq</span>
                        </div>
                        <div>
                            <h1 className="text-white text-lg font-bold leading-none tracking-tight">PodGen AI</h1>
                            <p className="text-slate-500 text-xs font-medium">Studio Pro</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/5 transition-colors group text-left">
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">add_circle</span>
                            <span className="text-sm font-medium whitespace-nowrap">New Project</span>
                        </button>
                        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/5 transition-colors group text-left">
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">dashboard</span>
                            <span className="text-sm font-medium whitespace-nowrap">Templates</span>
                        </button>
                        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/5 transition-colors group text-left">
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">settings</span>
                            <span className="text-sm font-medium whitespace-nowrap">Settings</span>
                        </button>
                    </div>
                </div>
                <div className="mt-4 px-6 overflow-hidden">
                    <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Recent History</h3>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1 p-3 rounded-lg bg-surface-dark border border-primary/20 relative overflow-hidden group cursor-pointer shadow-lg shadow-primary/5">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-white text-sm font-bold truncate pr-2">The Future of AI</span>
                                <span className="material-symbols-outlined text-primary text-[16px]">graphic_eq</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-500">
                                <span>15:30</span>
                                <span>Just now</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 p-3 rounded-lg hover:bg-white/5 border border-transparent transition-colors cursor-pointer">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-slate-400 text-sm font-medium truncate pr-2">Tech Trends 2024</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-600">
                                <span>42:12</span>
                                <span>Yesterday</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-auto p-6 border-t border-border-dark whitespace-nowrap overflow-hidden">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-slate-800 bg-cover bg-center border border-border-dark flex-shrink-0" data-alt="User profile picture" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA2rjwk_pwHxAGw7X5WCXwUKbmvkOrmIfXdS_qwu3LiFHUOPf5nFOs5s_7tgan8oqrp3KdTnjRZY35WssfvoQPGwca12TH9VTIdqb-fMFMzRINT2POMFyibqQgzA-r5dLLOVoICJ-fs3AC04isn-8amx6yb2fUdrAHgU5R08jUkbqm-qRd_YNx0aK2GT7mfVZa1QkXOrFxOAAtgdW_eOq6TokrR5hiUf8jRI13DwD-jKNr1aYUyLfGHHJRVprNk9653O-6bnIkPoPpR')"}}></div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-white">Elena R.</span>
                            <span className="text-xs text-slate-500">Pro Plan</span>
                        </div>
                    </div>
                </div>
            </aside>
            <main className="flex-1 flex flex-col h-full min-w-0 bg-background-dark relative">
                <header className="h-16 border-b border-border-dark flex items-center justify-between px-8 bg-surface-darker/80 backdrop-blur-md z-20">
                    <div className="flex items-center gap-4">
                        <label className="size-8 flex items-center justify-center rounded-lg border border-border-dark hover:bg-white/5 cursor-pointer text-slate-400 hover:text-white transition-all" htmlFor="sidebar-toggle">
                            <span className="material-symbols-outlined transition-transform duration-300" id="collapse-icon">menu_open</span>
                        </label>
                        <div className="h-6 w-px bg-border-dark mx-1"></div>
                        <nav className="flex items-center text-sm font-medium text-slate-500">
                            <a className="hover:text-white transition-colors" href="#">Projects</a>
                            <span className="material-symbols-outlined text-[16px] mx-2">chevron_right</span>
                            <span className="text-primary bg-primary/10 px-3 py-1 rounded-full text-xs font-bold border border-primary/20">Final Result</span>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="hidden md:flex text-slate-500 text-sm items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">cloud_done</span>
                            Saved
                        </span>
                        <div className="hidden md:block h-6 w-px bg-border-dark mx-2"></div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-black text-sm font-bold rounded-lg hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]">
                            <span className="material-symbols-outlined text-[20px]">download</span>
                            Export Audio
                        </button>
                    </div>
                </header>
                <div className="flex-1 overflow-hidden relative flex flex-col">
                    <div className="flex-shrink-0 bg-surface-dark border-b border-border-dark p-8 shadow-2xl z-10 transition-all">
                        <div className="max-w-[1400px] mx-auto w-full">
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex gap-6">
                                    <div className="size-28 rounded-2xl overflow-hidden shadow-2xl border border-border-dark relative group">
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors z-10"></div>
                                        <img className="w-full h-full object-cover" data-alt="Cover art" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRoNBlz-r5zzo-Q8vzY7qTWJBpUTNgKBc4Fr6nQaq3sqjK6uLVm9LCusy-D05l7QSw6NKdmqBkfRTIvCLcLbzRxZSBx8RdaxvkxrkGT2L6be45MObhh4csjLUNJiY38RWv5BDVt16o1LaqNQ7cPhhgs7aPVh8m6FtkRs_KV8W59XTv7Que-MXw5II6CB6UWti8scGX9ZWBbBpKvQsvvW_6myTO04eVJ3RRbLOEAjXYMOINQwemqwDefE97EnQfu2lBchVUyZYhXe9A"/>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h1 className="text-4xl font-bold text-white font-mono tracking-tight mb-2 neon-text-glow">The Future of AI in Design</h1>
                                        <div className="flex items-center gap-3">
                                            <span className="px-2 py-0.5 rounded bg-accent/10 border border-accent/30 text-accent text-[10px] uppercase tracking-widest font-bold">Episode 1</span>
                                            <span className="text-slate-500 text-sm font-medium tracking-wide">Oct 27, 2023 • 15:30 Total</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button className="size-12 rounded-xl border border-border-dark bg-surface-darker flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-all" title="Share">
                                        <span className="material-symbols-outlined text-[24px]">ios_share</span>
                                    </button>
                                    <button className="size-12 rounded-xl border border-border-dark bg-surface-darker flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-all" title="Audio Settings">
                                        <span className="material-symbols-outlined text-[24px]">tune</span>
                                    </button>
                                </div>
                            </div>
                            <div className="bg-surface-darker rounded-[2rem] p-6 border border-border-dark shadow-inner shadow-black/20">
                                <div className="h-24 flex items-center justify-between gap-[4px] w-full px-4 mb-6 waveform-container" id="waveform">
                                    <div className="flex-1 flex items-end justify-center h-full gap-[6px]">
                                        <div className="w-2 bg-accent h-[20%] rounded-full opacity-60"></div>
                                        <div className="w-2 bg-accent h-[40%] rounded-full opacity-70"></div>
                                        <div className="w-2 bg-accent h-[30%] rounded-full"></div>
                                        <div className="w-2 bg-accent h-[60%] rounded-full shadow-[0_0_10px_#00F0FF]"></div>
                                        <div className="w-2 bg-accent h-[25%] rounded-full"></div>
                                        <div className="w-2 bg-accent h-[50%] rounded-full shadow-[0_0_10px_#00F0FF]"></div>
                                        <div className="w-2 bg-accent h-[80%] rounded-full shadow-[0_0_15px_#00F0FF]"></div>
                                        <div className="w-2 bg-accent h-[55%] rounded-full"></div>
                                        <div className="w-2 bg-accent h-[40%] rounded-full shadow-[0_0_10px_#00F0FF]"></div>
                                        <div className="w-2 bg-accent h-[70%] rounded-full"></div>
                                        <div className="w-0.5 bg-white/40 h-full mx-2"></div>
                                        <div className="w-2 bg-primary h-[50%] rounded-full shadow-[0_0_10px_#39FF14]"></div>
                                        <div className="w-2 bg-primary h-[30%] rounded-full"></div>
                                        <div className="w-2 bg-primary h-[65%] rounded-full shadow-[0_0_15px_#39FF14]"></div>
                                        <div className="w-2 bg-primary h-[40%] rounded-full"></div>
                                        <div className="w-2 bg-primary h-[90%] rounded-full shadow-[0_0_20px_#39FF14]"></div>
                                        <div className="w-2 bg-primary h-[70%] rounded-full shadow-[0_0_15px_#39FF14]"></div>
                                        <div className="w-2 bg-primary h-[50%] rounded-full"></div>
                                        <div className="w-2 bg-primary h-[30%] rounded-full opacity-60"></div>
                                        <div className="w-2 bg-slate-700 h-[50%] rounded-full"></div>
                                        <div className="w-2 bg-slate-700 h-[70%] rounded-full"></div>
                                        <div className="w-2 bg-slate-700 h-[40%] rounded-full"></div>
                                        <div className="w-2 bg-slate-700 h-[60%] rounded-full"></div>
                                        <div className="w-2 bg-slate-700 h-[30%] rounded-full"></div>
                                        <div className="w-2 bg-slate-700 h-[50%] rounded-full"></div>
                                        <div className="w-2 bg-slate-700 h-[75%] rounded-full"></div>
                                        <div className="w-2 bg-slate-700 h-[45%] rounded-full"></div>
                                        <div className="w-2 bg-slate-700 h-[25%] rounded-full"></div>
                                        <div className="w-2 bg-slate-700 h-[55%] rounded-full"></div>
                                        <div className="w-2 bg-slate-700 h-[40%] rounded-full"></div>
                                        <div className="w-2 bg-slate-700 h-[65%] rounded-full"></div>
                                        <div className="w-2 bg-slate-700 h-[35%] rounded-full"></div>
                                        <div className="w-2 bg-slate-700 h-[50%] rounded-full"></div>
                                        <div className="w-2 bg-slate-700 h-[70%] rounded-full"></div>
                                        <div className="w-2 bg-slate-700 h-[40%] rounded-full"></div>
                                        <div className="w-2 bg-slate-700 h-[55%] rounded-full"></div>
                                        <div className="w-2 bg-slate-700 h-[30%] rounded-full"></div>
                                        <div className="w-2 bg-slate-700 h-[60%] rounded-full"></div>
                                        <div className="w-2 bg-slate-700 h-[40%] rounded-full"></div>
                                        <div className="w-2 bg-slate-700 h-[25%] rounded-full"></div>
                                        <div className="w-2 bg-slate-700 h-[50%] rounded-full"></div>
                                    </div>
                                </div>
                                <div className="px-2 mb-6">
                                    <div className="w-full bg-slate-800/50 h-2 rounded-full relative cursor-pointer group">
                                        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent to-primary w-[35%] rounded-full group-hover:brightness-110 transition-all"></div>
                                        <div className="absolute top-1/2 -translate-y-1/2 left-[35%] size-4 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-[0_0_10px_white] transition-opacity"></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between px-4">
                                    <div className="text-sm font-mono text-accent font-bold w-16">05:22</div>
                                    <div className="flex items-center gap-8 md:gap-10">
                                        <button className="text-slate-400 hover:text-white transition-all transform active:scale-90" title="Back 10s">
                                            <span className="material-symbols-outlined text-[32px]">replay_10</span>
                                        </button>
                                        <div className="flex items-center gap-6">
                                            <button className="size-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                                <span className="material-symbols-outlined text-[40px] fill-1">pause</span>
                                            </button>
                                        </div>
                                        <button className="text-slate-400 hover:text-white transition-all transform active:scale-90" title="Forward 10s">
                                            <span className="material-symbols-outlined text-[32px]">forward_10</span>
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-6 w-32 justify-end">
                                        <div className="relative">
                                            <button className="flex items-center gap-2 text-sm font-bold text-slate-300 bg-surface-dark border border-border-dark hover:border-slate-500 px-4 py-2 rounded-xl transition-all">
                                                1.25x
                                                <span className="material-symbols-outlined text-[18px]">expand_more</span>
                                            </button>
                                        </div>
                                        <div className="text-sm font-mono text-slate-500">15:30</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 bg-background-dark">
                        <div className="max-w-3xl mx-auto pb-24">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex flex-col">
                                    <h2 className="text-white text-2xl font-bold font-mono">Transcript</h2>
                                    <p className="text-slate-500 text-sm">Real-time narration syncing</p>
                                </div>
                                <div className="flex bg-surface-darker p-1 rounded-xl border border-border-dark">
                                    <button className="text-xs font-bold text-primary bg-primary/10 px-5 py-2.5 rounded-lg border border-primary/20 shadow-sm">Reader Mode</button>
                                    <button className="text-xs font-bold text-slate-500 hover:text-white px-5 py-2.5 rounded-lg transition-colors">Key Takeaways</button>
                                </div>
                            </div>
                            <div className="space-y-12">
                                <div className="flex gap-8 opacity-40 hover:opacity-60 transition-opacity group">
                                    <div className="w-16 flex-shrink-0 flex flex-col items-end pt-1">
                                        <span className="text-xs font-bold text-slate-600 uppercase tracking-widest group-hover:text-slate-400">00:00</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-[0.2em] font-mono">HOST (SARAH)</h4>
                                        <p className="text-slate-300 leading-relaxed text-lg">
                                            Welcome back to the Design Future podcast. Today, we’re diving into a topic that’s been on everyone’s mind lately: the intersection of artificial intelligence and creative workflows.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-8 relative group">
                                    <div className="absolute -left-10 top-2 bottom-2 w-1.5 bg-primary rounded-full shadow-[0_0_20px_#39FF14]"></div>
                                    <div className="w-16 flex-shrink-0 flex flex-col items-end pt-1">
                                        <span className="text-xs font-bold text-primary uppercase tracking-widest neon-text-glow">01:14</span>
                                    </div>
                                    <div className="flex-1 p-6 rounded-2xl bg-surface-dark/60 border border-primary/20 shadow-2xl backdrop-blur-sm">
                                        <h4 className="text-[10px] font-bold text-primary mb-3 uppercase tracking-[0.2em] font-mono flex items-center gap-3">
                                            GUEST (MARCUS)
                                            <span className="flex h-2.5 w-2.5 relative">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary shadow-[0_0_8px_#39FF14]"></span>
                                            </span>
                                        </h4>
                                        <p className="text-white leading-relaxed text-xl font-medium">
                                            Thanks for having me, Sarah. It’s honestly a fascinating time to be in this industry. <span className="text-accent underline decoration-accent/40 decoration-2 underline-offset-4">We're seeing tools that don't just automate tasks</span>, but actually act as creative partners. It changes the entire dynamic of how we approach a blank canvas.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-8 opacity-40 hover:opacity-80 transition-opacity group">
                                    <div className="w-16 flex-shrink-0 flex flex-col items-end pt-1">
                                        <span className="text-xs font-bold text-slate-600 uppercase tracking-widest group-hover:text-slate-400">02:30</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-[0.2em] font-mono">HOST (SARAH)</h4>
                                        <p className="text-slate-400 leading-relaxed text-lg">
                                            That’s a great way to put it. A "creative partner." But do you think there's a risk of over-reliance? Where does the human intuition stop and the algorithm begin?
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="h-32"></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PlayerPage;
