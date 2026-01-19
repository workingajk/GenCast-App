import React from 'react';

const HomePage = () => {
    return (
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

            <div className="w-full pt-10 flex flex-col gap-4 relative">
                <div className="flex justify-center md:justify-start">
                    <div className="bg-bg-surface p-1 rounded-2xl inline-flex border border-white/10 shadow-xl backdrop-blur-md">
                        <label className="cursor-pointer relative">
                            <input className="peer sr-only" name="speakers" type="radio" value="1" />
                            <div className="px-5 py-2 rounded-xl text-xs font-bold text-gray-400 peer-checked:bg-white/10 peer-checked:text-primary transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">person</span>
                                1 Host
                            </div>
                        </label>
                        <label className="cursor-pointer relative">
                            <input defaultChecked className="peer sr-only" name="speakers" type="radio" value="2" />
                            <div className="px-5 py-2 rounded-xl text-xs font-bold text-gray-400 peer-checked:bg-white/10 peer-checked:text-primary transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">group</span>
                                Duo
                            </div>
                        </label>
                        <label className="cursor-pointer relative">
                            <input className="peer sr-only" name="speakers" type="radio" value="3" />
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
    );
};

export default HomePage;
