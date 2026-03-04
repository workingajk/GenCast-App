import React from 'react';
import { FileText, Globe, ArrowRight, CheckCircle } from 'lucide-react';

export const PlanningView = ({
    outline,
    sources,
    onConfirm,
    isGeneratingScript
}) => {
    return (
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-text-main transition-colors duration-300">
            <div className="md:col-span-2 space-y-6">
                <div className="bg-bg-surface p-8 rounded-3xl border border-border-main shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-opacity dark:text-white text-slate-900">
                        <FileText size={120} />
                    </div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20">
                            <FileText size={24} />
                        </div>
                        <h3 className="text-2xl font-bold font-heading dark:text-white">Episode Outline</h3>
                    </div>

                    <div className="space-y-8 relative z-10">
                        <div>
                            <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-2 block ml-1">Topic Title</label>
                            <p className="text-2xl font-bold dark:text-white leading-tight tracking-tight">{outline.title}</p>
                        </div>

                        <div>
                            <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-2 block ml-1">Research Summary</label>
                            <p className="text-text-muted leading-relaxed text-lg">{outline.summary}</p>
                        </div>

                        <div>
                            <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-4 block ml-1">Discussion Points</label>
                            <ul className="space-y-4">
                                {outline.topics.map((topic, idx) => (
                                    <li key={idx} className="flex items-start gap-4 bg-primary/5 p-4 rounded-2xl border border-border-main hover:border-primary/20 transition-all group/item">
                                        <div className="mt-1 bg-primary/20 p-1 rounded-full text-primary">
                                            <CheckCircle size={14} />
                                        </div>
                                        <span className="text-text-muted group-hover/item:text-text-main transition-colors">{topic}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">


                <button
                    onClick={onConfirm}
                    disabled={isGeneratingScript}
                    className="w-full py-5 bg-primary hover:bg-primary-hover disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-text-muted text-[#0a0c0e] rounded-2xl font-bold text-lg shadow-glow transition-all transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    {isGeneratingScript ? (
                        <>
                            <div className="w-5 h-5 border-[3px] border-[#0a0c0e]/30 border-t-[#0a0c0e] rounded-full animate-spin"></div>
                            <span className="animate-pulse">Synthesizing Script...</span>
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-[20px]">edit_note</span>
                            <span>Generate Script</span>
                        </>
                    )}
                </button>

                <div className="bg-bg-surface p-8 rounded-3xl border border-border-main shadow-xl">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-accent/10 rounded-2xl text-accent border border-accent/20">
                            <Globe size={24} />
                        </div>
                        <h3 className="text-xl font-bold dark:text-white font-heading">Validated Sources</h3>
                    </div>
                    <p className="text-sm text-text-muted mb-6 leading-relaxed">
                        Our RAG engine discovered these high-quality sources for your content.
                    </p>
                    <div className="space-y-3">
                        {sources.length > 0 ? sources.map((source, idx) => (
                            <a
                                key={idx}
                                href={source.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-4 rounded-2xl border border-border-main bg-bg-main hover:bg-primary/5 hover:border-primary/20 transition-all group"
                            >
                                <p className="text-sm font-bold text-text-muted line-clamp-2 group-hover:text-primary transition-colors">
                                    {source.title}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-text-muted/30 group-hover:bg-primary transition-colors"></span>
                                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">{new URL(source.uri).hostname}</p>
                                </div>
                            </a>
                        )) : (
                            <div className="p-8 border border-dashed border-border-main rounded-2xl flex flex-col items-center justify-center text-center">
                                <span className="material-symbols-outlined text-text-muted/30 text-4xl mb-2">cloud_off</span>
                                <p className="text-sm text-text-muted italic">No external sources cited.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
