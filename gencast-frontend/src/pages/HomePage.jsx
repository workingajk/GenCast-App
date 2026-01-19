import React from 'react';

const HomePage = () => {
    return (
        <div className="bg-bg-deep text-gray-100 font-display overflow-hidden h-screen flex">
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
                            <a className="w-full flex flex-col gap-1 px-4 py-3 rounded-xl hover:bg-white/5 transition-all group border border-transparent" href="#">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-gray-500 group-hover:text-primary text-[20px] sidebar-mini-content hidden">rocket_launch</span>
                                        <span className="text-sm font-medium text-gray-300 group-hover:text-white truncate sidebar-full-content w-32">Space Exploration</span>
                                    </div>
                                </div>
                                <span className="text-[11px] text-gray-500 group-hover:text-gray-400 sidebar-full-content">Oct 22 • 45:20 mins</span>
                            </a>
                            <a className="w-full flex flex-col gap-1 px-4 py-3 rounded-xl hover:bg-white/5 transition-all group border border-transparent" href="#">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-gray-500 group-hover:text-primary text-[20px] sidebar-mini-content hidden">eco</span>
                                        <span className="text-sm font-medium text-gray-300 group-hover:text-white truncate sidebar-full-content w-32">Sustainable Living</span>
                                    </div>
                                </div>
                                <span className="text-[11px] text-gray-500 group-hover:text-gray-400 sidebar-full-content">Oct 20 • 28:15 mins</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t border-white/5">
                    <button className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-white/5 transition-colors text-left group">
                        <div className="size-9 min-w-[36px] rounded-full bg-cover bg-center ring-2 ring-white/10 group-hover:ring-primary/50 transition-all" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDoNEyfqmjziEedpVoaqSRsTI-cTj7HVr9IS0NEejeRCu3F_1hNDDA5aIbFftmmYu_D4q8I2UXynCtBEa668gIsGgnQQxIx7uP16SefuJylYZJxVizHHtBlnm4CQPpJI_IqE-rgiTtFMawp9p1bvXxmp-CoP224O2G_kS50hao340mpbtDd3GDEbDke8-wH4ccZdIz2LCnWeD__HBdH-4YRfkHwEKsmgSzVpIv8ekyBpfubOIt5ROPjq7BbR3DuYgXrsRvsVKmQp8QP")'}}></div>
                        <div className="flex-1 min-w-0 sidebar-full-content">
                            <p className="text-sm font-semibold text-white truncate">Elena R.</p>
                            <p className="text-[11px] text-gray-500 font-medium truncate uppercase tracking-wider">Pro Tier</p>
                        </div>
                        <span className="material-symbols-outlined text-gray-500 group-hover:text-white transition-colors sidebar-full-content">settings</span>
                    </button>
                </div>
            </aside>
            <main className="flex-1 flex flex-col relative h-full min-w-0 bg-bg-deep overflow-hidden">
                <header className="flex items-center justify-end px-8 py-4 absolute top-0 right-0 left-0 z-10">
                    <div className="flex gap-2">
                        <button className="flex items-center justify-center size-9 rounded-full bg-bg-surface text-gray-400 hover:text-white hover:bg-bg-input transition-all border border-white/5">
                            <span className="material-symbols-outlined text-[20px]">notifications</span>
                        </button>
                        <button className="flex items-center justify-center size-9 rounded-full bg-primary text-[#0a0c0e] hover:bg-primary-hover transition-all border border-primary/20">
                            <span className="material-symbols-outlined text-[20px] font-bold">light_mode</span>
                        </button>
                    </div>
                </header>
                <div className="flex-1 flex flex-col items-center justify-center w-full px-6 overflow-y-auto">
                    <div className="flex flex-col items-center justify-center max-w-2xl w-full text-center space-y-10 pb-24">
                        <div aria-hidden="true" className="h-16 flex items-end justify-center gap-1.5 opacity-90">
                            <div className="w-1.5 bg-primary rounded-full h-4 opacity-40"></div>
                            <div className="w-1.5 bg-primary rounded-full h-8 opacity-60"></div>
                            <div className="w-1.5 bg-primary rounded-full h-12 opacity-80"></div>
                            <div className="w-1.5 bg-primary rounded-full h-6 opacity-50"></div>
                            <div className="w-1.5 bg-primary rounded-full h-16"></div>
                            <div className="w-1.5 bg-primary rounded-full h-10 opacity-70"></div>
                            <div className="w-1.5 bg-primary rounded-full h-14 opacity-90"></div>
                            <div className="w-1.5 bg-primary rounded-full h-5 opacity-40"></div>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-5xl md:text-6xl font-heading font-bold text-white tracking-tight leading-tight">Create your <span className="text-primary">Podcast</span></h2>
                            <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">Transform your scripts or topics into high-fidelity AI-powered conversations.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                            <button className="px-5 py-3 rounded-xl border border-white/5 bg-bg-surface hover:bg-bg-input hover:border-primary/40 text-sm text-gray-300 text-left transition-all flex items-center gap-3 group">
                                <span className="material-symbols-outlined text-primary/60 group-hover:text-primary text-[18px]">science</span>
                                Quantum Physics 101
                            </button>
                            <button className="px-5 py-3 rounded-xl border border-white/5 bg-bg-surface hover:bg-bg-input hover:border-primary/40 text-sm text-gray-300 text-left transition-all flex items-center gap-3 group">
                                <span className="material-symbols-outlined text-primary/60 group-hover:text-primary text-[18px]">newspaper</span>
                                Tech News Roundup
                            </button>
                        </div>
                    </div>
                </div>
                <div className="w-full pb-10 pt-4 px-6 md:px-12 flex justify-center bg-gradient-to-t from-bg-deep via-bg-deep to-transparent">
                    <div className="w-full max-w-3xl flex flex-col gap-4 relative">
                        <div className="flex justify-center md:justify-start">
                            <div className="bg-bg-surface p-1 rounded-2xl inline-flex border border-white/10 shadow-xl backdrop-blur-md">
                                <label className="cursor-pointer relative">
                                    <input className="peer sr-only" name="speakers" type="radio" value="1"/>
                                    <div className="px-5 py-2 rounded-xl text-xs font-bold text-gray-400 peer-checked:bg-white/10 peer-checked:text-primary transition-all flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">person</span>
                                        1 Host
                                    </div>
                                </label>
                                <label className="cursor-pointer relative">
                                    <input defaultChecked className="peer sr-only" name="speakers" type="radio" value="2"/>
                                    <div className="px-5 py-2 rounded-xl text-xs font-bold text-gray-400 peer-checked:bg-white/10 peer-checked:text-primary transition-all flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">group</span>
                                        Duo
                                    </div>
                                </label>
                                <label className="cursor-pointer relative">
                                    <input className="peer sr-only" name="speakers" type="radio" value="3"/>
                                    <div className="px-5 py-2 rounded-xl text-xs font-bold text-gray-400 peer-checked:bg-white/10 peer-checked:text-primary transition-all flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">groups</span>
                                        Panel (3)
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div className="relative group rounded-3xl bg-bg-input shadow-glow border border-white/5 transition-all focus-within:border-primary/40 focus-within:bg-[#1c232c]">
                            <textarea className="w-full bg-transparent text-white placeholder-gray-600 rounded-3xl border-none focus:ring-0 resize-none py-5 pl-6 pr-16 min-h-[110px] text-base leading-relaxed" placeholder="Enter your script, a topic, or paste a link to convert into a podcast..."></textarea>
                            <div className="absolute bottom-4 right-4 flex items-center gap-3">
                                <button className="p-2 text-gray-500 hover:text-white transition-colors rounded-xl hover:bg-white/5" title="Attach Source">
                                    <span className="material-symbols-outlined text-[24px]">attachment</span>
                                </button>
                                <button className="size-11 flex items-center justify-center rounded-2xl bg-primary hover:bg-primary-hover text-[#0a0c0e] transition-all shadow-lg hover:shadow-primary/25 group/btn">
                                    <span className="material-symbols-outlined text-[24px] font-bold group-hover/btn:scale-110 transition-transform">bolt</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            <p className="text-[10px] text-gray-600 font-medium tracking-wide uppercase">
                                Tokens: <span className="text-gray-400">120/5000</span>
                            </p>
                            <div className="h-1 w-1 rounded-full bg-gray-800"></div>
                            <p className="text-[10px] text-gray-600 font-medium tracking-wide uppercase">
                                AI Content Warning: Review before export
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
