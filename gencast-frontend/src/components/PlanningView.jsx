import React from 'react';
import { FileText, Globe, ArrowRight, CheckCircle } from 'lucide-react';

export const PlanningView = ({
    outline,
    sources,
    onConfirm,
    isGeneratingScript
}) => {
    return (
        <div className="max-w-6xl xl:max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 text-text-main transition-colors duration-300">
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white dark:bg-bg-surface p-8 md:p-14 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-xl-saas relative overflow-hidden transition-all duration-300">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none transition-opacity dark:text-white text-slate-900">
                        <FileText size={200} />
                    </div>
                    <div className="flex items-center gap-5 mb-10">
                        <div className="p-4 bg-primary/10 text-primary rounded-2xl border border-primary/20 shadow-glow">
                            <FileText size={32} />
                        </div>
                        <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Episode Layout</h3>
                    </div>

                    <div className="space-y-10 relative z-10">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] mb-4 block ml-1">Podcast Title</label>
                            <p className="text-4xl font-black text-slate-900 dark:text-white leading-tight tracking-tight mb-2">{outline.title}</p>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] mb-4 block ml-1">Context & Research</label>
                            <p className="text-slate-600 dark:text-text-muted leading-relaxed text-balance text-lg font-medium mb-2">{outline.summary}</p>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] mb-6 block ml-1">Discussion Architecture</label>
                            <ul className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                {outline.topics.map((topic, idx) => (
                                    <li key={idx} className="flex items-start gap-4 bg-slate-50 dark:bg-bg-main p-5 rounded-2xl border border-slate-100 dark:border-white/5 transition-all group/item hover:border-primary/30">
                                        <div className="mt-1 bg-primary/20 p-1.5 rounded-lg text-primary">
                                            <CheckCircle size={18} />
                                        </div>
                                        <span className="text-slate-700 dark:text-text-main font-bold mt-0.5 leading-snug">{topic}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <button
                    onClick={onConfirm}
                    disabled={isGeneratingScript}
                    className="w-full py-6 bg-primary hover:bg-primary-hover disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-text-muted text-[#0a0c0e] transition-all rounded-[2rem] font-black tracking-tight text-xl shadow-glow hover:shadow-[0_15px_30px_rgba(0,240,255,0.4)] flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                    {isGeneratingScript ? (
                        <>
                            <div className="w-6 h-6 border-[3px] border-[#0a0c10]/20 border-t-[#0a0c10] rounded-full animate-spin"></div>
                            <span className="animate-pulse">Writing Script...</span>
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-[24px]">edit_note</span>
                            <span>Generate Full Script</span>
                        </>
                    )}
                </button>

                <div className="bg-white dark:bg-bg-surface p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-xl-saas">
                    <div className="flex items-center gap-4 mb-8 pb-5 border-b border-slate-100 dark:border-white/5">
                        <div className="p-3 bg-slate-900 dark:bg-primary/10 text-white dark:text-primary rounded-xl border border-white/10 dark:border-primary/20">
                            <Globe size={24} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">Grounding</h3>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-text-muted mb-6 leading-relaxed font-medium">
                        RAG Engine verified sources:
                    </p>
                    <div className="space-y-4">
                        {sources.length > 0 ? sources.map((source, idx) => (
                            <a
                                key={idx}
                                href={source.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-5 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-bg-main hover:bg-white dark:hover:bg-bg-surface hover:border-primary/30 hover:shadow-soft transition-all group overflow-hidden"
                            >
                                <p className="text-sm font-bold text-slate-900 dark:text-text-muted line-clamp-2 group-hover:text-primary transition-colors break-words">
                                    {source.title}
                                </p>
                                <div className="flex items-center gap-2 mt-4">
                                    <span className="size-2 rounded-full bg-primary/40"></span>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-600 font-bold tracking-widest truncate uppercase">{new URL(source.uri).hostname}</p>
                                </div>
                            </a>
                        )) : (
                            <div className="p-10 border border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] flex flex-col items-center justify-center text-center">
                                <span className="material-symbols-outlined text-slate-200 dark:text-white/5 text-5xl mb-3">cloud_off</span>
                                <p className="text-sm text-slate-400 dark:text-slate-500 italic font-medium">No verified sources found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
);
};
