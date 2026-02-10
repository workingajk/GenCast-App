import React, { useState } from 'react';
import { Mic, Search, Users } from 'lucide-react';

export const TopicInput = ({ onGenerate, isGenerating }) => {
    const [topic, setTopic] = useState('');
    const [speakers, setSpeakers] = useState(2);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (topic.trim()) {
            onGenerate(topic, speakers);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-bg-surface p-8 rounded-3xl shadow-xl dark:shadow-2xl border border-border-main relative overflow-hidden group transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-primary border border-primary/20 shadow-glow">
                        <Mic size={40} className="group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h2 className="text-3xl font-bold font-heading dark:text-white">Create Your Podcast</h2>
                    <p className="text-text-muted mt-3 leading-relaxed">Enter a topic, and AI will research, script, and record a podcast for you.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-3 ml-1">Podcast Topic</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g. The future of quantum computing"
                                className="w-full bg-bg-main px-5 py-4 pl-12 rounded-2xl border border-border-main text-text-main placeholder:text-text-muted/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                                disabled={isGenerating}
                            />
                            <Search className="absolute left-4 top-[1.1rem] text-text-muted/50" size={20} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-3 ml-1">Number of Speakers</label>
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setSpeakers(num)}
                                    className={`flex items-center justify-center gap-2 py-4 rounded-2xl border font-bold transition-all ${speakers === num
                                            ? 'border-primary bg-primary/10 text-primary shadow-glow'
                                            : 'border-border-main bg-bg-main hover:bg-bg-surface text-text-muted hover:text-text-main'
                                        }`}
                                    disabled={isGenerating}
                                >
                                    <Users size={18} />
                                    <span>{num}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!topic.trim() || isGenerating}
                        className="w-full py-5 bg-primary hover:bg-primary-hover disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-text-muted text-[#0a0c0e] rounded-2xl font-bold text-lg shadow-glow hover:shadow-[0_15px_40px_rgba(0,189,199,0.4)] transition-all transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                        {isGenerating ? (
                            <>
                                <div className="w-6 h-6 border-[3px] border-[#0a0c10]/30 border-t-[#0a0c10] rounded-full animate-spin"></div>
                                <span className="animate-pulse">Researching Topic...</span>
                            </>
                        ) : (
                            <>
                                <span>Generate Episode Plan</span>
                                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
