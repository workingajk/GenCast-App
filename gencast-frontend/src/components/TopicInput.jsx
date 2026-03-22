import React, { useState } from 'react';
import { Mic, Search, Users } from 'lucide-react';
import { clsx } from 'clsx';

export const TopicInput = ({ onGenerate, isGenerating }) => {
    const [topic, setTopic] = useState('');
    const [speakers, setSpeakers] = useState(2);
    const [characteristics, setCharacteristics] = useState(Array(2).fill(''));

    const handleSpeakerChange = (num) => {
        setSpeakers(num);
        setCharacteristics(prev => {
            const newChars = [...prev];
            if (num > prev.length) {
                // Add empty strings for new speakers
                for (let i = prev.length; i < num; i++) {
                    newChars.push('');
                }
            } else {
                // Truncate to new length
                newChars.length = num;
            }
            return newChars;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (topic.trim()) {
            onGenerate(topic, speakers, characteristics);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white dark:bg-bg-surface p-8 md:p-12 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-xl-saas relative overflow-hidden transition-all duration-300">
            <div className="relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">Create Podcast</h2>
                    <p className="text-slate-500 dark:text-text-muted font-medium max-w-md mx-auto">Enter a topic, and our AI agents will research, script, and record a studio-quality episode.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div>
                        <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 ml-1">Podcast Topic</label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g. The future of quantum computing"
                                className="w-full bg-slate-50 dark:bg-bg-main px-6 py-5 pl-14 rounded-2xl border border-slate-200 dark:border-white/5 text-text-main placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold"
                                disabled={isGenerating}
                            />
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={22} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 ml-1">Number of Speakers</label>
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => handleSpeakerChange(num)}
                                    className={clsx(
                                        "flex items-center justify-center gap-2 py-4 rounded-2xl font-black transition-all border-2 active:scale-95",
                                        speakers === num
                                            ? "bg-primary border-primary text-[#0a0c0e] shadow-glow"
                                            : "bg-slate-50 dark:bg-bg-main border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500 hover:border-slate-300 dark:hover:border-white/20"
                                    )}
                                    disabled={isGenerating}
                                >
                                    <Users size={18} />
                                    <span>{num}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-white/5">
                        <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1 ml-1">Speaker Characteristics</label>
                        <p className="text-sm text-slate-500 dark:text-text-muted ml-1 mb-6 font-medium">Define personality, role, or background for each speaker.</p>
                        <div className="space-y-6">
                            {characteristics.map((char, index) => (
                                <div key={index} className="relative">
                                    <label className="block text-xs font-bold text-slate-900 dark:text-text-main mb-3 ml-1">
                                        {index === 0 ? "Speaker 1 (Host)" : index === 1 ? "Speaker 2 (Guest)" : `Speaker ${index + 1}`}
                                    </label>
                                    <textarea
                                        value={char}
                                        onChange={(e) => {
                                            const newChars = [...characteristics];
                                            newChars[index] = e.target.value;
                                            setCharacteristics(newChars);
                                        }}
                                        maxLength={500}
                                        placeholder={index === 0 ? "e.g. A 30-year-old male professor who explains clearly." : "e.g. A curious student who asks many questions."}
                                        className="w-full bg-slate-50 dark:bg-bg-main px-5 py-4 rounded-2xl border border-slate-200 dark:border-white/5 text-text-main placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-y min-h-[100px] font-bold"
                                        disabled={isGenerating}
                                    />
                                    <div className="absolute bottom-4 right-4 text-[10px] font-mono text-slate-400 bg-slate-50 dark:bg-bg-main px-2 py-1 rounded-md">
                                        {char.length}/500
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!topic.trim() || isGenerating}
                        className="w-full py-6 mt-10 bg-primary hover:bg-primary-hover disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-text-muted text-[#0a0c0e] transition-all rounded-[2rem] font-black tracking-tight text-xl shadow-glow hover:shadow-[0_15px_30px_rgba(0,240,255,0.4)] flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                        {isGenerating ? (
                            <>
                                <div className="w-6 h-6 border-[3px] border-[#0a0c10]/20 border-t-[#0a0c10] rounded-full animate-spin"></div>
                                <span className="animate-pulse">Building Podcast...</span>
                            </>
                        ) : (
                            <>
                                <span>Generate Episode Plan</span>
                                <span className="material-symbols-outlined text-[24px] font-black">arrow_forward</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
